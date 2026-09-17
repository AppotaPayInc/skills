<!-- source: https://docs.appotapay.com/bill/transaction-status -->

# API Kiểm tra trạng thái giao dịch

Endpoint: `/api/v1/service/bill/transaction/{partnerRefId}`

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
| billDetail | Array | Mảng thông tin chi tiết hoá đơn |
| billDetail[].billNumber | String | ID của hoá đơn |
| billDetail[].period | String | Kỳ thanh toán hoá đơn |
| billDetail[].amount | Integer | Số tiền hoá đơn |
| billDetail[].billCreated | String | Ngày tạo hoá đơn |
| billDetail[].billExpiry | String | Ngày hết hạn thanh toán |
| billDetail[].billType | String | Loại hoá đơn |
| billDetail[].billOtherInfo | String | Các thông tin khác |
| billDetail[].isPartialPaymentAllowed | Bool | Hoá đơn có cho phép thanh toán từng phần hay không (mặc định: false) |
| billDetail[].extraInfo | String | Thông tin bổ sung |
| transaction | Object | Thông tin giao dịch |
| transaction.appotapayTransId | String | Mã giao dịch phía AppotaPay |
| transaction.amount | Integer | Số tiền giao dịch |
| transaction.billAmount | Integer | Số tiền hoá đơn thanh toán |
| transaction.time | String | Thời gian giao dịch |
| signature | String | Chữ ký thông tin giao dịch trả về, các trường được ký bao gồm (amount + appotapayTransId + billAmount + errorCode + time) (xem thêm phần cách tạo signature) |

## Ví dụ

### Response

```json
{
    "errorCode": 0,
    "message": "Thành công",
    "billDetail": [
        {
        "billNumber": "117934",
        "period": "4/2020",
        "amount": 100000,
        "billCreated": "",
        "billExpiry": "",
        "billType": "",
        "billOtherInfo": "",
        "isPartialPaymentAllowed": false,
        "extraInfo": ""
        }
    ],
    "transaction": {
        "amount": 100000,
        "billAmount":100000,
        "appotapayTransId": "01ARXAAWEBDS",
        "time": "10-04-2020 10:10:10"
    },
    "signature": "b10294bae53e89919b3efd62a763bf3228e260ef1a329..."
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/bill/transaction/AB123' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json'
```

### Request

#### REQUEST
