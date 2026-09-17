<!-- source: https://docs.appotapay.com/ewallet/confirm-payment -->

# API Xác Nhận Thanh Toán

API được dùng để xác thực giao dịch thanh toán trong trường hợp giao dịch cần xác thực đa thành tố.

### EndPoint

`POST` `/api/v2/ewallet/payment/confirm`

### Header Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| X-APPOTAPAY-AUTH | required | String | Cách tạo JWT_TOKEN |  |
| Authorization | required | String | User Access Token |  |
| Content-Type | required | String | Giá trị: `application/json` |  |
| X-Request-ID | optional | String | Định dạng UUIDv4. Request ID để kiểm tra yêu cầu khi xảy ra sự cố | max:42 |
| X-Language | optional | String | Giá trị `vi` hoặc `en` tương ứng với link thanh toán sẽ là tiếng việt hoặc tiếng anh, (mặc định: `vi`) | in:vi,en |
| X-Account-Ref-ID | optional | String | Mã định danh của tài khoản Sub account do AppotaPay cung cấp. Bắt buộc truyền khi thanh toán giao dịch của Sub account loại owner |  |

```json
{
  "X-APPOTAPAY-AUTH": "Bearer JWT_TOKEN",
  "Authorization": "Bearer ACCESS_TOKEN",
  "Content-Type": "application/json",
  "X-Request-ID": "Your_Unique_id",
  "X-Language": "vi",
  "X-Account-Ref-ID": "9723f73b-9295-4acb-884b-ab6310c2e653"
}
```

### Request Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| orderId | required | String | Mã đơn hàng phía đối tác |  |
| verificationMethod | required | String | Phương thức xác thực (OTP). Nhận được tại trường verificationMethod API Yêu Cầu Thanh Toán | Value: OTP, NONE |
| verificationCode | required | String | Mã xác thực (OTP) | min:1, max: 10 |
| signature | required | String | Chữ ký kiểm tra dữ liệu | signature = `hash_hmac('sha256', 'orderId={orderId}&verificationCode={verificationCode}' , SECRET_KEY))` |

### Example Request

```json
{
  "orderId": "241698338917842945",
  "verificationMethod": "OTP",
  "verificationCode": "123456",
  "signature": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
}
```

### Response Params

```json
{
  "transaction": {
    "orderId": "123728435",
    "partnerCode": "TEST",
    "transactionId": "233728435",
    "status": "success",
    "amount": 120000,
    "currency": "VND",
    "orderVersion": "1.0",
    "createdAt": "2024-01-29T11:36:03+07:00",
    "updatedAt": "2024-01-29T11:36:03+07:00"
  }
}
```

#### Thành công

> Http Status Code 200 - OK

| Tham số | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- |
| transaction | Object | Thông tin giao dịch |  |
| transaction.transactionId | String | Mã giao dịch phía AppotaPay |  |
| transaction.partnerCode | String | Mã đối tác |  |
| transaction.orderId | Integer | Mã đơn hàng phía đối tác |  |
| transaction.status | String | Trạng thái GD | pending = Giao dịch đang chờ xử lý. processing = Giao dịch đang tiến hành xử lý. success = Giao dịch thành công. error = Giao dịch thất bại. |
| transaction.amount | Integer | Số tiền thanh toán |  |
| transaction.currency | String | Đơn vị tiền tệ |  |
| transaction.orderVersion | String | Phiên bản thanh toán |  |
| transaction.errorCode | Integer | Mã lỗi (chỉ trả về khi status != success) |  |
| transaction.errorMessage | String | Thông tin chi tiết mã lỗi (chỉ trả về khi status != success) |  |
| transaction.createdAt | String | Thời gian tạo giao dịch (định dạng chuẩn RFC-3339) |  |
| transaction.updatedAt | String | Thời gian cập nhật giao dịch (định dạng chuẩn RFC-3339) |  |

#### Thất bại

> HTTP Status Code != 200

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi |
| message | String | Mô tả thêm về lỗi |

#### Bảng mã lỗi thường gặp

Mã lỗi đầy đủ vui lòng xem tại đây

| Mã lỗi | Mô tả |
| --- | --- |
| 1 | Thông tin yêu cầu thiếu hoặc không hợp lệ |
| 2 | Tham số signature không chính xác |
| 21 | Mã OTP không đúng |
| 22 | Mã OTP đã hết hạn xác thực, vui lòng thực hiện lại giao dịch |
| 33 | Giao dịch thất bại |
| 34 | Giao dịch đang được xử lý, vui lòng kiểm tra lại sau |
| 36 | Giao dịch không tồn tại |
| 39 | Người dùng nhập sai mã OTP quá số lần quy định |
| 40 | Giao dịch đã được hoàn trả |
| 41 | Giao dịch đã thành công trước đó |
| 42 | Yêu cầu lấy mã OTP quá số lần quy định |
| 52 | Phương thức thanh toán không hợp lệ |
| 70 | Bạn đã giao dịch vượt quá giới hạn trong ngày, vui lòng thử lại sau |
| 75 | Số tiền không đủ để thanh toán |
| 94 | Hệ thống đang bảo trì, vui lòng thử lại sau |
| 99 | Lỗi không xác định, vui lòng kiểm tra lại giao dịch sau |
| 162 | Bạn đã giao dịch vượt quá giới hạn trong tháng, vui lòng thử lại sau |
| 401 | Lỗi xác thực |
| 500 | Hệ thống gặp lỗi, vui lòng thử lại sau |

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v2/ewallet/payment/confirm' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Authorization: Bearer ACCESS_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'X-Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653' \
  -d '{
  "orderId": "241698338917842945",
  "verificationMethod": "OTP",
  "verificationCode": "123456",
  "signature": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
}'
```

### Request

#### REQUEST
