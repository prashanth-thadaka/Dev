'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { company, money } from '@/lib/catalog';
import type { Order, CartItem } from '@/lib/types';
import { api, useApp } from './provider';
import { EmptyState, ErrorMessage, Icon } from './ui';

export function AuthPage({
  mode,
}: {
  mode: 'login' | 'register' | 'forgot-password' | 'reset-password';
}) {
  const router = useRouter(),
    params = useSearchParams();
  const { refresh } = useApp();
  const [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('');
  const register = mode === 'register',
    login = mode === 'login';
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const endpoint = register
        ? 'register'
        : login
          ? 'login'
          : mode === 'forgot-password'
            ? 'forgot'
            : 'reset';
      const data = await api(`auth/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify({ ...fields, terms: true, token: params.get('token') || '' }),
      });
      if (register || login) {
        await refresh();
        router.push(
          params.get('next') === '/checkout'
            ? '/checkout'
            : data.user?.role === 'admin'
              ? '/admin'
              : '/account',
        );
      } else setMessage(data.message);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-section">
      <div className="container-xl">
        <div className="auth-layout">
          <aside className="auth-story">
            <span className="eyebrow light">A LITTLE SPACE FOR BIG IDEAS</span>
            <div className="auth-orbits" aria-hidden="true">
              <div />
              <div />
              <span>v.</span>
              <i>✦</i>
            </div>
            <h1>
              Your next chapter
              <br />
              <span>starts here.</span>
            </h1>
            <p>
              A home for your website. A place to manage the details. A partner for what comes next.
            </p>
            <ul>
              <li>
                <Icon name="globe2" /> Domains, hosting and websites, together.
              </li>
              <li>
                <Icon name="shield-check" /> Your account. Your control.
              </li>
              <li>
                <Icon name="chat-square-heart" /> Help when you need a next step.
              </li>
            </ul>
          </aside>
          <div className="auth-form-panel">
            <span className="eyebrow">WELCOME TO VEEHOSTER</span>
            <h2>
              {register
                ? 'Make room for your next idea.'
                : login
                  ? 'Good to see you again.'
                  : mode === 'forgot-password'
                    ? 'Let’s get you back in.'
                    : 'A fresh start for your password.'}
            </h2>
            <p>
              {register
                ? 'Create your account and bring the possibilities together.'
                : login
                  ? 'Sign in to manage your services, orders and conversations.'
                  : 'Use a strong password that you don’t use elsewhere.'}
            </p>
            {message ? (
              <div className="alert alert-success" role="status">
                {message}
                <Link href="/login" className="d-block mt-3">
                  Back to sign in <Icon name="arrow-right" />
                </Link>
              </div>
            ) : (
              <form onSubmit={submit}>
                <ErrorMessage error={error} />
                {register && (
                  <div className="mb-3">
                    <label className="form-label" htmlFor="auth-name">
                      Your name
                    </label>
                    <input
                      id="auth-name"
                      name="name"
                      className="form-control"
                      required
                      minLength={2}
                      maxLength={100}
                      autoComplete="name"
                    />
                  </div>
                )}
                {mode !== 'reset-password' && (
                  <div className="mb-3">
                    <label className="form-label" htmlFor="auth-email">
                      Email address
                    </label>
                    <input
                      id="auth-email"
                      name="email"
                      className="form-control"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                    />
                  </div>
                )}
                {mode !== 'forgot-password' && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <label className="form-label" htmlFor="auth-password">
                        Password
                      </label>
                      {login && (
                        <Link href="/forgot-password" className="small">
                          Forgot password?
                        </Link>
                      )}
                    </div>
                    <div className="password-input">
                      <input
                        id="auth-password"
                        name="password"
                        className="form-control"
                        type={show ? 'text' : 'password'}
                        required
                        minLength={login ? 1 : 12}
                        maxLength={128}
                        autoComplete={login ? 'current-password' : 'new-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShow(!show)}
                        aria-label={show ? 'Hide password' : 'Show password'}
                      >
                        <Icon name={show ? 'eye-slash' : 'eye'} />
                      </button>
                    </div>
                    {!login && (
                      <small className="text-muted">
                        At least 12 characters. A memorable passphrase works well.
                      </small>
                    )}
                  </div>
                )}
                {register && (
                  <label className="form-check d-flex gap-2 my-4">
                    <input className="form-check-input" name="terms" type="checkbox" required />
                    <span className="small">
                      I agree to the <Link href="/terms">terms of service</Link> and{' '}
                      <Link href="/privacy">privacy policy</Link>.
                    </span>
                  </label>
                )}
                <button className="btn btn-primary w-100" disabled={busy}>
                  {busy
                    ? 'Just a moment…'
                    : register
                      ? 'Create my account'
                      : login
                        ? 'Sign in'
                        : 'Continue'}
                  <Icon name="arrow-right" />
                </button>
              </form>
            )}
            {(register || login) && (
              <p className="auth-switch">
                {register ? 'Already have an account?' : 'New around here?'}{' '}
                <Link
                  href={`${register ? '/login' : '/register'}${params.get('next') === '/checkout' ? '?next=/checkout' : ''}`}
                >
                  {register ? 'Sign in' : 'Create an account'}
                </Link>
              </p>
            )}
            <div className="auth-security">
              <Icon name="lock" /> Passwords are hashed. Your session stays in a secure cookie.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function CheckoutSteps({ step }: { step: number }) {
  return (
    <div className="checkout-steps">
      {['Your cart', 'Your details', 'Payment'].map((label, i) => (
        <span className={step >= i ? 'active' : ''} key={label}>
          <b>{step > i ? <Icon name="check2" /> : i + 1}</b>
          {label}
        </span>
      ))}
    </div>
  );
}
function OrderSummary({ button }: { button?: React.ReactNode }) {
  const { cart } = useApp();
  const live = cart?.mode === 'payu_live';
  return (
    <aside className="order-summary">
      <h2>A little overview.</h2>
      <div className="quote-line">
        <span>Subtotal</span>
        <strong>{money(cart?.subtotal || 0)}</strong>
      </div>
      <div className="quote-line">
        <span>Illustrative GST (18%)</span>
        <strong>{money(cart?.tax || 0)}</strong>
      </div>
      <div className="order-total">
        <span>Total today</span>
        <strong>{money(cart?.total || 0)}</strong>
      </div>
      {button}
      <div className="demo-checkout-note">
        <Icon name="info-circle" />
        <p>
          <strong>
            {live ? 'Hosted payment. Clear order tracking.' : 'Demo checkout. No real charge.'}
          </strong>
          <br />
          {live
            ? 'Payment is collected by PayU. Service activation is handled separately after confirmation.'
            : 'Prices and tax are illustrative. Hosting and domains are not provisioned.'}
        </p>
      </div>
      <div className="summary-help">
        <Icon name="headset" />
        <span>
          A question before you begin?<a href={`tel:${company.tel}`}>{company.phone}</a>
        </span>
      </div>
    </aside>
  );
}
export function CartPage() {
  const { cart, refreshCart } = useApp();
  const [error, setError] = useState(''),
    [removing, setRemoving] = useState('');
  async function remove(id: string) {
    setRemoving(id);
    setError('');
    try {
      await api('cart', { method: 'DELETE', body: JSON.stringify({ id }) });
      await refreshCart();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRemoving('');
    }
  }
  return (
    <section className="commerce-section">
      <div className="container-xl">
        <CheckoutSteps step={0} />
        <span className="eyebrow">A FEW GOOD CHOICES</span>
        <h1>
          Your next chapter,
          <br />
          <span className="text-primary">in the making.</span>
        </h1>
        <p className="lead mb-5">Review your plans and get ready for what comes next.</p>
        <ErrorMessage error={error} />
        {!cart ? (
          <div className="loading-panel" role="status">
            Loading your cart…
          </div>
        ) : !cart.items.length ? (
          <EmptyState
            icon="bag"
            title="A little empty. Full of possibility."
            text="Find a hosting plan, a domain or an SEO package to get started."
            href="/pricing"
            label="Explore packages"
          />
        ) : (
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="cart-items">
                <div className="cart-heading">
                  <h2>
                    Your cart <span>({cart.items.length})</span>
                  </h2>
                  <Link href="/pricing">
                    Keep exploring <Icon name="arrow-up-right" />
                  </Link>
                </div>
                {cart.items.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <span className="icon-surface">
                      <Icon
                        name={
                          item.domain
                            ? 'globe2'
                            : item.sku.startsWith('hosting')
                              ? 'hdd-stack'
                              : 'graph-up-arrow'
                        }
                      />
                    </span>
                    <div>
                      <h3>{item.name}</h3>
                      <p>
                        {item.domain
                          ? 'Domain registration'
                          : item.sku.startsWith('hosting')
                            ? 'Web hosting'
                            : 'SEO service'}{' '}
                        · Billed{' '}
                        {item.period === 'year'
                          ? 'yearly'
                          : item.period === 'month'
                            ? 'monthly'
                            : 'once'}
                      </p>
                      <span className="small text-muted">
                        Demo service · quantity {item.quantity}
                      </span>
                    </div>
                    <strong>{money(item.total)}</strong>
                    <button
                      className="icon-button"
                      onClick={() => remove(item.id)}
                      disabled={removing === item.id}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Icon name="trash3" />
                    </button>
                  </article>
                ))}
              </div>
              <div className="cart-confidence">
                <Icon name="shield-check" />
                <div>
                  <strong>A clear total before you continue.</strong>
                  <p>
                    No payment details are collected in demo mode. Your order stays in your customer
                    account.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <OrderSummary
                button={
                  <Link href="/checkout" className="btn btn-primary w-100">
                    Continue to checkout <Icon name="arrow-right" />
                  </Link>
                }
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
export function CheckoutPage() {
  const { cart, user, ready } = useApp();
  const router = useRouter();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const fingerprint = JSON.stringify(cart?.items.map((i) => [i.id, i.total]));
      const previous = JSON.parse(sessionStorage.getItem('vh_checkout') || 'null');
      const key = previous?.fingerprint === fingerprint ? previous.key : crypto.randomUUID();
      sessionStorage.setItem('vh_checkout', JSON.stringify({ fingerprint, key }));
      const response = await api('checkout', {
        method: 'POST',
        body: JSON.stringify({ ...data, terms: true, idempotencyKey: key }),
      });
      if (response.mode === 'demo') router.push(`/payment/demo?order=${response.orderId}`);
      else {
        const payu = await api('payments/payu/start', {
          method: 'POST',
          body: JSON.stringify({ orderId: response.orderId }),
        });
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payu.action;
        for (const [name, value] of Object.entries(payu.fields)) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = String(value);
          form.appendChild(input);
        }
        document.body.appendChild(form);
        form.submit();
      }
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <section className="commerce-section">
      <div className="container-xl">
        <CheckoutSteps step={1} />
        <span className="eyebrow">ONE STEP CLOSER</span>
        <h1>
          Let’s make it <span className="text-primary">yours.</span>
        </h1>
        <p className="lead mb-5">Add your billing details and review the final amount.</p>
        {!ready || !cart ? (
          <div className="loading-panel">Preparing your checkout…</div>
        ) : !user ? (
          <div className="form-panel mx-auto text-center max-600">
            <span className="icon-surface mx-auto">
              <Icon name="person-circle" />
            </span>
            <h2 className="mt-4">Your order needs a home.</h2>
            <p>
              Sign in or create an account to keep your orders and support conversations together.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link href="/login?next=/checkout" className="btn btn-primary">
                Sign in
              </Link>
              <Link href="/register?next=/checkout" className="btn btn-outline-primary">
                Create account
              </Link>
            </div>
          </div>
        ) : !cart.items.length ? (
          <EmptyState
            title="Your cart is empty"
            text="Add a package before checking out."
            href="/pricing"
          />
        ) : (
          <form onSubmit={submit}>
            <div className="row g-5">
              <div className="col-lg-8">
                <div className="form-panel">
                  <ErrorMessage error={error} />
                  <h2>Your billing details</h2>
                  <p>
                    Signed in as <strong>{user.email}</strong>
                  </p>
                  <div className="row g-3 mt-2">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="billing-name">
                        Full name
                      </label>
                      <input
                        className="form-control"
                        id="billing-name"
                        name="name"
                        required
                        minLength={2}
                        maxLength={100}
                        defaultValue={user.name}
                        autoComplete="name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="billing-phone">
                        Phone number
                      </label>
                      <input
                        className="form-control"
                        id="billing-phone"
                        name="phone"
                        type="tel"
                        maxLength={25}
                        defaultValue={user.phone}
                        autoComplete="tel"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label" htmlFor="billing-address">
                        Billing address
                      </label>
                      <input
                        className="form-control"
                        id="billing-address"
                        name="address"
                        required
                        minLength={5}
                        maxLength={300}
                        autoComplete="street-address"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="billing-city">
                        City
                      </label>
                      <input
                        className="form-control"
                        id="billing-city"
                        name="city"
                        required
                        minLength={2}
                        maxLength={100}
                        autoComplete="address-level2"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="billing-state">
                        State
                      </label>
                      <input
                        className="form-control"
                        id="billing-state"
                        name="state"
                        required
                        minLength={2}
                        maxLength={100}
                        autoComplete="address-level1"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="billing-postcode">
                        PIN code
                      </label>
                      <input
                        className="form-control"
                        id="billing-postcode"
                        name="postcode"
                        required
                        pattern="[0-9]{6}"
                        inputMode="numeric"
                        maxLength={6}
                        autoComplete="postal-code"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="billing-country">
                        Country
                      </label>
                      <input
                        className="form-control"
                        id="billing-country"
                        value="India"
                        readOnly
                        autoComplete="country-name"
                      />
                    </div>
                  </div>
                  <div className="payment-option">
                    <Icon name="wallet2" />
                    <div>
                      <strong>
                        PayU checkout ·{' '}
                        {cart.mode === 'payu_live'
                          ? 'secure hosted payment'
                          : cart.demo
                            ? 'local demo'
                            : 'sandbox'}
                      </strong>
                      <p>
                        {cart.demo
                          ? 'Explore a simulated payment without entering card details.'
                          : cart.mode === 'payu_live'
                            ? 'Continue to PayU’s hosted payment page.'
                            : 'Continue to PayU’s hosted test payment page. Test credentials only.'}
                      </p>
                    </div>
                    <Icon name="check-circle-fill" />
                  </div>
                  <label className="form-check d-flex gap-2 mt-4">
                    <input className="form-check-input" type="checkbox" name="terms" required />
                    <span className="small">
                      I agree to the <Link href="/terms">terms</Link> and{' '}
                      <Link href="/refunds">refund policy</Link>,{' '}
                      {cart.mode === 'payu_live'
                        ? 'and understand service activation follows payment confirmation.'
                        : 'and understand this is a demonstration order.'}
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-lg-4">
                <OrderSummary
                  button={
                    <button className="btn btn-primary w-100" disabled={busy}>
                      {busy ? 'Preparing your order…' : `Continue · ${money(cart.total)}`}
                      <Icon name="arrow-right" />
                    </button>
                  }
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
export function PaymentPage({ result = false }: { result?: boolean }) {
  const params = useSearchParams(),
    router = useRouter();
  const { refreshCart } = useApp();
  const orderId = params.get('order');
  const [order, setOrder] = useState<Order | null>(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!orderId) {
      setError('No order was selected.');
      return;
    }
    api(`orders/${orderId}`)
      .then((data) => setOrder(data.order))
      .catch((e) => setError(e.message));
  }, [orderId, result]);
  async function pay(outcome: string) {
    setBusy(true);
    setError('');
    try {
      await api('payments/demo', { method: 'POST', body: JSON.stringify({ orderId, outcome }) });
      await refreshCart();
      if (outcome === 'success') sessionStorage.removeItem('vh_checkout');
      router.push(`/payment/result?order=${orderId}`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  const paid = order?.status.startsWith('paid_');
  return (
    <section className="commerce-section">
      <div className="container-xl">
        <div className="payment-panel">
          <ErrorMessage error={error} />
          {!order ? (
            !error && <p role="status">Loading your order…</p>
          ) : result ? (
            <>
              <span className={`payment-result-icon ${paid ? 'paid' : ''}`}>
                <Icon
                  name={
                    paid
                      ? 'check2-circle'
                      : order.status === 'cancelled'
                        ? 'x-circle'
                        : 'exclamation-circle'
                  }
                />
              </span>
              <span className="eyebrow">
                {paid ? 'A GOOD NEXT STEP' : 'LET’S TAKE ANOTHER LOOK'}
              </span>
              <h1>
                {paid
                  ? order.payment_mode === 'payu_live'
                    ? 'Your payment is confirmed.'
                    : 'Your demo order is confirmed.'
                  : order.status === 'cancelled'
                    ? 'Payment cancelled.'
                    : order.status === 'failed'
                      ? 'The demo payment failed.'
                      : 'Your order is awaiting payment.'}
              </h1>
              <p>
                {paid
                  ? order.payment_mode === 'payu_live'
                    ? 'Your payment is verified and your order is saved. Our team will confirm the service activation details.'
                    : 'No real charge was made. Your order is saved in your account. Hosting and domains have not been provisioned.'
                  : order.payment_mode === 'payu_live'
                    ? 'Your order has no confirmed payment yet. If your bank shows a charge, contact us with this order reference.'
                    : 'No charge was made. You can return to your account or retry the demo payment.'}
              </p>
              <div className="payment-order">
                <span>Order {order.id.slice(0, 8).toUpperCase()}</span>
                <strong>{money(order.total)}</strong>
                <span className="status-badge">{order.status.replaceAll('_', ' ')}</span>
              </div>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Link href="/account/invoices" className="btn btn-primary">
                  View my orders <Icon name="arrow-right" />
                </Link>
                {!paid && order.payment_mode === 'demo' && (
                  <Link
                    href={`/payment/demo?order=${order.id}`}
                    className="btn btn-outline-primary"
                  >
                    Retry demo payment
                  </Link>
                )}
                <Link href="/" className="btn btn-outline-dark">
                  Back to Veehoster
                </Link>
              </div>
            </>
          ) : (
            <>
              <span className="payment-demo-label">DEMONSTRATION ONLY · NO REAL CHARGE</span>
              <span className="eyebrow mt-4">VEEHOSTER × PAYU INTEGRATION PREVIEW</span>
              <h1>
                A safe space
                <br />
                to test checkout.
              </h1>
              <p>
                This local simulator demonstrates success, failure and cancellation. It does not
                contact PayU or collect payment details.
              </p>
              <div className="payment-order">
                <span>Order {order.id.slice(0, 8).toUpperCase()}</span>
                <strong>{money(order.total)}</strong>
              </div>
              <div className="payment-items">
                {(JSON.parse(order.items) as CartItem[]).map((i) => (
                  <div key={i.id}>
                    <span>{i.name}</span>
                    <strong>{money(i.total)}</strong>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary w-100"
                disabled={busy}
                onClick={() => pay('success')}
              >
                Simulate successful payment <Icon name="check2" />
              </button>
              <div className="d-flex gap-3 mt-3">
                <button
                  className="btn btn-outline-dark flex-fill"
                  disabled={busy}
                  onClick={() => pay('failure')}
                >
                  Simulate failure
                </button>
                <button
                  className="btn btn-outline-dark flex-fill"
                  disabled={busy}
                  onClick={() => pay('cancel')}
                >
                  Cancel payment
                </button>
              </div>
              <p className="small text-muted mt-4">
                PayU sandbox credentials can be configured later. Real payments remain disabled.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
