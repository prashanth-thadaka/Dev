export type Category = 'hosting' | 'website' | 'seo' | 'domain';
export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  period: string;
  description: string;
  features: string[];
  featured?: boolean;
  badge?: string;
};
export const products: Product[] = [
  {
    id: 'hosting-launch',
    name: 'Launch',
    category: 'hosting',
    price: 14900,
    period: 'month',
    description: 'A little idea. A proper home.',
    features: [
      '1 website',
      '10 GB NVMe storage',
      'Free SSL certificate',
      '5 business mailboxes',
      'Weekly backups',
      'cPanel access',
    ],
  },
  {
    id: 'hosting-grow',
    name: 'Grow',
    category: 'hosting',
    price: 29900,
    period: 'month',
    description: 'More room for your next chapter.',
    features: [
      '10 websites',
      '50 GB NVMe storage',
      'Free SSL certificates',
      '25 business mailboxes',
      'Daily backups',
      'Staging & migration assistance',
    ],
    featured: true,
    badge: 'Our recommendation',
  },
  {
    id: 'hosting-scale',
    name: 'Scale',
    category: 'hosting',
    price: 59900,
    period: 'month',
    description: 'For businesses with bigger plans.',
    features: [
      '25 websites',
      '100 GB NVMe storage',
      'Free SSL certificates',
      '100 business mailboxes',
      'Daily backups',
      'Priority support queue',
    ],
  },
  {
    id: 'website-launch',
    name: 'Launch website',
    category: 'website',
    price: 1499900,
    period: 'project',
    description: 'A thoughtful first impression.',
    features: [
      'Up to 5 custom pages',
      'Mobile-first responsive design',
      'Contact form & WhatsApp',
      'Foundational technical SEO',
      '2 rounds of design revisions',
      '30 days of launch support',
    ],
  },
  {
    id: 'website-growth',
    name: 'Growth website',
    category: 'website',
    price: 3499900,
    period: 'project',
    description: 'A website that works harder.',
    features: [
      'Up to 12 custom pages',
      'CMS & blog setup',
      'Conversion-focused landing pages',
      'Analytics configuration',
      '3 rounds of design revisions',
      '60 days of launch support',
    ],
    featured: true,
    badge: 'Built for growing brands',
  },
  {
    id: 'website-commerce',
    name: 'Commerce website',
    category: 'website',
    price: 6999900,
    period: 'project',
    description: 'From first look to checkout.',
    features: [
      'Up to 50 initial products',
      'Customer account & cart',
      'One payment gateway integration',
      'Product & category SEO',
      'Order management training',
      '90 days of launch support',
    ],
  },
  {
    id: 'seo-foundation',
    name: 'SEO Foundation',
    category: 'seo',
    price: 799900,
    period: 'month',
    description: 'Get the fundamentals right.',
    features: [
      'Technical SEO audit',
      '10 target keyword themes',
      'On-page optimization',
      'Google Business Profile guidance',
      'Monthly progress report',
    ],
  },
  {
    id: 'seo-growth',
    name: 'SEO Growth',
    category: 'seo',
    price: 1499900,
    period: 'month',
    description: 'Turn search intent into opportunity.',
    features: [
      'Everything in Foundation',
      '25 target keyword themes',
      '2 content briefs per month',
      'Internal link improvements',
      'Monthly strategy call',
    ],
    featured: true,
    badge: 'A consistent growth plan',
  },
  {
    id: 'seo-authority',
    name: 'SEO Authority',
    category: 'seo',
    price: 2499900,
    period: 'month',
    description: 'Build a stronger organic presence.',
    features: [
      'Everything in Growth',
      '50 target keyword themes',
      '4 content briefs per month',
      'Competitive content analysis',
      'Conversion tracking review',
    ],
  },
  {
    id: 'domain-com',
    name: '.com',
    category: 'domain',
    price: 89900,
    period: 'year',
    description: 'The familiar global choice.',
    features: ['1 year registration', 'DNS management'],
  },
  {
    id: 'domain-in',
    name: '.in',
    category: 'domain',
    price: 59900,
    period: 'year',
    description: 'A local identity for India.',
    features: ['1 year registration', 'DNS management'],
  },
  {
    id: 'domain-net',
    name: '.net',
    category: 'domain',
    price: 109900,
    period: 'year',
    description: 'Built for connected ideas.',
    features: ['1 year registration', 'DNS management'],
  },
  {
    id: 'domain-org',
    name: '.org',
    category: 'domain',
    price: 99900,
    period: 'year',
    description: 'A home for a shared purpose.',
    features: ['1 year registration', 'DNS management'],
  },
];
export const money = (paise: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: paise % 100 === 0 ? 0 : 2,
  }).format(paise / 100);
