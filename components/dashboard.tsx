'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { company, money } from '@/lib/catalog';
import type { Order, CartItem, User } from '@/lib/types';
import { api, useApp } from './provider';
import { Brand } from './shell';
import { EmptyState, ErrorMessage, Icon } from './ui';

type Ticket = {
  id: string;
  subject: string;
  status: string;
  messages: string;
  created_at: string;
  customer_name?: string;
};
type Inquiry = {
  id: string;
  kind: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  details: string;
  status: string;
  created_at: string;
};
type DashboardData = {
  user?: User;
  users?: User[];
  orders: Order[];
  tickets: Ticket[];
  inquiries?: Inquiry[];
};
const customerLinks = [
  ['Overview', '', 'grid'],
  ['My services', 'services', 'hdd-stack'],
  ['My domains', 'domains', 'globe2'],
  ['Orders & invoices', 'invoices', 'receipt'],
  ['Support tickets', 'support', 'chat-square-text'],
  ['Account settings', 'settings', 'gear'],
];
const adminLinks = [
  ['Overview', '', 'grid'],
  ['Customers', 'customers', 'people'],
  ['Orders', 'orders', 'bag-check'],
  ['Quotes & enquiries', 'quotes', 'file-earmark-text'],
  ['Support tickets', 'support', 'chat-square-text'],
];
function Badge({ status }: { status: string }) {
  return (
    <span
      className={`status-badge ${status.startsWith('paid') || status === 'resolved' ? 'success' : status === 'failed' ? 'danger' : status === 'pending' || status === 'new' ? 'warning' : 'neutral'}`}
    >
      {status.replaceAll('_', ' ')}
    </span>
  );
}
const date = (value: string) =>
  new Date(value.includes('T') ? value : value + 'Z').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

