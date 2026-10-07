import Link from 'next/link';
import { articles, byCategory, company, hostingFaqs, money, projects } from '@/lib/catalog';
import {
  CTA,
  FAQ,
  FeatureGrid,
  Icon,
  MigrationStrip,
  PageHero,
  PortfolioPreview,
  ProjectVisual,
  SectionTitle,
  ServerArt,
} from './ui';
import {
  CpanelExplorer,
  DomainSearch,
  InquiryForm,
  PortfolioFilter,
  Pricing,
  QuoteBuilder,
} from './marketing-interactive';

export function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="container-xl">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 hero-copy">
              <span className="hero-eyebrow">
                <span className="status-dot" /> A LITTLE TECHNOLOGY. A LOT OF POSSIBILITY.
              </span>
              <h1>
                A better home
                <br />
                for your
                <br />
                <span>digital world.</span>
                <span className="heading-star" aria-hidden="true">
                  ✦
                </span>
              </h1>
              <p>
                From your first domain to your next big launch. Beautiful websites, dependable
                hosting and a team that’s in your corner.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" href="/hosting">
                  Find your hosting <Icon name="arrow-up-right" />
                </Link>
                <Link className="btn btn-outline-dark" href="/web-design">
                  Build my website <Icon name="arrow-right" />
                </Link>
              </div>
              <div className="hero-footnote">
                <span className="tiny-avatars">
                  <b>V</b>
                  <b>✦</b>
                  <b>
                    <Icon name="arrow-up-right" />
                  </b>
                </span>
                <span>
                  Your idea. Our expertise.
                  <br />
                  <strong>One thoughtful partnership.</strong>
                </span>
              </div>
            </div>
            <div className="col-lg-6">
              <ServerArt />
            </div>
          </div>
          <div className="hero-trust-strip">
            {[
              ['hdd-stack', 'NVMe-powered hosting'],
              ['shield-check', 'SSL included'],
              ['headset', 'A human on your side'],
              ['code-slash', 'Built around your business'],
            ].map(([icon, text]) => (
              <span key={text}>
                <Icon name={icon} />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="domain-band">
        <div className="container-xl">
          <div className="row align-items-center g-4">
            <div className="col-lg-4">
              <span className="eyebrow">GREAT THINGS START WITH A NAME</span>
              <h2>
                Make it yours<span>.</span>
              </h2>
              <p>Find a name with your future written on it.</p>
            </div>
            <div className="col-lg-8">
              <DomainSearch compact />
            </div>
          </div>
        </div>
      </section>
      <ServicesSection />
      <WhySection />
      <section className="section-space soft-section" id="plans">
        <div className="container-xl">
          <div className="d-md-flex justify-content-between align-items-end mb-5">
            <SectionTitle
              eyebrow="A PLAN FOR YOUR NEXT CHAPTER"
              title={
                <>
                  Big on possibilities.
                  <br />
                  Clear on pricing.
                </>
              }
              text="Start small, grow confidently. Choose the space your idea needs."
            />
            <Link href="/pricing" className="text-link">
              Explore all packages <Icon name="arrow-up-right" />
            </Link>
          </div>
          <Pricing />
        </div>
      </section>
      <MigrationStrip />
      <CpanelSection />
      <section className="section-space">
        <div className="container-xl">
          <div className="d-md-flex align-items-end justify-content-between mb-5">
            <SectionTitle
              eyebrow="A LITTLE OF WHAT’S POSSIBLE"
              title={
                <>
                  Different businesses.
                  <br />
                  Distinctive digital homes.
                </>
              }
              text="A few concept projects that show how we think, design and build."
            />
            <Link className="text-link" href="/portfolio">
              Explore our work <Icon name="arrow-up-right" />
            </Link>
          </div>
          <PortfolioPreview />
        </div>
      </section>
      <section className="promise-strip">
        <div className="container-xl">
          <span className="promise-symbol">“</span>
          <h2>
            Technology should make your next step easier.
            <br />
            <span>That’s the standard we build around.</span>
          </h2>
          <p>THE VEEHOSTER APPROACH</p>
        </div>
      </section>
      <FAQ />
      <CTA />
      <ContactStrip />
    </>
  );
}
function ServicesSection() {
  const services = [
    {
      n: '01',
      icon: 'hdd-network',
      title: 'A home for your website.',
      name: 'Web hosting',
      text: 'Straightforward plans, NVMe storage and the tools to stay in control.',
      href: '/hosting',
      className: 'service-hosting',
    },
    {
      n: '02',
      icon: 'window-stack',
      title: 'Good design. Real purpose.',
      name: 'Website development',
      text: 'Thoughtful websites that feel like your brand and work for your customers.',
      href: '/web-design',
      className: 'service-web',
    },
    {
      n: '03',
      icon: 'globe2',
      title: 'Your name. Your beginning.',
      name: 'Domain names',
      text: 'Find a memorable identity and connect it to your next big idea.',
      href: '/domains',
      className: 'service-domains',
    },
    {
      n: '04',
      icon: 'graph-up-arrow',
      title: 'Be there when they search.',
      name: 'SEO & growth',
      text: 'Better foundations, useful content and a clear view of your progress.',
      href: '/seo',
      className: 'service-seo',
    },
  ];
  return (
    <section className="section-space">
      <div className="container-xl">
        <div className="row g-5">
          <div className="col-lg-4">
            <SectionTitle
              eyebrow="ALL THE RIGHT CONNECTIONS"
              title={
                <>
                  Everything you need.
                  <br />
                  <span className="text-primary">One good partner.</span>
                </>
              }
              text="Less running between providers. More time building the business you believe in."
            />
            <Link href="/contact" className="text-link">
              Let’s find your starting point <Icon name="arrow-up-right" />
            </Link>
            <div className="service-note">
              <span>✳</span>
              <p>
                From a blank page
                <br />
                to your next milestone.
              </p>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="services-mosaic">
              {services.map((s) => (
                <Link href={s.href} key={s.n} className={`service-tile ${s.className}`}>
                  <div className="service-tile-top">
                    <span className="icon-surface">
                      <Icon name={s.icon} />
                    </span>
                    <span>{s.n}</span>
                  </div>
                  <span className="service-category">{s.name}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <span className="circle-arrow">
                    <Icon name="arrow-up-right" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function WhySection() {
  return (
    <section className="section-space why-section">
      <div className="container-xl">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <div className="why-art">
              <span className="eyebrow">MORE THAN A PROVIDER</span>
              <h3>
                A partner
                <br />
                in your
                <br />
                <span>corner.</span>
              </h3>
              <div className="why-orb">
                <Icon name="heart" />
              </div>
              <div className="why-mini-card">
                <Icon name="chat-square-heart" />
                <span>
                  Real questions.
                  <br />
                  <b>Real conversations.</b>
                </span>
              </div>
              <span className="why-art-star">✳</span>
            </div>
          </div>
          <div className="col-lg-6">
            <SectionTitle
              eyebrow="WHY VEEHOSTER"
              title={
                <>
                  Built around you.
                  <br />
                  Not the other way around.
                </>
              }
            />
            <div className="why-list">
              {[
                [
                  '01',
                  'Clarity from the first conversation',
                  'Understand your package, your scope and your next step. No confusing technical detours.',
                ],
                [
                  '02',
                  'Design and technology, together',
                  'Your website, domain and hosting work better when they’re planned as one experience.',
                ],
                [
                  '03',
                  'Room for what comes next',
                  'Start with the right foundation and a sensible path to expand as your needs change.',
                ],
              ].map(([n, t, d]) => (
                <div key={n}>
                  <span>{n}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function CpanelSection() {
  return (
    <section className="section-space cpanel-section">
      <div className="container-xl">
        <div className="row align-items-center g-5">
          <div className="col-lg-4">
            <SectionTitle
              eyebrow="LESS COMPLEXITY. MORE CONTROL."
              title={
                <>
                  Your hosting.
                  <br />
                  At your fingertips.
                </>
              }
              text="Files, mailboxes, databases and the little details—all in one familiar control panel."
            />
            <ul className="check-list">
              <li>
                <Icon name="check2" /> Manage your website essentials
              </li>
              <li>
                <Icon name="check2" /> Make room for professional email
              </li>
              <li>
                <Icon name="check2" /> Keep an eye on account resources
              </li>
            </ul>
            <Link href="/features/cpanel" className="text-link">
              Explore cPanel features <Icon name="arrow-up-right" />
            </Link>
          </div>
          <div className="col-lg-8">
            <CpanelExplorer compact />
          </div>
        </div>
      </div>
    </section>
  );
}
function ContactStrip() {
  return (
    <section className="contact-strip">
      <div className="container-xl">
        <span>Prefer a conversation?</span>
        <a href={`tel:${company.tel}`}>
          <Icon name="telephone" />
          {company.phone}
        </a>
        <a href={`mailto:${company.email}`}>
          <Icon name="envelope" />
          {company.email}
        </a>
        <a href={company.whatsapp} target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" />
          Say hello on WhatsApp <Icon name="arrow-up-right" />
        </a>
      </div>
    </section>
  );
}

export function HostingPage({
  variant = 'standard',
}: {
  variant?: 'standard' | 'wordpress' | 'cloud';
}) {
  const wp = variant === 'wordpress',
    cloud = variant === 'cloud';
  return (
    <>
      <PageHero
        eyebrow={
          wp ? 'WORDPRESS HOSTING' : cloud ? 'CLOUD HOSTING' : 'A BETTER HOME FOR YOUR WEBSITE'
        }
        title={
          wp ? (
            <>
              Big ideas.
              <br />
              <em>Powered by WordPress.</em>
            </>
          ) : cloud ? (
            <>
              More possibilities.
              <br />
              <em>Room to scale.</em>
            </>
          ) : (
            <>
              Small load times.
              <br />
              <em>Big possibilities.</em>
            </>
          )
        }
        text={
          wp
            ? 'A practical foundation for your WordPress website, with the storage, SSL and management tools you need.'
            : 'Give your website a considered foundation. Choose a clear plan, manage the essentials and get help planning your next step.'
        }
        visual={<ServerArt />}
      >
        <a href="#hosting-plans" className="btn btn-primary">
          Find your plan <Icon name="arrow-down" />
        </a>
        <Link href="/contact" className="text-link">
          Talk it through <Icon name="arrow-up-right" />
        </Link>
      </PageHero>
      <section className="feature-ribbon">
        <div className="container-xl">
          {[
            ['hdd', 'NVMe storage'],
            ['shield-check', 'SSL included'],
            ['envelope', 'Business email'],
            ['sliders2', 'cPanel control'],
          ].map(([i, t]) => (
            <div key={t}>
              <Icon name={i} />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>
      {cloud && (
        <div className="container-xl mt-5">
          <div className="info-banner">
            <Icon name="info-circle" /> Dedicated cloud resource allocations require a tailored
            provider quotation. The plans below are the demo shared-hosting catalog; request an
            assessment for managed cloud workloads.
          </div>
        </div>
      )}
      <section className="section-space" id="hosting-plans">
        <div className="container-xl">
          <SectionTitle
            eyebrow="YOUR NEXT CHAPTER, YOUR PLAN"
            title="A good fit beats a long feature list."
            text="Choose what you need today, with space to grow tomorrow."
            align="center"
          />
          <Pricing />
        </div>
      </section>
      <section className="section-space soft-section">
        <div className="container-xl">
          <SectionTitle
            eyebrow="THE DETAILS, SIDE BY SIDE"
            title="A little comparison. A clearer choice."
          />
          <div
            className="table-responsive comparison-table"
            tabIndex={0}
            role="region"
            aria-label="Hosting plan comparison"
          >
            <table className="table align-middle">
              <caption className="visually-hidden">Hosting plan resource comparison</caption>
              <thead>
                <tr>
                  <th scope="col">What’s included</th>
                  {byCategory('hosting').map((p) => (
                    <th key={p.id} scope="col">
                      {p.name}
                      <small>{money(p.price)}/mo</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Websites', '1', '10', '25'],
                  ['NVMe storage', '10 GB', '50 GB', '100 GB'],
                  ['Business mailboxes', '5', '25', '100'],
                  ['Backups', 'Weekly', 'Daily', 'Daily'],
                  ['Free SSL', 'Included', 'Included', 'Included'],
                  ['Control panel', 'cPanel', 'cPanel', 'cPanel'],
                  ['Migration', 'Assessment', 'Assistance', 'Assistance'],
                  ['Support queue', 'Standard', 'Standard', 'Priority'],
                ].map((row) => (
                  <tr key={row[0]}>
                    <th scope="row">{row[0]}</th>
                    {row.slice(1).map((cell, i) => (
                      <td key={i}>
                        {cell === 'Included' ? (
                          <>
                            <Icon name="check2" />
                            <span className="visually-hidden">Included</span>
                          </>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small text-muted">
            Proposed plan specifications. Fair-use limits, retention and provider capacity must be
            confirmed before live service activation.
          </p>
        </div>
      </section>
      <section className="section-space">
        <div className="container-xl">
          <FeatureGrid
            items={[
              {
                icon: 'lightning-charge',
                title: 'A responsive foundation',
                text: 'NVMe storage helps your server read and write data efficiently. Real speed also depends on your application, content and traffic.',
              },
              {
                icon: 'shield-check',
                title: 'Security starts with the basics',
                text: 'SSL is part of the plan. Pair it with application updates, strong credentials and sensible access controls.',
              },
              {
                icon: 'arrow-repeat',
                title: 'A sensible backup routine',
                text: 'Plan for recovery before you need it. Confirm backup retention and keep independent copies of important data.',
              },
            ]}
          />
        </div>
      </section>
      <CpanelSection />
      <MigrationStrip />
      <FAQ items={hostingFaqs} />
      <CTA title="Give your website a good home." />
    </>
  );
}
export function DomainsPage() {
  return (
    <>
      <section className="domain-page-hero">
        <div className="container-xl">
          <span className="eyebrow">A NAME WITH YOUR FUTURE IN IT</span>
          <h1>
            A great idea deserves
            <br />
            <span>a great domain.</span>
          </h1>
          <p>Find something memorable. Make it unmistakably yours.</p>
          <div className="domain-hero-art" aria-hidden="true">
            <span>.com</span>
            <span>✦</span>
            <span>.in</span>
          </div>
          <DomainSearch />
        </div>
      </section>
      <section className="section-space">
        <div className="container-xl">
          <SectionTitle eyebrow="A SMALL CHOICE WITH A BIG JOB" title="Find your kind of ending." />
          <div className="row g-4">
            {byCategory('domain').map((p) => (
              <div className="col-md-6 col-lg-3" key={p.id}>
                <div className="extension-card">
                  <strong>{p.name}</strong>
                  <p>{p.description}</p>
                  <span>
                    From <b>{money(p.price)}</b>/year
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space soft-section">
        <div className="container-xl">
          <div className="row g-5">
            <div className="col-lg-5">
              <SectionTitle
                eyebrow="MAKE YOUR NAME WORK HARDER"
                title={
                  <>
                    Short. Clear.
                    <br />
                    Easy to remember.
                  </>
                }
              />
            </div>
            <div className="col-lg-7">
              <div className="editorial-rows">
                {[
                  [
                    '01',
                    'Say it out loud',
                    'If someone can spell it after hearing it once, you’re off to a good start.',
                  ],
                  [
                    '02',
                    'Give it room to grow',
                    'Choose a name that fits your business today without limiting tomorrow’s ideas.',
                  ],
                  [
                    '03',
                    'Check the wider picture',
                    'Review trademarks and social handles before you commit to a name.',
                  ],
                ].map(([n, t, d]) => (
                  <div key={n}>
                    <span>{n}</span>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <FAQ
        items={[
          {
            q: 'Is this checking a live domain registry?',
            a: 'No. This release demonstrates the search and cart experience with simulated availability. A registrar API must verify availability and current prices before a real domain is sold.',
          },
          {
            q: 'Can I use a domain I already own?',
            a: 'Yes. You can connect an existing domain to a suitable hosting account by updating DNS records. Keep your old records and coordinate email settings carefully.',
          },
          {
            q: 'How often do domains renew?',
            a: 'Domains are generally registered for annual terms. Registration and renewal prices can differ; confirm both before purchase. This demo does not set up automatic renewals.',
          },
        ]}
      />
      <CTA title="A name today. A business tomorrow." />
    </>
  );
}
export function WebDesignPage() {
  return (
    <>
      <PageHero
        eyebrow="WEBSITES WITH A POINT OF VIEW"
        title={
          <>
            Good design means
            <br />
            <em>good business.</em>
          </>
        }
        text="Your website should feel like you, work beautifully, and make the next step obvious. We bring the strategy, design and development together."
        visual={
          <div className="web-hero-composition">
            <ProjectVisual
              theme="architecture"
              name="Form & Field"
              headline="Spaces with a point of view."
            />
            <div className="web-hero-sticker">
              Designed
              <br />
              with intent. <Icon name="asterisk" />
            </div>
          </div>
        }
      >
        <Link href="/quote" className="btn btn-primary">
          Let’s build your website <Icon name="arrow-up-right" />
        </Link>
        <a href="#work" className="text-link">
          See the possibilities <Icon name="arrow-down" />
        </a>
      </PageHero>
      <section className="section-space" id="work">
        <div className="container-xl">
          <SectionTitle
            eyebrow="A FEW DIFFERENT POINTS OF VIEW"
            title="Your business isn’t a template."
            text="Neither should your website be. Explore these fictional concept projects."
          />
          <PortfolioPreview />
        </div>
      </section>
      <section className="section-space process-section">
        <div className="container-xl">
          <SectionTitle
            eyebrow="THOUGHTFUL AT EVERY STEP"
            title={
              <>
                A clear process.
                <br />
                Room for good ideas.
              </>
            }
          />
          <div className="row g-4">
            {[
              ['01', 'Discover', 'Your goals, your audience and the problems worth solving.'],
              [
                '02',
                'Design',
                'A direction that feels right, with feedback built into the process.',
              ],
              [
                '03',
                'Develop',
                'Responsive, accessible pages and the integrations your scope needs.',
              ],
              ['04', 'Launch', 'Checks, handover and a supported start to your next chapter.'],
            ].map(([n, t, d]) => (
              <div className="col-md-6 col-lg-3" key={n}>
                <div className="process-step">
                  <span>{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space">
        <div className="container-xl">
          <FeatureGrid
            items={[
              {
                icon: 'phone',
                title: 'Comfortable on every screen',
                text: 'Responsive layouts, readable type and practical tap targets help people use your site on the devices they already have.',
              },
              {
                icon: 'compass',
                title: 'A clear way forward',
                text: 'Useful content, sensible navigation and specific calls to action make the experience easier to understand.',
              },
              {
                icon: 'search',
                title: 'Search foundations, built in',
                text: 'Descriptive page titles, structured headings, internal links and technical SEO are part of the development process.',
              },
            ]}
          />
        </div>
      </section>
      <section className="section-space soft-section" id="packages">
        <div className="container-xl">
          <SectionTitle
            eyebrow="START WITH A CLEAR SCOPE"
            title="Good websites. Thoughtful packages."
            text="Choose a starting point and build an itemized quotation around your goals."
            align="center"
          />
          <Pricing category="website" />
        </div>
      </section>
      <FAQ />
      <CTA title="Let’s build a website that feels like you." />
    </>
  );
}
export function SEOPage() {
  return (
    <>
      <PageHero
        eyebrow="GET FOUND FOR THE RIGHT REASONS"
        title={
          <>
            Useful content.
            <br />
            Better foundations.
            <br />
            <em>Meaningful growth.</em>
          </>
        }
        text="SEO starts with understanding your customers. We connect technical improvements, search intent and a content plan you can actually use."
        visual={
          <div className="seo-art">
            <div className="seo-search">
              <Icon name="search" />
              <span>the answer your customer needs</span>
              <Icon name="stars" />
            </div>
            <div className="seo-result">
              <span>yourbusiness.com</span>
              <h3>Be the useful answer.</h3>
              <p>
                A clear page. A relevant question.
                <br />A better reason to choose you.
              </p>
            </div>
            <div className="seo-chart">
              <span>A MORE USEFUL DIRECTION</span>
              <svg viewBox="0 0 360 120" aria-hidden="true">
                <path
                  d="M0 110C40 110 30 65 70 78S130 99 160 50S200 70 245 30S285 60 355 5"
                  fill="none"
                  stroke="#635bff"
                  strokeWidth="4"
                />
              </svg>
              <span className="seo-chip">
                <Icon name="graph-up-arrow" /> Progress over promises
              </span>
            </div>
            <p className="small text-muted">Illustration, not a performance claim.</p>
          </div>
        }
      >
        <Link href="/contact?service=seo" className="btn btn-primary">
          Let’s review your website <Icon name="arrow-up-right" />
        </Link>
      </PageHero>
      <section className="section-space">
        <div className="container-xl">
          <SectionTitle
            eyebrow="THE WORK BEHIND THE VISIBILITY"
            title="A connected approach to organic growth."
          />
          <FeatureGrid
            items={[
              {
                icon: 'gear',
                title: 'Technical foundations',
                text: 'Crawlability, site structure, redirects, page metadata and performance issues that get in the way.',
              },
              {
                icon: 'file-earmark-text',
                title: 'Content with a purpose',
                text: 'Useful pages built around your customers’ questions, supported by thoughtful briefs and internal links.',
              },
              {
                icon: 'geo-alt',
                title: 'Local relevance',
                text: 'Consistent business details, a useful Google Business Profile and locally relevant service pages.',
              },
              {
                icon: 'search',
                title: 'Search intent mapping',
                text: 'Group the questions your audience asks and connect them to pages with a clear purpose.',
              },
              {
                icon: 'link-45deg',
                title: 'A stronger site structure',
                text: 'Help visitors and search engines move between related topics with descriptive internal links.',
              },
              {
                icon: 'bar-chart-line',
                title: 'Reporting that explains',
                text: 'Understand completed work, emerging opportunities and changes in meaningful business metrics.',
              },
            ]}
          />
        </div>
      </section>
      <section className="seo-principle">
        <div className="container-xl">
          <span className="eyebrow">A PROMISE WE CAN STAND BEHIND</span>
          <h2>
            No magic rankings.
            <br />
            <span>Just a clear plan and consistent work.</span>
          </h2>
          <p>
            Search positions can never be guaranteed. We’ll tell you what we’re doing, why it
            matters and what the data says next.
          </p>
        </div>
      </section>
      <section className="section-space">
        <div className="container-xl">
          <SectionTitle
            eyebrow="CONSISTENCY HAS A STARTING POINT"
            title="Choose your monthly SEO plan."
            align="center"
          />
          <Pricing category="seo" />
        </div>
      </section>
      <section className="section-space soft-section">
        <div className="container-xl">
          <div className="row g-5">
            <div className="col-lg-5">
              <SectionTitle
                eyebrow="LET’S FIND THE OPPORTUNITY"
                title="What’s holding your website back?"
                text="Share your website and goals. We’ll use that context to discuss a sensible starting scope."
              />
            </div>
            <div className="col-lg-7">
              <InquiryForm kind="seo" button="Request an SEO conversation" />
            </div>
          </div>
        </div>
      </section>
      <FAQ />
      <CTA title="Make your next search visitor count." />
    </>
  );
}
export function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="A LITTLE CLARITY GOES A LONG WAY"
        title={
          <>
            Good plans.
            <br />
            <em>No guessing games.</em>
          </>
        }
        text="Hosting, websites and SEO packages with clear inclusions. Choose your starting point, then make it yours."
      />
      <section className="section-space pt-0">
        <div className="container-xl">
          <Pricing tabs />
        </div>
      </section>
      <section className="quote-banner">
        <div className="container-xl">
          <div>
            <span className="eyebrow">SOMETHING A LITTLE DIFFERENT?</span>
            <h2>Your business. Your scope.</h2>
            <p>Build an itemized website estimate with optional extras and clear milestones.</p>
          </div>
          <Link href="/quote" className="btn btn-primary">
            Create my quotation <Icon name="arrow-up-right" />
          </Link>
        </div>
      </section>
      <FAQ />
      <CTA />
    </>
  );
}
export function MigrationPage() {
  return (
    <>
      <PageHero
        eyebrow="A FRESH START, CAREFULLY PLANNED"
        title={
          <>
            Bring your website.
            <br />
            <em>We’ll bring the plan.</em>
          </>
        }
        text="Changing hosting shouldn’t mean starting over. We assess the details, agree the scope and help you move with a sensible fallback."
        visual={
          <div className="migration-art">
            <div>
              <Icon name="hdd" />
              <span>Your current home</span>
            </div>
            <span className="migration-dots">
              ·····
              <Icon name="arrow-right" />
              ·····
            </span>
            <div>
              <span className="brand-mark">v</span>
              <span>Your next chapter</span>
            </div>
            <span className="migration-art-label">
              <Icon name="shield-check" /> Backup. Transfer. Verify.
            </span>
          </div>
        }
      >
        <a href="#migration-form" className="btn btn-primary">
          Plan my move <Icon name="arrow-down" />
        </a>
      </PageHero>
      <MigrationStrip />
      <section className="section-space">
        <div className="container-xl">
          <SectionTitle
            eyebrow="THE LITTLE DETAILS MATTER"
            title="A move with a proper checklist."
          />
          <FeatureGrid
            items={[
              {
                icon: 'clipboard-check',
                title: 'Before we begin',
                text: 'Confirm website software, storage, database versions, DNS, email and access. Agree the migration scope and cost.',
              },
              {
                icon: 'cloud-arrow-up',
                title: 'During the transfer',
                text: 'Take backups, transfer files and databases, and check the website in its new environment before switching DNS.',
              },
              {
                icon: 'check2-circle',
                title: 'After the switch',
                text: 'Verify key pages, forms and email routing. Keep the old environment available during the agreed rollback window.',
              },
            ]}
          />
        </div>
      </section>
      <section className="section-space soft-section" id="migration-form">
        <div className="container-xl">
          <div className="row g-5">
            <div className="col-lg-5">
              <SectionTitle
                eyebrow="LET’S CHECK THE FIT"
                title="Tell us where you are today."
                text="Share your current website and hosting details. Never include passwords or access keys in this form."
              />
              <a
                href={company.whatsapp}
                className="text-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Prefer WhatsApp? <Icon name="arrow-up-right" />
              </a>
            </div>
            <div className="col-lg-7">
              <InquiryForm kind="migration" button="Request my migration assessment" />
            </div>
          </div>
        </div>
      </section>
      <FAQ items={hostingFaqs} />
    </>
  );
}
export function CpanelPage() {
  return (
    <>
      <PageHero
        eyebrow="FAMILIAR TOOLS. A CLEARER WORKDAY."
        title={
          <>
            A little less admin.
            <br />
            <em>A lot more control.</em>
          </>
        }
        text="Explore the tools that can come with a cPanel hosting account. Files, email, databases and security, brought into one workspace."
      />
      <section className="section-space pt-0">
        <div className="container-xl">
          <CpanelExplorer />
        </div>
      </section>
      <section className="section-space soft-section">
        <div className="container-xl">
          <FeatureGrid
            items={[
              {
                icon: 'folder2-open',
                title: 'Your files, organized',
                text: 'Manage your website directories and uploads with a browser-based file manager.',
              },
              {
                icon: 'envelope-at',
                title: 'A professional inbox',
                text: 'Create mailboxes, forwarding rules and autoresponders using your own domain.',
              },
              {
                icon: 'database',
                title: 'A home for application data',
                text: 'Manage supported databases and their users without losing sight of access permissions.',
              },
              {
                icon: 'shield-lock',
                title: 'The essentials of security',
                text: 'Review SSL and account settings alongside your ongoing application security work.',
              },
              {
                icon: 'grid',
                title: 'A quicker first step',
                text: 'Supported app installers simplify setup for commonly used website software.',
              },
              {
                icon: 'arrow-counterclockwise',
                title: 'A plan for recovery',
                text: 'Use available backup tools and retain independent copies of your critical data.',
              },
            ]}
          />
          <p className="small text-muted mt-4">
            cPanel is a trademark of cPanel, L.L.C. This is an independent feature overview. License
            availability and actual account tools depend on your hosting provider.
          </p>
        </div>
      </section>
      <CTA title="Choose the space. Keep the control." />
    </>
  );
}
export function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="DESIGN WITH A POINT OF VIEW"
        title={
          <>
            Good work starts
            <br />
            <em>with a good question.</em>
          </>
        }
        text="How should your brand feel online? These fictional concept projects explore different answers through layout, typography and clear user journeys."
      />
      <section className="section-space pt-0">
        <div className="container-xl">
          <PortfolioFilter />
        </div>
      </section>
      <CTA title="Your project could be our next good story." />
    </>
  );
}
export function ProjectPage({ slug }: { slug: string }) {
  const p = projects.find((p) => p.slug === slug)!;
  return (
    <>
      <PageHero
        eyebrow={`${p.type.toUpperCase()} · CONCEPT PROJECT`}
        title={
          <>
            {p.name}
            <br />
            <em>{p.headline}</em>
          </>
        }
        text={p.intro}
      >
        <Link href="/quote" className="btn btn-primary">
          Create something like this <Icon name="arrow-up-right" />
        </Link>
      </PageHero>
      <section className="section-space pt-0">
        <div className="container-xl">
          <div className="project-detail-visual">
            <ProjectVisual theme={p.theme} name={p.name} headline={p.headline} />
          </div>
          <div className="row g-5 mt-4">
            <div className="col-lg-4">
              <span className="eyebrow">THE SCOPE</span>
              <ul className="plain-list">
                {p.scope.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="col-lg-8">
              <h2>The idea behind the experience.</h2>
              <p className="lead">{p.detail}</p>
              <p>
                This portfolio example is a fictional design exploration. It is not a claim of a
                completed client engagement or measured business results.
              </p>
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="A THOUGHTFUL PARTNER FOR WHAT’S NEXT"
        title={
          <>
            Good technology.
            <br />
            Human conversations.
            <br />
            <em>A shared next step.</em>
          </>
        }
        text="Veehoster brings websites, hosting, domains and SEO into one conversation—so the important parts of your digital presence work together."
        visual={
          <div className="about-art">
            <span>v.</span>
            <p>
              Here for
              <br />
              <b>your next chapter.</b>
            </p>
            <i>✳</i>
          </div>
        }
      />
      <section className="section-space">
        <div className="container-xl">
          <div className="row g-5">
            <div className="col-lg-5">
              <SectionTitle eyebrow="OUR APPROACH" title="Less complexity. More possibility." />
            </div>
            <div className="col-lg-7">
              <p className="lead">
                A business owner shouldn’t need to become a hosting specialist to make a confident
                decision.
              </p>
              <p>
                We start with the people who will use your website, the work it needs to do, and the
                resources available to maintain it. That gives us a practical foundation for design,
                infrastructure and growth.
              </p>
              <p>
                Our aim is a clear scope, useful advice and a dependable handover. When something
                needs another specialist or a different approach, the right next step matters more
                than selling a larger package.
              </p>
            </div>
          </div>
        </div>
      </section>
      <WhySection />
      <section className="section-space">
        <div className="container-xl">
          <FeatureGrid
            items={[
              {
                icon: 'chat-square-text',
                title: 'Speak clearly',
                text: 'Explain the choices, costs and tradeoffs in language people can use.',
              },
              {
                icon: 'vector-pen',
                title: 'Make it intentional',
                text: 'Give every page, feature and interaction a useful reason to exist.',
              },
              {
                icon: 'arrow-up-right-circle',
                title: 'Think past launch day',
                text: 'Plan for ownership, updates, support and the next stage of the business.',
              },
            ]}
          />
        </div>
      </section>
      <CTA />
    </>
  );
}
export function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="GOOD THINGS START WITH HELLO"
        title={
          <>
            Something in mind?
            <br />
            <em>Let’s talk it through.</em>
          </>
        }
        text="A new website, a hosting move or a question you haven’t quite figured out yet. Tell us where you’d like to go."
      />
      <section className="section-space pt-0">
        <div className="container-xl">
          <div className="row g-5">
            <div className="col-lg-4">
              <div className="contact-details">
                <h2>A human connection.</h2>
                <a href={`mailto:${company.email}`}>
                  <span className="icon-surface">
                    <Icon name="envelope" />
                  </span>
                  <span>
                    <small>WRITE TO US</small>
                    <strong>{company.email}</strong>
                  </span>
                </a>
                <a href={`tel:${company.tel}`}>
                  <span className="icon-surface">
                    <Icon name="telephone" />
                  </span>
                  <span>
                    <small>GIVE US A CALL</small>
                    <strong>{company.phone}</strong>
                  </span>
                </a>
                <a href={company.whatsapp} target="_blank" rel="noopener noreferrer">
                  <span className="icon-surface green">
                    <Icon name="whatsapp" />
                  </span>
                  <span>
                    <small>KEEP IT CONVERSATIONAL</small>
                    <strong>
                      Chat on WhatsApp <Icon name="arrow-up-right" />
                    </strong>
                  </span>
                </a>
                <p>
                  Already a customer? <Link href="/account/support">Open a support ticket</Link> to
                  keep the conversation with your account.
                </p>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="form-panel">
                <h2>Tell us about your next chapter.</h2>
                <p>A few details will help us start in the right place.</p>
                <InquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      <FAQ />
    </>
  );
}
export function SupportPage() {
  return (
    <>
      <PageHero
        eyebrow="A LITTLE HELP GOES A LONG WAY"
        title={
          <>
            Let’s find
            <br />
            <em>your next step.</em>
          </>
        }
        text="Start with a useful guide, explore a common question, or keep a support conversation in your account."
      >
        <Link href="/account/support" className="btn btn-primary">
          Open a support ticket <Icon name="arrow-up-right" />
        </Link>
        <Link href="/faq" className="btn btn-outline-primary">
          Browse FAQs
        </Link>
      </PageHero>
      <section className="section-space pt-0">
        <div className="container-xl">
          <div className="row g-4">
            {articles.map((a) => (
              <div className="col-md-4" key={a.slug}>
                <Link href={`/blog/${a.slug}`} className="support-guide">
                  <span className="icon-surface">
                    <Icon name="journal-text" />
                  </span>
                  <h2>{a.title}</h2>
                  <p>{a.description}</p>
                  <span className="text-link">
                    Read the guide <Icon name="arrow-right" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactStrip />
      <FAQ />
    </>
  );
}
export function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="A FEW USEFUL IDEAS"
        title={
          <>
            Less jargon.
            <br />
            <em>More understanding.</em>
          </>
        }
        text="Practical notes on websites, hosting and organic growth for people building a business."
      />
      <section className="section-space pt-0">
        <div className="container-xl">
          <div className="row g-4">
            {articles.map((a, i) => (
              <div className="col-lg-4" key={a.slug}>
                <Link href={`/blog/${a.slug}`} className="article-card">
                  <div className={`article-art article-art-${i}`}>
                    <Icon name={['hdd-stack', 'window', 'graph-up-arrow'][i]} />
                    <span>FIELD NOTES / 0{i + 1}</span>
                  </div>
                  <span className="eyebrow mt-4">{a.category}</span>
                  <h2>{a.title}</h2>
                  <p>{a.description}</p>
                  <span className="text-link">
                    {a.minutes} min read <Icon name="arrow-up-right" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
export function ArticlePage({ slug }: { slug: string }) {
  const a = articles.find((a) => a.slug === slug)!;
  return (
    <>
      <PageHero
        eyebrow={`${a.category.toUpperCase()} · ${a.minutes} MIN READ`}
        title={a.title}
        text={a.description}
      />
      <article className="container-xl article-body">
        <div className="row g-5">
          <aside className="col-lg-3">
            <span className="eyebrow">IN THIS GUIDE</span>
            {a.sections.map(([title], i) => (
              <a href={`#section-${i}`} key={title}>
                {title}
              </a>
            ))}
          </aside>
          <div className="col-lg-8">
            {a.sections.map(([title, text], i) => (
              <section key={title} id={`section-${i}`}>
                <h2>{title}</h2>
                <p>{text}</p>
              </section>
            ))}
            <div className="article-callout">
              <h3>A conversation can make the choices clearer.</h3>
              <p>
                Tell us about your website and goals. We’ll help identify a practical starting
                point.
              </p>
              <Link href="/contact" className="text-link">
                Talk to Veehoster <Icon name="arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </article>
      <CTA />
    </>
  );
}
export function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="YOUR IDEA, WITH A LITTLE MORE DETAIL"
        title={
          <>
            A clear scope.
            <br />
            <em>A confident start.</em>
          </>
        }
        text="Choose a website package, add the extras you need and get an itemized estimate. We’ll confirm the details together before work starts."
      />
      <section className="section-space pt-0">
        <div className="container-xl">
          <QuoteBuilder />
        </div>
      </section>
    </>
  );
}
const legalContent: Record<string, { title: string; intro: string; sections: [string, string][] }> =
  {
    privacy: {
      title: 'Your information deserves care.',
      intro:
        'This implementation collects only the information needed to operate the demonstrated account, order and support workflows. This policy must be reviewed against the final business operations before launch.',
      sections: [
        [
          'Information we collect',
          'Account name, email, hashed password, contact details, billing details, orders, quotations and support messages are stored in the application database. Payment card details are never requested by the demo checkout.',
        ],
        [
          'How information is used',
          'Information is used to manage accounts, record order requests, prepare quotations and handle customer conversations. This release does not send marketing emails or include third-party advertising trackers.',
        ],
        [
          'Cookies and storage',
          'Essential HTTP-only cookies maintain your login session and shopping cart. These cookies support core functionality. No optional analytics cookies are installed in this implementation.',
        ],
        [
          'Payment providers',
          'When PayU sandbox is configured, checkout shares the required order and customer details with PayU for a test transaction. Live payments require a reviewed production integration and updated disclosures.',
        ],
        [
          'Access, deletion and retention',
          'Contact info@veehoster.com to request access, correction or deletion. The business must establish a retention schedule that meets applicable obligations before collecting live customer data.',
        ],
      ],
    },
    terms: {
      title: 'Clear expectations. Better projects.',
      intro:
        'These are draft commercial terms for the demonstration website. Final business identity, applicable law, service commitments and contract terms must be reviewed before accepting live orders.',
      sections: [
        [
          'Demonstration services',
          'This release demonstrates hosting, domain, website and SEO ordering. Demo payments do not collect money, domain availability is simulated, and hosting or domain services are not automatically provisioned.',
        ],
        [
          'Pricing and scope',
          'All prices are in INR and are illustrative. The checkout displays an illustrative 18% GST calculation; actual tax treatment depends on the business registration and service. Website scope, milestones, third-party licenses and delivery dates require written agreement.',
        ],
        [
          'Accounts and acceptable use',
          'Use accurate account details and protect your credentials. Do not use the service for unlawful content, abusive traffic or unauthorized access. Hosting resource limits and suspension rules must be agreed with the actual provider.',
        ],
        [
          'Website and SEO projects',
          'Package inclusions set a starting scope, not an unlimited service commitment. Content approvals, changes, revision rounds and handover requirements are confirmed in the project agreement. Search rankings and specific business results are not guaranteed.',
        ],
        [
          'Renewal and cancellation',
          'This implementation does not automatically renew or charge a saved payment method. Real renewal terms, cancellation deadlines and refund eligibility must be disclosed before live purchase.',
        ],
        [
          'Contact',
          'Questions about your proposed project or these terms can be sent to info@veehoster.com or discussed at +91 96404 69666.',
        ],
      ],
    },
    refunds: {
      title: 'Let’s make the next step clear.',
      intro:
        'No real charges are made in demo mode, so demo orders do not require a financial refund. The following describes the decisions that must be documented before live sales.',
      sections: [
        [
          'Hosting services',
          'A live hosting refund policy must specify the eligibility window, excluded usage, cancellation procedure and handling of third-party fees. No blanket money-back guarantee is advertised by this implementation.',
        ],
        [
          'Domain registrations',
          'Registrar charges may become non-refundable after registration. Availability, refund eligibility and renewal conditions must be confirmed with the chosen registrar before purchase.',
        ],
        [
          'Website and SEO work',
          'Project cancellation and refunds depend on approved scope, completed milestones and third-party costs. These must be agreed in writing before work starts.',
        ],
        [
          'Raise a concern',
          'Contact info@veehoster.com with your order reference and a description of the issue. Do not include payment card details or credentials in your message.',
        ],
      ],
    },
  };
export function LegalPage({ kind }: { kind: string }) {
  const data = legalContent[kind];
  return (
    <>
      <PageHero
        eyebrow={`${kind.toUpperCase()} POLICY · DRAFT FOR OWNER REVIEW`}
        title={data.title}
        text={data.intro}
      />
      <article className="legal-body container-xl">
        {data.sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </article>
    </>
  );
}
