<!-- source: https://docs.appotapay.com/buy-card/buy -->

# API Mua mã thẻ

## API Mua mã thẻ

Endpoint: `/api/v1/service/shopcard/buy`

Method: `POST`

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
| partnerRefId | √ | String | Mã giao dịch phía đối tác, duy nhất cho mỗi giao dịch |
| productCode | √ | String | Mã sản phẩm (xem thêm phần Phụ Lục bảng mã sản phẩm) |
| type |  | String | Hình thức mua thẻ. Mặc định là "normal". normal: Thẻ mua sẽ được trả trực tiếp. |
| quantity | √ | Integer | Số lượng thẻ mua Tối đa 100 thẻ /1 lần mua với hình thức mua thẻ normal |
| signature | √ | String | Chữ ký các tham số truyền lên API, các tham số được đưa vào chữ ký theo thứ tự bao gồm: partnerRefId + productCode + quantity (xem thêm phần cách tạo signature) |

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
| account | Object | Thông tin tài khoản |
| account.balance | Integer | Số dư tài khoản sau giao dịch |

## Ví dụ

### Request

```json
{
    "partnerRefId": "AB123",
    "productCode": "AC100",
    "quantity": 10,
    "signature": "b10294bae53e89919b3efd62a763bf3..."
}
```

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
        },
        ...
    ],
    "transaction": {
        "amount": 100000,
        "appotapayTransId": "AP12adf21121",
        "time": "10-04-2020 10:10:10",
    },
    "account": {
        "balance": "121000000"
    }
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/shopcard/buy' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  -d '{
  "partnerRefId": "AB123",
  "productCode": "AC100",
  "type": "normal",
  "customerPhone": "0912345678",
  "quantity": 10,
  "signature": "b10294bae53e89919b3efd62a763bf3..."
}'
```

### Request

#### REQUEST
