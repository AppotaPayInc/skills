<!-- source: https://docs.appotapay.com/mobile-topup -->

# API Nạp tiền điện thoại

Endpoint: `/api/v2/service/topup/charging`

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
| partnerRefId | √ | String | Mã giao dịch phía đối tác, duy nhất cho mỗi giao dịch | max_length: 50 |
| telco |  | String | Tên nhà mạng (xem thêm phần Phụ Lục bảng nhà mạng) |  |
| telcoServiceType | √ | String | Loại dịch vụ prepaid: Nạp tiền điện thoại trả trướcpostpaid: Nạp tiền điện thoại trả sau |  |
| productCode | √ | String | Mã sản phẩm (xem thêm API lấy bảng mã sản phẩm) |  |
| phoneNumber | √ | String | Số điện thoại nạp tiền (truyền dạng: 09x, 08x,..) |  |
| signature | √ | String | Chữ ký các tham số truyền lên API, các tham số được đưa vào chữ ký theo thứ tự bao gồm: partnerRefId + phoneNumber + productCode + telco + telcoServiceType (xem thêm phần cách tạo signature) |  |

Chú ý:

- APPOTAPAY đã hỗ trợ Partner trong việc chủ động kiểm tra nhà mạng của SĐT truyền sang.

- Partner có thể sử dụng bảng mã sản phẩm chung để truyền vào API mà không cần định nghĩa rõ product_code theo từng nhà mạng của SĐT (Bảng mã này dùng với nạp topup thường, không dùng cho topup data).

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi trả về |
| message | String | Mô tả chi tiết mã lỗi |
| transaction | Object | Thông tin giao dịch |
| transaction.phoneNumber | String | Số điện thoại nạp |
| transaction.amount | Integer | Số tiền giao dịch |
| transaction.productCode | String | Mã sản phẩm |
| transaction.topupAmount | String | Số tiền nạp |
| transaction.appotapayTransId | String | Mã giao dịch phía AppotaPay |
| transaction.time | String | Thời gian giao dịch (định dạng chuẩn RFC-3339) |
| transaction.telco | String | Tên nhà mạng Thông tin trả về có thể khác với request đầu vào do ghi nhận thực tế từ nhà mạng |
| transaction.telcoServiceType | String | Loại dịch vụ (giá trị có thể thay đổi theo thông tin thực tế của thuê bao do nhà mạng trả về) |
| account | Object | Thông tin tài khoản |
| account.balance | Integer | Số dư tài khoản sau giao dịch |
| signature | String | Chữ ký thông tin giao dịch trả về, các trường được ký bao gồm (amount + appotapayTransId + errorCode + phoneNumber + productCode + time + topupAmount) (xem thêm phần cách tạo signature) |

## Ví dụ

### Request

```json
{
    "partnerRefId": "AB123",
    "telco": "viettel",
    "telcoServiceType": "prepaid",
    "phoneNumber": "0866123456",
    "productCode": "viettel_10",
    "signature": "5a2774918a29cf4d2bdb78cccceb956f4c27837fad09a03a56e1df68b1bf29dd"
}
```

### Response

Thành công

```json
{
    "errorCode": 0,
    "message": "Thành công",
    "transaction": {
        "phoneNumber": "0866123456",
        "amount": 10000,
        "productCode": "viettel_10",
        "topupAmount": 10000,
        "appotapayTransId": "01J7G2DYZTPCGHM3AAF8ANZC7J",
        "time": "2024-09-13T17:48:06+07:00",
        "telco": "viettel",
        "telcoServiceType": "prepaid",
    },
    "account": {
        "balance": "121000000"
    },
    "signature": "e5f61a7eca55ca1c5a1b6305acfa0e52f6d3d562de1b9780faf5f247ed10ab8d"
}
```

Thất bại

```json
{
    "errorCode": 40,
    "message": "Hệ thống đang bảo trì, vui lòng thử lại sau"
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v2/service/topup/charging' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  -d '{
  "partnerRefId": "AB123",
  "telco": "viettel",
  "telcoServiceType": "prepaid",
  "phoneNumber": "0866123456",
  "productCode": "viettel_10",
  "signature": "5a2774918a29cf4d2bdb78cccceb956f4c27837fad09a03a56e1df68b1bf29dd"
}'
```

### Request

#### REQUEST
