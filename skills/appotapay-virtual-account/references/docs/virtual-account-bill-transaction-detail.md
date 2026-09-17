<!-- source: https://docs.appotapay.com/virtual-account/bill-transaction-detail -->

# API Lấy danh sách giao dịch của 1 hoá đơn

Endpoint: `/api/v1/service/ebill/{billCode}/transactions`

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
| billCode | √ | String | Mã đơn hàng phía Partner |

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi trả về |
| message | String | Chi tiết mã lỗi |
| billCode | String | Mã đơn hàng phía Partner |
| amount | Integer | Số tiền thanh toán |
| paidAmount | Integer | Số tiền thực tế đã thanh toán |
| billExpiryTime | Integer | Thời gian hết hạn giao dịch thanh toán hóa đơn |
| transactions | Array of Object | Thông tin giao dịch thực hiện chuyển khoản |
| transactions.transactionId | String | Mã giao dịch |
| transactions.billCode | String | Mã đơn hàng |
| transaction.accountNo | String | Số tài khoản nhận tiền |
| transactions.amount | Integer | Số tiền giao dịch |
| transactions.status | String | Trạng thái giao dịch |
| transactions.type | String | Loại giao dịch |
| transactions.memo | String | Nội dung chuyển khoản |
| transactions.transactionTime | String | Thời gian thực hiện giao dịch |

## Ví dụ

### Response

```json
{
  "errorCode": 0,
  "message": "Thành công",
  "billCode": "94194a2f3ed349785a36",
  "amount": 20000,
  "paidAmount": 30000,
  "billExpiryTime": 1710644659,
  "transactions": [
    {
      "transactionId": "01HRXEPS7163JT039YHS6CGMS9",
      "billCode": "94194a2f3ed349785a36",
      "accountNo": "987654000007947",
      "amount": 10000,
      "status": "success",
      "type": "VA",
      "memo": "chuyen khoan",
      "transactionTime": "13-03-2024 11:10:00"
    },
    {
      "transactionId": "01HRXERA2GT8JV6ND6GG8N5RW9",
      "billCode": "94194a2f3ed349785a36",
      "accountNo": "987654000007947",
      "amount": 20000,
      "status": "success",
      "type": "VA",
      "memo": "chuyen khoan",
      "transactionTime": "13-03-2024 11:10:00"
    }
  ]
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/ebill/94194a2f3ed349785a36/transactions' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json'
```

### Request

#### REQUEST
