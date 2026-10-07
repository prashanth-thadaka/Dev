# Architecture and API

## Stack and source map

Next.js 16.4.0 App Router, React 19.3.0, TypeScript, Bootstrap 5.3.8, Bootstrap Icons, self-hosted Manrope/DM Sans, Node.js 24 SQLite, Zod and Node crypto. Tests use Playwright, axe-core and Node's runner. No jQuery or external font requests are needed.

| Location                               | Responsibility                                             |
| -------------------------------------- | ---------------------------------------------------------- |
| `app/[[...slug]]/page.tsx`             | Public/commerce routing and per-page metadata              |
| `app/account/[[...section]]/page.tsx`  | Customer workspace routes                                  |
| `app/admin/[[...section]]/page.tsx`    | Administrator workspace routes                             |
| `app/api/[...segments]/route.ts`       | Validated HTTP API and access controls                     |
| `app/layout.tsx`                       | Fonts, Bootstrap, providers, Organization JSON-LD          |
| `app/globals.css`                      | Tokens, page layouts, responsive and print rules           |
| `components/public-pages.tsx`          | Distinct marketing page compositions                       |
| `components/marketing-interactive.tsx` | Pricing, search, forms, quotes, filters and cPanel preview |
| `components/commerce.tsx`              | Authentication, cart, checkout and payments                |
| `components/dashboard.tsx`             | Account/admin views, receipts and conversations            |
| `components/provider.tsx`              | Client session/cart state and API client                   |
| `lib/catalog.ts`                       | Server-owned packages, prices, content and brand details   |
| `lib/database.mjs`                     | SQLite schema and transaction helper                       |
| `lib/security.mjs`                     | Scrypt passwords and opaque tokens                         |
| `lib/payu.mjs`                         | Gateway endpoints, hashes and verification                 |
| `lib/mail.mjs`                         | Optional Resend transport and local reset mailbox          |
| `lib/seo.ts`                           | Metadata and canonical base URL                            |
| `scripts/create-admin.mjs`             | Explicit administrator creation                            |
| `tests/`                               | Payment/security vectors and browser/API integration tests |

## Data and request flow

Public pages render HTML on the server. Client components use same-origin JSON requests. Mutation APIs require the configured `Origin`, except the signed PayU callback.

Login sessions use random 32-byte tokens in HTTP-only, SameSite=Lax cookies; only token hashes are stored. Protected APIs resolve the session and enforce roles or record ownership. Client-supplied roles and prices are never trusted. Password changes/reset completion invalidate existing sessions.

The dashboard shell contains no protected records before its authenticated API request. Customer orders/tickets are scoped to the current user; administrative endpoints require an administrator role.

SQLite uses WAL, foreign keys and parameterized queries. Tables: `users`, `sessions`, `resets`, `cart_items`, `orders`, `inquiries`, `tickets`, `rate_limits`, `audit_events`.

Money is stored in integer **paise**: ₹149 is `14900`. Annual hosting costs `round(monthly paise × 12 × 0.9)`. Illustrative tax is `round(subtotal × 0.18)`.

Checkout snapshots line items, billing and amounts. Statuses are `pending`, `failed`, `cancelled`, `paid_demo`, `paid_sandbox`, `paid_live`. Payment success does not provision a service. Demo/sandbox statuses do not represent real revenue.

The schema is initialized with `CREATE TABLE IF NOT EXISTS`. Add versioned migrations for future structural changes; initialization does not alter existing columns.

## API

All paths are under `/api`. JSON mutations require `Content-Type: application/json` and a matching `Origin`. Errors use `{ "error": "Human-readable message" }`. JSON and callback bodies are limited to 32 KiB.

| Method | Path                      | Behavior                                                        |
| ------ | ------------------------- | --------------------------------------------------------------- |
| GET    | `/health`                 | Database readiness and payment mode                             |
| GET    | `/auth/me`                | Current user or null                                            |
| POST   | `/auth/register`          | `name`, `email`, `password` (12–128 chars), `terms: true`       |
| POST   | `/auth/login`             | Email/password; creates session                                 |
| POST   | `/auth/logout`            | Revokes current session                                         |
| POST   | `/auth/forgot`            | Email; generic reset response; production needs email transport |
| POST   | `/auth/reset`             | Single-use token and new password                               |
| GET    | `/domains/search?q=brand` | Simulated suggestions with `demo: true`                         |
| GET    | `/cart`                   | Read anonymous cart and set its cookie                          |
| POST   | `/cart`                   | SKU, optional cycle/domain; duplicate item is idempotent        |
| DELETE | `/cart`                   | Item ID, restricted to caller's cart                            |
| POST   | `/checkout`               | Signed-in user, billing details, terms, UUID idempotency key    |
| GET    | `/orders/:id`             | Owner's order only; other users receive 404                     |
| POST   | `/payments/demo`          | Owner, demo order, success/failure/cancel outcome               |
| POST   | `/payments/payu/start`    | Owner; signed hosted-checkout fields                            |
| POST   | `/payments/payu/callback` | Signed URL-encoded callback and server verification             |
| GET    | `/account`                | Current profile, orders and tickets                             |
| PATCH  | `/account/settings`       | Name/phone; current password required for password change       |
| POST   | `/tickets`                | Signed-in user, subject and message                             |
| PATCH  | `/tickets/:id`            | Owner/admin reply; only admin may change status                 |
| POST   | `/inquiries`              | Contact, migration, SEO or quotation with consent/honeypot      |
| GET    | `/admin`                  | Admin-only customers, orders, requests and tickets              |
| PATCH  | `/admin/inquiries/:id`    | Admin-only request status                                       |

Quote requests contain package/extra IDs. The server recomputes the estimate; browser-submitted amounts are not accepted. Print/save PDF produces an estimate, not a signed contract or tax invoice.

## Scaling boundaries

This database design targets one persistent application host. Multiple ephemeral instances would have separate data. Before horizontal scaling, move to shared persistence, shared rate limiting and paginated administrative queries.

No provider provisioning, registrar access, automatic renewal scheduler, refunds API, accounting integration, OAuth or MFA is implemented. These are explicit integration boundaries.
