# AppotaPay IPN & redirect result handling

Source: https://docs.appotapay.com/payment/result.

After the customer pays, AppotaPay notifies you **two ways**, both carrying the same payload shape:

- **IPN** — server-to-server `POST` to your `notifyUrl`. Sent **only on success**. Source of truth.
- **Redirect** — browser `GET` to your `redirectUrl`. For UX only.

## Payload (both channels)

| Field       | Type   | Meaning                                              |
|-------------|--------|------------------------------------------------------|
| `data`      | string | `base64( json_encode( { transaction, partnerReference, ... } ) )` |
| `signature` | string | `HMAC_SHA256(data, SECRET_KEY)` — hex                |
| `time`      | string | response timestamp                                   |

IPN arrives as a JSON body (`POST`, `Content-Type: application/json`). Redirect arrives as query string.

## Verify, then decode

1. Read the raw `data` string **exactly as received** (do not trim/re-encode).
2. `expected = HMAC_SHA256(data, SECRET_KEY)`.
3. Constant-time compare `expected` with the received `signature`. Mismatch → reject (HTTP 400).
4. `payload = json_decode(base64_decode(data))`.

## Decoded `data` fields (most relevant)

| Field | Notes |
|-------|-------|
| `transaction.transactionId` | AppotaPay transaction id |
| `transaction.reconciliationId` | reconciliation id (on success) |
| `transaction.partnerCode` | your partner code |
| `transaction.status` | `pending`/`processing`/`success`/`error` |
| `transaction.errorCode` / `errorMessage` | result code / message |
| `transaction.orderAmount` | order amount — **must match your record** |
| `transaction.amount` | amount charged at the provider |
| `transaction.currency` | `VND` |
| `transaction.bankCode` / `paymentMethod` / `action` | as chosen by the customer |
| `transaction.createdAt` / `updatedAt` | RFC-3339 |
| `partnerReference.order.{id,info,extraData}` | your order reference |
| `tokenResult` | present when a card token was saved (`action = PAY_WITH_RETURN_TOKEN`) |

## Before fulfilling an order, confirm ALL of:

1. `signature` is valid (step above).
2. `transaction.status === "success"`.
3. `transaction.orderAmount` equals the amount you expected for `partnerReference.order.id`.
4. (Recommended) `GET /api/v2/orders/transaction` returns `success` for the same id.
5. The order is not already fulfilled (idempotency — IPN may be retried).

## IPN response contract

- Reply HTTP `200` with body exactly `{"status":"ok"}` once you've accepted the IPN.
- If you don't, AppotaPay retries up to **3 times, 5 minutes apart**.
- Make handling **idempotent**: a retry for an already-processed order must still return `{"status":"ok"}`
  without double-fulfilling.

## Status codes

| Status | Meaning |
|--------|---------|
| `pending` | awaiting processing |
| `processing` | in progress |
| `success` | succeeded |
| `error` | failed |
