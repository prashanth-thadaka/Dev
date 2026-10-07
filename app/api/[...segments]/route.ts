import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  db,
  uuid,
  fail,
  userFor,
  requireUser,
  sessionResponse,
  cartId,
  withCart,
  getCart,
  limit,
  checkOrigin,
  body,
  readText,
  paymentMode,
  audit,
} from '@/lib/server';
import { hashPassword, verifyPassword, digest, token } from '@/lib/security.mjs';
import { transaction } from '@/lib/database.mjs';
import { mailConfigured, sendResetEmail } from '@/lib/mail.mjs';
import { requestHash, validResponseHash, verifyPayment, payuEndpoints } from '@/lib/payu.mjs';
import { byCategory, findProduct, quoteExtras } from '@/lib/catalog';
import type { User, Order, CartItem } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const email = z
  .email()
  .max(254)
  .transform((v) => v.toLowerCase().trim());
const password = z.string().min(12, 'Use at least 12 characters.').max(128);
const name = z.string().trim().min(2).max(100);
const phone = z
  .string()
  .trim()
  .max(25)
  .regex(/^[+\d ()-]*$/)
  .default('');
const safeUser = (row: Record<string, unknown>): User => ({
  id: row.id as string,
  name: row.name as string,
  email: row.email as string,
  role: row.role as User['role'],
  phone: row.phone as string,
});
const json = (v: unknown, status = 200) => NextResponse.json(v, { status });

