<!-- source: https://docs.appotapay.com/subscription/cycle-callback -->

# Cycle callback

Hệ thống AppotaPay callback kết quả của cycle cho hệ thống của đối tác

- Sử dụng tham số `signature` để kiểm tra tính toàn vẹn của dữ liệu nhận được, phía đối tác tạo ra signature từ dữ liệu nhận được từ AppotaPay sau đó so sánh với tham số `signature` AppotaPay gửi sang.

## Web callback

AppotaPay sẽ gửi kết quả qua API URL của phía đối tác gửi AppotaPay để cấu hình, server phía đối tác kiểm tra tính toàn vẹn dữ liệu qua tham số `signature` sau đó cập nhật trạng thái của cycle.

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
| event | Required | String | Event: - subscription.cycle.created: cycle được tạo thành công - subscription.cycle.succeeded: cycle được thanh toán thành công - subscription.cycle.retrying: cycle thực hiện attempt không thành công, thực hiện thanh toán lại lần tiếp theo - subscription.cycle.failed: cycle thanh toán thất bại - subscription.cycle.force_attempt_failed: force cycle attempt không thành công |
| data | Required | Object | Data |
| data.cycleId | Required | String | Cycle ID |
| data.planId | Required | String | Plan ID |
| data.cycleNumber | Required | Integer | Số thứ tự của cycle |
| data.currency | Required | Integer | Đơn vị tiền tệ |
| data.amount | Required | Integer | Số tiền thanh toán |
| data.attemptCount | Required | Integer | Số lần attempt |
| attemptDetails | Required | Array | Thông tin chi tiết của attempt |
| attemptDetails.*.attemptNumber | Required | Integer | Số thứ tự của attempt |
| attemptDetails.*.createdAt | Required | String | Thời gian tạo attempt. (định dạng chuẩn ISO-8601) |
| attemptDetails.*.attemptId | Required | Integer | ID của cycle attempt |
| attemptDetails.*.type | Required | String | Loại attempt - INITIAL: attempt đầu tiên với mỗi cycle - RETRY: attempt có type là INITIAL không thành công, logic retry cho các attempt tiếp theo được thiết lập - PAYMENT_LINK: nếu bạn sử dụng paymentLinkForFailedAttempt trong khi tạo plan, attempt sử dụng payment link sẽ có type này - FORCED: nếu bạn thực hiện force cycle thông qua API chúng tôi cung cấp |
| attemptDetails.*.status | Required | String | Trạng thái của attempt: - PENDING: đang thực hiện thanh toán cycle - SUCCESS: thực hiện attempt với cycle thành công - FAILED: thực hiện attempt với cycle thất bại |
| attemptDetails.*.nextRetryTime | Required | String | Thời gian thử lại lần tiếp theo. (định dạng chuẩn ISO-8601) |
| data.scheduledAt | Required | String | Thời gian dự kiến thanh toán (định dạng chuẩn ISO-8601) |
| data.status | Required | String | Trạng thái của cycle: - SCHEDULED: cycle đã được khởi tạo và chờ đến thời gian thực hiện - PENDING: quá trình thanh toán định kỳ đang diễn ra (cycle không thể cập nhật - RETRYING: cycle cần thực hiện thanh toán lại - FAILED: tất cả các attempt/retry được cấu hình thực hiện cho cycle đều thất bại - SUCCEEDED: cycle thực hiện thanh toán thành công - CANCELLED: cycle bị huỷ do yêu cầu từ merchant |
| data.createdAt | Required | String | Thời gian tạo cycle (ISO 8601) |
| data.updatedAt | Required | String | Thời gian cập nhật (ISO 8601) |

### Response format

- Đối tác cần phản hồi lại cho AppotaPay xác nhận đã nhận được kết quả
- Phản hồi được coi là thành công khi `HTTP code = 200`
