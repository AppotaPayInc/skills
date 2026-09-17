# AppotaPay request signature & callback verification

Three **distinct** HMAC-SHA256 uses. Don't confuse them. All of them key on `SECRET_KEY` and produce
a lowercase hex digest.

---

## Family A — v1 services: sign a named subset, sorted

Used by every `/api/v1/service/...` endpoint (bill, buy-card, mobile-topup, firm-banking,
virtual-account) and by the e-wallet payment APIs. The endpoint's doc page names **which fields are
signed** — it is *not* "all params".

Algorithm:

1. Take **only the fields the endpoint's spec lists** (never include `signature` itself).
2. Sort those keys **alphabetically**.
3. Join as `key=value` with `&`. Values go in raw — **no URL-encoding**, spaces stay spaces.
4. `signature = HMAC_SHA256(joined, SECRET_KEY)` → hex.

The **response** is signed too, over a *different* field list. Verify it before trusting the result.

### Signed field lists (from the live docs)

| API | Direction | Fields signed (sorted for you) |
|---|---|---|
| Bill — check info `POST /api/v1/service/bill/check` | request | `billCode`, `partnerRefId`, `serviceCode` |
| Bill — pay `POST /api/v1/service/bill/pay` | request | `amount`, `billCode`, `billDetail`, `partnerRefId`, `serviceCode` |
| Bill — pay | response | `amount`, `appotapayTransId`, `billAmount`, `errorCode`, `time` |
| Buy card `POST /api/v1/service/shopcard/buy` | request | `partnerRefId`, `productCode`, `quantity` |
| Mobile topup `POST /api/v2/service/topup/charging` | request | `partnerRefId`, `phoneNumber`, `productCode`, `telco`, `telcoServiceType` |
| Mobile topup | response | `amount`, `appotapayTransId`, `errorCode`, `phoneNumber`, `productCode`, `time`, `topupAmount` |
| Topup — transaction status | response | `amount`, `appotapayTransId`, `errorCode`, `phoneNumber`, `time`, `topupAmount` |
| Firm banking — transfer `POST /api/v1/service/transfer/make` | request | `accountName`, `accountNo`, `accountType`, `amount`, `bankCode`, `bankId`, `channel`, `contractNumber`, `customerPhoneNumber`, `feeType`, `message`, `partnerRefId` |
| Firm banking — transfer | response | `amount`, `appotapayTransId`, `errorCode`, `time`, `transferAmount` |
| Firm banking — transaction status | response | `amount`, `appotapayTransId`, `errorCode`, `time`, `transferAmount` |
| Firm banking — pending result callback | callback | `amount`, `appotapayTransId`, `errorCode`, `partnerRefId`, `time`, `transferAmount`, `transferStatus` |
| Firm banking — account info `POST /api/v1/service/transfer/bank/account/info` | request | `accountNo`, `accountType`, `bankCode`, `partnerRefId` |
| Firm banking — account info | response | `accountName`, `accountNo`, `errorCode` |
| Virtual account — create bill `POST /api/v1/service/ebill/create` | request | `amount`, `bankCode`, `billCode`, `billExpiryTime`, `billInfo`, `customerName`, `notifyUrl`, `paymentCondition`, `serviceCode` |
| Virtual account — create bill | response | `billCode`, `errorCode`, `payment` (as `json_encode(payment)`) |
| Virtual account — bill detail | response | `amount`, `billCode`, `billExpiryTime`, `errorCode`, `paidAmount`, `payment` (as `json_encode(payment)`) |
| Virtual account — close account `POST /api/v1/service/ebill/close` | request | `accountNo`, `billCode`, `partnerRefId` |
| Virtual account — **IPN** | callback | `amount`, `apiKey`, `bankAccountName`, `bankAccountNumber`, `bankCode`, `billCode`, `extraData`, `memo`, `partnerCode`, `requestTime`, `transactionId`, `transactionTime`, `version` |
| E-wallet — request payment `POST /api/v2/ewallet/payment` | request | `amount`, `currency`, `extraData`, `orderId`, `orderInfo` |

> Always re-read the endpoint's own page before shipping — the list is per endpoint and the docs do
> change. `node skills/appotapay/scripts/fetch-doc.mjs <area>/security` prints the signature page for
> an area.

### Gotchas that break signatures

- **Array/object values are not JSON-stringified the same way everywhere.** Bill pay signs
  `billDetail=Array` (the literal word, per the docs example), while virtual-account signs
  `payment={json}` using `json_encode(payment)`. Copy the endpoint's worked example, don't guess.
- **Empty values still appear**: `extraData=` stays in the string.
- **Spaces are literal** — `orderInfo=test thanh toan`, not `test%20thanh%20toan`.
- Numbers are written as-is: `amount=10000`, not `10000.00`.

Helper: `scripts/sign-params.mjs` builds the canonical string from a field list and HMACs it.

---

## Family B — v2 gateway callbacks: sign the opaque `data`

This is the one you **must always implement** for the payment gateway. When AppotaPay calls your
`notifyUrl` (IPN, POST) or redirects the browser to your `redirectUrl` (GET), it sends:

| Field | Meaning |
|---|---|
| `data` | base64( json_encode(transaction info) ) — an opaque string |
| `signature` | `HMAC_SHA256(data, SECRET_KEY)` (hex) |
| `time` | response timestamp |

Verification:

1. Recompute `expected = HMAC_SHA256(data, SECRET_KEY)`.
2. Compare to the received `signature` with a **constant-time** comparison.
3. Only if equal: `base64_decode(data)` then `json_decode` to read the transaction.

> Sign the **raw `data` string exactly as received** — do not decode and re-encode first, or it will
> not match. Runnable verifiers: `appotapay-payment/scripts/verify-ipn.{mjs,py,php}`.

---

## Family C — v2 order params (appendix scheme)

The appendix page `payment/signature` documents signing a flat payment parameter set (`amount`,
`bankCode`, `clientIp`, `extraData`, `notifyUrl`, `orderId`, `orderInfo`, `paymentMethod`,
`redirectUrl`) with the same sort-and-join rule as Family A.

```
amount=10000&bankCode=VCB&clientIp=103.53.171.140&extraData=&notifyUrl=http://yourwebsite.com/ipn&orderId=5f61cf4f41e2b&orderInfo=test thanh toan&paymentMethod=ATM&redirectUrl=http://yourwebsite.com/redirect
```

> The current `POST /api/v2/orders/payment` body uses nested `transaction` / `partnerReference`
> objects and authenticates with the JWT — its documented example carries **no** `signature` field.
> Only add one where a specific endpoint's page asks for it.

---

## Family D — POS: HMAC over the raw JSON body

The POS gateway (`pos-gw.*`) does not put the signature in the body. It sends an `X-Signature`
header:

```
X-Signature = HMAC_SHA256(raw_request_body_json_string, SECRET_KEY)
```

Sign the exact bytes you send — serialize once, sign that string, and send that same string. Any
re-serialization (key reordering, whitespace changes) invalidates it. See **appotapay-pos**.

---

## Family E — Charging card: plain SHA-256 over a concatenation

The scratch-card charging API (`/v1/services/card_charging`) is the odd one out: **no HMAC, no
`key=value`, no sorting**. Fields are concatenated in a fixed documented order with the secret key
appended, then hashed:

```
signature = SHA256(code + serial + vendor + partner_code + service_name + transaction_id + secret_key)
```

The card `code` itself is **AES-128 encrypted** before being sent. See **appotapay-charging-card**.

---

## Not a signature: JWT

The `X-APPOTAPAY-AUTH` header is a full HS256 JWT, not one of these digests. See `jwt.md`.
