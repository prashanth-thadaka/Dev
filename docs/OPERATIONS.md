# Customer, admin and content workflows

## Customer

1. Explore hosting/SEO packages or simulated domains and add one to the cart.
2. Register/sign in, enter billing details and review server-calculated totals.
3. Select a demo payment outcome.
4. Review `/account/invoices`; open an order to print/save its receipt.
5. Purchased demo items appear in `/account/services` or `/account/domains`. These records do not provision services.
6. Create and reply to conversations in `/account/support`.
7. Update profile/password in `/account/settings`. Password changes invalidate other sessions.

## Administrator

Create an administrator using the README instructions. Public registration can never assign an administrator role.

| Page               | Tasks                                                                            |
| ------------------ | -------------------------------------------------------------------------------- |
| `/admin`           | Stored order counts, test order value and recent activity                        |
| `/admin/customers` | Search names/email and view contact details/roles                                |
| `/admin/orders`    | Search and inspect itemized orders                                               |
| `/admin/quotes`    | Read quote/contact/migration/SEO requests; mark new, contacted, quoted or closed |
| `/admin/support`   | Reply to tickets; mark open, in progress or resolved                             |

Updates create audit events. A new install starts with honest empty states, not fabricated customers or totals. Demo/sandbox payments are not revenue. Production payments still require the appropriate service-activation workflow.

## Quotations

The quote builder selects a website package/extras, itemizes the estimate and proposes 40/40/20 milestones. Browser print allows saving a PDF. Submissions create admin requests with references.

An estimate is not a contract, signed proposal, invoice or automatically emailed PDF. Confirm scope, timeline, taxes and commercial terms before accepting a project.

## Edit packages and content

`lib/catalog.ts` holds company details, fixed package IDs, integer-paise prices, billing periods, features, quote extras, FAQs, projects and articles. The server uses these same prices when accepting carts and creating orders. Existing orders preserve their original snapshots.

Website packages use quotations. Hosting/SEO subscriptions currently represent a single billing-period order; there is no automatic recurring billing.

Illustrative GST is currently 18% in the cart and quote calculations. Replace it with a reviewed tax policy before real sales, including applicable GSTIN, invoice numbering, place-of-supply and exemptions.

Public copy is in `components/public-pages.tsx`; metadata is in `lib/seo.ts`. Update both when changing a page's purpose. Sitemap and robots exclude private routes. All portfolio examples are fictional; replace them with approved, permissioned work before presenting client case studies.

The generated architecture image is in `public/images/architecture.png`. Hosting, plant and finance illustrations are authored with CSS. Fonts and icons are installed packages, served locally.

Legal pages need owner review: registered business identity/address, GST details and contractual service/refund commitments were not provided and have not been invented.

## Connect actual providers

- Replace simulated domain search with a chosen registrar's availability/pricing API.
- Recheck availability and price at checkout and handle registration failure after payment. Live domain checkout is currently blocked.
- Add an idempotent, retryable hosting-provisioning workflow through your provider, with operator visibility.
- Replace the cPanel feature preview with a provider-supported customer access flow if required. Never expose WHM/provider administrator credentials to browsers.

Provider selection and credentials are still required. Payment success alone is not service activation.
