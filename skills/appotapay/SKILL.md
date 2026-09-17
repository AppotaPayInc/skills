---
name: appotapay
description: >-
  Router skill for integrating the AppotaPay platform (Vietnamese fintech, docs.appotapay.com).
  Use when the user wants to integrate AppotaPay in any form: accept online payments (hosted checkout or
  merchant-hosted), international credit card with 3DS, e-wallet account linking, recurring/subscription
  billing, virtual-account bank collection, interbank transfer (firm banking), bill payment, mobile topup,
  buy card codes, charging card, or POS. It explains credentials, JWT auth, base URLs, the two signature
  families, and routes to the correct sub-skill.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com
---

# AppotaPay integration — start here

AppotaPay is a Vietnamese payment platform. Partners call REST APIs (JSON) authenticated with a JWT
in the `X-APPOTAPAY-AUTH` header. This router tells you which sub-skill to load.

## Source of truth — check the LIVE docs

`references/docs/*.md` in every skill are an **offline snapshot** generated from
https://docs.appotapay.com and **may lag**. Before finalizing endpoints, fields, codes, or base URLs
in generated code, fetch the live page and reconcile — **if they disagree, the live doc wins**.

```bash
node skills/appotapay/scripts/fetch-doc.mjs index            # every doc path (from sitemap.xml)
node skills/appotapay/scripts/fetch-doc.mjs index subscription   # filter
node skills/appotapay/scripts/fetch-doc.mjs payment/signature    # one page, as Markdown
```
Full mechanism: **`references/live-docs.md`**. The docs site has **no** `llms.txt` / API export —
pages are discovered through `sitemap.xml` and converted from HTML.

## Decision: which sub-skill to load

| The user wants to… | Load |
|---|---|
| Build/refresh the `X-APPOTAPAY-AUTH` JWT, or sign request params / verify a callback signature | **appotapay-auth** |
| Accept a payment on AppotaPay's **hosted checkout** (ATM/card/e-wallet/QR), IPN, status, refund | **appotapay-payment** |
| Collect **domestic** card/account details **on their own page** (merchant-hosted) | **appotapay-merchant-hosted** |
| Charge an **international** card (Visa/Master) with 3DS, tokens, capture, reversal | **appotapay-credit-card** |
| Link an **AppotaPay e-wallet** account (OAuth2) and pay from the wallet balance | **appotapay-ewallet** |
| **Recurring billing** — plans, customers, payment methods, cycles, subscription refunds | **appotapay-subscription** |
| Collect via **bank transfer to a virtual account** (thu hộ / ebill) | **appotapay-virtual-account** |
| **Transfer money** to a bank account/card (chuyển tiền liên ngân hàng) | **appotapay-firm-banking** |
| Pay **utility bills** (điện, nước, internet…) | **appotapay-bill** |
| **Top up** phone airtime or data packages | **appotapay-mobile-topup** |
| **Buy card codes** (mã thẻ game/điện thoại) | **appotapay-buy-card** |
| **Charge a scratch card** (gạch thẻ cào) | **appotapay-charging-card** |
| Take payments from a **POS** terminal | **appotapay-pos** |

Every flow needs **appotapay-auth** first — the JWT is on every request.

## Credentials (from the AppotaPay Partner portal)

Register at https://partner.appotapay.com and create an application to get three secrets:

- `PARTNER_CODE` — your partner identifier (JWT `iss`)
- `API_KEY` — public key (JWT `api_key`, and part of `jti`)
- `SECRET_KEY` — secret; signs the JWT **and** signs/verifies request + callback signatures. Never expose client-side.

Store as env vars (`APPOTAPAY_PARTNER_CODE`, `APPOTAPAY_API_KEY`, `APPOTAPAY_SECRET_KEY`).
Never hard-code or commit secrets.

## Base URLs — they differ per product

| Product area | Sandbox | Production |
|---|---|---|
| Payment, merchant-hosted, credit card, subscription, bill, topup, buy-card, charging-card, firm-banking, virtual-account | `https://gateway.dev.appotapay.com` | `https://gateway.appotapay.com` |
| E-wallet **OAuth** (login form, access/refresh token, account info, unlink) | `https://ewallet.dev.appotapay.com` | `https://ewallet.appotapay.com` |
| POS | `https://pos-gw.dev.appotapay.com` | `https://pos-gw.appotapay.com` |

> `https://acpg.dev.appotapay.com` is **not** an API base — it is the host AppotaPay returns inside
> 3DS / subscription authentication redirect URLs. Follow the URL as returned; never build it yourself.

Confirm production hosts and your account's IP allow-list with AppotaPay before going live.

### Sandbox test credentials (payment gateway)

```
PARTNER_CODE = APPOTAPAY
API_KEY      = FJcmF8uj2ISveL5FvvNk4pnp8xrhINz8
SECRET_KEY   = XAonJgy14YhtePEITXhyBS2unjfJLAV3
```
Other areas have their own sandbox accounts — see each skill's `references/docs/`.

## Two signature families (do not mix them up)

1. **v2 gateway (`/api/v2/...`, `/credit-card/...`)** — the callback carries `{ data, signature, time }`
   and `signature = HMAC_SHA256(data, SECRET_KEY)` over the raw `data` string.
2. **v1 services (`/api/v1/service/...`, e-wallet payment)** — a `signature` field over a
   **named subset** of fields, sorted alphabetically and joined `key=value&…`. The field list differs
   per endpoint and per direction (request vs response).

Details and worked examples: **appotapay-auth**.

## Golden rules

1. **JWT on every request** — server-side, short `exp`, unique `jti`.
2. **Always verify the callback/IPN signature** before trusting a result; compare constant-time.
3. **Re-check status via the API** before fulfilling an order — never trust a browser redirect alone.
4. **Amounts are integers in VND** (no decimals); `currency` is `"VND"`.
5. Keep `SECRET_KEY` server-side only.

## Shared references

- `references/live-docs.md` — how to fetch the live docs, URL scheme, sync tooling.
- `references/docs/errors.md` — HTTP status codes + common error codes across all APIs.
- `references/docs/partner-account-balance.md` — `GET /api/v1/service/accounts/balance`.
