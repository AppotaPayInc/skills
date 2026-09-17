<!-- source: https://docs.appotapay.com/pos/request-payment -->

# API Yêu Cầu Thanh Toán

## API Yêu Cầu Thanh Toán

### EndPoint

`POST` `/api/v2/partner/orders/payment/create`

### Header Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| X-AppotaPay-Auth | required | String | Cách tạo JWT_TOKEN |
| Content-Type | required | String | Giá trị: `application/json` |
| X-Request-Id | required | String | Định dạng UUIDv4. Request ID để kiểm tra yêu cầu khi xảy ra sự cố |
| X-Signature | required | String | - Signature được tạo bởi thuật toán HMAC SHA256 Ví dụ: Signature = HMAC_SHA256(body, SECRET_KEY) , body là JSON String được truyền vào Request |

```json
{
  "Content-Type": "application/json",
  "X-AppotaPay-Auth": "JWT_TOKEN",
  "X-Request-Id": "Your_Unique_id",
  "X-Signature": "Your Signature"
}
```

### Request Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| partner_ref_id | required | String | Mã giao dịch tham chiếu của partner, unique (regex: a-z, A-Z, 0-9, _, -) | max: 26 |
| order_info | required | String | Thông tin đơn hàng | max: 100 |
| terminal_id | required | String | Mã định danh thiết bị (cung cấp bởi AppotaPay) | max: 20 |
| payment_method | required | String | Phương thức thanh toán (POS, QR) |  |
| amount | required | Integer | Số tiền thanh toán | min: 10000 |
| customer_phone_number | optional | String | Số điện thoại khách hàng | max: 20 |

#### Example Request

```json
{
  "partner_ref_id": "igVSoghODYwBgJEbQdTj",
  "order_info": "Appota test",
  "terminal_id": "TID-5094322012",
  "payment_method": "QR",
  "amount": 12000,
  "customer_phone_number": "0989898657"
}
```

### Response Params

#### Thành công

> Http Status Code 200 - OK

| Tham số | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- |
| transaction | Object | Thông tin giao dịch |  |
| transaction.transaction_id | String | Mã giao dịch AppotaPay |  |
| transaction.partner_ref_id | String | Mã tham chiếu Partner |  |
| transaction.status | String | Trạng thái GD | pending = Giao dịch đang chờ xử lý. processing = Giao dịch đang tiến hành xử lý. success = Giao dịch thành công. error = Giao dịch thất bại. void = Giao dịch hoàn tiền. |
| transaction.amount | Integer | Số tiền thanh toán |  |
| transaction.error_code | Integer | Mã lỗi giao dịch (Lưu ý: chỉ trả về trong trường hợp `status` != success) |  |
| transaction.error_message | String | Thông tin chi tiết trạng thái giao dịch (Lưu ý: chỉ trả về trong trường hợp `status` != success) |  |
| transaction.payment_method | String | Phương thức thanh toán |  |
| transaction.created_at | String | Thời gian tạo giao dịch (định dạng chuẩn ISO_8601) |  |
| transaction.paid_at | String | Thời gian thanh toán (định dạng chuẩn ISO_8601) |  |
| payment_info | Object | Thông tin thanh toán (khi sử dụng phương thức thanh toán QR) |  |
| payment_info.qr_content | string | Ảnh base64 QR thanh toán |  |
| payment_info.qr_url | string | Link QR thanh toán |  |
| payment_info.qr_type | string | Link QR(mặc định VIETQR) |  |

#### Example Response Success

```json
{
  "transaction": {
    "transaction_id": "01KFWSXKTKA645GHJMM27DWEBT",
    "partner_ref_id": "igVSoghODYwBgJEbQdTj",
    "status": "pending",
    "amount": 12000,
    "error_code": "34",
    "error_message": "Giao dịch đang chờ xử lý",
    "payment_method": "QR",
    "created_at": "2026-01-26T16:24:49",
    "paid_at": ""
  },
  "payment_info": {
    "qr_content": "00020101021238630010A000000727013300069704320119MQQ0759866wrYqzPLw70208QRIBFTTA5204549953037045405120005802VN5916QRPAYMENT UAT 216011HO CHI MINH62430109wrYqzPLw70708Q07598660814AP26146183702063042A9D",
    "qr_url": "",
    "qr_type": "VIETQR"
  }
}
```

#### Thất bại

> HTTP Status Code != 200

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| error_code | String | Mã lỗi |
| error_message | String | Chi tiết mã lỗi |

## Ví dụ

### Ví dụ Code

```bash
curl --location 'https://pos-gw.dev.appotapay.com/api/v2/partner/orders/payment/create' \
  --header 'Content-Type: application/json' \
  --header 'X-AppotaPay-Auth: JWT_TOKEN' \
  --header 'X-Request-Id: Your_Unique_id' \
  --header 'X-Signature: Your signature' \
  -d '{
  "partner_ref_id": "igVSoghODYwBgJEbQdTj",
  "order_info": "Appota test",
  "terminal_id": "TID-5094322012",
  "payment_method": "QR",
  "amount": 12000,
  "customer_phone_number": "0989898657"
}'
```

### Request

#### REQUEST
