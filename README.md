# Veehoster

A responsive IT services and hosting demonstration: public marketing pages, website quotations, registration, a server-backed cart, checkout, customer accounts and administration.

**Brand:** Veehoster · **Currency:** INR · **Contact:** +91 96404 69666 · info@veehoster.com

## See the designs first

- [Public website image mockups](designs/veehoster-public-pages.png): expanded homepage, hosting and website development.
- [Account and commerce image mockups](designs/veehoster-account-commerce.png): domain search, registration, cart, customer/admin dashboards and quotations.
- [Design system](docs/DESIGN.md).

![Veehoster public website design exploration](designs/veehoster-public-pages.png)

Mockups are design explorations; the application refines their wording, accessibility and behavior. Portfolio projects are explicitly identified as concepts.

## Run locally

Requires **Node.js 24+** and npm. SQLite uses Node's built-in driver.

```bash
git clone --branch codex/veehoster-website https://github.com/prashanth-thadaka/Dev.git
cd Dev
npm ci
cp .env.example .env.local
npm run dev
```

The server listens on port **3000**. In an existing Codex task, use `/workspace/Dev`; do not clone again or create a worktree. The onboarding interface does not expose a browser preview of this server. View design images through GitHub instead.

Default mode is `PAYMENT_MODE=demo`. No PayU credentials, email provider, registrar or cPanel connection is required. SQLite is created on the first API request in the ignored `data/veehoster.sqlite` file.

```bash
npm run build
npm start
```

Use a persistent Node host and database volume for deployment. This is not a static-only application; GitHub Pages cannot run its backend.

## Included

| Area           | Behavior                                                                                                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public website | Expanded homepage; hosting, WordPress, cloud assessment, domains, websites, SEO, pricing, migration, cPanel, portfolio, about, contact, help, FAQs, articles and legal drafts |
| Domain search  | Clearly simulated availability, extension prices and cart integration                                                                                                         |
| Packages       | Monthly/annual hosting, website project scopes and monthly SEO plans                                                                                                          |
| Quotations     | Itemized estimates, optional extras, illustrative GST, milestones, print/save PDF and stored requests                                                                         |
| Accounts       | Registration, scrypt password hashing, server sessions, login/logout, profile/password changes and token-based recovery                                                       |
| Shopping       | Persistent guest cart, server-calculated amounts, immutable orders and idempotent checkout                                                                                    |
| Payments       | Local success/failure/cancel simulation plus PayU hosted-checkout signing, callback checking and transaction verification adapters                                            |
| Customer area  | Orders, printable receipts, purchased service/domain records, support tickets and settings                                                                                    |
| Admin area     | Customer/order views, enquiries/quotations, request statuses, support replies and ticket statuses                                                                             |
| SEO            | Server-rendered content, individual metadata, canonical URLs, Organization JSON-LD, sitemap, robots, OG image and private-page noindex                                        |
| UI             | Bootstrap **5.3.8**, custom compositions, self-hosted Manrope/DM Sans, Bootstrap Icons, responsive layouts and accessible interactions                                        |

## Create an administrator

There is **no default administrator password**. Securely enter your own credentials in a local terminal:

```bash
read -r -p "Admin email: " ADMIN_EMAIL
read -rs -p "Admin password (12+ characters): " ADMIN_PASSWORD
export ADMIN_EMAIL ADMIN_PASSWORD
npm run admin
unset ADMIN_EMAIL ADMIN_PASSWORD
```

The script loads `.env.local` and uses that database. It refuses to overwrite or elevate an existing account. Sign in at `/login`, then use `/admin`.

## Test

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run format:check
```

Browser tests start an isolated production server on port 3100 with a fresh temporary database. They use system Chromium if available; otherwise install it with `npx playwright install chromium`.

## Documentation

- [Architecture, source map and API](docs/ARCHITECTURE.md)
- [PayU demo, sandbox and live integration](docs/PAYU.md)
- [Deployment and environment variables](docs/DEPLOYMENT.md)
- [Customer/admin workflows and content editing](docs/OPERATIONS.md)
- [Testing and limitations](docs/TESTING.md)
- [Design system](docs/DESIGN.md)

## Commercial launch boundaries

The default is a working demo, not an activated hosting business. Live domain registration and cPanel/WHM provisioning need provider adapters. PayU and transactional email require credentials and provider-side testing. Hosting/SEO purchases currently require manual fulfillment.

Approve the proposed prices, resource specifications, tax treatment and legal drafts. **18% GST is illustrative**; demo receipts are not tax invoices. Live PayU is separately gated, and live domain checkout is blocked until registrar verification exists. The linked integration documents explain the remaining work.
