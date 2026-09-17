<!-- source: https://docs.appotapay.com/buy-card/transaction-status -->

# API Kiểm tra trạng thái giao dịch

Endpoint: `/api/v1/service/shopcard/transaction/{partnerRefId}`

Method: `GET`

Header: Cách tạo JWT_TOKEN

Language: en | vi

```json
{
    "X-APPOTAPAY-AUTH": Bearer JWT_TOKEN,
    "Content-Type": "application/json",
    "Language": LANGUAGE
}
```

### Tham số

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| partnerRefId | √ | String | Mã giao dịch phía đối tác đưa vào API url |

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi trả về |
| message | String | Mô tả chi tiết mã lỗi |
| cards | Array of Object | Thông tin thẻ |
| cards[].code | String | Mã thẻ (ở dạng đã mã hoá) |
| cards[].serial | String | Serial thẻ |
| cards[].vendor | String | Vendor thẻ |
| cards[].value | Integer | Giá trị thẻ |
| cards[].expiry | String | Hạn sử dụng thẻ (dang: y-m-d, vd: 29-09-2023) |
| transaction | Object | Thông tin giao dịch |
| transaction.appotapayTransId | String | Mã giao dịch phía AppotaPay |
| amount | Integer | Số tiền giao dịch |
| time | String | Thời gian giao dịch (dạng: d-m-Y H:i:s) |

## Ví dụ

### Response

```json
{
    "errorCode": 0,
    "message": "Thành công",
    "cards": [
        {
            "code": "b10294bae53e89919b3efd62a763bf3",
            "serial": "OTA123456789",
            "vendor": "appota",
            "value": 100000,
            "expiry": "29-09-2023"
        }
    ],
    "transaction": {
        "appotapayTransId": "AP12adf21121",
        "amount": 100000,
        "time": "10-04-2020 10:10:10"
    }
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/shopcard/transaction/AB123' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json'
```

### Request

#### REQUEST
