---
name: appotapay-subscription
description: >-
  Build recurring / subscription billing on AppotaPay: create and update customers, create payment
  methods (card tokens), create plans with a schedule, run and inspect billing cycles, force or cancel
  a cycle, deactivate a plan, refund a subscription charge, and handle the plan / cycle / payment-method
  / refund callbacks. Use when the user wants thanh toán định kỳ, subscription, recurring billing,
  auto-renew, or asks about /api/v1/subs endpoints. Requires appotapay-auth for the JWT.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com/subscription/introduction
---

# AppotaPay subscription (recurring billing)

Base URL: `https://gateway.dev.appotapay.com` (sandbox) / `https://gateway.appotapay.com` (production).
JWT on every request — see **appotapay-auth**.

Two integration models: **merchant-hosted** (you collect card details and create the payment method)
and **checkout page** (AppotaPay hosts the form). The object model is the same.

> **Verify against live docs.** 32 pages live under `subscription/`; snapshots in `references/docs/`
> may lag. `node skills/appotapay/scripts/fetch-doc.mjs index subscription` lists them all.

## Object model

```
Customer ──< PaymentMethod
    └──< Plan (schedule + amount) ──< Cycle (one billing attempt) ──< Refund
```

| Object | Key fields |
|---|---|
| **Customer** | `customerRefId` (yours), `customerId` (AppotaPay). Individual customers only. |
| **PaymentMethod** | `paymentMethodRefId`, `paymentMethod` (e.g. `CC_SUBS`), `reusability` (`MULTIPLE_USE`) |
| **Plan** | `planRefId`, `amount`, `currency`, `schedule.interval` + `schedule.intervalCount`, `anchorDate`, `immediateActionType`, `failedCycleAction`, ranked `paymentMethods[]` |
| **Cycle** | one scheduled charge attempt against a plan |

Full field tables: `references/docs/subscription-customer-object.md`, `-payment-method-object.md`,
`-plan-object.md`, `-cycle-object.md`, `-refund-object.md`.

## Endpoints

| Task | Endpoint |
|---|---|
| Create customer | `POST /api/v1/customers` |
| Get / update customer | `GET /api/v1/customers/{customerRefId}` · `PATCH /api/v1/customers/{customerId}` |
| Create payment method | `POST /api/v1/subs/payment-methods` |
| List / get payment method | `GET /api/v1/subs/payment-methods` · `GET /api/v1/subs/payment-methods/{paymentMethodRefId}` |
| Create plan | `POST /api/v1/subs/plans` |
| Get / update plan | `GET /api/v1/subs/plans/{planRefId}` · `PATCH /api/v1/subs/plans/{planId}` |
| Deactivate plan | `POST /api/v1/subs/plans/{planId}/deactivate` |
| List / get cycle | `GET /api/v1/subs/plans/{planId}/cycles` · `GET …/cycles/{cycleId}` |
| Update cycle | `PATCH /api/v1/subs/plans/{planId}/cycles/{cycleId}` |
| Cancel cycle | `POST /api/v1/subs/plans/{planId}/cycles/{cycleId}/cancel` |
| Force a charge attempt now | `POST /api/v1/subs/plans/{planId}/cycles/{cycleId}/force-attempt` |
| Refund | `POST /api/v1/subs/refunds` · `GET /v1/subs/refunds/{refundRefId}` |

## Plan lifecycle

`status` ∈ `PENDING` → `REQUIRES_ACTION` → `ACTIVE` → `INACTIVE`.

**`REQUIRES_ACTION` is the step teams miss.** The response carries `actions[]`, each with a `url`,
a `method` (`GET`/`POST`) and an `action`:

| `action` | Meaning |
|---|---|
| `AUTH` | send the customer to `url` to authorize the payment method / first charge |
| `RESEND_AUTH` | re-send the authorization code to the customer |
| `PAY` | AppotaPay-hosted link where the customer enters payment details |

Follow the `url` **exactly as returned** (it is on `acpg.*` and carries its own signature) — never
rebuild it.

Two plan settings decide the money behaviour:

- `immediateActionType` — `FULL_AMOUNT` charges as soon as the plan activates; `null` waits for
  `anchorDate`.
- `failedCycleAction` — `STOP` kills the whole plan on a failed cycle; `RESUME` skips it and
  continues with the next one. Pick deliberately; the default is not obviously right for either
  dunning strategy.

## Callbacks — verify every one

AppotaPay POSTs a callback to the URL you configured for each of: **plan**, **cycle**, **payment
method**, **plan action**, **payment method action**, and **refund**. Each carries a `signature`:
recompute it from the received data and compare constant-time **before** acting. Cycle callbacks are
how you learn a renewal succeeded or failed — treat them as the source of truth and handle repeats
idempotently.

Pages: `references/docs/subscription-plan-callback.md`, `-cycle-callback.md`,
`-payment-method-callback.md`, `-plan-action-callback.md`, `-payment-method-action-callback.md`,
`-refund-callback.md`.

## References

- `references/docs/subscription-introduction.md` — the full step-by-step model.
- `references/docs/subscription-error-code.md` — error codes.
- `references/docs/subscription-merchant_hosted.md`, `-checkout_page.md` — the two models.
