---
name: appotapay-mobile-topup
description: >-
  Top up Vietnamese mobile airtime and data packages through AppotaPay (nạp tiền điện thoại / nạp data):
  look up the subscriber's telco, fetch product codes, charge a topup or a data package (sync, or async
  with the result delivered by IPN), verify the IPN signature, and check transaction status. Covers
  Viettel, Vinaphone, Mobifone, Vietnamobile, Itel, Gtel, Beeline. Use when the user integrates mobile
  topup or asks about /api/v2/service/topup endpoints (charging, charging-async). Requires appotapay-auth
  for the JWT and the signature.
license: MIT
metadata:
  version: "0.3.0"
  source: https://docs.appotapay.com/mobile-topup/introduction
---

# AppotaPay mobile topup

Base URL: `https://gateway.dev.appotapay.com` (sandbox) / `https://gateway.appotapay.com` (production).
Headers: `X-APPOTAPAY-AUTH: Bearer JWT_TOKEN`, `Content-Type: application/json`, optional `Language`.
Paid from your AppotaPay balance.

> **Verify against live docs.** `node skills/appotapay/scripts/fetch-doc.mjs mobile-topup/mobile-topup-async`
> (or `mobile-topup`, `mobile-topup/security`, `mobile-topup/error-code`) before generating code.

## Endpoints

| Task | Endpoint |
|---|---|
| Subscriber info (telco detection) | `GET /api/v1/service/topup/{phoneNumber}/info` |
| Product codes (all) | `GET /api/v2/service/topup/productCodes` |
| Data packages for a number | `GET /api/v1/service/topup/{phone_number}/products` |
| Charge a topup (sync) | `POST /api/v2/service/topup/charging` |
| Charge a topup (async, result via IPN) | `POST /api/v2/service/topup/charging-async` |
| Transaction status | `GET /api/v1/service/topup/transaction/{partnerRefId}` |

Pick **one** flow per partner: **sync** returns the final result in the response (needs a long client
timeout); **async** answers immediately and pushes the final result to the partner's IPN URL (needs an
IPN URL registered with AppotaPay). Comparison: `references/docs/mobile-topup-introduction.md`.

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

## Async charge — `POST /api/v2/service/topup/charging-async`

Same body and same request signature as the sync charge. The response is only an acknowledgement:
`{"errorCode": 35, "message": "..."}`.

- `errorCode` **34 or 35** = accepted, still pending — **not** a final result; keep the order pending.
- Any other code = **not** accepted (e.g. `31` duplicate, `1034` no IPN URL configured).
- Never mark success/failure from this response; wait for the IPN or the status API.

### IPN (AppotaPay → partner IPN URL, `POST`, JSON)

Sent once the transaction is final. Fields: `errorCode`, `status` (`success`|`error`),
`appotapayTransId`, `partnerRefId`, `phoneNumber`, `productCode`, `amount`, `topupAmount`, `telco`,
`telcoServiceType` (both may differ from the request — the telco's actual data), `time` (RFC 3339),
`signature`.

**IPN signature**: HMAC-SHA256 with `SECRET_KEY` over the sorted `key=value&…` string of `amount`,
`appotapayTransId`, `errorCode`, `partnerRefId`, `phoneNumber`, `productCode`, `status`, `telco`,
`telcoServiceType`, `time`, `topupAmount`. Constant-time compare; mismatch → do not update the order.

Handler rules:
- Success only when `status = success`, `errorCode = 0` **and** the signature is valid.
- Idempotent on `partnerRefId`: the same IPN can arrive several times — if already final, skip and
  still answer `HTTP 200`.
- Answer `HTTP 200` fast (connect timeout 5 s, response timeout 10 s). Non-200 counts as failed;
  AppotaPay retries every 5 min, 4 attempts total, then stops — reconcile with the status API.

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

- `references/docs/mobile-topup.md` — the sync charging API.
- `references/docs/mobile-topup-mobile-topup-async.md` — the async charging API and its IPN.
- `references/docs/mobile-topup-security.md` — signature examples (request, response, async IPN).
- `references/docs/mobile-topup-service-code.md`, `-product-code.md` — code tables.
