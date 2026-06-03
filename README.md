# AppotaPay Skills

Agent Skills that teach AI coding agents (Claude Code, Cursor, Copilot, and any
[Agent Skills](https://agentskills.io)–compatible tool) how to integrate the
**[AppotaPay](https://docs.appotapay.com) payment gateway** the standard, correct way.

Install once, then ask your agent *"integrate AppotaPay payments"* (or *"tích hợp thanh toán AppotaPay"*)
and it will follow the official flow: build the `X-APPOTAPAY-AUTH` JWT, create a payment, verify the
IPN/redirect signature, check status, and refund.

## What's inside

| Skill | Purpose |
|-------|---------|
| `appotapay` | Router — overview, credentials, base URLs, and which sub-skill to use |
| `appotapay-auth` | Build the HS256 JWT (`X-APPOTAPAY-AUTH`) and sign requests. Scripts: Node / Python / PHP |
| `appotapay-payment` | Create payment → checkout → **verify IPN/redirect** → status → refund. Scripts: Node / Python / PHP |

Each skill is a `SKILL.md` (kept short for fast loading) that routes to `references/` for full field
tables and `scripts/` for runnable, dependency-light helpers. More product areas (e-wallet,
subscription, virtual-account, …) follow the same auth + signature model and will be added over time.

## Install

### Claude Code (plugin marketplace)
```
/plugin marketplace add appotapay-skills
/plugin install appotapay@appotapay-skills
```

### Any agent (Agent Skills CLI)
```
npx skills add https://github.com/appotapay/appotapay-skills
```

### Manual
Copy the folders under `skills/` into your agent's skills directory, e.g.
`~/.claude/skills/` (Claude Code) or `~/.cursor/skills/` (Cursor), or a project's `.claude/skills/`.

## Usage

After installing, the skills trigger automatically when you describe an AppotaPay task. You can also
invoke them explicitly in Claude Code, e.g. `/appotapay:appotapay-payment`.

The agent will ask for / read these environment variables (never hard-code secrets):
```
APPOTAPAY_PARTNER_CODE
APPOTAPAY_API_KEY
APPOTAPAY_SECRET_KEY     # server-side only — used to sign the JWT and verify callbacks
```
Sandbox test credentials are documented in `skills/appotapay-payment/references/sandbox.md`.

## Security notes baked into the skills

- JWT is built **server-side**, short-lived, with a unique `jti`.
- IPN/redirect callbacks are **always** verified: `signature == HMAC_SHA256(data, SECRET_KEY)` (constant-time).
- Order fulfillment is gated on the **status API = success** + amount match, with **idempotent** IPN handling.

## Staying in sync with the docs (no stale data)

The skills do **not** rely only on a frozen copy of the API. AppotaPay publishes always-current,
machine-readable docs as `llms-*.txt` files (built from https://docs.appotapay.com). Each `SKILL.md`
instructs the agent to **fetch the live doc and reconcile before generating code** — if the live doc
and the bundled reference disagree, the live doc wins. So when the docs are updated, the agent picks
up the change on the next run without re-publishing the skill.

- Live index of every page: `https://docs.appotapay.com/llms.txt`
- A single page: `https://docs.appotapay.com/llms-v2.0-<slug>-full.txt`
- Mechanism + URL scheme: `skills/appotapay/references/live-docs.md`
- Fetch helper (no deps): `node skills/appotapay/scripts/fetch-doc.mjs <slug|index|full>`

The `references/*.md` are an **offline fallback** for speed/air-gapped use. Maintainers can refresh
them from the live docs with `node skills/appotapay/scripts/sync-references.mjs` (writes `*.live.txt`
diffs to review), then fold changes in.

## Source of truth

All content is derived from the official docs at **https://docs.appotapay.com**. When the docs and a
skill disagree, the docs win — please open an issue/PR.

## License

MIT.
