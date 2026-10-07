import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { articles, projects } from '@/lib/catalog';
import { metaFor } from '@/lib/seo';
import {
  HomePage,
  HostingPage,
  DomainsPage,
  WebDesignPage,
  SEOPage,
  PricingPage,
  MigrationPage,
  CpanelPage,
  PortfolioPage,
  ProjectPage,
  AboutPage,
  ContactPage,
  SupportPage,
  BlogPage,
  ArticlePage,
  QuotePage,
  LegalPage,
} from '@/components/public-pages';
import { AuthPage, CartPage, CheckoutPage, PaymentPage } from '@/components/commerce';
import { CTA, FAQ, PageHero } from '@/components/ui';

type Props = { params: Promise<{ slug?: string[] }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = '/' + slug.join('/');
  const meta = metaFor(path);
  if (!meta) return { title: 'Page not found', robots: { index: false, follow: false } };
  return {
    title: path === '/' ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: { title: meta.title, description: meta.description, url: path },
    robots: meta.private ? { index: false, follow: false } : { index: true, follow: true },
  };
}
export default async function Page({ params }: Props) {
  const { slug = [] } = await params;
  const path = '/' + slug.join('/');
  let content: React.ReactNode;
  switch (path) {
    case '/':
      content = <HomePage />;
      break;
    case '/hosting':
      content = <HostingPage />;
      break;
    case '/hosting/wordpress':
      content = <HostingPage variant="wordpress" />;
      break;
    case '/hosting/cloud':
      content = <HostingPage variant="cloud" />;
      break;
    case '/domains':
      content = <DomainsPage />;
      break;
    case '/web-design':
      content = <WebDesignPage />;
      break;
    case '/seo':
      content = <SEOPage />;
      break;
    case '/pricing':
      content = <PricingPage />;
      break;
    case '/migration':
      content = <MigrationPage />;
      break;
    case '/features/cpanel':
      content = <CpanelPage />;
      break;
    case '/portfolio':
      content = <PortfolioPage />;
      break;
    case '/about':
      content = <AboutPage />;
      break;
    case '/contact':
      content = <ContactPage />;
      break;
    case '/support':
      content = <SupportPage />;
      break;
    case '/faq':
      content = (
        <>
          <PageHero
            eyebrow="THE QUESTIONS WORTH ASKING"
            title={
              <>
                A little clarity.
                <br />
                <em>A better next step.</em>
              </>
            }
            text="Useful answers about hosting, websites, domains and the way we work."
          />
          <FAQ />
          <CTA />
        </>
      );
      break;
    case '/blog':
      content = <BlogPage />;
      break;
    case '/quote':
      content = <QuotePage />;
      break;
    case '/privacy':
    case '/terms':
    case '/refunds':
      content = <LegalPage kind={slug[0]} />;
      break;
    case '/login':
    case '/register':
    case '/forgot-password':
    case '/reset-password':
      content = (
        <AuthPage mode={slug[0] as 'login' | 'register' | 'forgot-password' | 'reset-password'} />
      );
      break;
    case '/cart':
      content = <CartPage />;
      break;
    case '/checkout':
      content = <CheckoutPage />;
      break;
    case '/payment/demo':
      content = <PaymentPage />;
      break;
    case '/payment/result':
      content = <PaymentPage result />;
      break;
    default:
      if (slug[0] === 'portfolio' && slug.length === 2 && projects.some((p) => p.slug === slug[1]))
        content = <ProjectPage slug={slug[1]} />;
      else if (slug[0] === 'blog' && slug.length === 2 && articles.some((a) => a.slug === slug[1]))
        content = <ArticlePage slug={slug[1]} />;
      else notFound();
  }
  return (
    <main id="main">
      <Suspense
        fallback={
          <div className="loading-panel" role="status">
            Preparing your next step…
          </div>
        }
      >
        {content}
      </Suspense>
    </main>
  );
}
