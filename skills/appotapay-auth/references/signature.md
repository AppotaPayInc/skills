# AppotaPay request signature & callback verification

There are **two distinct** HMAC-SHA256 uses. Don't confuse them.

## 1. Request parameter signature (canonical sorted string)

Used by flows that pass a flat parameter set. Algorithm:

1. Take the request params (exclude any `signature` field itself).
2. Sort the keys **alphabetically**.
3. Join as `key=value` pairs with `&` (no URL-encoding shown in the docs example).
4. `signature = HMAC_SHA256(joined_string, SECRET_KEY)` → hex string.

### Worked example

Params:
```json
{
  "amount": 10000,
  "orderId": "5f61cf4f41e2b",
  "orderInfo": "test thanh toan",
  "bankCode": "VCB",
  "paymentMethod": "ATM",
  "clientIp": "103.53.171.140",
  "extraData": "",
  "notifyUrl": "http://yourwebsite.com/ipn",
  "redirectUrl": "http://yourwebsite.com/redirect"
}
```

Canonical string (sorted by key):
```
amount=10000&bankCode=VCB&clientIp=103.53.171.140&extraData=&notifyUrl=http://yourwebsite.com/ipn&orderId=5f61cf4f41e2b&orderInfo=test thanh toan&paymentMethod=ATM&redirectUrl=http://yourwebsite.com/redirect
```

```
signature = HMAC_SHA256(canonical_string, SECRET_KEY)
```

> Note: the documented **v2** `POST /api/v2/orders/payment` body uses nested `transaction` /
> `partnerReference` objects and authenticates with the JWT — its example body does **not** carry a
> `signature` field. Treat this sorted-param signing as the appendix/legacy scheme and only add a
> `signature` param where a specific endpoint's spec asks for it. When in doubt, follow that
> endpoint's page in the docs.

## 2. IPN / redirect callback verification (sign the opaque `data`)

This is the one you **must always implement**. When AppotaPay calls your `notifyUrl` (IPN, POST)
or redirects the browser to your `redirectUrl` (GET), it sends three fields:

| Field       | Meaning                                                   |
|-------------|-----------------------------------------------------------|
| `data`      | base64( json_encode(transaction info) ) — an opaque string |
| `signature` | `HMAC_SHA256(data, SECRET_KEY)` (hex)                     |
| `time`      | response timestamp                                        |

Verification:
1. Recompute `expected = HMAC_SHA256(data, SECRET_KEY)`.
2. Compare to the received `signature` using a **constant-time** comparison.
3. Only if equal: `base64_decode(data)` then `json_decode` to read the transaction.

> The signature is over the **raw `data` string exactly as received** — do not decode/re-encode
> before signing, or it won't match. See the `appotapay-payment` skill (`references/ipn.md` and
> `scripts/verify-ipn.*`) for runnable verifiers.
