# Live docs — the source of truth (read this before generating integration code)

The `references/*.md` files in these skills are an **offline snapshot** for quick reading. They can
lag behind the live documentation. **AppotaPay publishes machine-readable, always-current docs** as
`llms-*.txt` files on the docs site (built from the same source as https://docs.appotapay.com).

**Rule:** before you finalize endpoints, field names, codes, amounts, or base URLs in generated code,
**fetch the live doc** for the relevant page and reconcile. If the live doc and a local reference
disagree, **the live doc wins**.

## Base

```
DOCS = https://docs.appotapay.com           # production docs host
```
> If the user is working against a different docs host (e.g. a dev mirror like
> `https://docs.dev.appotapay.com`), swap `DOCS` accordingly — the file paths below are identical.

## URL scheme

| Want | URL |
|------|-----|
| **Index of every v2.0 page** (discover slugs/links) | `{DOCS}/llms.txt` |
| **All v2.0 docs in one file** | `{DOCS}/llms-full.txt` |
| **One v2.0 page** | `{DOCS}/llms-v2.0-<slug>-full.txt` |
| Older version index | `{DOCS}/llms-v1.1.txt` , `{DOCS}/llms-v1.0.txt` |
| Older version, one page | `{DOCS}/llms-v1.1-<slug>-full.txt` , `{DOCS}/llms-v1.0-<slug>-full.txt` |

`<slug>` = the doc page path with `/` replaced by `-`. The `llms.txt` index lists the exact
`mdFile` name for every page, so when unsure, **fetch `llms.txt` first and grep for the topic**.

## Canonical pages used by these skills (v2.0)

| Topic | Live file |
|-------|-----------|
| Authentication overview | `llms-v2.0-authentication-full.txt` |
| JWT / security (claims) | `llms-v2.0-security-full.txt` |
| Request signature | `llms-v2.0-payment-payment-signature-full.txt` |
| Create payment | `llms-v2.0-payment-payment-full.txt` |
| Payment result (IPN/redirect) | `llms-v2.0-payment-payment-result-full.txt` |
| Transaction status | `llms-v2.0-payment-payment-status-full.txt` |
| Refund | `llms-v2.0-payment-refund-full.txt` |
| Codes (method/action/bank) | `llms-v2.0-payment-payment-code-full.txt` |
| Sandbox | `llms-v2.0-payment-payment-sandbox-full.txt` |

## How to fetch

Any of these works — pick what fits the environment:

```bash
# discover everything
curl -fsSL https://docs.appotapay.com/llms.txt

# one page (create-payment spec)
curl -fsSL https://docs.appotapay.com/llms-v2.0-payment-payment-full.txt
```

A dependency-free helper is bundled: `skills/appotapay/scripts/fetch-doc.mjs`
(e.g. `node fetch-doc.mjs payment-payment` or `node fetch-doc.mjs index`).

In an agent that has a web-fetch / browse tool, just fetch the URL directly.

## Keeping the offline snapshot fresh (maintainers)

`skills/appotapay/scripts/sync-references.mjs` re-downloads the canonical pages into each skill's
`references/` folder so the offline fallback stays close to the live docs. Run it whenever the docs
are re-published, then review the diff before committing.
