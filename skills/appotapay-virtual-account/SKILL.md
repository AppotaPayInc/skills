---
name: appotapay-virtual-account
description: >-
  Collect money by bank transfer into an AppotaPay virtual account (thu hộ qua tài khoản ảo / ebill):
  create a collection bill and get the bank account numbers to show the payer, read bill detail, list
  bill transactions, close the account, and verify the IPN when money arrives. Use when the user wants
  bank-transfer collection, VA, virtual account, ebill, or asks about /api/v1/service/ebill endpoints.
  Requires appotapay-auth for the JWT and the signature.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com/virtual-account/introduction
---

# AppotaPay virtual account (bank-transfer collection)

You create a *bill*; AppotaPay returns one or more **virtual bank accounts**. Show them (or a QR) to
the payer. When a transfer lands, AppotaPay calls your IPN.

Base URL: `https://gateway.dev.appotapay.com` (sandbox) / `https://gateway.appotapay.com` (production).
Headers: `X-APPOTAPAY-AUTH: Bearer JWT_TOKEN`, `Content-Type: application/json`, optional `Language`.

> **Verify against live docs.** `node skills/appotapay/scripts/fetch-doc.mjs virtual-account/security`
> for the signature rules — they are the thing that breaks integrations.

## Endpoints

| Task | Endpoint |
|---|---|
| Create collection bill | `POST /api/v1/service/ebill/create` |
| Bill detail | `GET /api/v1/service/ebill/detail/{billCode}` |
| List transactions | `GET /api/v1/service/ebill/transactions` |
| Transactions of one bill | `GET /api/v1/service/ebill/{billCode}/transactions` |
| Close the account | `POST /api/v1/service/ebill/close` |

## Create a bill — `POST /api/v1/service/ebill/create`

```json
{
  "billCode": "60586f8d6a684",
  "billInfo": "Thanh toán hóa đơn",
  "serviceCode": "GAME",
  "customerName": "NGUYEN VAN A",
  "notifyUrl": "https://yourdomain.com/ipn",
  "amount": 50000,
  "billExpiryTime": 1616818154,
  "paymentCondition": "NO",
  "bankCode": "WOORIBANK",
  "signature": "<hmac>"
}
```

Signature (**family A**) over these nine fields, sorted:
`amount`, `bankCode`, `billCode`, `billExpiryTime`, `billInfo`, `customerName`, `notifyUrl`,
`paymentCondition`, `serviceCode`.

The response returns `payment.bankAccounts[]` — `bankCode`, `bankName`, `accountNo`, `accountName`.
Display those to the payer; the transfer memo is matched automatically.

**Response signature** is over `billCode` + `errorCode` + `payment`, where `payment` is the
**`json_encode`d object**, not a scalar:

```
billCode=...&errorCode=0&payment={"bankAccounts":[{...}]}
```
Serialize it exactly as received (key order matters) or the check fails. Bank codes:
`references/docs/virtual-account-bank-code.md`.

## IPN — verify before crediting

AppotaPay POSTs to your `notifyUrl` when a transfer arrives. Signature (**family A**) over thirteen
fields, sorted:

`amount`, `apiKey`, `bankAccountName`, `bankAccountNumber`, `bankCode`, `billCode`, `extraData`,
`memo`, `partnerCode`, `requestTime`, `transactionId`, `transactionTime`, `version`

Recompute, compare constant-time, then credit. Partial and repeat transfers happen on a virtual
account — key your ledger on `transactionId` and make the handler **idempotent**. Compare the
received `amount` against the bill before treating it as paid in full;
`paymentCondition` decides whether under/over payment is accepted.

Page: `references/docs/virtual-account-ipn.md`.

## Closing

`POST /api/v1/service/ebill/close` with `accountNo`, `billCode`, `partnerRefId` (signed over those
three). Close accounts you no longer expect money on — an open virtual account keeps accepting
transfers.

## References

- `references/docs/virtual-account-introduction.md` — the model.
- `references/docs/virtual-account-security.md` — every signature, with worked examples.
- `references/docs/virtual-account-error-code.md` — error codes.
