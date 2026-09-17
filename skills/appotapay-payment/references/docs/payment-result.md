<!-- source: https://docs.appotapay.com/payment/result -->

# Xử lý kết quả thanh toán

## Xử lý kết quả thanh toán

Sau khi khách hàng hoàn tất quá trình thanh toán, hệ thống AppotaPay thông báo kết quả cho hệ thống của đối tác qua 2 hình thức

- Cần kiểm tra kĩ thông số trường status, orderAmount & signature phải hợp lệ trước khi xác nhận giao dịch thành công
- Nên gọi api check trạng thái giao dịch để đảm bảo kết quả được cập nhật chính xác nhất
- Sử dụng tham số `signature` để kiểm tra tính toàn vẹn của dữ liệu nhận được, phía đối tác tạo ra signature từ dữ liệu nhận được từ AppotaPay sau đó so sánh với tham số `signature` AppotaPay gửi sang.
- IPN chỉ trả khi giao dịch thành công

## Redirect URL

- Khách hàng sẽ được điều hướng đến URL của phía đối tác đã truyền lên API qua tham số `redirectUrl`
- Ở trang này phía đối tác kiểm tra dữ liệu, trạng thái giao dịch và hiển thị thông báo cho khách hàng.

Các tham số (query string) được gửi kèm vào URL

> Method: GET

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| data | String | Thông tin giao dịch ở dạng base64encode & json_encode |
| signature | String | Chữ ký kiểm tra dữ liệu signature = `HMAC_SHA256(data, secretKey)` |
| time | String | Thời gian phản hồi |

### Example result

data=`eyJ0cmFuc2FjdGlvbiI6eyJlcnJvckNvZGUiOjAsIm1lc3NhZ2UiOiJUaFx1MDBlMG5oIGNcdTAwZjRuZyIsInBhcnRuZXJDb2RlIjoiVEVTVCIsImFwaUtleSI6Im9NaEpwa3o3SzZIRGNSNlMiLCJvcmRlckFtb3VudCI6NTAwMDAsImFtb3VudCI6NTAwMDAsImRpc2NvdW50QW1vdW50IjowLCJmZWVVc2VyIjowLCJzdGF0dXMiOiJzdWNjZXNzIiwiY3VycmVuY3kiOiJWTkQiLCJvcmRlcklkIjoiNWY1YjQ2Y2I3M2ZkMCIsImJhbmtDb2RlIjoiU0hCIiwicGF5bWVudE1ldGhvZCI6IkFUTSIsInBheW1lbnRUeXBlIjoiV0VCIiwiYXBwb3RhcGF5VHJhbnNJZCI6IkFQMjAwOTEwMDE0MTI1QiIsInRyYW5zYWN0aW9uVHMiOjE1OTk4MTc0MzMsImV4dHJhRGF0YSI6InRlc3QgdGVzdCJ9fQ==`
&signature=`9487dd169d2178b249d1503d2f2d7f01d1210517f6ae3a2703760cb218c838f3&time=53485768945`

## IPN (Instant Payment Notification)

AppotaPay sẽ gửi thông báo giao dịch qua API URL của phía đối tác đã gửi lên API qua tham số `notifyUrl`, server phía đối tác kiểm tra tính toàn vẹn dữ liệu qua tham số `signature` sau đó cập nhật trạng thái của đơn hàng.

### Header

