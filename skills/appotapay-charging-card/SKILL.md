---
name: appotapay-charging-card
description: >-
  Redeem scratch-card codes through AppotaPay (gạch thẻ cào / AppotaCard): submit an encrypted card
  code plus serial for charging and check the transaction status. Note this API uses its own signature
  scheme (plain SHA-256 concatenation) and AES-128 card-code encryption, unlike the rest of the
  platform. Use when the user integrates card charging or asks about /v1/services/card_charging.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com/charging-card/introduction
---

# AppotaPay charging card (gạch thẻ)

Base URL: `https://gateway.dev.appotapay.com` (sandbox) / `https://gateway.appotapay.com` (production).
Headers: `X-APPOTAPAY-AUTH: Bearer JWT_TOKEN`, `Content-Type: application/json`.

> **This area is the odd one out.** Its signature is a plain SHA-256 concatenation (not HMAC, not
> sorted `key=value`), the card code is AES-128 encrypted, and the field names are `snake_case`
> instead of camelCase. Do not copy an implementation from another AppotaPay skill.

## Endpoints

| Task | Endpoint |
|---|---|
| Charge a card | `POST /v1/services/card_charging?api_key=YOUR_API_KEY` |
| Transaction status | `GET /v1/services/transaction/check?api_key=YOUR_API_KEY` |

Note `api_key` travels as a **query parameter** here, in addition to the JWT header.

## Charge — request

```json
{
  "code": "<AES-128 encrypted card code>",
  "serial": "123456789012",
  "vendor": "appota",
  "partner_code": "YOUR_PARTNER_CODE",
  "service_name": "YOUR_SERVICE",
  "transaction_id": "unique-5-to-50-chars",
  "signature": "<sha256>"
}
```

Signature (**family E**) — fixed order, concatenated, secret appended, **plain SHA-256**:

```
signature = SHA256(code + serial + vendor + partner_code + service_name + transaction_id + secret_key)
```

- `code` is the **encrypted** card code (AES-128), not the raw one.
- `serial` is 12 characters.
- `vendor` defaults to `appota`.
- `transaction_id` is yours, unique, 5–50 chars.

Response: `error_code`, `message`, and on success `data.amount` (card face value), `data.serial`,
`data.transaction_id`, `data.time`.

## Security rules from the docs

- The partner's source IP must be allow-listed.
- **A card code or serial submitted more than 5 times gets locked.** Do not build a naive retry loop
  — on a timeout, query the status endpoint with your `transaction_id` instead of resubmitting.

## References

- `references/docs/charging-card-introduction.md` · `charging-card-charging.md`
- `references/docs/charging-card-transaction-status.md` · `charging-card-error-code.md`
