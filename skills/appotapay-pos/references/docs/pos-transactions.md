<!-- source: https://docs.appotapay.com/pos/transactions -->

# API Danh sách giao dịch

## API Danh sách giao dịch

Endpoint: `/api/v2/partner/orders/transactions`

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
| payment_method | optional | String | Phương thức thanh toán(POS,QR) |
| page | required | String |  |
| limit | required | String |  |

### Response Params

#### Thành công

> Http Status Code 200 - OK

| Tham số | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- |
| transactions | Array Object | Thông tin danh sách giao dịch |  |
| transaction.order_id | String | Mã đơn hàng |  |
| transaction.transaction_id | String | Mã giao dịch AppotaPay |  |
| transaction.partner_ref_id | String | Mã tham chiếu Partner |  |
| transaction.status | String | Trạng thái GD | pending = Giao dịch đang chờ xử lý. processing = Giao dịch đang tiến hành xử lý. success = Giao dịch thành công. error = Giao dịch thất bại. void = Giao dịch hoàn tiền. |
| transaction.is_sett | Boolean | Trạng thái kết toán của GD | true: Giao dịch đã kết toán false: Giao dịch chưa kết toán |
| transaction.amount | Integer | Số tiền thanh toán |  |
| transaction.error_code | Integer | Mã lỗi giao dịch (Lưu ý: chỉ trả về trong trường hợp `status` != success) |  |
| transaction.error_message | String | Thông tin chi tiết trạng thái giao dịch (Lưu ý: chỉ trả về trong trường hợp `status` != success) |  |
| transaction.payment_method | String | Phương thức thanh toán |  |
| transaction.created_at | String | Thời gian tạo giao dịch (định dạng chuẩn ISO_8601) |  |
| transaction.updated_at | String | Thời gian kết toán giao dịch (định dạng chuẩn ISO_8601) |  |
| transaction.paid_at | String | Thời gian thanh toán (định dạng chuẩn ISO_8601) |  |
| pagination | Object |  |  |
| pagination.limit | string | Limit |  |
| pagination.page | string | Page |  |
| pagination.total | string | Total |  |
| pagination.total_items | string | Total Items |  |

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
  "transactions": [
    {
      "order_id": "676979536619700224",
      "transaction_id": "01KXYP0X3YH18V0HB313S5FR89",
      "partner_ref_id": "95OK-EE4V-K6RY-427J",
      "status": "success",
      "amount": 10000,
      "error_code": "00",
      "error_message": "Giao dịch thành công",
      "payment_method": "QR",
      "created_at": "2026-07-20T09:34:59",
      "paid_at": "2026-07-20T09:43:33",
      "is_sett": true,
      "updated_at": "2026-07-20T09:43:34"
    }
  ],
  "pagination": {
    "limit": 1,
    "page": 1,
    "total": 10,
    "total_items": 10
  }
}
```

### Ví dụ Code

```bash
curl --location 'https://pos-gw.dev.appotapay.com/api/v2/partner/orders/transactionspage=1&limit=25' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Lang: vi'
```

### Request

#### REQUEST
