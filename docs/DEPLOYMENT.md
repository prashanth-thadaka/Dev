# Setup and deployment

## Development

Use Node.js 24+ and the committed lockfile.

```bash
cd /workspace/Dev
npm ci --cache /workspace/.npm-cache --no-fund
npm run dev
```

Use the existing cloud checkout; each task is already isolated. Do not create a Git worktree unless explicitly requested. The cloud home npm cache is not writable, so setup uses `/workspace/.npm-cache`.

Port 3000 is the default. Readiness means a healthy API plus a functional page/request or browser test. Processes do not survive environment snapshots; future tasks must restart the server.

## Variables

| Name                                          | Purpose                                                                                                                 |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `APP_URL`                                     | Exact runtime origin; local HTTP for development, HTTPS in production. Used by CSRF, payment callbacks and reset links. |
| `NEXT_PUBLIC_SITE_URL`                        | `https://veehoster.com` by default; metadata/sitemap canonical origin. Rebuild after changing.                          |
| `DATABASE_PATH`                               | `./data/veehoster.sqlite`; persistent writable storage.                                                                 |
| `PAYMENT_MODE`                                | `demo`, `payu_sandbox` or `payu_live`.                                                                                  |
| `PAYU_KEY`, `PAYU_SALT`                       | Server-side merchant credentials.                                                                                       |
| `LIVE_CHECKOUT_ENABLED`                       | Defaults off; literal `true` additionally required for live checkout.                                                   |
| `TRUST_PROXY`                                 | Defaults false; determines whether forwarded IPs are trusted for rate limits.                                           |
| `MAIL_API_KEY`                                | Optional Resend credential for reset email.                                                                             |
| `MAIL_FROM`                                   | Verified sender, e.g. `Veehoster <accounts@veehoster.com>`.                                                             |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Administrator script only; unset after use.                                                                             |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE`              | Optional browser executable for tests.                                                                                  |

Never commit secrets, database files or reset mailbox messages. They are ignored in their default locations; keep any custom database path outside the web-served directories and source control.

## Persistent hosting

Use a VPS/container with a persistent Node process and database volume. A static host or ephemeral serverless filesystem cannot support this SQLite-backed application as-is.

1. Install dependencies using `npm ci`.
2. Set server variables and durable database storage.
3. Run `npm run build` and start with `npm start` under a process manager.
4. Configure an HTTPS reverse proxy and the exact `APP_URL`.
5. Create your administrator securely.
6. Test registration, forms, checkout and customer/admin access in that deployment.

Only enable `TRUST_PROXY=true` when the trusted proxy strips and overwrites incoming `X-Forwarded-For`. Otherwise client-supplied headers could spoof rate-limit identities. The default local rate-limit bucket is shared; configure trustworthy client IP handling before serving many users.

Set proxy request-size limits, credential-redacted logs and operational monitoring. The API also limits body readers to 32 KiB. Production cookies use Secure when `APP_URL` is HTTPS, plus HTTP-only and SameSite=Lax.

## Email

Development reset messages go to `data/mailbox.jsonl` or beside the configured database. This is a local mailbox containing sensitive reset links, not real email delivery. Keep it private.

For real reset delivery, configure a verified Resend sender, `MAIL_API_KEY`, `MAIL_FROM` and an HTTPS `APP_URL`. Allow `api.resend.com` over HTTPS. Tokens expire after 30 minutes and are single-use. Delivery was not tested without provider credentials.

Production recovery reports a configuration error if mail is unavailable instead of claiming an email was sent. Contact/quote/migration requests are stored for admin review; notifications for those forms are not currently sent by email.

## Data operations

Back up SQLite through its backup API or a consistent stopped-service backup. Do not casually copy a running WAL database. Test restores, monitor disk usage and maintain session/reset-token retention. Introduce versioned migrations for schema changes. Use shared persistence, shared rate limits and paginated queries before scaling to multiple instances.

## Destinations

Initial setup: `registry.npmjs.org`, the existing GitHub Git proxy, and `raw.githubusercontent.com` for published design images. Fonts/icons are local assets.

Optional: `docs.payu.in`, `test.payu.in`, `secure.payu.in`, `info.payu.in`, `api.resend.com`. Your eventual registrar/hosting provider adds its own requirements.

Saving a cloud environment draft does not apply credentials, publish a snapshot or deploy a public website. A GitHub source branch is not a live deployment.
