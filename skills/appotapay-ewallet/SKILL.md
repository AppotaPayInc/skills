---
name: appotapay-ewallet
description: >-
  Link an AppotaPay e-wallet account to a partner account with OAuth2 and pay from the wallet or
  APoint balance. Use when the user wants liên kết ví AppotaPay, wallet login/authorization code,
  access token and refresh token, reading wallet account info, requesting a wallet payment, confirming
  it with OTP, cancelling a wallet transaction, or unlinking a wallet. Requires appotapay-auth for the
  JWT on the payment APIs.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com/ewallet/introduction
---

# AppotaPay e-wallet linking & payment

Two different hosts — do not mix them up:

| Purpose | Sandbox | Production |
|---|---|---|
| OAuth (login form, tokens, account info, unlink) | `https://ewallet.dev.appotapay.com` | `https://ewallet.appotapay.com` |
| Wallet payment APIs (`/api/v2/ewallet/...`) | `https://gateway.dev.appotapay.com` | `https://gateway.appotapay.com` |

> **Verify against live docs.** `node skills/appotapay/scripts/fetch-doc.mjs ewallet/request-payment`
> etc. `references/docs/*.md` may lag.

## Flow

```
1. Build the authorization link, open it for the customer:
   GET {ewallet}/oauth/login?client_key=API_KEY&scope=...&response_type=code
                            &redirect_uri=CALLBACK_URI&state=ANTI_CSRF
2. Customer logs in / authorizes → AppotaPay redirects to CALLBACK_URI?code=...&state=...
   → CHECK `state` matches what you issued, then discard the code after one use
3. POST {ewallet}/api/v1/oauth/access_token
        { client_key, secret_key, grant_type: "authorization_code", code }
   → { access_token, refresh_token, expiry_in, refresh_token_expiry_in }
4. Use the access token:
   GET  {ewallet}/api/v1/users/accounts/info      (wallet balance, profile)
   POST {gateway}/api/v2/ewallet/payment          (charge the wallet)
   POST {gateway}/api/v2/ewallet/payment/confirm  (OTP confirm, when required)
   POST {gateway}/api/v2/ewallet/transaction/cancel
5. POST {ewallet}/api/v1/oauth/refresh_token  before expiry_in lapses
6. POST {ewallet}/api/v1/users/app/destroy    to unlink
```

### Scopes

| Scope | Grants |
|---|---|
| `user.info` | basic profile (fullname, apoint_balance, …) |
| `user.apoint_payment` | pay with the APoint balance |
| `user.wallet_payment` | pay with the wallet balance |

Request only what you use. `state` is your CSRF defence — generate it per attempt, bind it to the
session, and reject a callback whose `state` does not match.

## Payment — `POST /api/v2/ewallet/payment`

Headers: `X-APPOTAPAY-AUTH: Bearer JWT_TOKEN`, `Authorization: Bearer ACCESS_TOKEN`,
`Content-Type: application/json`; optional `X-Request-ID`, `X-Language`, `X-Account-Ref-ID`.

```json
{
  "orderId": "123",
  "orderInfo": "test",
  "amount": 120000,
  "currency": "VND",
  "extraData": "test",
  "signature": "<hmac>"
}
```

`signature` is signature **family A** over exactly these five fields, sorted:

```
amount={amount}&currency={currency}&extraData={extraData}&orderId={orderId}&orderInfo={orderInfo}
signature = HMAC_SHA256(that_string, SECRET_KEY)
```
Limits: `amount` 1 000 – 500 000 000, `orderId` ≤ 50 alphanumeric, `orderInfo` ≤ 150.
Helper: `../appotapay-auth/scripts/sign-params.mjs`.

The response `transaction.status` plus `verificationMethod` tells you whether an OTP confirm step is
needed (`POST /api/v2/ewallet/payment/confirm`).

## Tokens

`access_token` and `refresh_token` are **user credentials** — store them encrypted, per user, server
side. `expiry_in` / `refresh_token_expiry_in` are unix timestamps; refresh before expiry rather than
on a 401. When a user unlinks, delete your copies.

## References

- `references/docs/ewallet-introduction.md` — the 8-step connection model, environments.
- One page per endpoint under `references/docs/ewallet-*.md`; errors in `ewallet-error-code.md`.
