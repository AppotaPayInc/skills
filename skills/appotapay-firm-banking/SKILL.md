---
name: appotapay-firm-banking
description: >-
  Send money from an AppotaPay balance to a bank account or card (chuyển tiền liên ngân hàng / firm
  banking): look up the beneficiary account name, make a transfer, check transaction status, and handle
  the pending-result callback. Covers napas and citad channels and the bank code tables. Use when the
  user wants payouts, disbursement, bank transfer out, or asks about /api/v1/service/transfer endpoints.
  Requires appotapay-auth for the JWT and the signature.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com/firm-banking/introduction
---

# AppotaPay firm banking (interbank transfer out)

Base URL: `https://gateway.dev.appotapay.com` (sandbox) / `https://gateway.appotapay.com` (production).
Headers: `X-APPOTAPAY-AUTH: Bearer JWT_TOKEN`, `Content-Type: application/json`, optional `Language`.

> **This moves real money out.** Every request is signed, every response is signed, and a transfer
> can land in a non-final state. Read the status section before shipping.

> **Verify against live docs.** `node skills/appotapay/scripts/fetch-doc.mjs firm-banking/security`.

## Endpoints

| Task | Endpoint |
|---|---|
| Beneficiary account lookup | `POST /api/v1/service/transfer/bank/account/info` |
| Make a transfer | `POST /api/v1/service/transfer/make` |
| Transaction status | `GET /api/v1/service/transfer/transaction/{partnerRefId}` |

Always call the lookup first and show the returned `accountName` to the operator for confirmation —
a wrong `accountNo` is not recoverable once the transfer settles.

## Transfer — `POST /api/v1/service/transfer/make`

```json
{
  "bankCode": "TPBANK",
  "accountNo": "132100132400000",
  "accountType": "account",
  "accountName": "NGUYEN VAN A",
  "amount": 50000,
  "feeType": "payer",
  "partnerRefId": "Partner9999",
  "message": "ck tien",
  "customerPhoneNumber": "0374720460",
  "contractNumber": "1234567",
  "channel": "citad",
  "bankId": "11223344",
  "signature": "<hmac>"
}
```

Signature (**family A**) over twelve fields, sorted: `accountName`, `accountNo`, `accountType`,
`amount`, `bankCode`, `bankId`, `channel`, `contractNumber`, `customerPhoneNumber`, `feeType`,
`message`, `partnerRefId`.

- `accountType`: `account` | `card`
- `channel`: e.g. `citad` — see `references/docs/firm-banking-citad-codes.md`
- `partnerRefId` must be **unique**; it is the key you use for status lookups and the only handle
  you have on a transfer whose response you never received.

**Response signature**: `amount` + `appotapayTransId` + `errorCode` + `time` + `transferAmount`.
Verify it before recording the transfer as sent.

## Non-final results — the part that matters

A transfer can come back pending. When it later settles, AppotaPay calls your configured URL with a
callback signed over: `amount`, `appotapayTransId`, `errorCode`, `partnerRefId`, `time`,
`transferAmount`, `transferStatus`.

Rules:

- **Never retry a transfer on a timeout or an unclear error.** Query
  `GET /api/v1/service/transfer/transaction/{partnerRefId}` first — a retry with a fresh
  `partnerRefId` can double-pay.
- Treat `transferStatus` from the callback (or the status API) as the only truth about settlement.
- Status-API response is signed over `amount` + `appotapayTransId` + `errorCode` + `time` +
  `transferAmount`.

Page: `references/docs/firm-banking-process-result.md`.

## References

- `references/docs/firm-banking-security.md` — all four signature schemes with examples.
- `references/docs/firm-banking-bank-code.md`, `-citad-codes.md` — bank and CITAD code tables.
- `references/docs/firm-banking-error-code.md` — error codes.
