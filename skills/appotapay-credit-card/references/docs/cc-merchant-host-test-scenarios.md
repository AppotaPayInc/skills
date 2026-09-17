<!-- source: https://docs.appotapay.com/cc-merchant-host/test-scenarios -->

# Test scenarios

Thẻ test dành cho một số trường hợp

| Brand | Số thẻ | Trường hợp 3DS | Charge |
| --- | --- | --- | --- |
| VISA | 4000000000001091 | 3DS EMV 2.0 Challenge | √ |
| Mastercard | 5200000000002151 | 3DS EMV 2.0 Challenge | √ |
| VISA | 4000000000001000 | 3DS EMV 2.0 Frictionless | √ |
| Mastercard | 5200000000001005 | 3DS EMV 2.0 Frictionless | √ |
| Mastercard | 4000000000000010 | 3DS Enabled | √ only success if skip 3DS |
| Mastercard | 5200000000000015 | 3DS Enabled | √ only success if skip 3DS |
| VISA | 4000000000001075 | 3DS Enabled | √ only success if skip 3DS |
| Mastercard | 5200000000001070 | 3DS Enabled | √ only success if skip 3DS |
