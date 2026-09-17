<!-- source: https://docs.appotapay.com/pos/detail-transaction -->

# API Chi tiết giao dịch

Endpoint: `/api/v2/partner/orders/transaction/:partner_ref_id`

Method: `GET`

Header: Cách tạo JWT_TOKEN

```json
{
  "X-APPOTAPAY-AUTH": "JWT_TOKEN",
  "X-Request-Id": "Your_Unique_id",
  "Content-Type": "application/json",
  "X-Lang": "vi"
}
```

### Request params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| partner_ref_id | required | String | Mã tham chiếu của giao dịch partner |

### Response Params

#### Thành công

> Http Status Code 200 - OK

| Tham số | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- |
| transaction_id | String | Mã giao dịch AppotaPay |  |
| order_id | String | Mã đơn hàng |  |
| status | String | Trạng thái GD | pending = Giao dịch đang chờ xử lý. processing = Giao dịch đang tiến hành xử lý. success = Giao dịch thành công. error = Giao dịch thất bại. void = Giao dịch hoàn tiền. |
| is_sett | Boolean | Trạng thái kết toán của GD | true: Giao dịch đã kết toán false: Giao dịch chưa kết toán |
| amount | Integer | Số tiền thanh toán |  |
| error_code | Integer | Mã lỗi giao dịch (Lưu ý: chỉ trả về trong trường hợp `status` != success) |  |
| error_message | String | Thông tin chi tiết trạng thái giao dịch (Lưu ý: chỉ trả về trong trường hợp `status` != success) |  |
| payment_method | String | Phương thức thanh toán |  |
| created_at | String | Thời gian tạo giao dịch (định dạng chuẩn ISO_8601) |  |
| updated_at | String | Thời gian kết toán giao dịch (định dạng chuẩn ISO_8601) |  |
| paid_at | String | Thời gian thanh toán (định dạng chuẩn ISO_8601) |  |

#### Thất bại

> HTTP Status Code != 200

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| error_code | String | Mã lỗi |
| error_message | String | Chi tiết mã lỗi |

## Ví dụ

### Response

```json
{
  "order_id": "676979536619700224",
  "transaction_id": "01KXYP0X3YH18V0HB313S5FR89",
  "payment_method": "QR",
  "amount": 10000,
  "status": "success",
  "error_code": "00",
  "error_message": "Giao dịch thành công",
  "created_at": "2026-07-20T09:34:59",
  "paid_at": "2026-07-20T09:43:33",
  "is_sett": true,
  "updated_at": "2026-07-20T09:43:34"
}
```

### Ví dụ Code

```bash
curl --location 'https://pos-gw.dev.appotapay.com/api/v2/partner/orders/transaction/:partner_ref_id' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'X-Request-Id: UUID' \
  --header 'Content-Type: application/json' \
  --header 'X-Lang: vi'
```

### Request

#### REQUEST