export const byCategory = (category: Category) => products.filter((p) => p.category === category);
export const findProduct = (id: string) => products.find((p) => p.id === id);
export function itemPrice(product: Product, cycle: string) {
  return cycle === 'annual' && product.period === 'month'
    ? Math.round(product.price * 12 * 0.9)
    : product.price;
}
export const quoteExtras = [
  { id: 'pages', name: '5 additional pages', price: 750000 },
  { id: 'seo', name: 'SEO launch setup', price: 499900 },
  { id: 'copy', name: 'Copywriting for 5 pages', price: 600000 },
  { id: 'care', name: '3 months of website care', price: 450000 },
];
export const company = {
  name: 'Veehoster',
  phone: '+91 96404 69666',
  tel: '+919640469666',
  email: 'info@veehoster.com',
  whatsapp: 'https://wa.me/919640469666',
};
export const generalFaqs = [
  {
    q: 'Can you help with both my website and hosting?',
    a: 'Yes. We can plan and build your website, help you choose a domain, and recommend an appropriate hosting package. Website development and hosting are priced separately so you can see exactly what you are buying.',
  },
  {
    q: 'Can I move my existing website to Veehoster?',
    a: 'Start with a migration assessment. We review your current platform, storage, email and DNS setup, agree a backup and rollback plan, then schedule the move. Migration scope and any charges are confirmed before work begins.',
  },
  {
    q: 'What is included in the website packages?',
    a: 'Each package lists its page count, revisions, integrations and launch support. Content writing, premium plugins, hosting and domain fees are separate unless your approved quotation includes them.',
  },
  {
    q: 'Do you guarantee first-page rankings?',
    a: 'No. Search rankings depend on your market, competition and search engine changes. We focus on technical quality, useful content and measurable progress, with clear monthly reporting.',
  },
  {
    q: 'Are these checkout and domain results live?',
    a: 'This release includes a demonstration store. Domain availability is simulated and demo payments never charge money. Live registrar, hosting provisioning and payment connections must be configured before accepting real orders.',
  },
  {
    q: 'How do I get a tailored quotation?',
    a: 'Use the quote builder to choose a website package and optional services, then send your requirements. We will confirm the scope, delivery milestones and final price before a project begins.',
  },
];
export const hostingFaqs = [
  {
    q: 'Which hosting plan should I choose?',
    a: 'Launch suits one small website. Grow adds storage and space for several websites. Scale provides larger allowances and a priority support queue. Tell us about your site traffic and software before ordering if you need help choosing.',
  },
  {
    q: 'Is a domain included?',
    a: 'Domains are separate annual purchases. You can use an existing domain or add a new one to your cart. This avoids hiding domain renewals inside introductory hosting prices.',
  },
  {
    q: 'What happens when I choose annual billing?',
    a: 'Annual hosting is paid upfront for 12 months with a 10% discount on the displayed monthly rate. The full annual amount is shown before checkout. Prices shown are proposed demo prices.',
  },
  {
    q: 'Can I access a real cPanel account here?',
    a: 'The feature explorer demonstrates the tools a cPanel hosting account offers. This application does not provision hosting or authenticate into cPanel yet; those connections require your hosting provider configuration.',
  },
  {
    q: 'Are backups a replacement for my own copies?',
    a: 'No. Keep independent copies of important website data. Confirm retention periods and restoration procedures for your selected service before relying on a provider backup.',
  },
];
export const projects = [
  {
    slug: 'form-and-field',
    name: 'Form & Field',
    type: 'Architecture & interiors',
    category: 'Business websites',
    theme: 'architecture',
    headline: 'Spaces with a point of view.',
    intro: 'An editorial website concept for a contemporary architecture studio.',
    scope: ['Art direction', 'Responsive website', 'Project portfolio'],
    detail:
      'Large project imagery, an understated palette and a project-first navigation help a studio explain its approach. The concept pairs a considered enquiry journey with a flexible project archive.',
  },
  {
    slug: 'botanica',
    name: 'Botanica',
    type: 'Lifestyle & commerce',
    category: 'E-commerce',
    theme: 'botanica',
    headline: 'A little closer to nature.',
    intro: 'A warm, simple shopping concept for a plant and homeware brand.',
    scope: ['Brand-led design', 'Product discovery', 'Storefront UX'],
    detail:
      'Soft greens and confident typography create a calm product experience. Collection filters and useful care information help shoppers find products that fit their homes.',
  },
  {
    slug: 'orbit-finance',
    name: 'Orbit',
    type: 'Finance & technology',
    category: 'Business websites',
    theme: 'orbit',
    headline: 'Your money. In perspective.',
    intro: 'A clear, approachable digital product concept for a financial platform.',
    scope: ['UX strategy', 'Landing pages', 'Design system'],
    detail:
      'Complex information becomes easier to understand through structured content, clear pricing and a focused dashboard. This is a fictional design concept, not financial advice or a real financial service.',
  },
];
export const articles = [
  {
    slug: 'choose-your-first-hosting-plan',
    title: 'How to choose your first hosting plan',
    category: 'Hosting essentials',
    minutes: 5,
    description: 'A practical guide to storage, SSL, backups and support—without the jargon.',
    sections: [
      [
        'Start with the website you actually need',
        'A five-page business website has different needs from an online store or a busy publication. List your software, likely storage needs, number of sites and email requirements before comparing plans.',
      ],
      [
        'Look beyond the introductory price',
        'Compare the full billing period, renewal costs, migration scope and included backups. A clear monthly or annual total is more useful than an advertised discount alone.',
      ],
      [
        'Treat backups and security as a routine',
        'Use a supported CMS, strong passwords, HTTPS and independent backups. Ask how restoration works and how long provider backups are retained.',
      ],
      [
        'Leave room to grow',
        'Choose a plan that meets your current needs with a sensible upgrade path. Review real usage after launch rather than paying for capacity based on guesswork.',
      ],
    ],
  },
  {
    slug: 'website-launch-checklist',
    title: 'The small-business website launch checklist',
    category: 'Website strategy',
    minutes: 6,
    description: 'The important details to review before your new website goes live.',
    sections: [
      [
        'Make the next step obvious',
        'Every important page should help the visitor do something: understand your service, compare a package, make an enquiry or complete a purchase. Use specific button labels and visible contact details.',
      ],
      [
        'Test on real mobile screens',
        'Check navigation, form labels, tap targets, text sizes and checkout on small screens. A page that fits the viewport still needs to be comfortable to use.',
      ],
      [
        'Review the content and search foundations',
        'Give each public page a descriptive title and a unique main heading. Use meaningful image descriptions, internal links, a sitemap and accurate structured data.',
      ],
      [
        'Prepare the operational handover',
        'Confirm domain ownership, backups, analytics access and responsibility for future updates. Run a real contact-form test and verify that the right team receives it.',
      ],
    ],
  },
  {
    slug: 'seo-that-starts-with-your-customer',
    title: 'Better SEO starts with your customer',
    category: 'Organic growth',
    minutes: 4,
    description: 'Build useful pages around real questions, not a list of keywords.',
    sections: [
      [
        'Understand the question behind the search',
        'Start with the problems your customers describe. Group related questions into useful topics and make sure each page has a clear purpose.',
      ],
      [
        'Make useful information easy to find',
        'Explain your service, who it suits, what it costs and how to get started. Descriptive headings and sensible internal links help both people and search engines.',
      ],
      [
        'Fix the technical basics',
        'Ensure important pages can be crawled, load efficiently and use consistent canonical URLs. Redirect retired pages carefully and keep structured data accurate.',
      ],
      [
        'Measure business outcomes',
        'Review qualified enquiries, helpful content engagement and conversions alongside search visibility. No provider can responsibly guarantee a particular ranking.',
      ],
    ],
  },
];
export const publicPaths = [
  '/',
  '/hosting',
  '/hosting/wordpress',
  '/hosting/cloud',
  '/domains',
  '/web-design',
  '/seo',
  '/pricing',
  '/migration',
  '/features/cpanel',
  '/portfolio',
  '/about',
  '/contact',
  '/faq',
  '/support',
  '/blog',
  '/quote',
  '/privacy',
  '/terms',
  '/refunds',
];
