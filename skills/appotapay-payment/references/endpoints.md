# AppotaPay payment endpoints — full field reference

Source: https://docs.appotapay.com/payment/. Base URL: sandbox `https://gateway.dev.appotapay.com`,
production `https://gateway.appotapay.com`. All requests require the `X-APPOTAPAY-AUTH` JWT.

---

## Create payment — `POST /api/v2/orders/payment`

### Headers
| Header             | Required | Notes |
|--------------------|----------|-------|
| `X-APPOTAPAY-AUTH` | yes      | JWT (see appotapay-auth) |
| `Content-Type`     | yes      | `application/json` |
| `X-Request-ID`     | no       | UUIDv4, max ~42 chars |
| `X-Language`       | no       | `vi` or `en` (checkout page language; default `vi`) |
| `X-Account-Ref-ID` | no       | required only for owner-type sub-account transactions |

### Request body
| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `transaction` | yes | object | |
| `transaction.amount` | yes | integer | VND, min 1000, max 500,000,000 |
| `transaction.currency` | yes | string | `VND` |
| `transaction.bankCode` | no | string | see codes.md (bank code) |
| `transaction.paymentMethod` | yes | string | `ATM`/`CC`/`EWALLET`/`VA`/`MM`/`ISTM`/`ALL` |
| `transaction.action` | yes | string | `PAY`, `PAY_WITH_RETURN_TOKEN`, `PAY_WITH_TOKEN` |
| `transaction.token` | no | string | required when `action = PAY_WITH_TOKEN` |
| `partnerReference` | yes | object | |
| `partnerReference.order.id` | yes | string | your order id, max 50 |
| `partnerReference.order.info` | yes | string | max 150 |
| `partnerReference.order.extraData` | no | string | max 200 |
| `partnerReference.notificationConfig.notifyUrl` | yes | string | IPN endpoint (HTTPS), max 500 |
| `partnerReference.notificationConfig.redirectUrl` | yes | string | browser return URL, max 500 |
| `partnerReference.notificationConfig.deeplinkUrl` | no | string | open mobile app |
| `partnerReference.notificationConfig.installmentNotifyUrl` | no | string | installment IPN |

### Response (200)
Key fields: `transaction.transactionId`, `transaction.status` (`pending`), `transaction.errorCode`,
`transaction.partnerCode`, `transaction.orderAmount`, `transaction.bankCode`,
`transaction.paymentMethod`, `transaction.action`, `transaction.createdAt`/`updatedAt` (RFC-3339),
`payment.url` (hosted checkout), `payment.qrCode.{url,content,expiry}` (when QR), `payment.deepLinkUrl`.

```json
{
  "transaction": { "transactionId": "AP123", "status": "pending", "errorCode": 35, "orderAmount": 10000,
    "currency": "VND", "bankCode": "VCB", "paymentMethod": "ATM", "action": "PAY" },
  "payment": { "url": "https://payment.dev.appotapay.com/v2/bank/payment/process?tran=...&sign=...&lang=vi",
    "qrCode": null, "deepLinkUrl": "" }
}
```

### Errors (HTTP != 200)
`{ "errorCode": int, "message": string, "errors": [{ "field", "reason" }] }`

| errorCode | Meaning |
|-----------|---------|
| 1 | Missing/invalid params |
| 30 | Duplicate order id |
| 32 | Invalid amount |
| 140 | Partner not allowed to use this `paymentMethod` |
| 141 | Partner not allowed to use this `bankCode` |
| 500 | System error, retry later |

---

## Get transaction status — `GET /api/v2/orders/transaction`

Query params:
| Param | Required | Notes |
|-------|----------|-------|
| `referenceId` | yes | the id to look up (alphanumeric) |
| `type` | no | `TRANSACTION_ID` (default, AppotaPay id) or `PARTNER_ORDER_ID` (your order id) |

Response includes `transaction.status` (`pending`/`processing`/`success`/`error`),
`transaction.reconciliationId`, amounts, `partnerReference.order`, and optionally `tokenInfo`,
`cardInfo`, `installmentInfo`, `promotionInfo`. Errors: `1` invalid params, `36` transaction not found,
`500` system error.

---

## Refund — `POST /api/v2/transaction/refund`

Body:
| Field | Required | Notes |
|-------|----------|-------|
| `partnerRefId` | yes | unique, max 50, alphanumeric |
| `transactionId` | yes | the AppotaPay transaction id to refund |
| `amount` | yes | integer, min 1000 |
| `currency` | yes | `VND` |
| `reason` | yes | max 100 |

Response: `refundId`, `transactionId`, `partnerRefId`, `amount`, `currency`, `reason`,
`status` (`pending`/`processing`/`success`/`error`), `createdAt`, `refundedAt`.
Errors: `1`, `31` duplicate id, `36` not found, `129` wait before new refund, `135` refund not supported,
`401` unauthorized, `500`.

### Provider refund support (summary)
Auto-refund via API supported by e.g. Napas, VPBank Visa/Master, VnptPay, Shopee, MOCA, Appota Wallet,
ZaloPay, VNPay. NOT auto: VA, Cybersource. Partial/multiple-refund support varies by provider — confirm
per provider before relying on it.
