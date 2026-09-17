<!-- source: https://docs.appotapay.com/bill/payment -->

# API Thanh toán hoá đơn

Endpoint: `/api/v1/service/bill/pay`

Method: `POST`

Header: Cách tạo JWT_TOKEN

Language: en | vi

```json
{
    "X-APPOTAPAY-AUTH": Bearer JWT_TOKEN,
    "Content-Type": "multipart/form-data",
    "Language": LANGUAGE
}
```

### Tham số

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| partnerRefId | √ | String | Mã giao dịch mà đã gửi ở API truy vấn thông tin hoá đơn |
| billCode | √ | String | Mã hoá đơn/thanh toán |
| serviceCode | √ | String | Mã dịch vụ (xem thêm phần Phụ Lục bảng mã dịch vụ) |
| amount | √ | Integer | Số tiền thanh toán |
| billDetail | √ | String | JSON String của mảng thông tin hoá đơn đã trả về từ API truy vấn hoá đơn |
| signature | √ | String | Chữ ký các tham số truyền lên API, các tham số được đưa vào chữ ký bao gồm: amount + billCode + billDetail + partnerRefId + serviceCode (xem thêm phần cách tạo signature) |

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
| account | Object | Thông tin tài khoản |
| account.balance | Integer | Số dư tài khoản sau giao dịch |
| signature | String | Chữ ký thông tin giao dịch trả về, các trường được ký bao gồm (amount + appotapayTransId + billAmount + errorCode + time) (xem thêm phần cách tạo signature) |

## Ví dụ

### Request

```json
{
    "amount": 100000,
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
    "partnerRefId": "AB123",
    "billCode": "PD12121",
    "serviceCode": "ENVHN",
    "signature": "b10294bae53e89919b3efd62a763bf3..."
}
```

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
    "account": {
        "balance": 12200000
    },
    "signature": "b10294bae53e89919b3efd62a763bf3228e260ef1a329..."
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/bill/pay' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --form 'amount="10000"' \
  --form 'billDetail="[{"billNumber":"KyMOdHtAYlsJ1kLD","period":"08/2099","amount":10000,"billCreated":"","billExpiry":"","billType":"","billOtherInfo":"","isPartialPaymentAllowed":false,"extraInfo":""}]"' \
  --form 'partnerRefId="8DL154LXW"' \
  --form 'billCode="HNH266201"' \
  --form 'serviceCode="WB_HN2"' \
  --form 'signature="cdf98502803dc3ebbae58e6fbc724fcb965b8c445957c2063717226ad5cc8952"'
```

### Request

#### REQUEST
