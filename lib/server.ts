import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { database } from './database.mjs';
import { digest, token } from './security.mjs';
import { findProduct, itemPrice } from './catalog';
import type { Cart, User } from './types';
export const db = database;
export const uuid = () => randomUUID();
export const paymentMode = () => process.env.PAYMENT_MODE || 'demo';
export function fail(message: string, status = 400): never {
  throw Object.assign(new Error(message), { status });
}
export function userFor(req: NextRequest): User | null {
  const session = req.cookies.get('vh_session')?.value;
  if (!session) return null;
  return (
    (db()
      .prepare(
        'SELECT u.id,u.name,u.email,u.role,u.phone FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?',
      )
      .get(digest(session), Date.now()) as User | undefined) || null
  );
}
export function requireUser(req: NextRequest, admin = false) {
  const user = userFor(req);
  if (!user) fail('Please sign in to continue.', 401);
  if (admin && user.role !== 'admin') fail('Administrator access is required.', 403);
  return user;
}
export function sessionResponse(user: User) {
  const session = token();
  db()
    .prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)')
    .run(digest(session), user.id, Date.now() + 7 * 86400000);
  const r = NextResponse.json({ user });
  r.cookies.set('vh_session', session, {
    httpOnly: true,
    sameSite: 'lax',
    secure:
      process.env.NODE_ENV === 'production' && process.env.APP_URL?.startsWith('https://') === true,
    path: '/',
    maxAge: 7 * 86400,
  });
  return r;
}
export function cartId(req: NextRequest) {
  return req.cookies.get('vh_cart')?.value || token();
}
export function withCart(value: unknown, id: string) {
  const r = NextResponse.json(value);
  r.cookies.set('vh_cart', id, {
    httpOnly: true,
    sameSite: 'lax',
    secure:
      process.env.NODE_ENV === 'production' && process.env.APP_URL?.startsWith('https://') === true,
    path: '/',
    maxAge: 30 * 86400,
  });
  return r;
}
export function getCart(id: string): Cart {
  const rows = db()
    .prepare('SELECT * FROM cart_items WHERE cart_id=? ORDER BY rowid')
    .all(id) as Array<{ id: string; sku: string; domain: string; cycle: string; quantity: number }>;
  const items = rows.flatMap((row) => {
    const p = findProduct(row.sku);
    if (!p) return [];
    const unitPrice = itemPrice(p, row.cycle);
    return [
      {
        ...row,
        name: row.domain || p.name,
        unitPrice,
        total: unitPrice * row.quantity,
        period: row.cycle === 'annual' && p.period === 'month' ? 'year' : p.period,
      },
    ];
  });
  const subtotal = items.reduce((n, i) => n + i.total, 0);
  const taxRate = 0.18;
  const tax = Math.round(subtotal * taxRate);
  return {
    items,
    subtotal,
    tax,
    total: subtotal + tax,
    taxRate,
    demo: paymentMode() === 'demo',
    mode: paymentMode(),
  };
}
export function limit(req: NextRequest, action: string, max = 30, period = 60_000) {
  const ip =
    process.env.TRUST_PROXY === 'true'
      ? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      : 'local';
  const key = digest(`${action}:${ip}`);
  const now = Date.now();
  db().prepare('DELETE FROM rate_limits WHERE expires_at < ?').run(now);
  db()
    .prepare(
      'INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1',
    )
    .run(key, now + period);
  const result = db().prepare('SELECT count FROM rate_limits WHERE key=?').get(key) as {
    count: number;
  };
  if (result.count > max) fail('Too many attempts. Please wait a moment and try again.', 429);
}
export function checkOrigin(req: NextRequest) {
  const origin = req.headers.get('origin');
  const allowed = new URL(process.env.APP_URL || req.url).origin;
  if (!origin || origin !== allowed)
    fail('This request did not come from the expected website.', 403);
}
export async function readText(req: NextRequest) {
  const reader = req.body?.getReader();
  if (!reader) return '';
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 32768) {
      await reader.cancel();
      fail('The request is too large.', 413);
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString('utf8');
}
export async function body(req: NextRequest) {
  if (!req.headers.get('content-type')?.includes('application/json'))
    fail('Send JSON content.', 415);
  const text = await readText(req);
  try {
    return JSON.parse(text);
  } catch {
    fail('The request contains invalid JSON.');
  }
}
export function audit(userId: string, action: string, targetId: string) {
  db()
    .prepare('INSERT INTO audit_events(user_id,action,target_id) VALUES(?,?,?)')
    .run(userId, action, targetId);
}
