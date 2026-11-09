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
| feature_code | optional | String | Hình thức thanh toán. Truyền giá trị: `QR_PAY` nếu sử dụng QR PAY |  |
| amount | required | Integer | Số tiền thanh toán | min: 10000 |
| customer_phone_number | optional | String | Số điện thoại khách hàng | max: 20 |

#### Example Request

```json
// Ví dụ khi tạo thanh toán thẻ
{
  "partner_ref_id": "hadjUBSDjbfjaBBFNM",
  "order_info": "Appota test Card swipe",
  "terminal_id": "TID-5094322012",
  "payment_method": "POS",
  "amount": 12000,
  "customer_phone_number": "0989898657"
}

// Ví dụ khi tạo thanh toán QR Code
{
  "partner_ref_id": "igVSoghODYwBgJEbQdTj",
  "order_info": "Appota test QR Code",
  "terminal_id": "TID-5094322012",
  "payment_method": "QR",
  "amount": 12000,
  "customer_phone_number": "0989898657"
}

// Ví dụ khi tạo thanh toán QR Pay
{
  "partner_ref_id": "kdsvjhdbsAHHfbafbch",
  "order_info": "Appota test QR PAY",
  "terminal_id": "TID-5094322012",
  "payment_method": "QR",
  "feature_code": "QR_PAY",
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
| transaction.order_id | String | Mã đơn hàng do AppotaPay tạo |  |
| transaction.transaction_id | String | Mã giao dịch AppotaPay |  |
| transaction.partner_ref_id | String | Mã tham chiếu Partner |  |
| transaction.status | String | Trạng thái GD | pending = Giao dịch đang chờ xử lý. processing = Giao dịch đang tiến hành xử lý. success = Giao dịch thành công. error = Giao dịch thất bại. void = Giao dịch hoàn tiền. |
| transaction.amount | Integer | Số tiền thanh toán |  |
| transaction.error_code | Integer | Mã lỗi giao dịch (Lưu ý: chỉ trả về trong trường hợp `status` != success) |  |
| transaction.error_message | String | Thông tin chi tiết trạng thái giao dịch (Lưu ý: chỉ trả về trong trường hợp `status` != success) |  |
| transaction.payment_method | String | Phương thức thanh toán |  |
| transaction.created_at | String | Thời gian tạo giao dịch (định dạng chuẩn ISO_8601) |  |
| transaction.paid_at | String | Thời gian thanh toán (định dạng chuẩn ISO_8601) |  |
| transaction.updated_at | String | Thời gian cập nhật giao dịch (định dạng chuẩn ISO_8601) |  |
| transaction.is_sett | Boolean | Trạng thái kết toán của giao dịch |  |
| payment_info | Object | Thông tin thanh toán (khi sử dụng phương thức thanh toán QR) |  |
| payment_info.qr_content | string | Ảnh base64 QR thanh toán |  |
| payment_info.qr_url | string | Link QR thanh toán |  |
| payment_info.qr_type | string | Link QR (VIETQR nếu là QR Code, VIETQR_PAY nếu là QR PAY ) |  |

#### Example Response Success

```json
// Ví dụ response khi tạo thanh toán thẻ
{
  "transaction": {
    "order_id": "711773203426177024",
    "transaction_id": "01M5NX632VNDEGJX3KJXPAHKKX",
    "partner_ref_id": "hadjUBSDjbfjaBBFNM",
    "status": "pending",
    "amount": 12000,
    "error_code": "34",
    "error_message": "Giao dịch đang chờ xử lý",
    "payment_method": "POS",
    "created_at": "2026-10-24T09:52:35",
    "paid_at": "",
    "is_sett": false,
    "updated_at": "2026-10-24T09:52:35"
  },
  "payment_info": {
    "qr_content": "",
    "qr_url": "",
    "qr_type": ""
  }
}

// Ví dụ response khi tạo thanh toán QR Code
{
  "transaction": {
    "order_id": "711773778087768064",
    "transaction_id": "01M5NXA9RR4F5N4SH02XWYKKQK",
    "partner_ref_id": "igVSoghODYwBgJEbQdTj",
    "status": "pending",
    "amount": 12000,
    "error_code": "34",
    "error_message": "Giao dịch đang chờ xử lý",
    "payment_method": "QR",
    "created_at": "2026-10-24T09:54:52",
    "paid_at": "",
    "is_sett": false,
    "updated_at": "2026-10-24T09:54:53"
  },
  "payment_info": {
    "qr_content": "00020101021238590010A0000007270129000697041801159630120002883540208QRIBFTTA53037045802VN54051300262540309APPOTAPAY0823Tran ref AP2614682244480910DYNAMIC_QR6304FD06",
    "qr_url": "",
    "qr_type": "VIETQR"
  }
}

// Ví dụ response khi tạo thanh toán QR Pay
{
  "transaction": {
    "order_id": "711773569622470656",
    "transaction_id": "01M5NX8SDD692V05B0X0KX7FHR",
    "partner_ref_id": "kdsvjhdbsAHHfbafbch",
    "status": "pending",
    "amount": 12000,
    "error_code": "34",
    "error_message": "Giao dịch đang chờ xử lý",
    "payment_method": "QR",
    "created_at": "2026-10-24T09:54:03",
    "paid_at": "",
    "is_sett": false,
    "updated_at": "2026-10-24T09:54:04"
  },
  "payment_info": {
    "qr_content": "00020101021238630010A00000072701330006971031011912073010900000040250208QRIBFTTA5204581253037045405130025802VN5905CTEST6015ARAGATSOTN REGI626501187117735696224706560514AP2614682243790821UPDATE API PARTNER V263041CF8",
    "qr_url": "",
    "qr_type": "VIETQR_PAY"
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
