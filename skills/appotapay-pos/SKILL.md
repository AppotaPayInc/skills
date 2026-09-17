---
name: appotapay-pos
description: >-
  Take payments from a POS terminal through the AppotaPay POS gateway: request a POS or QR payment for
  a terminal, list transactions, read one transaction, and handle the POS IPN. Uses its own host
  (pos-gw.*), snake_case fields and an X-Signature header over the raw request body. Use when the user
  integrates POS/terminal payments or asks about /api/v2/partner/orders endpoints.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com/pos/payment-info
---

# AppotaPay POS

Base URL: `https://pos-gw.dev.appotapay.com` (dev) / `https://pos-gw.appotapay.com` (production) —
**not** the `gateway.*` host used by the rest of the platform.

Headers: `X-AppotaPay-Auth` (JWT), `Content-Type: application/json`, `X-Request-Id` (UUIDv4,
**required** here), and `X-Signature`.

## Signature — family D, over the raw body

```
X-Signature = HMAC_SHA256(raw_request_body_json_string, SECRET_KEY)
```

Serialize the body **once**, sign that exact string, and send that same string. Re-serializing (a
framework re-encoding, key reordering, pretty-printing) invalidates the signature. This is the only
AppotaPay area that signs the whole body in a header.

## Endpoints

| Task | Endpoint |
|---|---|
| Request payment | `POST /api/v2/partner/orders/payment/create` |
| List transactions | `GET /api/v2/partner/orders/transactions` |
| Transaction detail | `GET /api/v2/partner/orders/transaction/:partner_ref_id` |
| IPN (you implement) | `POST <your URL>` |

## Request payment

```json
{
  "partner_ref_id": "igVSoghODYwBgJEbQdTj",
  "order_info": "Appota test",
  "terminal_id": "TID-5094322012",
  "payment_method": "QR",
  "amount": 50000,
  "customer_phone_number": "0866123456"
}
```

| Field | Notes |
|---|---|
| `partner_ref_id` | unique, ≤ 26 chars, `[a-zA-Z0-9_-]` |
| `terminal_id` | issued by AppotaPay per device, ≤ 20 |
| `payment_method` | `POS` or `QR` |
| `amount` | integer VND, **min 10 000** |
| `order_info` | ≤ 100 chars |

## IPN

AppotaPay POSTs the result to your registered URL. Verify its signature before marking the sale paid,
reply promptly, and stay idempotent — a terminal sale can be notified more than once. Then reconcile
with `GET /api/v2/partner/orders/transaction/:partner_ref_id`.
Page: `references/docs/pos-ipn.md`.

## Network

`references/docs/pos-payment-info.md` lists the dev/production domains **and the incoming/outgoing
IPs** — production outbound IPs are `54.151.252.252`, `52.76.192.70`, `43.239.223.231`. Allow-list
them on your IPN endpoint and give AppotaPay your own source IPs.

## References

- `references/docs/pos-request-payment.md` · `pos-transactions.md` · `pos-detail-transaction.md`
- `references/docs/pos-payment-error-codes.md`
