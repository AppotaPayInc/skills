<!-- source: https://docs.appotapay.com/subscription/cycle-object -->

# Cycle Object

## Cycle Object

Cycle object đề cập đến một trường hợp cụ thể về hành động của gói đăng ký định kỳ. Cycle object được tạo từ plan object trong đó các hành vi thanh toán định được xác định.

Mỗi object có cấu trúc như sau:

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| cycleId | String | Cycle ID |
| planId | String | Plan ID được khởi tạo tại AppotaPay và trả cho đối tác tương ứng với cycle |
| cycleNumber | Integer | Số thứ tự của cycle |
| currency | Integer | Đơn vị tiền tệ |
| amount | Integer | Số tiền thanh toán |
| attemptCount | Integer | Số lần attempt |
| attemptDetails | Array | Thông tin chi tiết của attempt |
| attemptDetails.*.attemptNumber | Integer | Số thứ tự của attempt |
| attemptDetails.*.createdAt | String | Thời gian tạo attempt. (định dạng chuẩn ISO-8601) |
| attemptDetails.*.attemptId | Integer | ID của cycle attempt |
| attemptDetails.*.type | String | Loại attempt - INITIAL: attempt đầu tiên với mỗi cycle - RETRY: attempt có type là INITIAL không thành công, logic retry cho các attempt tiếp theo được thiết lập - PAYMENT_LINK: nếu bạn sử dụng paymentLinkForFailedAttempt trong khi tạo plan, attempt sử dụng payment link sẽ có type này - FORCED: nếu bạn thực hiện force cycle thông qua API chúng tôi cung cấp |
| attemptDetails.*.status | String | Trạng thái của attempt: - PENDING: đang thực hiện thanh toán cycle - SUCCESS: thực hiện attempt với cycle thành công - FAILED: thực hiện attempt với cycle thất bại |
| attemptDetails.*.nextRetryTime | String | Thời gian thử lại lần tiếp theo. (định dạng chuẩn ISO-8601) |
| scheduledAt | String | Thời gian dự kiến thanh toán (định dạng chuẩn ISO-8601) |
| status | String | Trạng thái của cycle: - SCHEDULED: cycle đã được khởi tạo và chờ đến thời gian thực hiện - PENDING: quá trình thanh toán định kỳ đang diễn ra (cycle không thể cập nhật - RETRYING: cycle cần thực hiện thanh toán lại - FAILED: tất cả các attempt/retry được cấu hình thực hiện cho cycle đều thất bại - SUCCEEDED: cycle thực hiện thanh toán thành công - CANCELLED: cycle bị huỷ do yêu cầu từ merchant |
| createdAt | String | Thời gian tạo cycle (ISO 8601) |
| updatedAt | String | Thời gian cập nhật (ISO 8601) |

### Ví dụ

```json
{
    "cycleId": "01HRVK2NEYCHVZYJG3CK3HEQMQ",
    "planId": "01HRVJZV0W9NK63SDDXHW04T9H",
    "cycleNumber": 3,
    "currency": "VND",
    "amount": 405100,
    "attemptCount": 5,
    "attemptDetails": [
        {
            "attemptNumber": 4,
            "createdAt": "2024-01-22T18:03:42+07:00",
            "attemptId": "01HRVK5AFCB5EJASJVEK48VD96",
            "type": "FORCED",
            "status": "FAILED",
            "nextRetryTime": null
        },
        {
            "attemptNumber": 2,
            "createdAt": "2024-01-22T18:03:20+07:00",
            "attemptId": "01HRVK5K8V0D7ZGNA6PSQGD1DF",
            "type": "FORCED",
            "status": "FAILED",
            "nextRetryTime": null
        }
    ],
    "scheduledAt": "2024-02-14T16:23:28+07:00",
    "status": "SCHEDULED",
    "createdAt": "2024-01-22T18:01:28+07:00",
    "updatedAt": "2024-01-22T18:03:58+07:00"
}
```
