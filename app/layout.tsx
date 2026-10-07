import type { Metadata, Viewport } from 'next';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import { Provider } from '@/components/provider';
import { Shell } from '@/components/shell';
import { company } from '@/lib/catalog';
import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Veehoster — A better home for your digital world',
    template: '%s | Veehoster',
  },
  description:
    'Web hosting, custom website design, domains and SEO. A thoughtful partner for your digital world.',
  openGraph: { type: 'website', locale: 'en_IN', siteName: 'Veehoster' },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/icon.svg' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#635bff' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Veehoster',
    url: siteUrl,
    email: company.email,
    telephone: company.tel,
    description: 'Website design, hosting, domain and SEO services.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: company.tel,
      email: company.email,
      contactType: 'customer support',
      availableLanguage: ['English'],
    },
  };
  return (
    <html lang="en-IN">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, '\\u003c'),
          }}
        />
        <Provider>
          <Shell>{children}</Shell>
        </Provider>
      </body>
    </html>
  );
}
