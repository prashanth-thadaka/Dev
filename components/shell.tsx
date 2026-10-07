'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { company } from '@/lib/catalog';
import { useApp } from './provider';

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Veehoster home">
      <span className="brand-mark" aria-hidden="true">
        v<span />
      </span>
      <span>
        veehoster<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, cart } = useApp();
  const links = [
    ['Hosting', '/hosting'],
    ['Domains', '/domains'],
    ['Websites', '/web-design'],
    ['SEO', '/seo'],
    ['Our work', '/portfolio'],
  ];
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="top-strip">
        <div className="container-xl d-flex justify-content-between">
          <span>
            Big ideas deserve a better home.
            <Link href="/migration">
              Let’s move yours <i aria-hidden="true" className="bi bi-arrow-right" />
            </Link>
          </span>
          <a href={`tel:${company.tel}`}>
            <i aria-hidden="true" className="bi bi-telephone" /> {company.phone}
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="container-xl nav-wrap">
          <Brand />
          <nav aria-label="Main navigation" className={open ? 'main-nav open' : 'main-nav'}>
            {links.map(([text, href]) => (
              <Link
                key={href}
                href={href}
                className={pathname.startsWith(href) ? 'active' : ''}
                onClick={() => setOpen(false)}
              >
                {text}
              </Link>
            ))}
            <Link href="/contact" className="mobile-contact" onClick={() => setOpen(false)}>
              Contact us
            </Link>
          </nav>
          <div className="nav-actions">
            <Link
              href="/cart"
              className="cart-link"
              aria-label={`Shopping cart, ${cart?.items.length || 0} items`}
            >
              <i aria-hidden="true" className="bi bi-bag" />
              {!!cart?.items.length && <span>{cart.items.length}</span>}
            </Link>
            <Link href={user ? '/account' : '/login'} className="sign-in">
              {user ? 'My account' : 'Sign in'}{' '}
              <i aria-hidden="true" className="bi bi-arrow-up-right" />
            </Link>
            <Link href="/quote" className="btn btn-primary nav-cta">
              Let’s talk <i aria-hidden="true" className="bi bi-arrow-up-right" />
            </Link>
            <button
              className="menu-toggle"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <i aria-hidden="true" className={`bi bi-${open ? 'x-lg' : 'list'}`} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
const footerGroups = [
  {
    title: 'Find your home',
    links: [
      ['Web hosting', '/hosting'],
      ['WordPress hosting', '/hosting/wordpress'],
      ['Cloud hosting', '/hosting/cloud'],
      ['Domain names', '/domains'],
      ['Move to Veehoster', '/migration'],
    ],
  },
  {
    title: 'Build & grow',
    links: [
      ['Website development', '/web-design'],
      ['E-commerce websites', '/web-design#packages'],
      ['SEO services', '/seo'],
      ['Our portfolio', '/portfolio'],
      ['Get a quotation', '/quote'],
    ],
  },
  {
    title: 'A little help',
    links: [
      ['Help center', '/support'],
      ['Hosting features', '/features/cpanel'],
      ['Plans & pricing', '/pricing'],
      ['FAQs', '/faq'],
      ['Contact us', '/contact'],
    ],
  },
  {
    title: 'Veehoster',
    links: [
      ['Our story', '/about'],
      ['Ideas & insights', '/blog'],
      ['Your account', '/account'],
      ['Privacy policy', '/privacy'],
      ['Terms & refunds', '/terms'],
    ],
  },
];
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-xl">
        <div className="footer-top">
          <div>
            <span className="eyebrow light">GOOD THINGS START WITH A CONVERSATION</span>
            <h2>
              Something in mind?
              <br />
              <a href={`mailto:${company.email}`}>
                Let’s make it happen. <i aria-hidden="true" className="bi bi-arrow-up-right" />
              </a>
            </h2>
          </div>
          <Link href="/contact" className="footer-round" aria-label="Contact Veehoster">
            <i aria-hidden="true" className="bi bi-arrow-up-right" />
          </Link>
        </div>
        <div className="row g-4 footer-links">
          <div className="col-lg-4">
            <Brand light />
            <p className="footer-description">
              A thoughtful partner for your digital world. Websites, hosting, domains and growth—all
              connected.
            </p>
            <a href={`mailto:${company.email}`} className="footer-contact">
              <i aria-hidden="true" className="bi bi-envelope" /> {company.email}
            </a>
            <a href={`tel:${company.tel}`} className="footer-contact">
              <i aria-hidden="true" className="bi bi-telephone" /> {company.phone}
            </a>
            <div className="d-flex gap-2 mt-4">
              <a
                href={company.whatsapp}
                className="social-btn"
                aria-label="Chat with Veehoster on WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i aria-hidden="true" className="bi bi-whatsapp" />
              </a>
              <a
                href={`mailto:${company.email}`}
                className="social-btn"
                aria-label="Email Veehoster"
              >
                <i aria-hidden="true" className="bi bi-envelope" />
              </a>
            </div>
          </div>
          {footerGroups.map((group) => (
            <div className="col-6 col-lg-2" key={group.title}>
              <h3>{group.title}</h3>
              {group.links.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Veehoster. Made for what’s next.</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/refunds">Refund policy</Link>
            <span>
              <span className="status-dot" /> Demo storefront
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dashboard = pathname.startsWith('/account') || pathname.startsWith('/admin');
  return dashboard ? (
    <>{children}</>
  ) : (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
