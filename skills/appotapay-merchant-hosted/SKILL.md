---
name: appotapay-merchant-hosted
description: >-
  Accept AppotaPay payments with DOMESTIC card / bank account details collected on your own page
  (merchant-hosted model, thanh toán thẻ nội địa / tài khoản ngân hàng). Use when the user does not
  want to redirect to AppotaPay's hosted checkout but instead posts cardNumber / account details from
  their own checkout form, then handles the bank verification redirect and the IPN. Requires
  appotapay-auth for the JWT.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com/merchant-hosted/introduction
---

# AppotaPay merchant-hosted (domestic card / bank account)

The customer enters card or account details **on your page**; you post them server-to-server and
AppotaPay returns a verification URL to show the customer.

Base URL: `https://gateway.dev.appotapay.com` (sandbox) / `https://gateway.appotapay.com` (production).
JWT on every request — see **appotapay-auth**.

> **PCI scope warning.** Handling raw PAN/account data on your servers puts you in PCI-DSS scope.
> If you do not need it, use the hosted checkout instead (**appotapay-payment**) — AppotaPay collects
> the card and you never touch it. For **international** cards (Visa/Master with 3DS), use
> **appotapay-credit-card**.

> **Verify against live docs.** `references/docs/*.md` may lag.
> `node skills/appotapay/scripts/fetch-doc.mjs merchant-hosted/payment`.

## Flow

```
1. Customer enters card/account on YOUR page
2. You call    POST /api/v2/orders/create-payment   (card or account in sourceOfFunds)
3. AppotaPay   creates the transaction with the bank/provider
   - init failed  → result returned directly, show it
   - init ok      → response carries a redirect/verification URL
4. You show     that URL (embed or redirect) so the customer authenticates (OTP …)
5. IPN (POST)  → your notifyUrl gets { data, signature, time } — VERIFY, then mark the order
6. Reconcile   → GET /api/v2/orders/transaction before fulfilling
```

## Create payment — `POST /api/v2/orders/create-payment`

Headers: `X-APPOTAPAY-AUTH`, `Content-Type: application/json`; optional `X-Request-ID`,
`X-Language`, `X-Account-Ref-ID`.

Body shape (full field table: `references/docs/merchant-hosted-payment.md`):

```json
{
  "transaction": {
    "amount": 10000,
    "currency": "VND",
    "bankCode": "VCB",
    "paymentMethod": "ATM",
    "action": "PAY"
  },
  "sourceOfFunds": {
    "type": "card",
    "card": {
      "cardNumber": "...",
      "cardHolderName": "NGUYEN VAN A",
      "cardMonth": "03",
      "cardYear": "25"
    }
  },
  "partnerReference": {
    "order": { "id": "...", "info": "...", "extraData": "" },
    "notificationConfig": {
      "notifyUrl": "https://your.site/ipn",
      "redirectUrl": "https://your.site/redirect"
    }
  }
}
```

- `sourceOfFunds.type` is `card` or `account`; the matching object is required.
- `transaction.bankCode` is **required** here (unlike hosted checkout) — bank codes are in
  `../appotapay-payment/references/docs/payment-code.md`.
- `cardMonth` / `cardYear` mean *issue* or *expiry* depending on the bank — check the per-bank table
  linked from the doc page before validating the form.

## IPN and status

Identical to the hosted flow: verify `HMAC_SHA256(data, SECRET_KEY)` on the **raw** `data`, reply
`{"status":"ok"}`, stay idempotent, then confirm with `GET /api/v2/orders/transaction` before
fulfilling. Reuse `../appotapay-payment/scripts/verify-ipn.*`.

Refunds, status, transaction listing and the code tables are all the same endpoints as
**appotapay-payment** — load that skill for them.

## References

- `references/docs/merchant-hosted-introduction.md` — the step-by-step model.
- `references/docs/merchant-hosted-payment.md` — full request/response fields.
- `references/docs/merchant-hosted-checkout_page.md`, `references/docs/merchant-hosted-merchant_hosted.md`.
