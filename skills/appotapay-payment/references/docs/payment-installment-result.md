<!-- source: https://docs.appotapay.com/payment/installment-result -->

# Xử lý kết quả trả góp

Sau khi giao dịch thanh toán thẻ tín dụng được chuyển đổi sang hình thức trả góp, AppotaPay sẽ gửi thông báo kết quả qua API URL của phía đối tác đã đăng ký để đối tác cập nhật trạng thái giao dịch trả góp.

- Cần kiểm tra kĩ thông số trường `transaction.status`, `transaction.paymentAmount` & `signature` phải hợp lệ trước khi xác nhận giao dịch trả góp thành công
- Sử dụng tham số `signature` để kiểm tra tính toàn vẹn của dữ liệu nhận được, phía đối tác tạo ra signature từ dữ liệu nhận được từ AppotaPay sau đó so sánh với tham số `signature` AppotaPay gửi sang
- Chữ ký được tính trên chuỗi Base64 gốc của trường `data` (không phải trên JSON đã giải mã) — cần xác thực `signature` trước khi giải mã `data`
- IPN có thể được gửi lại nhiều lần cho cùng một giao dịch
- Trường `time` chỉ mang tính tham khảo thời điểm gửi, không tham gia vào việc tính `signature`

## IPN (Instant Payment Notification)

AppotaPay sẽ gửi thông báo kết quả giao dịch trả góp qua API URL của phía đối tác đã đăng ký, server phía đối tác kiểm tra tính toàn vẹn dữ liệu qua tham số `signature` sau đó cập nhật trạng thái của giao dịch trả góp.

### Header

```json
{
    "Content-Type": "application/json"
}
```

### Response params

> Phương thức: POST

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| data | String | Thông tin giao dịch ở dạng base64encode & json_encode |
| signature | String | Chữ ký kiểm tra dữ liệu signature = `HMAC_SHA256(data, secretKey)` |
| time | String | Thời gian phản hồi |

### Giải mã dữ liệu

1. Đối tác sử dụng hàm `Base64Decode` để giải mã dữ liệu ở dạng string
2. Sử dụng hàm `JSON_Decode` để giải mã dữ liệu lần 2 ở dạng json

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| transaction | required | Object | Thông tin giao dịch trả góp |
| transaction.transactionId | required | String | Mã giao dịch trả góp do AppotaPay sinh ra |
| transaction.partnerCode | required | String | Mã định danh partner |
| transaction.referenceId | required | String | Mã đơn hàng của giao dịch thanh toán gốc (orderId) |
| transaction.bankCode | required | String | Mã ngân hàng phát hành thẻ |
| transaction.authCode | required | String | Mã chuẩn chi (approval code) của ngân hàng |
| transaction.paymentAmount | required | Integer | Tổng số tiền giao dịch trả góp (VND) |
| transaction.payPerMonth | required | Integer | Số tiền phải trả mỗi tháng (VND) |
| transaction.feeConversion | required | Float | Tỷ lệ phí chuyển đổi trả góp (%) của gói vay được chọn |
| transaction.loanPackageId | required | String | ID gói vay trả góp áp dụng |
| transaction.gracePeriod | required | String | Kỳ hạn trả góp (số tháng) |
| transaction.status | required | String | Trạng thái giao dịch trả góp |
| transaction.statusCancel | optional | String | Trạng thái huỷ giao dịch trả góp |
| transaction.errorCode | required | Integer | Mã lỗi giao dịch trả góp |
| transaction.errorMessage | required | String | Mô tả lỗi tương ứng với `errorCode` |
| transaction.feePartner | required | Integer | Phí partner phải chịu (VND) |
| transaction.feeUser | required | Integer | Phí khách hàng phải chịu (VND) |
| transaction.reasonCancel | optional | String | Lý do huỷ giao dịch trả góp |
| transaction.reasonUpdate | optional | String | Lý do cập nhật giao dịch |
| transaction.completedAt | optional | Integer | Thời điểm hoàn tất giao dịch trả góp (Unix timestamp (giây)) |
| transaction.updatedAt | required | Integer | Thời điểm cập nhật gần nhất (Unix timestamp (giây)) |
| transaction.createdAt | required | Integer | Thời điểm tạo giao dịch trả góp (Unix timestamp (giây)) |

#### Bảng mã trạng thái

| Trạng thái | Mô tả |
| --- | --- |
| pending | Giao dịch đang chờ xử lý. |
| success | Giao dịch thành công. |
| error | Giao dịch thất bại. |

#### Bảng mã trạng thái huỷ

| Trạng thái | Mô tả |
| --- | --- |
| wait_vendor | Đang chờ vendor xử lý yêu cầu huỷ |
| wait_bank | Vendor đã xử lý, đang chờ ngân hàng xác nhận |
| bank_reject | Ngân hàng từ chối yêu cầu huỷ |
| rejected | Yêu cầu huỷ bị từ chối |
| cancelled | Giao dịch trả góp đã được huỷ thành công |