```json
{
    "Content-Type": "applicaton/json"
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

Ở cả IPN & URL khi thông báo đến Partner sẽ chung 1 định dạng dữ liệu

1. Đối tác sử dụng hàm `Base64Decode` để giải mã giữ liệu ở dạng string
2. Sử dụng hàm `JSON_Decode` để giải mã giữ liệu lần 2 ở dạng json

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| transaction | required | Object | Thông tin giao dịch |
| transaction.transactionId | required | String | Mã giao dịch phía Appotapay |
| transaction.reconciliationId | optional | String | Mã đối soát giao dịch khi giao dịch thành công |
| transaction.partnerCode | required | String | Mã đối tác |
| transaction.status | required | String | Trạng thái giao dịch |
| transaction.errorCode | required | Integer | Bảng mã lỗi |
| transaction.errorMessage | required | String | Mô tả lỗi |
| transaction.orderAmount | required | Integer | Số tiền đơn hàng |
| transaction.amount | required | Integer | Số tiền thanh toán với nhà cung cấp |
| transaction.discountAmount | required | Integer | Số tiền giảm giá |
| transaction.currency | required | String | Đơn vị tiền tệ |
| transaction.bankCode | optional | String | Mã Ngân hàng khách hàng đã chọn |
| transaction.paymentMethod | required | String | Phương thức thanh toán |
| transaction.action | required | String | Loại thanh toán |
| transaction.clientIp | optional | String | IP khách hàng thanh toán |
| transaction.version | optional | String | Version API |
| transaction.fee | optional | Object | Phí thanh toán |
| transaction.fee.customer_fee | optional | String | Phí thanh toán tính cho khách hàng |
| transaction.createdAt | required | String | Thời gian tạo giao dịch. (định dạng chuẩn RFC-3339) |
| transaction.updatedAt | required | String | Thời gian cập nhật giao dịch. (định dạng chuẩn RFC-3339) |
| partnerReference.order.id | required | String | Mã đơn hàng phía đối tác |
| partnerReference.order.info | required | String | Thông tin đơn hàng |
| partnerReference.order.extraData | required | String | Thông tin tuỳ chọn bổ sung |
| tokenResult | optional | String | Thông tin token và thẻ được lưu |

#### Bảng mã trạng thái

| Trạng thái | Mô tả |
| --- | --- |
| pending | Giao dịch đang chờ xử lý. |
| processing | Giao dịch đang tiến hành xử lý. |
| success | Giao dịch thành công. |
| error | Giao dịch thất bại. |

#### Thông tin token

| Mã | Mô tả | Lưu ý |
| --- | --- | --- |
| status | Trạng thái lưu thẻ |  |
| message | Thông báo lỗi |  |
| card | Thông tin thẻ |  |
| card.status | Trạng thái thẻ |  |
| card.token | Thông tin token cho lần thanh toán tiếp theo | max:32 |
| card.card_number | Số thẻ |  |
| card.card_name | Tên chủ thẻ |  |
| card.card_date | Ngày hết hạn/phát hành của thẻ |  |
| card.card_type | Loại thẻ |  |

Example Request:

```json
{
    "data": "eyJ0cmFuc2FjdGlvbiI6eyJ0cmFuc2FjdGlvbklkIjoiQVAyNDE0NTMyMTM3NDAiLCJyZWNvbmNpbGlhdGlvbklkIjoiQVAyNDE0NTMyMTM3NDAiLCJwYXJ0bmVyQ29kZSI6IkNQTSIsInN0YXR1cyI6InN1Y2Nlc3MiLCJlcnJvckNvZGUiOjAsImVycm9yTWVzc2FnZSI6IlRoXHUwMGUwbmggY1x1MDBmNG5nIiwib3JkZXJBbW91bnQiOjEwMDAwLCJhbW91bnQiOjEwMDAwLCJkaXNjb3VudEFtb3VudCI6MCwiY3VycmVuY3kiOiJWTkQiLCJiYW5rQ29kZSI6IlNBSUdPTkJBTksiLCJwYXltZW50TWV0aG9kIjoiQVRNIiwiYWN0aW9uIjoiUEFZX1dJVEhfUkVUVVJOX1RPS0VOIiwiY2xpZW50SXAiOiIxMTguNzAuOS42IiwidmVyc2lvbiI6IjIuMCIsImZlZSI6eyJjdXN0b21lcl9mZWUiOjB9LCJjcmVhdGVkQXQiOiIyMDI0LTA5LTExVDExOjMyOjE2KzA3OjAwIiwidXBkYXRlZEF0IjoiMjAyNC0wOS0xMVQxMTozMjo0MCswNzowMCJ9LCJwYXJ0bmVyUmVmZXJlbmNlIjp7Im9yZGVyIjp7ImlkIjoieVFvTTJjQUpkIiwiaW5mbyI6InRlc3QgdGhhbmggdG9hbiIsImV4dHJhRGF0YSI6IiJ9fSwidG9rZW5SZXN1bHQiOiJ7XCJzdGF0dXNcIjowLFwibWVzc2FnZVwiOlwiVGhcXHUwMGUwbmggY1xcdTAwZjRuZ1wiLFwiY2FyZFwiOntcInN0YXR1c1wiOlwiYWN0aXZlXCIsXCJ0b2tlblwiOlwiMjMzNjEwMDY4NjYyOTkwOVwiLFwiY2FyZF9uYW1lXCI6XCJOR1VZRU4gVkFOIEFcIixcImNhcmRfbnVtYmVyXCI6XCI5NzA0MDB4eHh4eHgwMDE4XCIsXCJjYXJkX2RhdGVcIjpcIlwiLFwiY2FyZF90eXBlXCI6XCJBVE1fQ0FSRFwifX0ifQ==",
    "time": 1726029178,
    "signature": "171846e6962c5537c546ec5d6e6a864800db2366c330f418d7eff87661248a4c"
}
```

### Response format

- Khi xác nhận giao dịch thành công thông qua IPN, đối tác cần phản hồi lại cho AppotaPay xác nhận đã nhận được kết quả
- Trường hợp phía Partner không phản hồi lại thành công, phía AppotaPay sẽ phản hồi thêm tối đa 3 lần, mỗi lần cách nhau trong khoảng 5 phút
- Phản hồi được coi là thành công khi `HTTP code = 200` và tham số `status` trong body response = `ok`

Example success response

> HTTP Code: 200

> Body: {"status": "ok"}
