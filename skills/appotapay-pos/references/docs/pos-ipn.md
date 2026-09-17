<!-- source: https://docs.appotapay.com/pos/ipn -->

# Xử lý kết quả thanh toán

## Xử lý kết quả thanh toán

Sau khi khách hàng hoàn tất quá trình thanh toán, hệ thống AppotaPay thông báo kết quả cho hệ thống của đối tác qua IPN

- Cần kiểm tra kĩ thông số trường status, amount & signature phải hợp lệ trước khi xác nhận giao dịch thành công
- Nên gọi api check trạng thái giao dịch để đảm bảo kết quả được cập nhật chính xác nhất
- Sử dụng tham số `signature` để kiểm tra tính toàn vẹn của dữ liệu nhận được, phía đối tác tạo ra signature từ dữ liệu nhận được từ AppotaPay sau đó so sánh với tham số `signature` AppotaPay gửi sang.
- IPN sẽ trả khi giao dịch có trạng thái cuối: success, void, error

### EndPoint

`POST` `URL-IPN-PARTNER`

### Header Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| Content-Type | required | String | Giá trị: `application/json` |

```json
{
  "Content-Type": "application/json"
}
```

### Request Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| data | required | String | Thông tin giao dịch ở dạng base64encode & json_encode |
| signature | required | String | HMAC_SECRETSHA256(data,SECRET_KEY) |

### Giải mã dữ liệu

1. Đối tác sử dụng hàm `Base64Decode` để giải mã dữ liệu ở dạng string
2. Sử dụng hàm `JSON_Decode` để giải mã giữ liệu lần 2 ở dạng json

| Tham số | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- |
| transaction | Object | Thông tin giao dịch |  |
| transaction.transaction_id | String | Mã giao dịch AppotaPay |  |
| transaction.order_id | String | Mã đơn hàng |  |
| transaction.partner_ref_id | String | Mã tham chiếu Partner |  |
| transaction.order_info | String | Thông tin đơn hàng |  |
| transaction.status | String | Trạng thái GD | pending = Giao dịch đang chờ xử lý. processing = Giao dịch đang tiến hành xử lý. success = Giao dịch thành công. error = Giao dịch thất bại. void = Giao dịch hoàn tiền. |
| transaction.amount | Integer | Số tiền thanh toán |  |
| transaction.bank_code | String | Mã bank *APPOTA: payment method = QR |  |
| transaction.bank_type | String | *EWALLET: payment method = QR |  |
| transaction.error_code | Integer | Mã lỗi giao dịch (Lưu ý: chỉ trả về trong trường hợp `status` != success) |  |
| transaction.error_message | String | Thông tin chi tiết trạng thái giao dịch (Lưu ý: chỉ trả về trong trường hợp `status` != success) |  |
| transaction.payment_method | String | Phương thức thanh toán |  |
| transaction.created_at | String | Thời gian tạo giao dịch (định dạng chuẩn ISO_8601) |  |
| transaction.paid_at | String | Thời gian thanh toán (định dạng chuẩn ISO_8601) |  |
| version | String | Version IPN |  |
| Time | string | Thời gian thanh confirm (định dạng chuẩn ISO_8601) |  |

Thành công

> HTTP Code: 200

> Body: {"status": "ok"}

#### Thất bại

> HTTP Status Code != 200

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| error_code | String | Mã lỗi |
| error_message | String | Chi tiết mã lỗi |
