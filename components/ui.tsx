import Link from 'next/link';
import { company, generalFaqs, projects } from '@/lib/catalog';
export const Icon = ({ name, className = '' }: { name: string; className?: string }) => (
  <i className={`bi bi-${name} ${className}`} aria-hidden="true" />
);
export function SectionTitle({
  eyebrow,
  title,
  text,
  align = 'left',
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={`section-heading ${align === 'center' ? 'text-center mx-auto' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
export function PageHero({
  eyebrow,
  title,
  text,
  children,
  visual,
  theme = '',
}: {
  eyebrow: string;
  title: React.ReactNode;
  text: string;
  children?: React.ReactNode;
  visual?: React.ReactNode;
  theme?: string;
}) {
  return (
    <section className={`page-hero ${theme}`}>
      <div className="container-xl">
        <div className="row align-items-center g-5">
          <div className={visual ? 'col-lg-6' : 'col-lg-9'}>
            <div className="breadcrumb-line">
              <Link href="/">Home</Link>
              <Icon name="chevron-right" />
              <span>{eyebrow}</span>
            </div>
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p className="hero-description">{text}</p>
            {children && <div className="hero-actions">{children}</div>}
          </div>
          {visual && <div className="col-lg-6">{visual}</div>}
        </div>
      </div>
    </section>
  );
}
export function CTA({
  title = 'Your next chapter starts here.',
  text = 'Bring the idea. We’ll help with the website, the hosting and everything in between.',
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="section-cta">
      <div className="container-xl">
        <div className="cta-panel">
          <div>
            <span className="eyebrow light">LET’S MAKE SOMETHING GOOD</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="cta-actions">
            <Link href="/quote" className="btn btn-light">
              Tell us about your idea <Icon name="arrow-up-right" />
            </Link>
            <a href={`tel:${company.tel}`}>
              <Icon name="telephone" /> {company.phone}
            </a>
          </div>
          <span className="cta-orbit" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
export function FAQ({
  items = generalFaqs,
  title = 'A little clarity goes a long way.',
}: {
  items?: { q: string; a: string }[];
  title?: string;
}) {
  return (
    <section className="section-space">
      <div className="container-xl">
        <div className="row g-5">
          <div className="col-lg-4">
            <SectionTitle eyebrow="GOOD QUESTIONS" title={title} />
            <p>Still have something on your mind? We’re happy to help.</p>
            <Link href="/contact" className="text-link">
              Talk to our team <Icon name="arrow-up-right" />
            </Link>
          </div>
          <div className="col-lg-8">
            <div className="faq-list">
              {items.map((item, i) => (
                <details key={item.q}>
                  <summary>
                    <span className="faq-number">0{i + 1}</span>
                    {item.q}
                    <Icon name="plus-lg" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export function ServerArt() {
  return (
    <div
      className="server-art"
      role="img"
      aria-label="Illustration of Veehoster cloud hosting infrastructure"
    >
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <span className="art-spark spark-one">✦</span>
      <span className="art-spark spark-two">✧</span>
      <div className="server-platform">
        <div className="server-top">
          <span className="server-v">v.</span>
          <span className="server-top-label">YOUR IDEA. CONNECTED.</span>
        </div>
        {[0, 1, 2].map((n) => (
          <div className={`server-unit unit-${n}`} key={n}>
            <div className="server-slots">
              <span />
              <span />
              <span />
            </div>
            <span className="server-led" />
            <span className="server-led second" />
          </div>
        ))}
        <div className="server-base" />
      </div>
      <div className="floating-tag tag-security">
        <span className="icon-surface green">
          <Icon name="shield-check" />
        </span>
        <div>
          <strong>A safer little corner.</strong>
          <span>SSL comes as standard</span>
        </div>
      </div>
      <div className="floating-tag tag-speed">
        <span className="icon-surface purple">
          <Icon name="lightning-charge" />
        </span>
        <div>
          <strong>Room to do more.</strong>
          <span>Powered by NVMe storage</span>
        </div>
      </div>
      <div className="art-note">
        built for
        <br />
        <b>what’s next.</b>
        <svg viewBox="0 0 65 40" aria-hidden="true">
          <path
            d="M5 4 Q58 0 43 33 M35 25 L43 34 L54 27"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}
export function PortfolioPreview({ limit = 3 }: { limit?: number }) {
  return (
    <div className="row g-4 portfolio-grid">
      {projects.slice(0, limit).map((p) => (
        <div className="col-md-6 col-lg-4" key={p.slug}>
          <Link href={`/portfolio/${p.slug}`} className="project-card">
            <ProjectVisual theme={p.theme} name={p.name} headline={p.headline} />
            <div className="project-caption">
              <div>
                <span>{p.type}</span>
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
  );
}
export function ProjectVisual({
  theme,
  name,
  headline,
}: {
  theme: string;
  name: string;
  headline: string;
}) {
  return (
    <div className={`project-visual ${theme}`}>
      <div className="mini-site-nav">
        <b>{name}</b>
        <span>
          Discover &nbsp; Our story <Icon name="list" />
        </span>
      </div>
      <div className="mini-site-body">
        <span className="mini-eyebrow">A WEBSITE CONCEPT BY VEEHOSTER</span>
        <h4>{headline}</h4>
        <span className="mini-site-button">
          Explore the collection <Icon name="arrow-right" />
        </span>
      </div>
      {theme === 'architecture' ? (
        <div className="architecture-photo" />
      ) : theme === 'botanica' ? (
        <div className="plant-illustration" aria-hidden="true">
          <div className="leaf l1" />
          <div className="leaf l2" />
          <div className="leaf l3" />
          <div className="leaf l4" />
          <div className="stem" />
          <div className="pot" />
        </div>
      ) : (
        <div className="finance-illustration" aria-hidden="true">
          <div className="finance-ring" />
          <div className="mini-bank-card">
            <span>orbit</span>
            <strong>•••• &nbsp; 0482</strong>
            <small>A LITTLE MORE POSSIBILITY</small>
          </div>
        </div>
      )}
    </div>
  );
}
export function MigrationStrip() {
  return (
    <section className="migration-section">
      <div className="container-xl">
        <div className="row g-5 align-items-center">
          <div className="col-lg-5">
            <span className="eyebrow light">MOVE FORWARD. WE’LL HANDLE THE MOVE.</span>
            <h2>
              New home.
              <br />
              Same website.
              <br />
              <span>Less to worry about.</span>
            </h2>
            <p>
              Moving hosts should feel like a fresh start. We’ll assess your site, plan the transfer
              and help you check every important detail.
            </p>
            <Link className="btn btn-light" href="/migration">
              Plan my migration <Icon name="arrow-up-right" />
            </Link>
          </div>
          <div className="col-lg-7">
            <div className="migration-steps">
              {[
                [
                  '01',
                  'A good look around',
                  'We review your files, database, email and current setup.',
                ],
                [
                  '02',
                  'A carefully planned move',
                  'We back up, transfer and test before switching DNS.',
                ],
                [
                  '03',
                  'A confident new beginning',
                  'We help verify the website and agree a rollback plan.',
                ],
              ].map(([n, t, d]) => (
                <div key={n}>
                  <span>{n}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                  <Icon name="arrow-down" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export function FeatureGrid({ items }: { items: { icon: string; title: string; text: string }[] }) {
  return (
    <div className="row g-4 feature-grid">
      {items.map((item) => (
        <div className="col-md-6 col-lg-4" key={item.title}>
          <div className="feature-item">
            <span className="icon-surface">
              <Icon name={item.icon} />
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export function ErrorMessage({ error }: { error: string }) {
  return error ? (
    <div className="alert alert-danger" role="alert">
      {error}
    </div>
  ) : null;
}
export function EmptyState({
  icon = 'inbox',
  title,
  text,
  href,
  label,
}: {
  icon?: string;
  title: string;
  text: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="empty-state">
      <span className="icon-surface">
        <Icon name={icon} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {href && (
        <Link href={href} className="btn btn-primary">
          {label || 'Explore plans'} <Icon name="arrow-right" />
        </Link>
      )}
    </div>
  );
}
