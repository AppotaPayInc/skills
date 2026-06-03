# AppotaPay payment codes

Source: https://docs.appotapay.com/payment/code.

## paymentMethod
| Code | Meaning |
|------|---------|
| `ATM` | Domestic iBanking / ATM card |
| `CC` | Visa / Master / JCB |
| `EWALLET` | E-wallet |
| `VA` | Bank transfer via virtual account |
| `MM` | Mobile Money |
| `ISTM` | Installment |
| `ALL` | Show all configured methods on the checkout page |

## action
| Code | Meaning |
|------|---------|
| `PAY` | Pay |
| `PAY_WITH_RETURN_TOKEN` | Pay and return a saved card token |
| `PAY_WITH_TOKEN` | Pay using a previously saved token (pass `transaction.token`) |

## bankCode — domestic (selected)
`VCB, TECHCOMBANK, TPBANK, VIETINBANK, VIB, VIETBANK, HDBANK, MB, VIETABANK, MARITIMEBANK, EXIMBANK,
SHB, VPBANK, ABBANK, SACOMBANK, NAMA, OCEANBANK, BIDV, SEABANK, BACA, NCB, AGRIBANK, SAIGONBANK,
PVBANK, ACB, LPB, BVBANK, OCB, KIENLONGBANK, VRB, PBVN, PGBANK, GPBANK, SCB, WOORIBANK,
VIETCAPITALBANK, UOB, IVB, SHINHANBANK`

> Each bank requires the customer to enter either the **issue date** or **expiry date** of the card
> at checkout (varies per bank). The full table with the per-bank rule is at
> https://docs.appotapay.com/payment/code#bảng-mã-ngân-hàng.

## bankCode — international (CC)
`VISA`, `MASTERCARD`, `JCB`

## bankCode — e-wallet (EWALLET)
`APPOTA` (Ví Appota), `SHOPEEPAY`, `VNPTWALLET`, `ZALOPAY`

## bankCode — bank transfer (VA)
`WOORIBANK`, `VIETCAPITALBANK`

## bankCode — Mobile Money (MM)
`VINAPHONE`

## bankCode — installment (ISTM)
`BAOKIM`
