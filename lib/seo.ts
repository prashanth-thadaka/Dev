import { articles, projects } from './catalog';
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://veehoster.com').replace(
  /\/$/,
  '',
);
export const pageMeta: Record<string, { title: string; description: string; private?: boolean }> = {
  '/': {
    title: 'Veehoster — Web Hosting, Website Design, Domains & SEO',
    description:
      'Build your online presence with Veehoster. Explore web hosting, custom website development, domain names and SEO services with clear INR packages.',
  },
  '/hosting': {
    title: 'Web Hosting Plans in India',
    description:
      'Compare Veehoster hosting plans with NVMe storage, SSL, business email and cPanel. Clear monthly and annual INR pricing for your next website.',
  },
  '/hosting/wordpress': {
    title: 'WordPress Hosting for Your Next Website',
    description:
      'Explore WordPress-ready hosting foundations with storage, SSL, email and control panel tools. Find a suitable plan with Veehoster.',
  },
  '/hosting/cloud': {
    title: 'Cloud Hosting Assessment & Scalable Website Plans',
    description:
      'Plan the infrastructure your business needs. Discuss cloud resource requirements and explore Veehoster hosting packages.',
  },
  '/domains': {
    title: 'Find Your Domain Name',
    description:
      'Explore .com, .in, .net and .org domain options with Veehoster. Find a memorable name for your business and review transparent annual prices.',
  },
  '/web-design': {
    title: 'Custom Website Design & Development',
    description:
      'Thoughtful, responsive websites for growing businesses. Explore Veehoster portfolio concepts, development packages and itemized project quotations.',
  },
  '/seo': {
    title: 'SEO Services for Useful, Sustainable Growth',
    description:
      'Improve your search foundations with technical SEO, content planning, local visibility and clear reporting. Compare Veehoster monthly SEO packages.',
  },
  '/pricing': {
    title: 'Hosting, Website Development & SEO Pricing',
    description:
      'Compare clear Veehoster packages in INR. Explore hosting plans, website development scopes and monthly SEO services.',
  },
  '/migration': {
    title: 'Website Migration Assessment',
    description:
      'Plan your move to Veehoster with a clear website migration checklist. Review files, databases, email, DNS, backups and rollback planning.',
  },
  '/features/cpanel': {
    title: 'Explore cPanel Hosting Features',
    description:
      'Discover file management, email, databases, SSL, app installation and backup tools in our interactive cPanel feature preview.',
  },
  '/portfolio': {
    title: 'Website Design Portfolio & Concepts',
    description:
      'Explore Veehoster website design concepts for architecture, e-commerce and technology. See distinct layouts built around different business needs.',
  },
  '/about': {
    title: 'About Veehoster',
    description:
      'Veehoster connects websites, hosting, domains and SEO through clear conversations, thoughtful design and practical technology choices.',
  },
  '/contact': {
    title: 'Contact Veehoster',
    description:
      'Discuss your website, hosting or SEO project with Veehoster. Call +91 96404 69666, email info@veehoster.com or send a project enquiry.',
  },
  '/support': {
    title: 'Help Center & Customer Support',
    description:
      'Find practical website and hosting guides, browse FAQs or open a support ticket in your Veehoster customer account.',
  },
  '/faq': {
    title: 'Frequently Asked Questions',
    description:
      'Get clear answers about Veehoster hosting, website packages, domain names, migrations, quotations and SEO services.',
  },
  '/blog': {
    title: 'Website, Hosting & SEO Guides',
    description:
      'Practical guides to choosing hosting, launching a business website and building useful SEO content, from Veehoster.',
  },
  '/quote': {
    title: 'Build Your Website Quotation',
    description:
      'Choose a Veehoster website package, add optional services and prepare an itemized estimate in INR with clear project milestones.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description:
      'Learn how the Veehoster demonstration application handles account, order, contact and support information.',
  },
  '/terms': {
    title: 'Terms of Service',
    description: 'Review Veehoster draft package, account, project, payment and service terms.',
  },
  '/refunds': {
    title: 'Refund & Cancellation Policy',
    description:
      'Review the demo payment policy and commercial decisions required for Veehoster hosting, domain and project refunds.',
  },
  '/login': {
    title: 'Sign In',
    description: 'Sign in to your Veehoster customer account.',
    private: true,
  },
  '/register': {
    title: 'Create Your Account',
    description: 'Create a Veehoster account to manage your orders and support conversations.',
    private: true,
  },
  '/forgot-password': {
    title: 'Password Recovery',
    description: 'Recover access to your Veehoster account.',
    private: true,
  },
  '/reset-password': {
    title: 'Reset Your Password',
    description: 'Choose a new password for your Veehoster account.',
    private: true,
  },
  '/cart': {
    title: 'Your Shopping Cart',
    description: 'Review your selected Veehoster packages.',
    private: true,
  },
  '/checkout': {
    title: 'Checkout',
    description: 'Confirm your billing details and review your Veehoster order.',
    private: true,
  },
  '/payment/demo': {
    title: 'Demo Payment',
    description: 'Test a Veehoster checkout outcome without making a real payment.',
    private: true,
  },
  '/payment/result': {
    title: 'Payment Result',
    description: 'Review your Veehoster order status.',
    private: true,
  },
};
export function metaFor(path: string) {
  if (path.startsWith('/blog/')) {
    const article = articles.find((a) => path === `/blog/${a.slug}`);
    if (article) return { title: article.title, description: article.description };
  }
  if (path.startsWith('/portfolio/')) {
    const project = projects.find((p) => path === `/portfolio/${p.slug}`);
    if (project)
      return { title: `${project.name} — Website Design Concept`, description: project.intro };
  }
  return pageMeta[path];
}
