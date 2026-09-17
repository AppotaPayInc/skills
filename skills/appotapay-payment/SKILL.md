---
name: appotapay-payment
description: >-
  Integrate the AppotaPay hosted payment flow: create a payment order, redirect the customer to the
  hosted checkout, receive and verify the IPN/redirect callback, check transaction status, list
  transactions, handle installment-conversion IPNs, delete saved card tokens, and issue refunds.
  Use when the user wants to accept online payments via AppotaPay (ATM/Visa/Master/JCB/e-wallet/QR),
  build an AppotaPay checkout, handle AppotaPay payment notifications/callbacks, verify a payment
  result, poll transaction status, or refund. Requires appotapay-auth for the JWT.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com/payment/
---

# AppotaPay hosted payment flow

Build the `X-APPOTAPAY-AUTH` JWT first — see **appotapay-auth**.
Amounts are integers in **VND**; `currency` is always `"VND"`.
Base URL: `https://gateway.dev.appotapay.com` (sandbox) / `https://gateway.appotapay.com` (production).

> Want the customer to enter card details **on your own page** instead of AppotaPay's? That is
> merchant-hosted: **appotapay-merchant-hosted** (domestic) or **appotapay-credit-card**
> (international, 3DS).

> **Verify against live docs.** `references/docs/*.md` are an offline snapshot and may lag.
> Reconcile before shipping (live doc wins):
> `node skills/appotapay/scripts/fetch-doc.mjs payment` (create),
> `… payment/result` (IPN), `… payment/payment-status`, `… payment/refund`, `… payment/code`.
> Mechanism: `../appotapay/references/live-docs.md`.

## The flow (server-side)

```
1. Create order   →  POST /api/v2/orders/payment        → returns payment.url (+ qrCode)
2. Redirect       →  send customer to payment.url
3. Customer pays  →  on the AppotaPay hosted page
4. IPN (POST)     →  AppotaPay calls your notifyUrl with { data, signature, time }
                     → VERIFY signature, decode data, mark order, reply {"status":"ok"}
5. Redirect (GET) →  customer returns to your redirectUrl with the same { data, signature, time }
                     → VERIFY signature, show result (do NOT fulfill on this alone)
6. Reconcile      →  GET /api/v2/orders/transaction?referenceId=...  → confirm final status
   (optional)        Refund: POST /api/v2/transaction/refund
```

> **Trust model:** treat the IPN as the source of truth, but always re-check via the status API
> before fulfilling. The redirect is for UX only — it can be tampered with or replayed.

## Endpoints

| Task | Endpoint | Page |
|---|---|---|
| Create payment | `POST /api/v2/orders/payment` | `references/docs/payment.md` |
| Transaction status | `GET /api/v2/orders/transaction` | `references/docs/payment-payment-status.md` |
| List transactions | `GET /api/v2/orders/transactions` | `references/docs/payment-list.md` |
| Refund | `POST /api/v2/transaction/refund` | `references/docs/payment-refund.md` |
| Refund detail | `GET /api/v2/transaction/refund/{refundRefId}` | `references/docs/payment-refund-detail.md` |
| Delete saved card token | `DELETE /api/v2/token/delete` | `references/docs/payment-payment-delete-token.md` |

## 1) Create payment — `POST /api/v2/orders/payment`

Headers: `X-APPOTAPAY-AUTH`, `Content-Type: application/json`; optional `X-Request-ID` (UUIDv4),
`X-Language` (`vi`|`en`), `X-Account-Ref-ID` (required for sub-account *owner* transactions).

Minimal body:
```json
{
  "transaction": {
    "amount": 10000,
    "currency": "VND",
    "bankCode": "VCB",
    "paymentMethod": "ATM",
    "action": "PAY"
  },
  "partnerReference": {
    "order": { "id": "5f61cf4f41e2b", "info": "test thanh toan", "extraData": "" },
    "notificationConfig": {
      "notifyUrl": "https://your.site/ipn",
      "redirectUrl": "https://your.site/redirect"
    }
  }
}
```

Success (`200`) returns `transaction.transactionId`, `transaction.status` (`pending`), and
`payment.url` (the hosted checkout link; may include `payment.qrCode`). Send the customer to
`payment.url`. Every request/response field: `references/endpoints.md`. `paymentMethod`, `action`
and `bankCode` values: `references/codes.md` and `references/docs/payment-code.md`.

Optional `notificationConfig` URLs: `deeplinkUrl` (return into a mobile app) and
`installmentNotifyUrl` (IPN for installment conversion — see §5).

## 2) Verify the IPN / redirect callback — REQUIRED

Both callbacks send `{ data, signature, time }`. Verify before trusting:

```
expected = HMAC_SHA256(data, SECRET_KEY)        // data = the raw base64 string, unchanged
if !constant_time_equals(expected, signature): reject (HTTP 400)
info = json_decode(base64_decode(data))         // the transaction object
```

Then check `info.transaction.status === "success"` **and** that the amount matches your order before
fulfilling. Respond to the IPN with HTTP `200` and body `{"status":"ok"}` — otherwise AppotaPay
retries up to 3 times, 5 minutes apart. The same IPN can arrive more than once, so **handle it
idempotently**. `time` is informational and is **not** part of the signature.

Runnable verifiers: `scripts/verify-ipn.mjs` (Node), `scripts/verify_ipn.py` (Python),
`scripts/verify-ipn.php` (PHP). Full field list & status codes: `references/ipn.md`.

## 3) Check status — `GET /api/v2/orders/transaction`

Query: `referenceId` (required) and `type` = `TRANSACTION_ID` (AppotaPay id, default) or
`PARTNER_ORDER_ID` (your order id). `status` ∈ `pending | processing | success | error`.
`GET /api/v2/orders/transactions` lists transactions over a `startTime`/`endTime` window (both or
neither) with paging.

## 4) Refund — `POST /api/v2/transaction/refund`

Body: `partnerRefId` (unique), `transactionId`, `amount` (min 1000), `currency` `"VND"`, `reason`
(max 100). Refund `status` ∈ `pending | processing | success | error` — `pending`/`processing` mean
AppotaPay accepted it and will settle within ~1 day; poll
`GET /api/v2/transaction/refund/{refundRefId}`.

Not every provider supports automatic, partial or repeated refunds — check the provider table in
`references/docs/payment-refund.md` before promising a refund in your UI (e.g. ONEPAY and EBILL have
no partial refund; Cybersource has none at all).

## 5) Installment conversion IPN (credit card)

If a card payment is converted to installments, AppotaPay POSTs a separate IPN to
`installmentNotifyUrl` with the same `{ data, signature, time }` shape. Verify the signature on the
raw `data` **before** decoding, then check `transaction.status` and `transaction.paymentAmount`.
Re-deliveries happen — stay idempotent. See `references/docs/payment-installment-result.md`.

## Sandbox

Base URL `https://gateway.dev.appotapay.com`. Test credentials and test cards:
`references/sandbox.md` and `references/docs/payment-sandbox.md`.

## Checklist before go-live

- [ ] JWT built server-side, short `exp`, unique `jti` (appotapay-auth).
- [ ] `notifyUrl` is a public HTTPS endpoint that verifies `signature` and replies `{"status":"ok"}`.
- [ ] IPN handling is **idempotent** (the same notification can arrive several times).
- [ ] Order fulfillment gated on **status API = success** + amount match, not on the redirect.
- [ ] `SECRET_KEY` only in server env; not in client bundles or git.
- [ ] Switched base URL to production and confirmed the IP allow-list with AppotaPay.
