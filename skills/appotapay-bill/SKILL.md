---
name: appotapay-bill
description: >-
  Pay utility and service bills through AppotaPay (thanh toán hoá đơn — điện, nước, internet, truyền
  hình…): query bill information by bill code and service code, pay the bill, and check transaction
  status. Use when the user integrates bill payment, hoá đơn, or asks about /api/v1/service/bill
  endpoints. Requires appotapay-auth for the JWT and the signature.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com/bill/introduction
---

# AppotaPay bill payment

Base URL: `https://gateway.dev.appotapay.com` (sandbox) / `https://gateway.appotapay.com` (production).
Headers: `X-APPOTAPAY-AUTH: Bearer JWT_TOKEN`, `Content-Type: application/json`, optional `Language`
(`vi`|`en`). Paid from your AppotaPay balance.

## Flow — check then pay, with the same `partnerRefId`

```
1. POST /api/v1/service/bill/check   { partnerRefId, billCode, serviceCode, signature }
   → billDetail[] (amounts, periods, expiry, isPartialPaymentAllowed …)
2. POST /api/v1/service/bill/pay     { partnerRefId, billCode, serviceCode, amount,
                                       billDetail, signature }
   → transaction { appotapayTransId, amount, billAmount, time }, account.balance
3. GET  /api/v1/service/bill/transaction/{partnerRefId}   (status / reconcile)
```

`partnerRefId` from step 1 is reused in step 2 — it ties the quote to the payment. It must be unique
per transaction. `billDetail` in step 2 is the array **as returned by the check call**, passed back
as a JSON string.

## Signatures (family A — see appotapay-auth)

| Call | Fields signed (sorted) |
|---|---|
| check | `billCode`, `partnerRefId`, `serviceCode` |
| pay (request) | `amount`, `billCode`, `billDetail`, `partnerRefId`, `serviceCode` |
| pay (response) | `amount`, `appotapayTransId`, `billAmount`, `errorCode`, `time` |

> The docs' worked example writes the array as the literal `billDetail=Array` in the canonical
> string. Reproduce the documented example byte-for-byte before trusting your implementation —
> `../appotapay-auth/scripts/sign-params.mjs` prints the canonical string it signs.

Verify the **response** signature before marking the bill paid.

## Service codes

`serviceCode` identifies the provider (electricity, water, …). Table:
`references/docs/bill-service-code.md`.

## Failure handling

A pay call that times out is **not** a failure — query
`GET /api/v1/service/bill/transaction/{partnerRefId}` before retrying, and never retry with a new
`partnerRefId`. Error codes: `references/docs/bill-error-code.md`.

## References

- `references/docs/bill-introduction.md` · `bill-info.md` · `bill-payment.md` · `bill-transaction-status.md`
- `references/docs/bill-security.md` — signature examples.
