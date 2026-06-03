# AppotaPay sandbox

Source: https://docs.appotapay.com/payment/sandbox. Base URL `https://gateway.dev.appotapay.com`.

## Test partner credentials
```
PARTNER_CODE = APPOTAPAY
API_KEY      = FJcmF8uj2ISveL5FvvNk4pnp8xrhINz8
SECRET_KEY   = XAonJgy14YhtePEITXhyBS2unjfJLAV3
```

## Test domestic card (ATM)
| Field | Value |
|-------|-------|
| Bank Code | `MB` |
| Card Number | `9704229306604047` |
| Card holder | `ARTURO MOEN` |
| Expired date | `01/23` |
| OTP | `123456` |

## Test domestic account
| Field | Value |
|-------|-------|
| Bank Code | `PVBANK` |
| Account Number | `01040001` |
| Account Name | `NGUYEN VAN A` |
| Identification Number | `343243423313` |
| OTP | `otp` |

## Test Visa / MasterCard
| Field | Value |
|-------|-------|
| Card Number | `5123456789012346` (or `5123450000000008`) |
| Card holder | `NGUYEN VAN A` |
| Expired date | `03/27` |
| CVV | `123` |

> These are public sandbox values from the docs — safe to commit in test config, but still keep your
> **real** production secrets out of source control.
