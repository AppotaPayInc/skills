<!-- source: https://docs.appotapay.com/subscription/payment-method-action-callback -->

# Payment method action callback

Sau khi tạo payment method và khách thực hiện xác thực thông tin, hệ thống AppotaPay callback kết quả của requires action cho đối tác

- Sử dụng tham số `signature` để kiểm tra tính toàn vẹn của dữ liệu nhận được, phía đối tác tạo ra signature từ dữ liệu nhận được từ AppotaPay sau đó so sánh với tham số `signature` AppotaPay gửi sang.

## Redirect

AppotaPay sẽ gửi kết quả qua API URL của phía đối tác đã gửi lên API qua tham số `successReturnUrl` và `failureReturnUrl`, server phía đối tác kiểm tra tính toàn vẹn dữ liệu qua tham số `signature` sau đó cập nhật trạng thái của payment method.

### Request params

> Phương thức: GET

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| data | String | Thông tin giao dịch ở dạng base64encode & json_encode |
| signature | String | Chữ ký kiểm tra dữ liệu signature = `HMAC_SHA256(data, secretKey)` |
| time | String | Thời gian phản hồi |

### Giải mã dữ liệu

1. Đối tác sử dụng hàm `Base64Decode` để giải mã giữ liệu ở dạng string
2. Sử dụng hàm `JSON_Decode` để giải mã giữ liệu lần 2 ở dạng json

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| action | Required | Object | Action: AUTH |
| paymentMethodId | Required | String | Payment Method ID |
| status | Required | String | Trạng thái thực hiện requires action - PENDING: đang xử lý action
- VERIFIED: thực hiện requires action thành công - FAILED: thực
hiện requires action thất bại |
| errorCode | Required | Integer | Mã lỗi |
| errorMessage | Required | String | Mô tả lỗi |
