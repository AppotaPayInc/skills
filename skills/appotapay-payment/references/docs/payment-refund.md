<!-- source: https://docs.appotapay.com/payment/refund -->

# Hoàn tiền giao dịch

## Hoàn tiền giao dịch

Endpoint: POST `/api/v2/transaction/refund`

### Header Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| X-APPOTAPAY-AUTH | required | String | Cách tạo JWT_TOKEN |  |
| Content-Type | required | String | Giá trị: `application/json` |  |
| X-Request-ID | optional | String | Định dạng UUIDv4. Request ID để kiểm tra yêu cầu khi xảy ra sự cố | max:40 |
| X-Language | optional | String | Giá trị `vi` hoặc `en` tương ứng với link thanh toán sẽ là tiếng việt hoặc tiếng anh, (mặc định: `vi`) | in:vi,en |
| X-Account-Ref-ID | optional | String | Mã định danh của tài khoản Sub account do AppotaPay cung cấp. Bắt buộc truyền khi thanh toán giao dịch của Sub account loại owner |  |

```json
{
    "X-APPOTAPAY-AUTH": "JWT_TOKEN",
    "Content-Type": "application/json",
    "X-Request-ID": "Your_Unique_id",
    "X-Language": "vi",
    "X-Account-Ref-ID": "9723f73b-9295-4acb-884b-ab6310c2e653"
}
```

### Tham số

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Định dạng |
| --- | --- | --- | --- | --- |
| partnerRefId | required | String | Mã tham chiếu giao dịch của Partner đối với AppotaPay (không được trùng lặp) | max:50,alphanumeric |
| transactionId | required | String | Mã giao dịch thanh toán từ AppotaPay trả về | alphanumeric |
| amount | required | Integer | Số tiền hoàn | min:1000 |
| currency | required | String | Đơn vị tiền tệ (chấp nhận VND) | in:VND |
| reason | required | String | Lý do hoàn tiền | max:100,alphanumeric |

### Dữ liệu trả về

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| refundId | required | String | Mã giao dịch hoàn tiền phía AppotaPay |
| transactionId | required | String | Mã giao dịch thanh toán phía AppotaPay |
| partnerRefId | required | String | Mã tham chiếu giao dịch hoàn tiền phía đối tác |
| amount | required | Integer | Số tiền hoàn |
| currency | required | String | Đơn vị tiền tệ (chấp nhận VND) |
| reason | required | String | Lý do hoàn tiền |
| status | required | String | Trạng thái hoàn tiền |
| createdAt | required | String | Thời gian thực hiện giao dịch. (định dạng chuẩn RFC-3339) |
| refundedAt | optional | String | Thời gian thực hoàn tiền nếu giao dịch hoàn tiền thành công. (định dạng chuẩn RFC-3339) |

### Bảng mã trạng thái giao dịch hoàn tiền

| Trạng thái | Mô tả |
| --- | --- |
| pending | Giao dịch thanh toán không hỗ trợ hoàn tiền tự động AppotaPay tiếp nhận yêu cầu hoàn tiền và xử lý hoàn thủ công trong 1 ngày, đối tác có thể gọi API kiểm tra trạng thái giao dịch. Quá 1 ngày giao dịch vẫn chưa đổi về trạng thái cuối (success, error) thì đối tác vui lòng liên hệ CSKH để được trợ giúp |
| processing | Giao dịch thanh toán hỗ trợ hoàn tiền tự động AppotaPay tiếp nhận yêu cầu hoàn tiền và đang xử lý, đối tác có thể gọi API kiểm tra trạng thái giao dịch. Quá 1 ngày giao dịch vẫn chưa đổi về trạng thái cuối (success, error) thì đối tác vui lòng liên hệ CSKH để được trợ giúp |
| success | Giao dịch hoàn tiền thành công. |
| error | Giao dịch hoàn tiền thất bại. |

## Ví dụ

### Request

```json
{
    "partnerRefId": "5f61cf4f41e2b",
    "transactionId": "AP241453209745",
    "amount": 10000,
    "currency": "VND",
    "reason": "test refund"
}
```

### Response

```json
{
    "refundId": "f28a4ac3-e407-45f1-902b-bc05c6c50dfa",
    "transactionId": "AP241453209745",
    "partnerRefId": "5f61cf4f41e2b",
    "amount": 10000,
    "currency": "VND",
    "reason": "test refund",
    "status": "success",
    "createdAt": "2024-09-11T11:21:17+07:00",
    "refundedAt": ""
}
```

### Thất bại

> HTTP Status Code != 200
> Với errorCode trả về, vui lòng tham khảo bảng mã lỗi tại đây

#### Error response params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| errorCode | required | Integer | Mã lỗi |
| message | required | String | Mô tả lỗi |
| errors | optional | Array of Object | Mô tả lỗi chi tiết các trường nếu có |
| errors.field | required | Object | Trường dữ liệu bị lỗi |
| errors.reason | required | Object | Mô tả trường dữ liệu bị lỗi |

```json
{
  "errorCode": 1,
  "message": "Invalid Params",
  "errors": [
    {
      "field": "transaction.amount",
      "reason": "Field amount is required"
    },
    {
      "field": "transaction.currency",
      "reason": "Field currency is required"
    }
  ]
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v2/transaction/refund' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'X-Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653' \
  -d '{
  "partnerRefId": "5f61cf4f41e2b",
  "transactionId": "AP241453209745",
  "amount": 10000,
  "currency": "VND",
  "reason": "test refund"
}'
```

### Request

#### REQUEST

## Danh sách nhà cung cấp hỗ trợ refund

| Vendor code | Thời gian hỗ trợ refund | Auto qua api | Refund một phần | Refund nhiều lần | Refund toàn phần | Time user nhận tiền |
| --- | --- | --- | --- | --- | --- | --- |
| Napas | 1 năm | Có | Có | Có |  | 5 - 7 ngày làm việc |
| Vpbank Visa - Mastercard | 6 tháng | Có | Có | Có |  | 10 - 15 ngày làm việc |
| VnptPay |  | Có | Không | Không | Có |  |
| ONEPAY |  |  | Không | Không |  |  |
| EBILL |  |  | Không | Không |  |  |
| SHOPEE | 60 ngày | Có | Có | Có | Có | Real time |
| MOCA | 1 tháng | Có | Không | Không | Có | Real time |
| APPOTA WALLET |  | Có | Không | Không | Có | Real time |
| ZaloPay | 180 ngày | Có | Có | Có | Có | Real time |
| VA |  | Không | Không | Không |  |  |
| VNpay |  | Có | Có | Không |  |  |
| Cybersource | Không | Không | Không | Không | Không | Không |

## Bảng mã lỗi

| Mã lỗi | Mô tả |
| --- | --- |
| 1 | Thông tin yêu cầu thiếu hoặc không hợp lệ |
| 31 | Mã giao dịch bị trùng |
| 36 | Giao dịch không tồn tại |
| 129 | Vui lòng chờ `{times}` để tạo yêu cầu hoàn tiền mới. |
| 135 | Giao dịch không hỗ trợ hoàn tiền |
| 401 | Unauthorized |
| 500 | Hệ thống gặp lỗi, vui lòng thử lại sau |
