# Validation

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run format:check
npm audit --omit=dev --audit-level=high
```

Build first. Browser tests start a separate production server on port 3100 with a fresh temporary SQLite database and random administrator credentials. They do not seed the development database or need real PayU keys.

System Chromium is used when installed; otherwise use `npx playwright install chromium` or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. Browser reports/traces are ignored by Git.

## Coverage

- Public routes, one main heading, unique metadata/canonical URLs, real 404, sitemap and private exclusions.
- Mobile navigation, FAQ expansion and horizontal overflow.
- Domain search from the homepage and cart add/remove.
- Registration through demo checkout, receipt, service record and support ticket.
- Quote selection, extras, totals and stored requests.
- Authentication, origin validation, customer/admin isolation and order ownership.
- Server prices despite tampered client amounts; checkout idempotency and paid-order replay.
- Payment failure/cancellation.
- Administrator quotation status changes and support replies.
- Axe-core WCAG A/AA checks on representative public/account screens.
- Fixed PayU hash vectors, additional charges, tamper rejection and salted password checks.

Automated accessibility checks are not a complete certification. PDF generation uses native browser print/save with supplied print styles; external PDF readers are outside the automated suite.

## External operations not verified here

- PayU sandbox/production merchant transactions or refunds.
- Real transactional email delivery.
- Live domain availability/registration.
- cPanel/WHM/cloud provisioning.
- DNS cutover, real hosting performance or uptime.
- Public deployment or restoration in a fresh cloud task.

These need provider configuration and deployment-specific testing. Final local results are recorded in `docs/VALIDATION.md` after the complete suite finishes.
