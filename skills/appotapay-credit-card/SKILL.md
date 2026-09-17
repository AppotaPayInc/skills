---
name: appotapay-credit-card
description: >-
  Charge INTERNATIONAL credit/debit cards (Visa, Mastercard) through AppotaPay's merchant-hosted
  credit card APIs: tokenize a card, run 3DS enrollment and validation, authorize and capture a
  charge, reverse an authorization, refund, and read charge/refund/reversal details. Use when the
  user integrates thanh toán thẻ quốc tế, 3DS/OTP card authentication, card tokens, auth-then-capture,
  or asks about /credit-card endpoints. Requires appotapay-auth for the JWT.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com/cc-merchant-host/introduction
---

# AppotaPay credit card (merchant-hosted, international)

The customer enters card details **on your page**; you tokenize server-to-server, run 3DS if needed,
then authorize and capture.

Base URL: `https://gateway.dev.appotapay.com` (sandbox) / `https://gateway.appotapay.com` (production).
JWT on every request — see **appotapay-auth**.

> **PCI scope.** Card number + CVV pass through your servers. If that is not acceptable, use the
> hosted checkout (**appotapay-payment**) instead. Never log PAN or CVV, never persist them —
> persist the returned `tokenId`.

> **Verify against live docs.** `node skills/appotapay/scripts/fetch-doc.mjs cc-merchant-host/charge-create`
> (and the other pages below). `references/docs/*.md` may lag.

## Endpoints

| Task | Endpoint |
|---|---|
| Create token from card | `POST /credit-card/token` |
| Delete token | `DELETE /credit-card/token/:tokenId` |
| 3DS enrollment check | `POST /credit-card/enrollment` |
| 3DS validate | `POST /credit-card/enrollment/validate/:authenticationId` |
| Create charge (authorize ± capture) | `POST /credit-card/charge` |
| Capture an authorization | `POST /credit-card/:authorizationId/capture` |
| Get charge | `GET /credit-card/charge/:creditCardRefId` |
| Reverse an authorization | `POST /credit-card/reversal` |
| Get reversal | `GET /credit-card/reversal/:creditCardReversalId` |
| Create refund | `POST /credit-card/refund` |
| Get refund | `GET /credit-card/refund/:creditCardRefundId` |
| Error code list | `GET /credit-card/error-code/list` |

Headers: `X-APPOTAPAY-AUTH`, `Content-Type: application/json`; optional `X-Request-ID`,
`Language` (note: `Language`, not `X-Language`, on these pages), `X-Account-Ref-ID`.

## Flow

```
1. Customer enters card on your page
2. POST /credit-card/token            → tokenId  (tokenType SINGLE | MULTIPLE)
3. 3DS required?
   yes → POST /credit-card/enrollment → may return a redirect URL + deviceDataCollectionUrl
         show it to the customer (OTP / challenge), then
         POST /credit-card/enrollment/validate/:authenticationId → authenticationId
   no  → skip to 4
4. POST /credit-card/charge           { tokenId | card, amount, currency, merchantRefId,
                                        capture: true|false, authenticationId? }
5. capture=false → money is only HELD (authorization, valid 7 days)
                   POST /credit-card/:authorizationId/capture to settle
                   POST /credit-card/reversal to release it
6. Refund after capture → POST /credit-card/refund
```

- `capture: true` authorizes **and** captures in one call; `false` authorizes only.
- An **authorization expires after 7 days** — capture or reverse before then.
- `authenticationId` is required when your account is configured with mandatory 3DS.
- If the card does not support 3DS, AppotaPay recommends **stopping the transaction** rather than
  falling back to non-3DS.
- `merchantRefId` is your idempotency/reference key (1–40 chars) — make it unique per request.
- `billing.*` and `customer.browser.*` are optional but materially improve frictionless 3DS 2.0
  approval rates; if you send the block, send **every** field in it.

## Testing

`references/docs/cc-merchant-host-test-scenarios.md` lists the sandbox cards and the scenario each
one triggers (success, 3DS challenge, decline …). Error codes:
`references/docs/cc-merchant-host-error-code.md` and `-error-code-api.md`.

## References

- `references/docs/cc-merchant-host-introduction.md` — the full 20-step model.
- One page per endpoint under `references/docs/cc-merchant-host-*.md`.