#### Bảng mã lỗi

| Mã lỗi | Mô tả |
| --- | --- |
| 2 | Param không hợp lệ |
| 35 | Lỗi hệ thống, Vui lòng Retry |
| 44 | Có lỗi xảy ra trong quá trình xử lý |
| 45 | Kiểm tra thẻ không hợp lệ |
| 46 | IP Webhook không hợp lệ |
| 47 | Chữ ký xác thực đối tác không hợp lệ |
| 49 | Lỗi hệ thống, Không cho phép retry |
| 50 | Mã ngân hàng không hợp lệ |
| 52 | Lỗi khi gọi sang provider |
| 53 | Lỗi không có mã secret key CTT |
| 54 | Lỗi Không thể hủy giao dịch |
| 55 | Lỗi Giao dịch đã hủy |
| 56 | Lỗi Mã Order đã tồn tại |
| 57 | Số tiền không hợp lệ |
| 100 | Mới tạo |
| 101 | Chờ chuyển đổi (Đã gửi Provider) |
| 102 | Đã chuyển sang bank |
| 103 | Chuyển đổi thành công |
| 104 | Chuyển đổi thất bại (Provider từ chối) |
| 105 | Chuyển đổi thất bại (Ngân hàng từ chối) |
| 108 | Huỷ thành công |
| 109 | Khởi tạo thất bại |
| 401 | Token không hợp lệ |

Example Request:

```json
{
    "data": "eyJ0cmFuc2FjdGlvbiI6eyJ0cmFuc2FjdGlvbklkIjoiQVAyMDA5MTAwMTQxMjVCIiwicGFydG5lckNvZGUiOiJNRVJDSEFOVF9DT0RFIiwicmVmZXJlbmNlSWQiOiJNUkNfT1JERVJfMTIzNDUiLCJiYW5rQ29kZSI6IlZDQiIsImF1dGhDb2RlIjoiMTMxMjMzOCIsInBheW1lbnRBbW91bnQiOjEyMDAwMDAwLCJwYXlQZXJNb250aCI6MTAwMDAwMCwiZmVlQ29udmVyc2lvbiI6Mi41LCJsb2FuUGFja2FnZUlkIjoiTFBfVkNCXzEyTSIsImdyYWNlUGVyaW9kIjoiMTIiLCJzdGF0dXMiOiJzdWNjZXNzIiwic3RhdHVzQ2FuY2VsIjpudWxsLCJlcnJvckNvZGUiOjEwMywiZXJyb3JNZXNzYWdlIjoiQ2h1eeG7g24gxJHhu5VpIHRow6BuaCBjw7RuZyIsImZlZVBhcnRuZXIiOjMwMDAwMCwiZmVlVXNlciI6MCwicmVhc29uQ2FuY2VsIjpudWxsLCJyZWFzb25VcGRhdGUiOm51bGwsImNvbXBsZXRlZEF0IjoxNzgyOTkwOTAwLCJ1cGRhdGVkQXQiOjE3ODI5OTA5MDAsImNyZWF0ZWRBdCI6MTc4Mjk4NzMwMH19",
    "time": 1782990900,
    "signature": "171846e6962c5537c546ec5d6e6a864800db2366c330f418d7eff87661248a4c"
}
```

Dữ liệu sau khi giải mã

```json
{
    "transaction": {
        "transactionId": "AP200910014125B",
        "partnerCode": "MERCHANT_CODE",
        "referenceId": "MRC_ORDER_12345",
        "bankCode": "VCB",
        "authCode": "1312338",
        "paymentAmount": 12000000,
        "payPerMonth": 1000000,
        "feeConversion": 2.5,
        "loanPackageId": "LP_VCB_12M",
        "gracePeriod": "12",
        "status": "success",
        "statusCancel": null,
        "errorCode": 103,
        "errorMessage": "Chuyển đổi thành công",
        "feePartner": 300000,
        "feeUser": 0,
        "reasonCancel": null,
        "reasonUpdate": null,
        "completedAt": 1782990900,
        "updatedAt": 1782990900,
        "createdAt": 1782987300
    }
}
```

### Response format

- Khi xác nhận giao dịch trả góp thành công thông qua IPN, đối tác cần phản hồi lại cho AppotaPay xác nhận đã nhận được kết quả
- Trường hợp phía Partner không phản hồi lại thành công, phía AppotaPay sẽ phản hồi thêm tối đa 3 lần, mỗi lần cách nhau trong khoảng 5 phút
- Phản hồi được coi là thành công khi `HTTP code = 200` và tham số `status` trong body response = `ok`

Example success response

> HTTP Code: 200

> Body: {"status": "ok"}
