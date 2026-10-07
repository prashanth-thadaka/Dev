# PayU integration

The delivered default is **local demo mode**. It needs no PayU keys, requests no card details and never charges money.

## Modes

| `PAYMENT_MODE` | Behavior                                                                                                  |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `demo`         | Local success/failure/cancel screen. No gateway traffic.                                                  |
| `payu_sandbox` | PayU Hosted Checkout test endpoint plus transaction verification. Records `paid_sandbox`.                 |
| `payu_live`    | Production endpoints, gated by `LIVE_CHECKOUT_ENABLED=true`. Records `paid_live` only after verification. |

The production adapter is included for later integration. **No real PayU sandbox or production merchant transaction has been executed in this environment**: merchant credentials and public HTTPS callbacks were not supplied. Local hash tests are not merchant acceptance tests.

## Try the local demo

Choose a hosting/SEO package or simulated domain, register/sign in, enter sample Indian billing details and continue. Select successful payment, failed payment or cancellation. Review the order in `/account/invoices`.

Success clears the purchased cart items. Failure/cancellation preserves them. Replaying a paid demo order cannot downgrade it. Checkout's UUID idempotency key prevents duplicate orders on retries.

## Configure sandbox

Obtain the **test merchant key and salt** from PayU. Store them only in server environment settings or ignored `.env.local`.

```dotenv
APP_URL=https://your-staging-domain.example
PAYMENT_MODE=payu_sandbox
PAYU_KEY=your-test-merchant-key
PAYU_SALT=your-test-merchant-salt
LIVE_CHECKOUT_ENABLED=false
```

These strings are placeholders. `APP_URL` must be the exact public HTTPS origin serving the application. Restart after changing server values. Never prefix a credential with `NEXT_PUBLIC_`.

| Purpose                  | Endpoint                                           |
| ------------------------ | -------------------------------------------------- |
| Sandbox checkout         | `https://test.payu.in/_payment`                    |
| Sandbox verification     | `https://test.payu.in/merchant/postservice?form=2` |
| Success/failure callback | `{APP_URL}/api/payments/payu/callback`             |

Allow outbound HTTPS to `test.payu.in`. PayU must reach the public callback. A localhost address inside this workspace is not a public callback URL. Use the test payment details currently provided for your merchant account; do not use real cards in sandbox.

## Server-side payment flow

1. Calculate the order from catalog prices in integer paise.
2. Store immutable line items, billing, amount and mode.
3. Validate ownership, then create a transaction ID from the order UUID.
4. Sign merchant key, transaction ID, exact two-decimal amount, product information, customer details and UDFs with SHA-512.
5. Submit to the fixed hosted-checkout URL. The browser receives the hash, never the salt.
6. Validate the callback's reverse hash using timing-safe comparison.
7. Check merchant key, order ID, transaction ID, mode and stored amount.
8. Call `verify_payment` from the server and compare the gateway transaction and amount.
9. Mark paid only when callback and verification both report matching success.
10. Redirect to the owner-protected order result page.

The standard Hosted Checkout request sequence is:

```text
key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
```

`udf1` contains the internal order UUID. Additional charges are included in reverse-hash validation when present. Verification signs:

```text
key|verify_payment|txnid|SALT
```

Functions are in `lib/payu.mjs`. Independent fixed vectors test request/reverse hashes, additional charges, verification commands and tampered values.

## Add your original live keys later

After merchant onboarding and sandbox acceptance testing:

```dotenv
APP_URL=https://veehoster.com
PAYMENT_MODE=payu_live
PAYU_KEY=your-live-merchant-key
PAYU_SALT=your-live-merchant-salt
LIVE_CHECKOUT_ENABLED=true
```

Production checkout is `https://secure.payu.in/_payment`; verification is `https://info.payu.in/merchant/postservice.php?form=2`. Allow those HTTPS destinations.

The live flag is off in the delivered configuration. Inserting a key or changing the mode alone does not activate real collection. Confirm current merchant-specific PayU requirements, perform an approved transaction/refund test, and review taxes, policies and fulfillment before enabling it.

**Live domain checkout is blocked** until a registrar adapter rechecks real availability and price. Hosting/SEO orders need manual fulfillment or provider integration; payment alone does not activate hosting.

## Failure and reconciliation

- Invalid hashes, mismatched values and unavailable verification do not mark an order paid.
- A paid order cannot be downgraded by a later failure callback.
- A closed browser or missing callback can leave an order pending. Add a scheduled `verify_payment` reconciliation job before commercial launch.
- No refunds, recurring charges or saved cards are automated. Use an operator-reviewed merchant workflow until those features are implemented.
- After a cross-site redirect, a user may need to sign in again to view their owner-protected order.

## References and validation limit

- [PayU Hosted Checkout](https://docs.payu.in/docs/prebuilt-web-checkout)
- [Hash generation](https://docs.payu.in/docs/generate-hash-payu-hosted)
- [Verify Payment API](https://docs.payu.in/reference/verify_payment_api)

The runtime network policy blocked `docs.payu.in` during this task. These references are provided for merchant review; no externally validated merchant transaction is claimed.
