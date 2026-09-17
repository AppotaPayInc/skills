<!-- source: https://docs.appotapay.com/firm-banking/transaction-status -->

# API Kiểm tra trạng thái giao dịch

## API Kiểm tra trạng thái giao dịch

Endpoint: `/api/v1/service/transfer/transaction/{partnerRefId}`

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
| partnerRefId | √ | String | Mã giao dịch phía đối tác đưa vào API Url |

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi trả về |
| message | String | Mô tả chi tiết mã lỗi |
| transaction | Object | Thông tin giao dịch |
| transaction.phoneNumber | String | Số điện thoại khách hàng |
| transaction.amount | Integer | Số tiền giao dịch |
| transaction.transferAmount | Integer | Số tiền thực tế chuyển cho người nhận, sẽ ít hơn nếu phí chuyển tiền người nhận chịu. |
| transaction.appotapayTransId | String | Mã giao dịch phía AppotaPay |
| transaction.accountNo | String | Số tài khoản/thẻ người nhận |
| transaction.accountName | String | Tên người nhận |
| transaction.time | Integer | Thời gian giao dịch |
| signature | String | Chữ ký các tham số truyền lên API, các tham số được đưa vào chữ ký theo thứ tự bao gồm: amount + appotapayTransId + errorCode + time + transferAmount (xem thêm phần cách tạo signature) |

## Ví dụ

### Response

```json
{
    "errorCode": 0,
    "message": "Thành công",
    "transaction": {
        "phoneNumber":"0987777888",
        "amount":50000,
        "transferAmount":50000,
        "appotapayTransId":"01EQTH129581",
        "accountNo":"9704000000000018",
        "accountName":"AP APPOTAPAY",
        "time": 1608778440
    },
    "signature": "b5bb9a6e9c71281fb1e06d"
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/transfer/transaction/5f61cf4f41e2b' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json'
```

### Request

#### REQUEST