async function handle(req: NextRequest, context: { params: Promise<{ segments: string[] }> }) {
  try {
    const route = (await context.params).segments.join('/');
    const method = req.method;
    if (method !== 'GET' && route !== 'payments/payu/callback') checkOrigin(req);

    if (route === 'health' && method === 'GET') {
      db().prepare('SELECT 1').get();
      return json({ status: 'ok', paymentMode: paymentMode() });
    }
    if (route === 'auth/me' && method === 'GET') return json({ user: userFor(req) });
    if (route === 'auth/register' && method === 'POST') {
      limit(req, 'register', 10, 3600000);
      const input = z
        .object({ name, email, password, terms: z.literal(true) })
        .parse(await body(req));
      const id = uuid();
      const hash = await hashPassword(input.password);
      try {
        db()
          .prepare('INSERT INTO users(id,name,email,password_hash) VALUES(?,?,?,?)')
          .run(id, input.name, input.email, hash);
      } catch (e) {
        if (String(e).includes('UNIQUE'))
          fail('An account with this email already exists. Please sign in.');
        throw e;
      }
      return sessionResponse({ id, name: input.name, email: input.email, role: 'customer' });
    }
    if (route === 'auth/login' && method === 'POST') {
      limit(req, 'login', 20, 600000);
      const input = z
        .object({ email, password: z.string().min(1).max(128) })
        .parse(await body(req));
      const row = db().prepare('SELECT * FROM users WHERE email=?').get(input.email) as
        Record<string, unknown> | undefined;
      // Spend the same password-derivation work for unknown accounts.
      const valid = await verifyPassword(
        input.password,
        (row?.password_hash as string) ||
          '00000000000000000000000000000000:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      );
      if (!row || !valid) fail('Email or password is incorrect.', 401);
      return sessionResponse(safeUser(row));
    }
    if (route === 'auth/logout' && method === 'POST') {
      const session = req.cookies.get('vh_session')?.value;
      if (session) db().prepare('DELETE FROM sessions WHERE token_hash=?').run(digest(session));
      const r = json({ ok: true });
      r.cookies.set('vh_session', '', { path: '/', maxAge: 0 });
      return r;
    }
    if (route === 'auth/forgot' && method === 'POST') {
      limit(req, 'forgot', 5, 3600000);
      const input = z.object({ email }).parse(await body(req));
      if (process.env.NODE_ENV === 'production' && !mailConfigured())
        fail(
          'Password recovery email is not configured yet. Contact info@veehoster.com for help.',
          503,
        );
      const user = db().prepare('SELECT id FROM users WHERE email=?').get(input.email) as
        { id: string } | undefined;
      if (user) {
        const reset = token();
        db().prepare('DELETE FROM resets WHERE user_id=?').run(user.id);
        db()
          .prepare('INSERT INTO resets VALUES(?,?,?)')
          .run(digest(reset), user.id, Date.now() + 1800000);
        try {
          await sendResetEmail(input.email, reset);
        } catch {
          fail('Password reset email is temporarily unavailable. Please try again later.', 503);
        }
      }
      return json({
        message: mailConfigured()
          ? 'If that account exists, password reset instructions have been sent.'
          : 'If that account exists, reset instructions have been saved in the local development mailbox.',
      });
    }
    if (route === 'auth/reset' && method === 'POST') {
      limit(req, 'reset', 10, 3600000);
      const input = z
        .object({ token: z.string().regex(/^[a-f0-9]{64}$/), password })
        .parse(await body(req));
      const record = db()
        .prepare('SELECT user_id FROM resets WHERE token_hash=? AND expires_at>?')
        .get(digest(input.token), Date.now()) as { user_id: string } | undefined;
      if (!record) fail('This reset link is invalid or has expired.');
      const hash = await hashPassword(input.password);
      transaction((d) => {
        d.prepare('UPDATE users SET password_hash=? WHERE id=?').run(hash, record.user_id);
        d.prepare('DELETE FROM resets WHERE user_id=?').run(record.user_id);
        d.prepare('DELETE FROM sessions WHERE user_id=?').run(record.user_id);
      });
      return json({ message: 'Password updated. You can now sign in.' });
    }
    if (route === 'domains/search' && method === 'GET') {
      limit(req, 'domains', 60);
      const query = z
        .string()
        .trim()
        .toLowerCase()
        .min(2)
        .max(253)
        .parse(req.nextUrl.searchParams.get('q') || '');
      const base = query.replace(/\.(com|in|net|org)$/, '');
      if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])$/.test(base))
        fail('Use 2–63 letters, numbers or hyphens. Do not start or end with a hyphen.');
      return json({
        demo: true,
        results: byCategory('domain').map((p) => ({
          domain: base + p.name,
          sku: p.id,
          price: p.price,
          available: !['google', 'amazon', 'veehoster', 'example'].includes(base),
        })),
      });
    }
    if (route === 'cart') {
      const id = cartId(req);
      if (method === 'GET') return withCart(getCart(id), id);
      if (method === 'POST') {
        limit(req, 'cart-add', 60);
        const input = z
          .object({
            sku: z.string(),
            cycle: z.enum(['monthly', 'annual', 'once']).default('monthly'),
            domain: z.string().max(253).default(''),
          })
          .parse(await body(req));
        const p = findProduct(input.sku);
        if (!p) fail('This package is not available.');
        if (
          p.category === 'domain' &&
          (!input.domain.endsWith(p.name) ||
            !/^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.(com|in|net|org)$/.test(input.domain))
        )
          fail('Search for a valid domain before adding it.');
        const cycle =
          p.period === 'month' ? (input.cycle === 'annual' ? 'annual' : 'monthly') : 'once';
        const domain = p.category === 'domain' ? input.domain : '';
        const existing = db()
          .prepare('SELECT id FROM cart_items WHERE cart_id=? AND sku=? AND domain=? AND cycle=?')
          .get(id, p.id, domain, cycle);
        const count = db()
          .prepare('SELECT COUNT(*) AS count FROM cart_items WHERE cart_id=?')
          .get(id) as { count: number };
        if (!existing) {
          if (count.count >= 20) fail('Your cart can contain up to 20 different items.');
          db()
            .prepare('INSERT INTO cart_items(id,cart_id,sku,domain,cycle) VALUES(?,?,?,?,?)')
            .run(uuid(), id, p.id, domain, cycle);
        }
        return withCart(getCart(id), id);
      }
      if (method === 'DELETE') {
        const input = z.object({ id: z.string() }).parse(await body(req));
        db().prepare('DELETE FROM cart_items WHERE id=? AND cart_id=?').run(input.id, id);
        return withCart(getCart(id), id);
      }
    }
    if (route === 'checkout' && method === 'POST') {
      const user = requireUser(req);
      limit(req, 'checkout', 15);
      const input = z
        .object({
          name,
          phone,
          address: z.string().trim().min(5).max(300),
          city: z.string().trim().min(2).max(100),
          state: z.string().trim().min(2).max(100),
          postcode: z.string().regex(/^\d{6}$/, 'Enter a 6-digit Indian PIN code.'),
          terms: z.literal(true),
          idempotencyKey: z.uuid(),
        })
        .parse(await body(req));
      const mode = paymentMode();
      if (!['demo', 'payu_sandbox', 'payu_live'].includes(mode))
        fail('This payment mode is not enabled.', 503);
      if (mode === 'payu_live' && process.env.LIVE_CHECKOUT_ENABLED !== 'true')
        fail('Live checkout has not been activated.', 503);
      if (mode !== 'demo' && input.phone.replace(/\D/g, '').length < 10)
        fail('Add a valid phone number for hosted checkout.');
      if (
        mode !== 'demo' &&
        (!process.env.PAYU_KEY ||
          !process.env.PAYU_SALT ||
          !process.env.APP_URL?.startsWith('https://'))
      )
        fail('PayU checkout requires merchant credentials and an HTTPS APP_URL.', 503);
      const previous = db()
        .prepare('SELECT id,user_id FROM orders WHERE checkout_key=?')
        .get(input.idempotencyKey) as { id: string; user_id: string } | undefined;
      if (previous) {
        if (previous.user_id !== user.id) fail('Invalid checkout reference.', 409);
        return json({ orderId: previous.id, mode });
      }
      const cid = cartId(req);
      const cart = getCart(cid);
      if (!cart.items.length) fail('Your cart is empty.');
      if (mode === 'payu_live' && cart.items.some((i) => i.domain))
        fail(
          'Live domain orders need registrar verification. Please contact us to confirm this domain.',
          409,
        );
      const id = uuid();
      db()
        .prepare(
          'INSERT INTO orders(id,user_id,checkout_key,cart_id,subtotal,tax,total,items,billing,payment_mode) VALUES(?,?,?,?,?,?,?,?,?,?)',
        )
        .run(
          id,
          user.id,
          input.idempotencyKey,
          cid,
          cart.subtotal,
          cart.tax,
          cart.total,
          JSON.stringify(cart.items),
          JSON.stringify({ ...input, email: user.email }),
          mode,
        );
      return json({ orderId: id, mode });
    }
    if (route === 'payments/demo' && method === 'POST') {
      const user = requireUser(req);
      const input = z
        .object({ orderId: z.uuid(), outcome: z.enum(['success', 'failure', 'cancel']) })
        .parse(await body(req));
      const order = db()
        .prepare('SELECT * FROM orders WHERE id=? AND user_id=?')
        .get(input.orderId, user.id) as (Order & { cart_id: string }) | undefined;
      if (!order) fail('Order not found.', 404);
      if (paymentMode() !== 'demo' || order.payment_mode !== 'demo')
        fail('Demo payment is disabled for this order.', 403);
      if (order.status === 'paid_demo') return json({ orderId: order.id, status: order.status });
      if (!['pending', 'failed', 'cancelled'].includes(order.status))
        fail('This order cannot be paid.', 409);
      const status =
        input.outcome === 'success'
          ? 'paid_demo'
          : input.outcome === 'failure'
            ? 'failed'
            : 'cancelled';
      transaction((d) => {
        d.prepare(
          "UPDATE orders SET status=?,paid_at=CASE WHEN ?='paid_demo' THEN CURRENT_TIMESTAMP ELSE NULL END WHERE id=?",
        ).run(status, status, order.id);
        if (status === 'paid_demo') {
          const items = JSON.parse(order.items) as CartItem[];
          for (const item of items)
            d.prepare('DELETE FROM cart_items WHERE id=? AND cart_id=?').run(
              item.id,
              order.cart_id,
            );
        }
        audit(user.id, `payment.${status}`, order.id);
      });
      return json({ orderId: order.id, status });
    }
    if (route === 'payments/payu/start' && method === 'POST') {
      const user = requireUser(req);
      const input = z.object({ orderId: z.uuid() }).parse(await body(req));
      const order = db()
        .prepare('SELECT * FROM orders WHERE id=? AND user_id=?')
        .get(input.orderId, user.id) as (Order & { billing: string }) | undefined;
      if (!order) fail('Order not found.', 404);
      if (
        !['payu_sandbox', 'payu_live'].includes(paymentMode()) ||
        order.payment_mode !== paymentMode() ||
        order.status.startsWith('paid_')
      )
        fail('This order is not available for PayU checkout.', 409);
      if (paymentMode() === 'payu_live' && process.env.LIVE_CHECKOUT_ENABLED !== 'true')
        fail('Live checkout has not been activated.', 503);
      const key = process.env.PAYU_KEY,
        salt = process.env.PAYU_SALT,
        base = process.env.APP_URL;
      if (!key || !salt || !base?.startsWith('https://'))
        fail('PayU has not been configured.', 503);
      const billing = JSON.parse(order.billing);
      const fields: Record<string, string> = {
        key,
        txnid: order.id.replaceAll('-', ''),
        amount: (order.total / 100).toFixed(2),
        productinfo: 'Veehoster order',
        firstname: billing.name,
        email: user.email,
        phone: billing.phone || '0000000000',
        surl: `${base}/api/payments/payu/callback`,
        furl: `${base}/api/payments/payu/callback`,
        udf1: order.id,
        udf2: '',
        udf3: '',
        udf4: '',
        udf5: '',
      };
      fields.hash = requestHash(fields, salt);
      return json({ action: payuEndpoints(order.payment_mode).checkout, fields });
    }
    if (route === 'payments/payu/callback' && method === 'POST') {
      if (
        !['payu_sandbox', 'payu_live'].includes(paymentMode()) ||
        !process.env.PAYU_SALT ||
        !process.env.PAYU_KEY
      )
        fail('PayU is disabled.', 403);
      if (Number(req.headers.get('content-length') || 0) > 32768) fail('Payload too large.', 413);
      if (!req.headers.get('content-type')?.includes('application/x-www-form-urlencoded'))
        fail('Unsupported payment callback format.', 415);
      const fields = Object.fromEntries(new URLSearchParams(await readText(req))) as Record<
        string,
        string
      >;
      if (fields.key !== process.env.PAYU_KEY || !validResponseHash(fields, process.env.PAYU_SALT))
        fail('Invalid payment signature.', 400);
      const order = db()
        .prepare('SELECT * FROM orders WHERE id=?')
        .get(fields.udf1 || '') as (Order & { cart_id: string }) | undefined;
      if (
        !order ||
        order.payment_mode !== paymentMode() ||
        fields.txnid !== order.id.replaceAll('-', '') ||
        fields.amount !== (order.total / 100).toFixed(2)
      )
        fail('Payment details do not match the order.', 400);
      const verified = await verifyPayment(
        fields.txnid,
        process.env.PAYU_KEY,
        process.env.PAYU_SALT,
        order.payment_mode,
      );
      if (
        !verified ||
        Number(verified.amt) !== order.total / 100 ||
        verified.txnid !== fields.txnid
      )
        fail('Payment verification failed. The order remains unpaid.', 502);
      const paidStatus = order.payment_mode === 'payu_live' ? 'paid_live' : 'paid_sandbox';
      if (fields.status === 'success' && verified.status === 'success') {
        transaction((d) => {
          d.prepare(
            "UPDATE orders SET status=?,gateway_id=?,paid_at=CURRENT_TIMESTAMP WHERE id=? AND status NOT LIKE 'paid_%'",
          ).run(paidStatus, String(verified.mihpayid || ''), order.id);
          for (const item of JSON.parse(order.items) as CartItem[])
            d.prepare('DELETE FROM cart_items WHERE id=? AND cart_id=?').run(
              item.id,
              order.cart_id,
            );
        });
      } else if (!order.status.startsWith('paid_')) {
        db()
          .prepare("UPDATE orders SET status='failed' WHERE id=? AND status NOT LIKE 'paid_%'")
          .run(order.id);
      }
      return NextResponse.redirect(
        `${process.env.APP_URL}/payment/result?order=${encodeURIComponent(order.id)}`,
        303,
      );
    }
    if (route === 'account' && method === 'GET') {
      const user = requireUser(req);
      const orders = db()
        .prepare('SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC,rowid DESC')
        .all(user.id);
      const tickets = db()
        .prepare('SELECT * FROM tickets WHERE user_id=? ORDER BY created_at DESC')
        .all(user.id);
      return json({ user, orders, tickets });
    }
    if (route.startsWith('orders/') && method === 'GET') {
      const user = requireUser(req);
      const id = route.split('/')[1];
      const order = db().prepare('SELECT * FROM orders WHERE id=? AND user_id=?').get(id, user.id);
      if (!order) fail('Order not found.', 404);
      return json({ order });
    }
    if (route === 'account/settings' && method === 'PATCH') {
      const user = requireUser(req);
      const input = z
        .object({
          name,
          phone,
          currentPassword: z.string().max(128).optional(),
          newPassword: password.optional(),
        })
        .parse(await body(req));
      if (input.newPassword) {
        const row = db().prepare('SELECT password_hash FROM users WHERE id=?').get(user.id) as {
          password_hash: string;
        };
        if (
          !input.currentPassword ||
          !(await verifyPassword(input.currentPassword, row.password_hash))
        )
          fail('Your current password is incorrect.');
        db()
          .prepare('UPDATE users SET password_hash=? WHERE id=?')
          .run(await hashPassword(input.newPassword), user.id);
        db().prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);
      }
      db()
        .prepare('UPDATE users SET name=?,phone=? WHERE id=?')
        .run(input.name, input.phone, user.id);
      return input.newPassword
        ? sessionResponse({ ...user, name: input.name, phone: input.phone })
        : json({ user: { ...user, name: input.name, phone: input.phone } });
    }
    if (route === 'tickets' && method === 'POST') {
      const user = requireUser(req);
      limit(req, 'tickets', 10, 3600000);
      const input = z
        .object({
          subject: z.string().trim().min(5).max(150),
          message: z.string().trim().min(10).max(3000),
        })
        .parse(await body(req));
      const id = uuid();
      db()
        .prepare('INSERT INTO tickets(id,user_id,subject,messages) VALUES(?,?,?,?)')
        .run(
          id,
          user.id,
          input.subject,
          JSON.stringify([
            {
              author: user.name,
              role: user.role,
              text: input.message,
              date: new Date().toISOString(),
            },
          ]),
        );
      return json({ id });
    }
    if (route.startsWith('tickets/') && method === 'PATCH') {
      const user = requireUser(req);
      limit(req, 'ticket-reply', 30);
      const id = route.split('/')[1];
      const input = z
        .object({
          message: z.string().trim().min(1).max(3000).optional(),
          status: z.enum(['open', 'in_progress', 'resolved']).optional(),
        })
        .parse(await body(req));
      transaction((d) => {
        const ticket = d.prepare('SELECT * FROM tickets WHERE id=?').get(id) as
          { user_id: string; messages: string; status: string } | undefined;
        if (!ticket || (user.role !== 'admin' && ticket.user_id !== user.id))
          fail('Ticket not found.', 404);
        if (input.status && user.role !== 'admin')
          fail('Only support can change ticket status.', 403);
        const messages = JSON.parse(ticket.messages);
        if (input.message)
          messages.push({
            author: user.name,
            role: user.role,
            text: input.message,
            date: new Date().toISOString(),
          });
        d.prepare('UPDATE tickets SET messages=?,status=? WHERE id=?').run(
          JSON.stringify(messages),
          input.status || ticket.status,
          id,
        );
        audit(user.id, 'ticket.updated', id);
      });
      return json({ ok: true });
    }
    if (route === 'inquiries' && method === 'POST') {
      limit(req, 'inquiry', 10, 3600000);
      const input = z
        .object({
          kind: z.enum(['contact', 'migration', 'quote', 'seo']),
          name,
          email,
          phone,
          message: z.string().trim().min(10).max(3000),
          website: z.string().max(200).default(''),
          packageId: z.string().optional(),
          extras: z.array(z.string()).max(4).default([]),
          consent: z.literal(true),
          companyWebsite: z.string().max(100).default(''),
        })
        .parse(await body(req));
      if (input.companyWebsite)
        return json({ message: 'Thank you. Your request has been received.' });
      const details: Record<string, unknown> = { website: input.website };
      if (input.kind === 'quote') {
        const p = findProduct(input.packageId || '');
        if (!p || p.category !== 'website') fail('Choose a website package.');
        const extras = quoteExtras.filter((e) => input.extras.includes(e.id));
        const subtotal = p.price + extras.reduce((n, e) => n + e.price, 0);
        Object.assign(details, {
          package: p.name,
          packageId: p.id,
          extras,
          subtotal,
          tax: Math.round(subtotal * 0.18),
          total: subtotal + Math.round(subtotal * 0.18),
        });
      }
      const id = uuid();
      db()
        .prepare(
          'INSERT INTO inquiries(id,kind,name,email,phone,message,details) VALUES(?,?,?,?,?,?,?)',
        )
        .run(
          id,
          input.kind,
          input.name,
          input.email,
          input.phone,
          input.message,
          JSON.stringify(details),
        );
      return json({
        id,
        message:
          'Your request is saved. Keep your reference number; our team can review it in the administration dashboard.',
      });
    }
    if (route === 'admin' && method === 'GET') {
      requireUser(req, true);
      return json({
        users: db()
          .prepare('SELECT id,name,email,role,phone,created_at FROM users ORDER BY created_at DESC')
          .all(),
        orders: db()
          .prepare(
            'SELECT o.*,u.name AS customer_name,u.email AS customer_email FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC',
          )
          .all(),
        inquiries: db().prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all(),
        tickets: db()
          .prepare(
            'SELECT t.*,u.name AS customer_name FROM tickets t JOIN users u ON u.id=t.user_id ORDER BY t.created_at DESC',
          )
          .all(),
      });
    }
    if (route.startsWith('admin/inquiries/') && method === 'PATCH') {
      const user = requireUser(req, true);
      const input = z
        .object({ status: z.enum(['new', 'contacted', 'quoted', 'closed']) })
        .parse(await body(req));
      const id = route.split('/')[2];
      const result = db().prepare('UPDATE inquiries SET status=? WHERE id=?').run(input.status, id);
      if (!result.changes) fail('Request not found.', 404);
      audit(user.id, 'inquiry.status', id);
      return json({ ok: true });
    }
    fail('This endpoint does not exist.', 404);
  } catch (error) {
    if (error instanceof z.ZodError)
      return json({ error: error.issues[0]?.message || 'Check the form fields.' }, 400);
    const e = error as Error & { status?: number };
    if (!e.status) console.error('API error:', e.name, e.message);
    return json(
      { error: e.status ? e.message : 'Something went wrong. Please try again.' },
      e.status || 500,
    );
  }
}
export { handle as GET, handle as POST, handle as PATCH, handle as DELETE };
