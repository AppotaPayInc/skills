# AppotaPay JWT — full reference

Source: https://docs.appotapay.com (Bảo mật / Security, Xác thực / Authentication).

## Algorithm & header

- Algorithm: **HS256** (HMAC-SHA256) with `SECRET_KEY` as the key.
- Header must include the content-type claim:

```json
{ "typ": "JWT", "alg": "HS256", "cty": "appotapay-api;v=1" }
```

Some JWT libraries only let you set `typ` and `alg` by default. Set the extra `cty` header
explicitly (most libraries accept a `header`/`headers` option). It is part of the documented spec.

## Payload claims

```json
{
  "iss": "YOUR_PARTNER_CODE",
  "jti": "YOUR_API_KEY-1614225624",
  "api_key": "YOUR_API_KEY",
  "exp": 1614225624
}
```

- `iss` = `PARTNER_CODE`.
- `api_key` = `API_KEY`.
- `jti` = `API_KEY` + `"-"` + the current unix timestamp (seconds). Makes each token unique.
- `exp` = expiry unix timestamp. Keep it short-lived (e.g. now + 300 seconds).

## Header placement

```
X-APPOTAPAY-AUTH: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6...
Content-Type: application/json
```

Optional request headers used across the payment APIs:
- `X-Request-ID` — UUIDv4, for tracing/support (max ~40 chars).
- `X-Language` — `vi` or `en` (controls the language of the hosted checkout page; default `vi`).
- `X-Account-Ref-ID` — required only when transacting on behalf of an owner-type sub-account.

## Recommended JWT libraries

| Language | Library                                            |
|----------|----------------------------------------------------|
| Node.js  | `jsonwebtoken` (https://github.com/auth0/node-jsonwebtoken) |
| Go       | `golang-jwt/jwt`                                   |
| PHP      | `firebase/php-jwt`                                 |
| Java     | `auth0/java-jwt`                                   |
| C#       | `jwt-dotnet/jwt`                                   |
| Python   | `PyJWT`                                            |

Inspect tokens at https://jwt.io.

## Common pitfalls

- **401 Unauthorized** → token expired (`exp` in the past), wrong `SECRET_KEY`, or wrong
  `PARTNER_CODE`/`API_KEY`. Regenerate with a fresh `exp`.
- **Clock skew** → server clock must be roughly correct; `exp`/`jti` use real unix time.
- **Missing `cty` header** → set it explicitly; don't rely on library defaults.
- **Reusing a token forever** → prefer short-lived tokens; generate per request batch.
- **Secret leakage** → never build the JWT in client code. Server-side only.
