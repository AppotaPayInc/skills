---
name: appotapay-buy-card
description: >-
  Buy prepaid card codes through AppotaPay (mua mã thẻ — thẻ game, thẻ điện thoại): list card products
  and product codes, buy a batch of cards, and check transaction status. Use when the user integrates
  card-code purchase or asks about /api/v1/service/shopcard endpoints.
  Requires appotapay-auth for the JWT and the signature.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com/buy-card/introduction
---

# AppotaPay buy card (mua mã thẻ)

Base URL: `https://gateway.dev.appotapay.com` (sandbox) / `https://gateway.appotapay.com` (production).
Headers: `X-APPOTAPAY-AUTH: Bearer JWT_TOKEN`, `Content-Type: application/json`, optional `Language`.
Paid from your AppotaPay balance.

## Endpoints

| Task | Endpoint |
|---|---|
| Product list | `GET /api/v1/service/shopcard/products` |
| Buy cards | `POST /api/v1/service/shopcard/buy` |
| Transaction status | `GET /api/v1/service/shopcard/transaction/{partnerRefId}` |

> "Resend card by SMS" exists only in the **archived 1.0** docs (`1.0/buy-card/resend-card-sms`), not
> in the current version. Fetch it with
> `node skills/appotapay/scripts/fetch-doc.mjs 1.0/buy-card/resend-card-sms` if you must support it,
> and confirm with AppotaPay that it is still live.

## Buy — `POST /api/v1/service/shopcard/buy`

```json
{
  "partnerRefId": "AB123",
  "productCode": "AC100",
  "type": "normal",
  "quantity": 10,
  "signature": "<hmac>"
}
```

- `quantity` — max **100** cards per call with `type: "normal"`.
- `type` defaults to `normal` (cards returned directly in the response).
- Signature (**family A**) over `partnerRefId`, `productCode`, `quantity` (sorted).

The response `cards[]` carries `code` (**encrypted**), `serial`, `vendor`, `expiry`. Decrypt the code
with the scheme AppotaPay gave you for your account, and treat `code` like a secret: never log it,
never put it in an error report, deliver it over an authenticated channel only.

## The delivery problem

A bought card is **not refundable** and the response is the only delivery. If your process crashes
between the HTTP call and persisting `cards[]`, recover with
`GET /api/v1/service/shopcard/transaction/{partnerRefId}` — never re-buy. Persist the response
before you acknowledge to your user, and keep `partnerRefId` unique.

## References

- `references/docs/buy-card-product-code.md`, `-card-code.md` — product and card code tables.
- `references/docs/buy-card-security.md` — signature example.
- `references/docs/buy-card-error-code.md` — error codes.
