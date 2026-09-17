<!-- source: https://docs.appotapay.com/subscription/refund-callback -->

# Refund callback

## Refund callback

Sau khi yêu cầu hoàn tiền, hệ thống AppotaPay callback kết quả cho hệ thống của đối tác

- Sử dụng tham số `signature` để kiểm tra tính toàn vẹn của dữ liệu nhận được, phía đối tác tạo ra signature từ dữ liệu nhận được từ AppotaPay sau đó so sánh với tham số `signature` AppotaPay gửi sang.

## Web callback

AppotaPay sẽ gửi kết quả qua API URL của phía đối tác gửi AppotaPay để cấu hình, server phía đối tác kiểm tra tính toàn vẹn dữ liệu qua tham số `signature` sau đó cập nhật trạng thái hoàn tiền.

### Header

```json
{
    "Content-Type": "applicaton/json"
}
```

### Request params

> Phương thức: POST

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
| event | Required | String | Event: - refund.succeeded: hoàn tiền thành công - refund.failed: hoàn tiền thất bại |
| data | Required | Object | Data |
| data.refundId | Required | String | Mã giao dịch hoàn tiền phía AppotaPay |
| data.attemptId | Required | String | Mã định danh cho attempt thanh toán thành công trong cycle cần thực hiện refund. Mã được trả trong cycle object |
| data.refundRefId | Required | String | Mã tham chiếu giao dịch hoàn tiền phía đối tác |
| data.amount | Required | Integer | Số tiền hoàn |
| data.currency | Required | String | Đơn vị tiền tệ |
| data.reason | Required | String | Lý do hoàn tiền - FRAUDULENT: Lừa đảo - DUPLICATE: Bị trùng- REQUESTED_BY_CUSTOMER: Yêu cầu của khách- CANCELLATION: Hủy bỏ- OTHER: khác |
| data.status | Required | String | Trạng thái hoàn tiền |
| data.createdAt | Required | String | Thời gian thực hiện giao dịch (ISO 8601) |
| data.updatedAt | Required | String | Thời gian cập nhật giao dịch (ISO 8601) |

### Response format

- Đối tác cần phản hồi lại cho AppotaPay xác nhận đã nhận được kết quả
- Phản hồi được coi là thành công khi `HTTP code = 200`
