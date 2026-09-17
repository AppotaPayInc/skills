<!-- source: https://docs.appotapay.com/virtual-account/bill-close -->

# API Đóng tài khoản thu hộ

## API Đóng tài khoản thu hộ

Endpoint: `/api/v1/service/ebill/close`

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

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Ghi chú |
| --- | --- | --- | --- | --- |
| accountNo | √ | String | Số tài khoản nhận tiền | max_length:30 |
| billCode | √ | String | Mã đơn hàng phía Partner, là mã duy nhất cho mỗi đơn hàng | max_length:50 |
| partnerRefId | √ | String | Mã yêu cầu duy nhất từ phía Partner | max_length:16 |
| signature | √ | String | Chữ ký các tham số trả về từ API, các tham số được đưa vào chữ ký theo thứ tự bao gồm: accountNo + billCode + partnerRefId (xem thêm phần cách tạo signature) |  |

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi trả về |
| message | String | Chi tiết mã lỗi |

## Ví dụ

### Request

```json
{
    "accountNo": "902000668565",
    "billCode": "VA586f8d6a684",
    "partnerRefId": "123456",
    "signature": "abc123",
}
```

### Response

```json
{
    "errorCode": 0,
    "message": "Thành công"
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/ebill/close' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  -d '{
  "accountNo": "902000668565",
  "billCode": "VA586f8d6a684",
  "partnerRefId": "123456",
  "signature": "abc123"
}'
```

### Request

#### REQUEST
