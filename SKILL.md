---
name: appotapay-suite
description: >-
  Full AppotaPay integration suite — the single entry skill that bundles and routes to EVERY
  AppotaPay skill at once (the router, auth, and payment). Install this to get the complete
  AppotaPay toolkit in one step. Use when you want to integrate the AppotaPay payment gateway
  (Vietnamese fintech, docs.appotapay.com): build the X-APPOTAPAY-AUTH JWT, sign requests, create
  a payment/checkout, handle IPN/redirect callbacks, verify signatures, check transaction status,
  or issue refunds.
license: MIT
metadata:
  version: "0.1.0"
  source: https://docs.appotapay.com
---

# AppotaPay integration suite — install-all entry skill

This is the **top-level bundle**. Installing it brings the whole AppotaPay skill set; you do not
need to pick individual skills. It does no work itself — it points you at the right sub-skill.

## What's bundled

| Sub-skill | What it does | Details |
|-----------|--------------|---------|
| **appotapay** (router) | Overview, credentials, base URLs (sandbox/prod), live-docs mechanism, and the routing decision | `skills/appotapay/SKILL.md` |
| **appotapay-auth** | Build the `X-APPOTAPAY-AUTH` HS256 JWT (`iss/jti/api_key/exp`) and sign request params (HMAC-SHA256) | `skills/appotapay-auth/SKILL.md` |
| **appotapay-payment** | Create payment → checkout → **verify IPN/redirect** → check status → refund | `skills/appotapay-payment/SKILL.md` |

## Routing — which sub-skill to load

| The user wants to… | Load this skill |
|--------------------|-----------------|
| Build/refresh the `X-APPOTAPAY-AUTH` JWT, or sign request params | **appotapay-auth** |
| Accept a payment, create an order/checkout, handle IPN/redirect, refund, check status | **appotapay-payment** |
| Understand the overall flow, credentials, base URLs | **appotapay** (router) |

Almost every flow needs **appotapay-auth** first (the JWT is on every request), then a product skill.
For the standard "accept a payment" task, load **appotapay-auth** + **appotapay-payment** together.

## Source of truth — fetch the LIVE docs first

The bundled `references/*.md` are an **offline snapshot and may lag**. Before finalizing endpoints,
fields, codes, or base URLs in generated code, fetch the live doc and reconcile — if they disagree,
the **live doc wins**. Index of every page: `https://docs.appotapay.com/llms.txt`. Full guide:
`skills/appotapay/references/live-docs.md`.

## Golden rules

1. **JWT on every request** (see appotapay-auth).
2. **Always verify the IPN/redirect `signature`** = `HMAC_SHA256(data, SECRET_KEY)` before trusting a result.
3. **Re-check status via the API** before fulfilling an order — never trust the redirect alone.
4. **Amounts are integers in VND** (no decimals); `currency` is `"VND"`.
5. Keep `SECRET_KEY` server-side only.

> Future product areas (e-wallet, subscription, virtual-account, firm-banking, bill payment,
> buy-card, charging-card, mobile-topup, credit-card, merchant-hosted, POS) follow the same
> auth + signature model and will be added here over time.
