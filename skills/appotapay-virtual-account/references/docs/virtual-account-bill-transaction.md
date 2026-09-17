<!-- source: https://docs.appotapay.com/virtual-account/bill-transaction -->

# API Lấy danh sách giao dịch

## API Lấy danh sách giao dịch

Endpoint: `/api/v1/service/ebill/transactions`

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
| startTime | √ | Integer | Thời gian bắt đầu |
| endTime | √ | Integer | Thời gian kết thúc |
| billCode |  | String | Mã hóa đơn |
| limit |  | Integer | Tổng số giao dịch trên một trang (mặc định: 20) |
| page |  | Integer | Trang hiện tại (mặc định: 1) |

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi trả về |
| message | String | Chi tiết mã lỗi |
| total | Integer | Tổng số giao dịch |
| page | Integer | Trang hiện tại |
| transactions | Array of Object | Danh sách giao dịch |
| transactions.transactionId | String | Mã giao dịch |
| transactions.billCode | String | Mã đơn hàng |
| transaction.accountNo | String | Số tài khoản |
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
    "total": 1,
    "page": 1,
    "transactions": [
        {
            "transactionId": "abc12345",
            "billCode": "004000110020210401174059469229",
            "accountNo": "902000225483",
            "amount": 100000,
            "status": "success",
            "type": "VA",
            "memo": "chuyen khoan",
            "transactionTime": "20-03-2021 10:01:00"
        }
    ]
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/ebill/transactions?startTime=1616818154&endTime=1616904554&billCode=004000110020210401174059469229&limit=20&page=1' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json'
```

### Request

#### REQUEST