export function Dashboard({ admin = false, section = '' }: { admin?: boolean; section?: string }) {
  const { user, ready, refresh } = useApp(),
    router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null),
    [error, setError] = useState(''),
    [open, setOpen] = useState(false);
  const base = admin ? '/admin' : '/account';
  const links = admin ? adminLinks : customerLinks;
  const title = links.find((l) => l[1] === section)?.[0] || 'Overview';
  const load = useCallback(async () => {
    try {
      setData(await api(admin ? 'admin' : 'account'));
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  }, [admin]);
  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (admin && user.role !== 'admin') {
      setError('Administrator access is required.');
      return;
    }
    void load();
  }, [ready, user, admin, router, load]);
  async function logout() {
    try {
      await api('auth/logout', { method: 'POST' });
      await refresh();
      router.push('/login');
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <div className="dashboard-layout">
      <aside className={`dashboard-sidebar ${open ? 'open' : ''}`}>
        <Brand light />
        <span className="sidebar-label">{admin ? 'BUSINESS WORKSPACE' : 'YOUR LITTLE CORNER'}</span>
        <nav aria-label={admin ? 'Administrator navigation' : 'Account navigation'}>
          {links.map(([label, path, icon]) => (
            <Link
              className={section === path ? 'active' : ''}
              key={path}
              href={`${base}${path ? '/' + path : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon name={icon} />
              {label}
              {path === 'support' &&
                !!data?.tickets.filter((t) => t.status !== 'resolved').length && (
                  <span>{data.tickets.filter((t) => t.status !== 'resolved').length}</span>
                )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <Icon name="headset" />
            <strong>A little help?</strong>
            <p>We’re a conversation away.</p>
            <a href={`mailto:${company.email}`}>
              Contact Veehoster <Icon name="arrow-up-right" />
            </a>
          </div>
          <Link href="/">
            <Icon name="arrow-left" /> Back to website
          </Link>
          {user?.role === 'admin' && (
            <Link href={admin ? '/account' : '/admin'}>
              <Icon name="arrow-left-right" /> {admin ? 'Customer view' : 'Admin workspace'}
            </Link>
          )}
          <button onClick={logout}>
            <Icon name="box-arrow-right" /> Sign out
          </button>
        </div>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="icon-button dashboard-menu"
            onClick={() => setOpen(!open)}
            aria-label="Toggle account menu"
            aria-expanded={open}
          >
            <Icon name="list" />
          </button>
          <div>
            <span>Workspace</span>
            <Icon name="chevron-right" />
            <strong>{title}</strong>
          </div>
          <div className="dashboard-profile">
            <span className="demo-top-badge">Demo environment</span>
            <span className="avatar">{user?.name.slice(0, 1) || 'V'}</span>
            <span>
              <strong>{user?.name || 'Your account'}</strong>
              <small>{admin ? 'Administrator' : user?.email}</small>
            </span>
          </div>
        </header>
        <main id="main" className="dashboard-content">
          <div className="dashboard-heading">
            <div>
              <span className="eyebrow">
                {admin ? 'A CLEARER VIEW OF YOUR BUSINESS' : 'GOOD TO HAVE YOU HERE'}
              </span>
              <h1>
                {section
                  ? title
                  : admin
                    ? 'Business overview.'
                    : `Hello${user ? ', ' + user.name.split(' ')[0] : ''}. What’s next?`}
              </h1>
              <p>
                {admin
                  ? 'Orders, customers and conversations, brought together.'
                  : 'Your digital world, with the details in one place.'}
              </p>
            </div>
            {!admin && (
              <Link href="/pricing" className="btn btn-primary">
                Explore packages <Icon name="plus-lg" />
              </Link>
            )}
          </div>
          <ErrorMessage error={error} />
          {!ready || (!data && !error) ? (
            <div className="loading-panel" role="status">
              Preparing your workspace…
            </div>
          ) : data ? (
            <>
              {!section ? (
                <Overview data={data} admin={admin} />
              ) : section === 'services' || section === 'domains' ? (
                <Services orders={data.orders} domains={section === 'domains'} />
              ) : section === 'invoices' || section === 'orders' ? (
                <Orders orders={data.orders} admin={admin} />
              ) : section === 'support' ? (
                <Support tickets={data.tickets} admin={admin} reload={load} />
              ) : section === 'settings' ? (
                <Settings />
              ) : section === 'customers' ? (
                <Customers users={data.users || []} />
              ) : section === 'quotes' ? (
                <Inquiries rows={data.inquiries || []} reload={load} />
              ) : null}
            </>
          ) : null}
          <div className="dashboard-bottomline">
            <span>Veehoster · Your next chapter, connected.</span>
            <Link href="/privacy">
              Privacy & your data <Icon name="arrow-up-right" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
function Overview({ data, admin }: { data: DashboardData; admin: boolean }) {
  const paid = data.orders.filter((o) => o.status.startsWith('paid_'));
  const services = paid.flatMap((o) => JSON.parse(o.items) as CartItem[]);
  const revenue = paid.reduce((n, o) => n + o.total, 0);
  const stats = admin
    ? [
        ['wallet2', 'Test order value', money(revenue)],
        ['bag-check', 'Total orders', data.orders.length],
        [
          'people',
          'Customer accounts',
          data.users?.filter((u) => u.role === 'customer').length || 0,
        ],
        [
          'chat-square-text',
          'Open tickets',
          data.tickets.filter((t) => t.status !== 'resolved').length,
        ],
      ]
    : [
        ['hdd-stack', 'Demo services', services.filter((i) => !i.domain).length],
        ['globe2', 'Demo domains', services.filter((i) => i.domain).length],
        ['receipt', 'Orders', data.orders.length],
        [
          'chat-square-text',
          'Open tickets',
          data.tickets.filter((t) => t.status !== 'resolved').length,
        ],
      ];
  return (
    <>
      <div className="row g-3 dashboard-stats">
        {stats.map(([icon, label, value]) => (
          <div className="col-6 col-xl-3" key={String(label)}>
            <div>
              <span className="icon-surface">
                <Icon name={String(icon)} />
              </span>
              <small>{label}</small>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className="row g-4 mt-1">
        <div className="col-xl-8">
          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h2>{admin ? 'Recent order activity' : 'Your next good idea starts here.'}</h2>
                <p>
                  {admin
                    ? 'Actual records from this demonstration store.'
                    : 'A little more space. A new name. A website that feels like you.'}
                </p>
              </div>
              <Icon name={admin ? 'bar-chart-line' : 'stars'} />
            </div>
            {admin ? (
              <OrderChart orders={data.orders} />
            ) : (
              <div className="account-welcome">
                <div>
                  <h3>
                    Bring your ideas.
                    <br />
                    <span>We’ll help with the rest.</span>
                  </h3>
                  <Link href="/quote" className="btn btn-primary">
                    Plan a website <Icon name="arrow-up-right" />
                  </Link>
                </div>
                <div className="welcome-orb">v.</div>
              </div>
            )}
          </div>
        </div>
        <div className="col-xl-4">
          <div className="dashboard-panel quick-actions">
            <h2>A quicker next step.</h2>
            {(admin
              ? [
                  ['Review orders', '/admin/orders', 'bag-check'],
                  ['View quotations', '/admin/quotes', 'file-earmark-text'],
                  ['Answer a ticket', '/admin/support', 'chat-square-text'],
                ]
              : [
                  ['Find a domain', '/domains', 'globe2'],
                  ['Explore hosting', '/hosting', 'hdd-stack'],
                  ['Get a quotation', '/quote', 'file-earmark-text'],
                  ['Open a ticket', '/account/support', 'chat-square-text'],
                ]
            ).map(([label, href, icon]) => (
              <Link href={href} key={href}>
                <Icon name={icon} />
                {label}
                <Icon name="arrow-up-right" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="dashboard-panel mt-4">
        <div className="panel-heading">
          <div>
            <h2>Recent orders</h2>
            <p>Clear records, without the guesswork.</p>
          </div>
          <Link href={admin ? '/admin/orders' : '/account/invoices'} className="text-link">
            View all <Icon name="arrow-right" />
          </Link>
        </div>
        <Orders orders={data.orders.slice(0, 5)} admin={admin} compact />
      </div>
      <div className="info-banner mt-4">
        <Icon name="info-circle" />
        <span>
          Demo payments create order records only. No real revenue is collected and no hosting or
          domain services are provisioned.
        </span>
      </div>
    </>
  );
}
function OrderChart({ orders }: { orders: Order[] }) {
  const buckets = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    const key = d.toISOString().slice(0, 10);
    return {
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      count: orders.filter((o) => o.created_at.slice(0, 10) === key).length,
    };
  });
  const max = Math.max(1, ...buckets.map((b) => b.count));
  return (
    <div className="order-chart">
      <div className="chart-bars">
        {buckets.map((b) => (
          <div key={b.label}>
            <strong>{b.count}</strong>
            <span style={{ height: `${Math.max(3, (b.count / max) * 140)}px` }} />
            <small>{b.label}</small>
          </div>
        ))}
      </div>
      <p>Orders created in the last 7 days · {orders.length} total records</p>
    </div>
  );
}
function Services({ orders, domains }: { orders: Order[]; domains: boolean }) {
  const entries = orders
    .filter((o) => o.status.startsWith('paid_'))
    .flatMap((order) =>
      (JSON.parse(order.items) as CartItem[])
        .filter((i) => (domains ? !!i.domain : !i.domain))
        .map((item) => ({ item, order })),
    );
  return (
    <div className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <h2>{domains ? 'A name for every next chapter.' : 'A home for your digital world.'}</h2>
          <p>Confirmed demo purchases appear here. Live provisioning is not connected.</p>
        </div>
      </div>
      {!entries.length ? (
        <EmptyState
          icon={domains ? 'globe2' : 'hdd-stack'}
          title={domains ? 'Your next great name is waiting.' : 'Your first service starts here.'}
          text="Complete a demo order to see it in your account."
          href={domains ? '/domains' : '/hosting'}
          label={domains ? 'Find a domain' : 'Explore hosting'}
        />
      ) : (
        <div className="service-account-list">
          {entries.map(({ item, order }) => (
            <article key={order.id + item.id}>
              <span className="icon-surface">
                <Icon name={domains ? 'globe2' : 'hdd-stack'} />
              </span>
              <div>
                <h3>{item.name}</h3>
                <p>
                  {money(item.total)} / {item.period} · Ordered {date(order.created_at)}
                </p>
              </div>
              <Badge status="demo_only" />
              <Link href="/account/support" className="btn btn-outline-primary btn-sm">
                Ask about activation <Icon name="arrow-up-right" />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
function Orders({
  orders,
  admin,
  compact = false,
}: {
  orders: Order[];
  admin: boolean;
  compact?: boolean;
}) {
  const [selected, setSelected] = useState<Order | null>(null),
    [search, setSearch] = useState('');
  useEffect(() => {
    if (!selected) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>('.invoice-dialog');
    const elements = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button,a[href],input,select,textarea,[tabindex="0"]',
        ) || [],
      ).filter((el) => el.getClientRects().length > 0);
    elements()[0]?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSelected(null);
      }
      if (event.key === 'Tab') {
        const list = elements();
        const first = list[0],
          last = list[list.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('keydown', keydown);
      previous?.focus();
    };
  }, [selected]);
  const rows = orders.filter((o) =>
    `${o.id} ${o.customer_name || ''} ${o.customer_email || ''} ${o.status}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <div className={compact ? '' : 'dashboard-panel'}>
      {!compact && (
        <div className="panel-heading">
          <h2>{admin ? 'Every order, in view.' : 'Your order history.'}</h2>
          <label className="dashboard-search">
            <Icon name="search" />
            <input
              aria-label="Search orders"
              placeholder="Search orders…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
      )}
      {!orders.length ? (
        <EmptyState
          icon="receipt"
          title="No orders just yet."
          text={
            admin
              ? 'New checkout orders will appear here.'
              : 'Your orders will appear here after your first checkout.'
          }
          href={admin ? undefined : '/pricing'}
          label="Find your starting point"
        />
      ) : (
        <div className="table-responsive" tabIndex={0} role="region" aria-label="Account records">
          <table className="table dashboard-table">
            <thead>
              <tr>
                <th scope="col">Order</th>
                {admin && <th scope="col">Customer</th>}
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id}>
                  <td>
                    <strong>VH-{o.id.slice(0, 8).toUpperCase()}</strong>
                  </td>
                  {admin && (
                    <td>
                      {o.customer_name}
                      <small>{o.customer_email}</small>
                    </td>
                  )}
                  <td>{date(o.created_at)}</td>
                  <td>{money(o.total)}</td>
                  <td>
                    <Badge status={o.status} />
                  </td>
                  <td>
                    <button className="table-action" onClick={() => setSelected(o)}>
                      View <Icon name="arrow-up-right" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <p className="p-3">No matching orders.</p>}
        </div>
      )}
      {selected && (
        <div
          className="dialog-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <section
            className="invoice-dialog print-document"
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-title"
          >
            <button
              className="dialog-close no-print"
              onClick={() => setSelected(null)}
              aria-label="Close order details"
            >
              <Icon name="x-lg" />
            </button>
            <span className="eyebrow">VEEHOSTER · DEMO ORDER RECEIPT</span>
            <h2 id="invoice-title">Your next chapter, itemized.</h2>
            <p>
              VH-{selected.id.slice(0, 8).toUpperCase()} · {date(selected.created_at)}
            </p>
            <Badge status={selected.status} />
            <div className="mt-4">
              {(JSON.parse(selected.items) as CartItem[]).map((i) => (
                <div className="quote-line" key={i.id}>
                  <span>
                    {i.name} × {i.quantity}
                  </span>
                  <strong>{money(i.total)}</strong>
                </div>
              ))}
              <div className="quote-line">
                <span>Illustrative GST (18%)</span>
                <strong>{money(selected.tax)}</strong>
              </div>
              <div className="quote-total">
                <span>Total</span>
                <strong>{money(selected.total)}</strong>
              </div>
            </div>
            <p className="small text-muted">
              This is a demo order receipt, not a tax invoice. No real money has been charged.
              Services are not provisioned.
            </p>
            <button className="btn btn-primary no-print" onClick={() => window.print()}>
              <Icon name="printer" /> Print / save PDF
            </button>
            {!admin && !selected.status.startsWith('paid_') && selected.payment_mode === 'demo' && (
              <Link
                href={`/payment/demo?order=${selected.id}`}
                className="btn btn-outline-primary no-print ms-2"
              >
                Continue payment
              </Link>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
function Customers({ users }: { users: User[] }) {
  const [search, setSearch] = useState('');
  const rows = users.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="dashboard-panel">
      <div className="panel-heading">
        <h2>The people behind the accounts.</h2>
        <label className="dashboard-search">
          <Icon name="search" />
          <input
            aria-label="Search customers"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers…"
          />
        </label>
      </div>
      <div className="table-responsive" tabIndex={0} role="region" aria-label="Account records">
        <table className="table dashboard-table">
          <thead>
            <tr>
              <th scope="col">Customer</th>
              <th scope="col">Email address</th>
              <th scope="col">Phone</th>
              <th scope="col">Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td>
                  <span className="customer-name">
                    <span className="avatar">{u.name[0]}</span>
                    <strong>{u.name}</strong>
                  </span>
                </td>
                <td>{u.email}</td>
                <td>{u.phone || 'Not provided'}</td>
                <td>
                  <Badge status={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="p-3">No matching accounts.</p>}
      </div>
    </div>
  );
}
function Support({
  tickets,
  admin,
  reload,
}: {
  tickets: Ticket[];
  admin: boolean;
  reload: () => Promise<void>;
}) {
  const [selected, setSelected] = useState<string | null>(null),
    [creating, setCreating] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const ticket = tickets.find((t) => t.id === selected);
  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const input = Object.fromEntries(new FormData(e.currentTarget));
      const result = await api('tickets', { method: 'POST', body: JSON.stringify(input) });
      await reload();
      setCreating(false);
      setSelected(result.id);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function reply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const form = e.currentTarget;
    try {
      await api(`tickets/${selected}`, {
        method: 'PATCH',
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      form.reset();
      await reload();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <h2>A conversation worth keeping.</h2>
          <p>Keep questions, replies and next steps together.</p>
        </div>
        {!admin && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setCreating(!creating);
              setSelected(null);
            }}
          >
            {creating ? 'Close form' : 'New ticket'}
            <Icon name="plus-lg" />
          </button>
        )}
      </div>
      <ErrorMessage error={error} />
      {creating ? (
        <form onSubmit={create} className="ticket-form">
          <label className="form-label" htmlFor="ticket-subject">
            Subject
          </label>
          <input
            className="form-control mb-3"
            id="ticket-subject"
            name="subject"
            required
            minLength={5}
            maxLength={150}
          />
          <label className="form-label" htmlFor="ticket-message">
            How can we help?
          </label>
          <textarea
            className="form-control mb-3"
            id="ticket-message"
            name="message"
            required
            minLength={10}
            maxLength={3000}
            rows={5}
          />
          <p className="small text-muted">Do not include passwords, payment details or API keys.</p>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Saving…' : 'Create support ticket'}
            <Icon name="arrow-right" />
          </button>
        </form>
      ) : !tickets.length ? (
        <EmptyState
          icon="chat-square-heart"
          title="A clean slate. We’re here if you need us."
          text="Support conversations will appear here."
        />
      ) : (
        <div className="ticket-layout">
          <div className="ticket-list">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={selected === t.id ? 'selected' : ''}
              >
                <strong>{t.subject}</strong>
                <span>{admin ? t.customer_name : date(t.created_at)}</span>
                <Badge status={t.status} />
              </button>
            ))}
          </div>
          <div className="ticket-conversation">
            {ticket ? (
              <>
                <h3>{ticket.subject}</h3>
                {(
                  JSON.parse(ticket.messages) as {
                    author: string;
                    role: string;
                    text: string;
                    date: string;
                  }[]
                ).map((m, i) => (
                  <div className={`ticket-message ${m.role === 'admin' ? 'staff' : ''}`} key={i}>
                    <div>
                      <strong>{m.author}</strong>
                      <span>
                        {m.role === 'admin' ? 'Support team' : 'Customer'} · {date(m.date)}
                      </span>
                    </div>
                    <p>{m.text}</p>
                  </div>
                ))}
                <form onSubmit={reply}>
                  <label className="form-label" htmlFor="reply-message">
                    Your reply
                  </label>
                  <textarea
                    className="form-control mb-3"
                    id="reply-message"
                    name="message"
                    rows={3}
                    maxLength={3000}
                    required
                  />
                  <div className="d-flex gap-3">
                    {admin && (
                      <select
                        className="form-select"
                        aria-label="Ticket status"
                        name="status"
                        defaultValue={ticket.status}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    )}
                    <button className="btn btn-primary" disabled={busy}>
                      {busy ? 'Sending…' : 'Send reply'}
                      <Icon name="send" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <EmptyState
                icon="chat-left-text"
                title="Pick up a conversation."
                text="Choose a ticket to view its messages."
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
function Inquiries({ rows, reload }: { rows: Inquiry[]; reload: () => Promise<void> }) {
  const [filter, setFilter] = useState('all'),
    [error, setError] = useState('');
  async function update(id: string, status: string) {
    try {
      await api(`admin/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      await reload();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <div className="dashboard-panel">
      <div className="panel-heading">
        <h2>Ideas ready for a conversation.</h2>
        <select
          className="form-select w-auto"
          aria-label="Filter enquiries"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All enquiries</option>
          {['quote', 'contact', 'migration', 'seo'].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </div>
      <ErrorMessage error={error} />
      {!rows.length ? (
        <EmptyState
          title="The next project starts with hello."
          text="Contact requests, migration assessments and quotations appear here."
        />
      ) : (
        <div className="inquiry-list">
          {rows
            .filter((r) => filter === 'all' || r.kind === filter)
            .map((r) => {
              const detail = JSON.parse(r.details);
              return (
                <details key={r.id}>
                  <summary>
                    <span className="icon-surface">
                      <Icon name={r.kind === 'quote' ? 'file-earmark-text' : 'chat-left-text'} />
                    </span>
                    <span>
                      <strong>{r.name}</strong>
                      <small>
                        {r.kind} · {date(r.created_at)}
                      </small>
                    </span>
                    {detail.total && <strong>{money(detail.total)}</strong>}
                    <Badge status={r.status} />
                    <Icon name="chevron-down" />
                  </summary>
                  <div className="inquiry-detail">
                    <p>{r.message}</p>
                    <a href={`mailto:${r.email}`}>{r.email}</a>
                    {r.phone && <span className="ms-3">{r.phone}</span>}
                    {detail.website && <p className="mt-2">Website: {detail.website}</p>}
                    {detail.package && (
                      <div className="info-banner mt-3">
                        <Icon name="file-earmark-text" />
                        <span>
                          {detail.package}
                          {detail.extras?.length
                            ? ' + ' + detail.extras.map((e: { name: string }) => e.name).join(', ')
                            : ''}
                          <br />
                          Estimate: {money(detail.total)} including illustrative GST.
                        </span>
                      </div>
                    )}
                    <label className="form-label mt-3" htmlFor={`status-${r.id}`}>
                      Request status
                    </label>
                    <select
                      className="form-select max-300"
                      id={`status-${r.id}`}
                      value={r.status}
                      onChange={(e) => update(r.id, e.target.value)}
                    >
                      {['new', 'contacted', 'quoted', 'closed'].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </details>
              );
            })}
        </div>
      )}
    </div>
  );
}
function Settings() {
  const { user, refresh, notify } = useApp();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const form = e.currentTarget;
    const input = Object.fromEntries(new FormData(form));
    if (!input.newPassword) {
      delete input.newPassword;
      delete input.currentPassword;
    }
    try {
      await api('account/settings', { method: 'PATCH', body: JSON.stringify(input) });
      await refresh();
      notify('Your account details have been updated.');
      (form.elements.namedItem('currentPassword') as HTMLInputElement).value = '';
      (form.elements.namedItem('newPassword') as HTMLInputElement).value = '';
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="dashboard-panel max-800">
      <h2>A little about you.</h2>
      <p>Keep your details current and your account protected.</p>
      <form onSubmit={submit}>
        <ErrorMessage error={error} />
        <div className="row g-3 mt-2">
          <div className="col-md-6">
            <label className="form-label" htmlFor="settings-name">
              Name
            </label>
            <input
              className="form-control"
              id="settings-name"
              name="name"
              defaultValue={user?.name}
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="settings-phone">
              Phone
            </label>
            <input
              className="form-control"
              id="settings-phone"
              name="phone"
              defaultValue={user?.phone}
              maxLength={25}
              type="tel"
              autoComplete="tel"
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="settings-email">
              Email address
            </label>
            <input
              className="form-control"
              id="settings-email"
              value={user?.email || ''}
              readOnly
            />
            <small className="text-muted">
              Contact support if your account email needs to change.
            </small>
          </div>
        </div>
        <hr className="my-4" />
        <h3 className="h5">Update your password</h3>
        <p className="small">
          Leave these blank to keep your current password. A change signs out your other sessions.
        </p>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="current-password">
              Current password
            </label>
            <input
              className="form-control"
              id="current-password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              maxLength={128}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="new-password">
              New password
            </label>
            <input
              className="form-control"
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={12}
              maxLength={128}
            />
          </div>
        </div>
        <button className="btn btn-primary mt-4" disabled={busy}>
          {busy ? 'Saving…' : 'Save my changes'}
          <Icon name="check2" />
        </button>
      </form>
    </div>
  );
}
