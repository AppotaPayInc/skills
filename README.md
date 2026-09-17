# AppotaPay Skills

Agent Skills that teach AI coding agents (Claude Code, Cursor, Copilot, and any
[Agent Skills](https://agentskills.io)–compatible tool) how to integrate the
**[AppotaPay](https://docs.appotapay.com) payment platform** the standard, correct way.

Coverage is the **whole documented platform** — every product area on docs.appotapay.com, not just
the payment gateway.

Install once, then ask your agent *"integrate AppotaPay payments"* (or *"tích hợp thanh toán
AppotaPay"*, *"làm thanh toán định kỳ AppotaPay"*, *"gạch thẻ AppotaPay"*, …) and it will follow the
official flow for that product.

## What's inside

| Skill | Purpose |
|---|---|
| `appotapay-suite` | **Install-all entry** (root `SKILL.md`) — bundles and routes to every skill below |
| `appotapay` | Router — credentials, base URLs per product, signature families, live-docs mechanism |
| `appotapay-auth` | HS256 JWT (`X-APPOTAPAY-AUTH`) + all five signature schemes. Scripts: Node / Python / PHP |
| `appotapay-payment` | Hosted checkout → IPN/redirect → status → refund → installment IPN. Scripts: Node / Python / PHP |
| `appotapay-merchant-hosted` | Domestic card / bank account collected on **your** page |
| `appotapay-credit-card` | International cards: token, 3DS, authorize, capture, reverse, refund |
| `appotapay-ewallet` | Wallet OAuth2 linking + wallet/APoint payment |
| `appotapay-subscription` | Recurring billing: customers, payment methods, plans, cycles, callbacks |
| `appotapay-virtual-account` | Bank-transfer collection (thu hộ / ebill) + IPN |
| `appotapay-firm-banking` | Interbank transfer out, beneficiary lookup, pending results |
| `appotapay-bill` | Utility bill check → pay → status |
| `appotapay-mobile-topup` | Airtime & data topup, product codes, subscriber info |
| `appotapay-buy-card` | Buy prepaid card codes |
| `appotapay-charging-card` | Scratch-card redemption (own SHA-256 + AES-128 scheme) |
| `appotapay-pos` | POS/QR terminal payments (own host + `X-Signature`) |

Each skill is a `SKILL.md` (kept short for fast loading) that routes to `references/` for full field
tables and `scripts/` for runnable, dependency-light helpers. Every skill also ships
`references/docs/` — a verbatim Markdown snapshot of the live documentation pages for its area.

## Install

### Claude Code (plugin marketplace)
```
/plugin marketplace add AppotaPayInc/skills
/plugin install appotapay@appotapay-skills
```

### Any agent (Agent Skills CLI)
```
npx skills add https://github.com/AppotaPayInc/skills
```
The root `appotapay-suite` skill is the entry point, so this pulls **all** skills at once.

### Manual
Copy the folders under `skills/` into your agent's skills directory, e.g. `~/.claude/skills/`
(Claude Code) or `~/.cursor/skills/` (Cursor), or a project's `.claude/skills/`.

## Usage

The skills trigger automatically when you describe an AppotaPay task. You can also invoke one
explicitly in Claude Code, e.g. `/appotapay:appotapay-subscription`.

The agent will ask for / read these environment variables (never hard-code secrets):
```
APPOTAPAY_PARTNER_CODE
APPOTAPAY_API_KEY
APPOTAPAY_SECRET_KEY     # server-side only — signs the JWT, signs requests, verifies callbacks
```
Sandbox test credentials are in `skills/appotapay-payment/references/sandbox.md`; other product areas
have their own sandbox accounts, documented in each skill's `references/docs/`.

## Base URLs differ per product

| Product area | Sandbox | Production |
|---|---|---|
| Payment, merchant-hosted, credit card, subscription, bill, topup, buy-card, charging-card, firm-banking, virtual-account | `gateway.dev.appotapay.com` | `gateway.appotapay.com` |
| E-wallet OAuth | `ewallet.dev.appotapay.com` | `ewallet.appotapay.com` |
| POS | `pos-gw.dev.appotapay.com` | `pos-gw.appotapay.com` |

## Security notes baked into the skills

- JWT is built **server-side**, short-lived, with a unique `jti`.
- Callbacks are **always** verified before being trusted, with a constant-time comparison.
- Order fulfillment is gated on the **status API = success** + amount match, with **idempotent** IPN handling.
- Money-moving calls are **never retried blind** on a timeout — status is queried by `partnerRefId` first.
- PCI scope is called out wherever raw card data would pass through your servers.

## Staying in sync with the docs (no stale data)

The skills do **not** rely only on a frozen copy of the API. Each `SKILL.md` instructs the agent to
**fetch the live page and reconcile before generating code** — if the live doc and the bundled
snapshot disagree, the live doc wins.

`docs.appotapay.com` is a Docusaurus site with **no** `llms.txt` and **no** OpenAPI export, so pages
are discovered through `sitemap.xml` and converted from HTML by a bundled, dependency-free helper:

```bash
node skills/appotapay/scripts/fetch-doc.mjs index                 # every doc path
node skills/appotapay/scripts/fetch-doc.mjs index subscription    # filter
node skills/appotapay/scripts/fetch-doc.mjs payment/signature     # one page, as Markdown
```

Maintainers refresh the whole offline snapshot with:

```bash
node skills/appotapay/scripts/sync-references.mjs              # current version (146 pages)
node skills/appotapay/scripts/sync-references.mjs --archived   # also 1.1/ and 1.0/
```
It rewrites every `references/docs/` directory and reports any page whose path has no owning skill.
Mechanism and URL scheme: `skills/appotapay/references/live-docs.md`.

## Source of truth

All content is derived from the official docs at **https://docs.appotapay.com**. When the docs and a
skill disagree, the docs win — please open an issue/PR.

## License

MIT.
