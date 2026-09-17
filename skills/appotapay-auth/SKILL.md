---
name: appotapay-auth
description: >-
  Build the AppotaPay authentication JWT (the X-APPOTAPAY-AUTH header) and compute or verify request
  and callback signatures. Use when integrating any AppotaPay API and you need to authenticate calls,
  create/refresh the JWT token, understand the HS256 claims (iss, jti, api_key, exp), sign a v1 service
  request (bill, topup, buy-card, firm-banking, virtual-account, e-wallet), or verify an IPN/redirect
  signature. Required by every other AppotaPay skill.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com
---

# AppotaPay authentication (X-APPOTAPAY-AUTH JWT + signatures)

Every AppotaPay API request carries a JWT in the `X-APPOTAPAY-AUTH` header, signed with your
`SECRET_KEY` using **HS256**. Most endpoints *additionally* carry an HMAC-SHA256 `signature` over a
named subset of the parameters.

> **Verify against live docs.** `references/docs/*.md` are an offline snapshot and may lag. Confirm
> before shipping: `node skills/appotapay/scripts/fetch-doc.mjs security` (JWT) and
> `node skills/appotapay/scripts/fetch-doc.mjs <area>/security` (that area's signature rules).
> If live and snapshot differ, the live doc wins. Mechanism: `../appotapay/references/live-docs.md`.

## JWT structure

**Header**
```json
{ "typ": "JWT", "alg": "HS256", "cty": "appotapay-api;v=1" }
```

**Payload (claims)**
```json
{
  "iss": "YOUR_PARTNER_CODE",
  "jti": "YOUR_API_KEY-<unix_time>",
  "api_key": "YOUR_API_KEY",
  "exp": 1614225624
}
```

| Claim | Value |
|---|---|
| `iss` | `PARTNER_CODE` |
| `api_key` | `API_KEY` |
| `jti` | `API_KEY` + `"-"` + current unix timestamp (unique per request) |
| `exp` | expiry unix timestamp (keep short, e.g. now + 300s) |

Sign with `SECRET_KEY` (HS256) and send as `X-APPOTAPAY-AUTH`.

> Generate a **fresh** token per request (or short-lived) — `jti` must be unique and `exp` short.
> Build the JWT **server-side only**; never ship `SECRET_KEY` to a browser or mobile client.

Some areas want the header prefixed with `Bearer ` (the e-wallet and v1 service pages show
`"X-APPOTAPAY-AUTH": Bearer JWT_TOKEN`), while the v2 gateway pages show the bare token. Follow the
endpoint's own example.

## Quick start

Generators in `scripts/` (read the one matching the project's language):

- Node.js / TypeScript: `scripts/gen-jwt.mjs`
- Python: `scripts/gen_jwt.py`
- PHP: `scripts/gen-jwt.php`

```bash
# Node (uses the `jsonwebtoken` package)
APPOTAPAY_PARTNER_CODE=APPOTAPAY \
APPOTAPAY_API_KEY=FJcmF8uj2ISveL5FvvNk4pnp8xrhINz8 \
APPOTAPAY_SECRET_KEY=XAonJgy14YhtePEITXhyBS2unjfJLAV3 \
node scripts/gen-jwt.mjs
```

```
X-APPOTAPAY-AUTH: <jwt>
Content-Type: application/json
```

Common optional headers across the platform: `X-Request-ID` (UUIDv4, for support tickets),
`X-Language` / `Language` (`vi` | `en`), `X-Account-Ref-ID` (sub-account id — **required** when
transacting for a sub account of type owner).

## Signatures — five families

| Family | Where | Rule |
|---|---|---|
| **A. Named subset, sorted** | all `/api/v1/service/...` (bill, buy-card, topup, firm-banking, virtual-account) and e-wallet payment | take the fields the endpoint lists, sort keys alphabetically, join `key=value` with `&` (raw values, no URL-encoding), `HMAC_SHA256(string, SECRET_KEY)` |
| **B. Opaque `data`** | v2 gateway IPN / redirect callbacks | `signature = HMAC_SHA256(data, SECRET_KEY)` over the **raw** `data` string as received |
| **C. Flat order params** | appendix `payment/signature` | same rule as A over the flat payment params |
| **D. Raw body, in a header** | POS (`pos-gw.*`) | `X-Signature = HMAC_SHA256(raw_json_body, SECRET_KEY)` — sign the exact bytes you send |
| **E. SHA-256 concatenation** | charging card `/v1/services/card_charging` | `SHA256(code + serial + vendor + partner_code + service_name + transaction_id + secret_key)` — no HMAC, fixed order |

**Responses are signed too** (family A), over a *different* field list than the request — verify them
before trusting a result. `references/signature.md` has the per-endpoint field tables and the
gotchas that silently break signatures (arrays, empty values, literal spaces).

Helper:

```bash
APPOTAPAY_SECRET_KEY=... node scripts/sign-params.mjs \
  --fields partnerRefId,phoneNumber,productCode,telco,telcoServiceType \
  --params '{"partnerRefId":"AB123","phoneNumber":"0866123456","productCode":"viettel_10","telco":"viettel","telcoServiceType":"prepaid"}'
```
It prints the canonical string on stderr — diff that against the doc's worked example when a
signature is rejected. It also exports `verifyParams()` for constant-time checking of responses.

## Errors

`401` means the JWT failed: expired `exp`, clock skew, wrong `SECRET_KEY`, unknown `api_key` or
`partnerCode`. `403` means the caller's IP is not allow-listed. Full table:
`../appotapay/references/docs/errors.md`.

## References

- `references/jwt.md` — full JWT spec, library list, common pitfalls.
- `references/signature.md` — all three signature families + per-endpoint signed-field tables.
- `references/docs/security.md`, `references/docs/authentication.md` — live doc snapshots.
