---
name: appotapay-suite
description: >-
  Full AppotaPay integration suite — the single entry skill that bundles and routes to EVERY AppotaPay
  skill at once. Install this to get the complete toolkit in one step. Use when you want to integrate
  the AppotaPay payment platform (Vietnamese fintech, docs.appotapay.com): JWT auth and request
  signatures, hosted checkout, merchant-hosted domestic cards, international credit cards with 3DS,
  e-wallet linking, subscription/recurring billing, virtual-account bank collection, interbank
  transfers, bill payment, mobile topup, buy card codes, charging cards, and POS.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com
---

# AppotaPay integration suite — install-all entry skill

This is the **top-level bundle**. Installing it brings the whole AppotaPay skill set; you do not need
to pick individual skills. It does no work itself — it points you at the right sub-skill.

Coverage: every product area currently documented at https://docs.appotapay.com.

## What's bundled

| Sub-skill | What it does |
|---|---|
| **appotapay** (router) | Overview, credentials, base URLs per product, the signature families, live-docs mechanism, routing |
| **appotapay-auth** | `X-APPOTAPAY-AUTH` HS256 JWT (`iss/jti/api_key/exp`) + all five signature schemes |
| **appotapay-payment** | Hosted checkout: create payment → IPN/redirect → status → refund → installment IPN |
| **appotapay-merchant-hosted** | Domestic card/account collected on **your** page (`/api/v2/orders/create-payment`) |
| **appotapay-credit-card** | International cards: tokenize, 3DS enroll/validate, authorize, capture, reverse, refund |
| **appotapay-ewallet** | OAuth2 wallet linking + wallet/APoint payment, confirm, cancel, unlink |
| **appotapay-subscription** | Recurring billing: customers, payment methods, plans, cycles, refunds, callbacks |
| **appotapay-virtual-account** | Bank-transfer collection (thu hộ / ebill) + IPN |
| **appotapay-firm-banking** | Interbank transfer out, account lookup, pending-result callback |
| **appotapay-bill** | Utility bill check → pay → status |
| **appotapay-mobile-topup** | Airtime and data topup, product codes, subscriber info |
| **appotapay-buy-card** | Buy prepaid card codes |
| **appotapay-charging-card** | Scratch-card redemption (own SHA-256 + AES-128 scheme) |
| **appotapay-pos** | POS/QR terminal payments (own host + `X-Signature` header) |

## Routing

| The user wants to… | Load |
|---|---|
| Build the JWT, sign params, verify a callback | **appotapay-auth** (needed by everything) |
| Redirect to AppotaPay's checkout page | **appotapay-payment** |
| Collect **domestic** card/account on their own page | **appotapay-merchant-hosted** |
| Charge an **international** card, 3DS, auth+capture | **appotapay-credit-card** |
| Link an AppotaPay wallet, pay from wallet balance | **appotapay-ewallet** |
| Charge on a recurring schedule | **appotapay-subscription** |
| Get paid by bank transfer to a virtual account | **appotapay-virtual-account** |
| Pay money **out** to a bank account | **appotapay-firm-banking** |
| Pay utility bills | **appotapay-bill** |
| Top up airtime/data | **appotapay-mobile-topup** |
| Sell card codes | **appotapay-buy-card** |
| Redeem scratch cards | **appotapay-charging-card** |
| Take payment on a terminal | **appotapay-pos** |

For the standard "accept a payment" task, load **appotapay-auth** + **appotapay-payment**.

## Source of truth — check the LIVE docs

The bundled `references/docs/*.md` are an **offline snapshot and may lag**. Before finalizing
endpoints, fields, codes, or base URLs in generated code, fetch the live page and reconcile — the
**live doc wins**.

```bash
node skills/appotapay/scripts/fetch-doc.mjs index          # every doc path (via sitemap.xml)
node skills/appotapay/scripts/fetch-doc.mjs payment/signature
```
The docs site has **no** `llms.txt` / OpenAPI export. Full guide:
`skills/appotapay/references/live-docs.md`.

## Golden rules

1. **JWT on every request** — server-side, short `exp`, unique `jti` (appotapay-auth).
2. **Always verify the callback/IPN signature** before trusting a result; compare constant-time.
3. **Re-check status via the API** before fulfilling — never trust a browser redirect alone.
4. **Never retry a money-moving call on a timeout** — query status by your `partnerRefId` first.
   Reuse that id; a fresh one can double-charge or double-pay.
5. **Amounts are integers in VND** (no decimals); `currency` is `"VND"`.
6. Keep `SECRET_KEY` server-side only.
