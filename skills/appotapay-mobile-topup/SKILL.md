---
name: appotapay-mobile-topup
description: >-
  Top up Vietnamese mobile airtime and data packages through AppotaPay (nạp tiền điện thoại / nạp data):
  look up the subscriber's telco, fetch product codes, charge a topup or a data package, and check
  transaction status. Covers Viettel, Vinaphone, Mobifone, Vietnamobile, Itel, Gtel, Beeline. Use when
  the user integrates mobile topup or asks about /api/v2/service/topup endpoints. Requires appotapay-auth
  for the JWT and the signature.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com/mobile-topup/introduction
---

# AppotaPay mobile topup

Base URL: `https://gateway.dev.appotapay.com` (sandbox) / `https://gateway.appotapay.com` (production).
Headers: `X-APPOTAPAY-AUTH: Bearer JWT_TOKEN`, `Content-Type: application/json`, optional `Language`.
Paid from your AppotaPay balance.

## Endpoints

| Task | Endpoint |
|---|---|
| Subscriber info (telco detection) | `GET /api/v1/service/topup/{phoneNumber}/info` |
| Product codes (all) | `GET /api/v2/service/topup/productCodes` |
| Data packages for a number | `GET /api/v1/service/topup/{phone_number}/products` |
| Charge a topup | `POST /api/v2/service/topup/charging` |
| Transaction status | `GET /api/v1/service/topup/transaction/{partnerRefId}` |

## Charge — `POST /api/v2/service/topup/charging`

```json
{
  "partnerRefId": "AB123",
  "telco": "viettel",
  "telcoServiceType": "prepaid",
  "productCode": "viettel_10",
  "phoneNumber": "0866123456",
  "signature": "<hmac>"
}
```

| Field | Notes |
|---|---|
| `partnerRefId` | unique per transaction, ≤ 50 chars |
| `telcoServiceType` | `prepaid` (trả trước) or `postpaid` (trả sau) |
| `productCode` | from the product-code API; a **generic** code works for plain topup so you need not resolve the telco yourself — but **not** for data packages |
| `phoneNumber` | local format `09x`, `08x`, … |
| `telco` | optional when using a generic product code |

Signature (**family A**) over: `partnerRefId`, `phoneNumber`, `productCode`, `telco`,
`telcoServiceType` (sorted).

**Response signature**: `amount`, `appotapayTransId`, `errorCode`, `phoneNumber`, `productCode`,
`time`, `topupAmount`. Status-API response drops `productCode`. Verify before recording success.

## Data packages

Data topups need a per-number product list —
`GET /api/v1/service/topup/{phone_number}/products` — because availability varies by subscriber.
Per-telco tables are in `references/docs/mobile-topup-telcos-*.md` (viettel, viettelData, vinaphone,
vinaphoneData, mobifone, mobifoneData, vnmobile, itel, gtel, beeline, topup).

## Failure handling

Timeouts are ambiguous — call
`GET /api/v1/service/topup/transaction/{partnerRefId}` before any retry, and reuse the same
`partnerRefId`. A new one can double-top-up. Error codes:
`references/docs/mobile-topup-error-code.md`.

## References

- `references/docs/mobile-topup.md` — the charging API.
- `references/docs/mobile-topup-security.md` — signature examples.
- `references/docs/mobile-topup-service-code.md`, `-product-code.md` — code tables.
