'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  byCategory,
  money,
  itemPrice,
  quoteExtras,
  projects,
  type Category,
  company,
} from '@/lib/catalog';
import { api, useApp } from './provider';
import { ErrorMessage, Icon, ProjectVisual } from './ui';

export function AddButton({
  sku,
  cycle = 'monthly',
  domain = '',
  className = 'btn btn-primary w-100',
  children,
}: {
  sku: string;
  cycle?: string;
  domain?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const { add } = useApp();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  return (
    <>
      <button
        className={className}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError('');
          try {
            await add(sku, cycle, domain);
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy
          ? 'Adding…'
          : children || (
              <>
                Choose this plan <Icon name="arrow-right" />
              </>
            )}
      </button>
      {error && (
        <p className="text-danger small mt-2" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
export function Pricing({
  category = 'hosting',
  tabs = false,
}: {
  category?: Category;
  tabs?: boolean;
}) {
  const [active, setActive] = useState(category),
    [annual, setAnnual] = useState(false);
  const items = byCategory(active);
  return (
    <div className="pricing-component">
      {tabs && (
        <div className="pill-tabs mb-4">
          {(['hosting', 'website', 'seo'] as Category[]).map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={active === c ? 'selected' : ''}
              aria-pressed={active === c}
            >
              {c === 'website'
                ? 'Website development'
                : c === 'seo'
                  ? 'SEO services'
                  : 'Web hosting'}
            </button>
          ))}
        </div>
      )}
      {active === 'hosting' && (
        <div className="billing-toggle">
          <div className="pill-tabs">
            <button
              className={!annual ? 'selected' : ''}
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
            >
              Monthly
            </button>
            <button
              className={annual ? 'selected' : ''}
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
            >
              Yearly <span>Save 10%</span>
            </button>
          </div>
          <span>Simple plans. A clear next step.</span>
        </div>
      )}
      <div className="row g-4 align-items-stretch">
        {items.map((p, i) => (
          <div className="col-lg-4" key={p.id}>
            <article className={`price-card ${p.featured ? 'featured' : ''}`}>
              <div className="price-topline">
                <span className="plan-icon">
                  <Icon name={['box', 'layers', 'lightning-charge'][i]} />
                </span>
                {p.badge && <span className="plan-badge">{p.badge}</span>}
              </div>
              <h3>{p.name}</h3>
              <p className="plan-description">{p.description}</p>
              <div className="price-amount">
                {money(itemPrice(p, annual ? 'annual' : 'monthly'))}
                <span>/{annual && active === 'hosting' ? 'year' : p.period}</span>
              </div>
              <p className="price-note">
                {annual && active === 'hosting'
                  ? '12 months, paid upfront.'
                  : 'Transparent ' +
                    (p.period === 'project' ? 'project' : 'recurring') +
                    ' pricing.'}{' '}
                Taxes extra.
              </p>
              {active === 'website' ? (
                <Link
                  href={`/quote?package=${p.id}`}
                  className={`btn w-100 ${p.featured ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                  Build my quotation <Icon name="arrow-up-right" />
                </Link>
              ) : (
                <AddButton
                  sku={p.id}
                  cycle={annual && active === 'hosting' ? 'annual' : 'monthly'}
                  className={`btn w-100 ${p.featured ? 'btn-primary' : 'btn-outline-primary'}`}
                />
              )}
              <div className="price-divider" />
              <span className="includes-label">A FEW GOOD THINGS INCLUDED</span>
              <ul className="check-list">
                {p.features.map((f) => (
                  <li key={f}>
                    <Icon name="check2" />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        ))}
      </div>
      <p className="pricing-fineprint">
        Proposed INR prices for this demo storefront. Hosting resources require provider
        provisioning. <Link href="/terms">See package terms.</Link>
      </p>
    </div>
  );
}
export function DomainSearch({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState(''),
    [results, setResults] = useState<
      { domain: string; sku: string; price: number; available: boolean }[] | null
    >(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (compact) return;
    const initial = new URLSearchParams(window.location.search).get('q');
    if (!initial) return;
    setQuery(initial);
    setBusy(true);
    api(`domains/search?q=${encodeURIComponent(initial)}`)
      .then((data) => setResults(data.results))
      .catch((e) => setError(e.message))
      .finally(() => setBusy(false));
  }, [compact]);
  async function search(e: FormEvent) {
    e.preventDefault();
    if (compact) {
      router.push(`/domains?q=${encodeURIComponent(query)}`);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const data = await api(`domains/search?q=${encodeURIComponent(query)}`);
      setResults(data.results);
    } catch (e) {
      setError((e as Error).message);
      setResults(null);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={`domain-search ${compact ? 'compact' : ''}`}>
      <form onSubmit={search}>
        <label className="visually-hidden" htmlFor={compact ? 'home-domain' : 'domain-search'}>
          Search for your domain name
        </label>
        <Icon name="globe2" />
        <input
          id={compact ? 'home-domain' : 'domain-search'}
          name="domain"
          required
          minLength={2}
          maxLength={253}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Your next great idea.com"
          autoComplete="off"
        />
        <button className="btn btn-primary" disabled={busy} type="submit">
          {busy ? 'Searching…' : 'Find my domain'} <Icon name="arrow-right" />
        </button>
      </form>
      <div className="domain-extensions">
        {byCategory('domain').map((p) => (
          <span key={p.id}>
            <b>{p.name}</b> {money(p.price)}
            <small>/yr</small>
          </span>
        ))}
      </div>
      <ErrorMessage error={error} />
      {!compact && (
        <>
          <p className="demo-note">
            <Icon name="info-circle" /> Demo search: results are simulated, not a live availability
            check. Annual renewal prices require registrar confirmation.
          </p>
          {results && (
            <div className="domain-results">
              <div className="results-heading">
                <h3>A name to call your own.</h3>
                <span>{results.length} demo suggestions</span>
              </div>
              {results.map((r) => (
                <div className="domain-result" key={r.domain}>
                  <span className="result-globe">
                    <Icon name="globe2" />
                  </span>
                  <strong>{r.domain}</strong>
                  <span className={`status-badge ${r.available ? 'success' : 'neutral'}`}>
                    {r.available ? 'Available · demo' : 'Unavailable · demo'}
                  </span>
                  <span className="result-price">
                    {money(r.price)}
                    <small>/year</small>
                  </span>
                  {r.available ? (
                    <AddButton
                      sku={r.sku}
                      domain={r.domain}
                      cycle="once"
                      className="btn btn-outline-primary btn-sm"
                    >
                      Add to cart <Icon name="plus" />
                    </AddButton>
                  ) : (
                    <span className="small text-muted">Try another name</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
export function InquiryForm({
  kind = 'contact',
  packageId,
  extras = [],
  button = 'Send your message',
}: {
  kind?: 'contact' | 'migration' | 'quote' | 'seo';
  packageId?: string;
  extras?: string[];
  button?: string;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState<{ message: string; id?: string } | null>(null);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const form = e.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    try {
      const data = await api('inquiries', {
        method: 'POST',
        body: JSON.stringify({ ...fields, kind, packageId, extras, consent: true }),
      });
      setSuccess(data);
      form.reset();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      {success ? (
        <div className="form-success" role="status">
          <span className="icon-surface green">
            <Icon name="check2-circle" />
          </span>
          <h3>Your next chapter is on its way.</h3>
          <p>{success.message}</p>
          {success.id && (
            <p className="small">
              Reference: <strong>{success.id.slice(0, 8).toUpperCase()}</strong>
            </p>
          )}
          <button className="btn btn-outline-primary" onClick={() => setSuccess(null)}>
            Send another request
          </button>
        </div>
      ) : (
        <form className="inquiry-form" onSubmit={submit}>
          <ErrorMessage error={error} />
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor={`${kind}-name`}>
                Your name
              </label>
              <input
                id={`${kind}-name`}
                className="form-control"
                name="name"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                placeholder="Alex Sharma"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor={`${kind}-email`}>
                Email address
              </label>
              <input
                id={`${kind}-email`}
                className="form-control"
                type="email"
                name="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="you@yourbusiness.com"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor={`${kind}-phone`}>
                Phone <span>(optional)</span>
              </label>
              <input
                id={`${kind}-phone`}
                className="form-control"
                type="tel"
                name="phone"
                maxLength={25}
                autoComplete="tel"
                placeholder="+91"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor={`${kind}-website`}>
                Website <span>(optional)</span>
              </label>
              <input
                id={`${kind}-website`}
                className="form-control"
                name="website"
                maxLength={200}
                placeholder="yourbusiness.com"
              />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor={`${kind}-message`}>
                {kind === 'migration'
                  ? 'Tell us about your current hosting'
                  : 'A little about your project'}
              </label>
              <textarea
                id={`${kind}-message`}
                className="form-control"
                name="message"
                required
                minLength={10}
                maxLength={3000}
                rows={4}
                placeholder="Your idea, your goals, and anything you’d like us to know…"
              />
            </div>
            <div className="visually-hidden" aria-hidden="true">
              <label htmlFor={`${kind}-hp`}>Leave this field empty</label>
              <input id={`${kind}-hp`} name="companyWebsite" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="col-12">
              <label className="form-check d-flex gap-2">
                <input
                  className="form-check-input flex-shrink-0"
                  type="checkbox"
                  name="consent"
                  required
                />
                <span className="small">
                  I agree to the <Link href="/privacy">privacy policy</Link> and to being contacted
                  about this request.
                </span>
              </label>
            </div>
            <div className="col-12">
              <button className="btn btn-primary" disabled={busy}>
                {busy ? 'Saving your request…' : button}
                <Icon name="arrow-up-right" />
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
export function QuoteBuilder() {
  const [selected, setSelected] = useState('website-launch'),
    [extras, setExtras] = useState<string[]>([]);
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get('package');
    if (initial && byCategory('website').some((p) => p.id === initial)) setSelected(initial);
  }, []);
  const p = byCategory('website').find((p) => p.id === selected)!;
  const subtotal =
    p.price + quoteExtras.filter((e) => extras.includes(e.id)).reduce((n, e) => n + e.price, 0);
  const tax = Math.round(subtotal * 0.18);
  return (
    <div className="row g-5">
      <div className="col-lg-7 quote-controls">
        <h2 className="step-heading">
          <span>01</span> Choose your starting point
        </h2>
        <div className="quote-options">
          {byCategory('website').map((product) => (
            <button
              key={product.id}
              className={selected === product.id ? 'selected' : ''}
              onClick={() => setSelected(product.id)}
              aria-pressed={selected === product.id}
            >
              <span>{product.name}</span>
              <strong>{money(product.price)}</strong>
              <small>{product.features[0]}</small>
              <Icon name={selected === product.id ? 'check-circle-fill' : 'circle'} />
            </button>
          ))}
        </div>
        <h2 className="step-heading">
          <span>02</span> Make it yours
        </h2>
        <div className="quote-extras">
          {quoteExtras.map((extra) => (
            <label key={extra.id}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={extras.includes(extra.id)}
                onChange={(e) =>
                  setExtras(
                    e.target.checked
                      ? [...extras, extra.id]
                      : extras.filter((id) => id !== extra.id),
                  )
                }
              />
              <span>{extra.name}</span>
              <strong>{money(extra.price)}</strong>
            </label>
          ))}
        </div>
        <h2 className="step-heading">
          <span>03</span> Tell us a little more
        </h2>
        <InquiryForm
          kind="quote"
          packageId={selected}
          extras={extras}
          button="Request this quotation"
        />
      </div>
      <div className="col-lg-5">
        <aside className="quote-preview print-document">
          <div className="quote-doc-header">
            <strong>
              veehoster<span>.</span>
            </strong>
            <span>PROJECT ESTIMATE</span>
          </div>
          <h2>
            A clear scope.
            <br />A confident start.
          </h2>
          <p className="small text-muted">
            Illustrative estimate · INR · Subject to scope confirmation
          </p>
          <div className="quote-line">
            <span>{p.name}</span>
            <strong>{money(p.price)}</strong>
          </div>
          {quoteExtras
            .filter((e) => extras.includes(e.id))
            .map((e) => (
              <div className="quote-line" key={e.id}>
                <span>{e.name}</span>
                <strong>{money(e.price)}</strong>
              </div>
            ))}
          <div className="quote-line">
            <span>Subtotal</span>
            <strong>{money(subtotal)}</strong>
          </div>
          <div className="quote-line">
            <span>Illustrative GST (18%)</span>
            <strong>{money(tax)}</strong>
          </div>
          <div className="quote-total">
            <span>Estimated project total</span>
            <strong>{money(subtotal + tax)}</strong>
          </div>
          <h3>Your package includes</h3>
          <ul className="check-list">
            {p.features.map((f) => (
              <li key={f}>
                <Icon name="check2" />
                {f}
              </li>
            ))}
          </ul>
          <div className="quote-terms">
            <p>
              <strong>Proposed milestones:</strong> 40% to begin, 40% after design approval, 20%
              before launch.
            </p>
            <p>
              Hosting, domains, premium licenses and additional scope are separate. This estimate is
              not a tax invoice or binding contract. Final scope, tax treatment and timeline are
              agreed in writing.
            </p>
          </div>
          <button className="btn btn-outline-primary w-100 no-print" onClick={() => window.print()}>
            <Icon name="printer" /> Print / save as PDF
          </button>
          <p className="quote-contact">
            {company.email} · {company.phone}
          </p>
        </aside>
      </div>
    </div>
  );
}
const cpanelTools = [
  {
    id: 'files',
    icon: 'folder2-open',
    name: 'File manager',
    text: 'Keep the building blocks in order.',
    detail:
      'Browse your website files, upload assets and manage directories from one familiar control panel. Use file permissions carefully and keep independent backups.',
    items: ['Website directory', 'Uploads & assets', 'File permissions'],
  },
  {
    id: 'email',
    icon: 'envelope-at',
    name: 'Business email',
    text: 'Your name. Your own domain.',
    detail:
      'Create domain-based mailboxes and manage forwarding or autoresponders. Mailbox limits depend on your hosting plan; email delivery still requires correct DNS records.',
    items: ['Mailbox management', 'Email forwarding', 'Autoresponders'],
  },
  {
    id: 'databases',
    icon: 'database',
    name: 'Databases',
    text: 'Give your content a good home.',
    detail:
      'Manage the databases behind supported applications. Separate database users and least-privilege permissions help keep your website organized.',
    items: ['MySQL databases', 'Database users', 'phpMyAdmin access'],
  },
  {
    id: 'security',
    icon: 'shield-lock',
    name: 'Security & SSL',
    text: 'A little more peace of mind.',
    detail:
      'Review certificate status and account security settings. HTTPS protects data in transit; updates and secure application code remain essential.',
    items: ['SSL certificates', 'Access controls', 'Security settings'],
  },
  {
    id: 'apps',
    icon: 'grid',
    name: 'App installer',
    text: 'A shorter path from idea to live.',
    detail:
      'Supported hosting configurations can include an installer for WordPress and other applications. Available applications depend on your provider license.',
    items: ['WordPress setup', 'Application updates', 'Installation management'],
  },
  {
    id: 'backup',
    icon: 'arrow-counterclockwise',
    name: 'Backup tools',
    text: 'Because a fallback is a good thing.',
    detail:
      'Create and download copies of important files and databases. Backup schedules, retention and restoration access must be confirmed with your hosting provider.',
    items: ['File backups', 'Database exports', 'Restore planning'],
  },
];
export function CpanelExplorer({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState('files');
  const tool = cpanelTools.find((t) => t.id === active)!;
  return (
    <div className={`cpanel-explorer ${compact ? 'is-compact' : ''}`}>
      <div className="cpanel-top">
        <span className="cpanel-logo">
          cPanel<span>®</span>
        </span>
        <span>
          <span className="status-dot" /> Feature preview
        </span>
        <Icon name="three-dots" />
      </div>
      <div className="cpanel-body">
        <aside>
          <span className="cpanel-user">
            <span>V</span> Your workspace
          </span>
          {cpanelTools.map((t) => (
            <button
              key={t.id}
              className={active === t.id ? 'active' : ''}
              onClick={() => setActive(t.id)}
              aria-pressed={active === t.id}
            >
              <Icon name={t.icon} />
              <span>{t.name}</span>
            </button>
          ))}
        </aside>
        <div className="cpanel-content">
          <span className="eyebrow">YOUR WEBSITE. YOUR CONTROL.</span>
          <h3>{tool.text}</h3>
          <div className="cpanel-tool-grid">
            {tool.items.map((item, i) => (
              <div key={item}>
                <Icon name={[tool.icon, 'sliders2', 'check2-circle'][i]} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p>{tool.detail}</p>
          <span className="demo-note">
            <Icon name="info-circle" /> Interactive preview. No hosting account is connected.
          </span>
        </div>
      </div>
    </div>
  );
}
export function PortfolioFilter() {
  const [active, setActive] = useState('All work');
  return (
    <>
      <div className="pill-tabs mb-5">
        {['All work', 'Business websites', 'E-commerce'].map((c) => (
          <button
            key={c}
            className={active === c ? 'selected' : ''}
            onClick={() => setActive(c)}
            aria-pressed={active === c}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="row g-4 portfolio-grid">
        {projects
          .filter((p) => active === 'All work' || p.category === active)
          .map((p) => (
            <div className="col-lg-6" key={p.slug}>
              <Link href={`/portfolio/${p.slug}`} className="project-card">
                <ProjectVisual theme={p.theme} name={p.name} headline={p.headline} />
                <div className="project-caption">
                  <div>
                    <span>{p.type} · Concept project</span>
                    <h3>{p.name}</h3>
                  </div>
                  <span className="circle-arrow">
                    <Icon name="arrow-up-right" />
                  </span>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </>
  );
}
