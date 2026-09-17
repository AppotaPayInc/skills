<!-- source: https://docs.appotapay.com/cc-merchant-host/refund-create -->

# Refund: Create

## Refund: Create

API refund có thể sử dụng khi khách hàng muốn hoàn trả lại giao dịch đã thanh toán thành công. Hoàn trả chỉ thực hiện được với các giao dịch có trạng thái `CAPTURED`

Hệ thống AppotaPay cho phép thực hiện hoàn trả 1 phần và thực hiện hoàn trả nhiều lần với 1 giao dịch capture thành công, với điều kiện tổng tiền yêu cầu hoàn trả cần nhỏ hơn số tiền đã capture.

Quá trình hoàn trả sẽ cần khoảng 1-3 ngày tuỳ vào từng issuing bank (có một số ngân hàng bạn cần chờ đến 14 ngày).

Thời gian tối đa để thực hiện hoàn trả với 1 giao dịch là 6 tháng, từ thời điểm giao dịch capture thành công.

### EndPoint

`POST` `/credit-card/refund`

### Header Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| X-APPOTAPAY-AUTH | required | String | Cách tạo JWT_TOKEN |  |
| Content-Type | required | String | Giá trị: `application/json` |  |
| X-Request-ID | optional | String | Định dạng UUIDv4. Request ID để kiểm tra yêu cầu khi xảy ra sự cố | max:42 |
| Language | optional | String | Giá trị `vi` hoặc `en` tương ứng với link thanh toán sẽ là tiếng việt hoặc tiếng anh, (mặc định: `vi`) | in:vi,en |
| X-Account-Ref-ID | optional | String | Mã định danh của tài khoản Sub account do AppotaPay cung cấp. Bắt buộc truyền khi thanh toán giao dịch của Sub account loại owner |  |

```json
{
    "X-APPOTAPAY-AUTH": "JWT_TOKEN",
    "Content-Type": "application/json",
    "X-Request-ID": "Your_Unique_id",
    "Language": "vi",
    "X-Account-Ref-ID": "9723f73b-9295-4acb-884b-ab6310c2e653"
}
```

### Request Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| transactionId | required | String | Mã giao dịch thanh toán đã thành công phía Appotapay trả về |  |
| merchantRefId | required | String | Mã tham chiếu, định danh cho yêu cầu khởi tạo từ merchant | Min: 1 Max:40 |
| amount | required | String | Số tiền hoàn | Min: 1000 Hỗ trợ: VND |
| currency | required | String | Đơn vị tiền hoàn | Hỗ trợ: VND |

### Example Request

```json
{
    "merchantRefId": "7Xthy1kbi",
    "transactionId": "01HJAG6Q3XMJBRJW28N1T8D6MM",
    "amount": 1000000, 
    "currency": "VND"
}
```

### Response Params

```json
{
    "refundId": "01HQJ41Q7135ZNJTKTWB92BTVH",
    "transactionId": "01HQHRWBC773J6CJV9VRZMBXD2",
    "merchantRefId": "S68O0whWv",
    "amount": 500000,
    "currency": "VND",
    "status": "success",
    "createdAt": "2024-02-26T14:11:12+07:00",
    "updatedAt": "2024-02-26T14:11:15+07:00"
}
```

#### Thành công

> Http Status Code 200 - OK

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| refundId | String | Mã giao dịch refund phía AppotaPay |
| transactionId | String | Mã giao dịch thanh toán gốc phía AppotaPay |
| merchantRefId | String | Mã tham chiếu, merchant gửi trong request |
| amount | String | Số tiền hoàn |
| currency | String | Đơn vị tiền hoàn |
| status | String | Trạng thái hoàn trả: `success`: Gửi yêu cầu Hoàn trả thành công (AppotaPay đã tiếp nhận yêu cầu) `error`: Hoàn trả thất bại `pending`: Chờ xử lý |
| errorInformation | Object | Lý do thất bại |
| errorInformation.errorCode | Integer | Mã lỗi thất bại, xem chi tiết tại error code |
| errorInformation.message | String | Mô tả lý do thất bại |
| errorInformation.details | Array or Object | Chi tiết thông tin thất bại |
| errorInformation.details.field | String | Trường gây ra lỗi |
| errorInformation.details.reason | String | Lý do |
| createdAt | String | Thời gian khởi tạo giao dịch theo chuẩn RFC-3339, time zone UTC+7 |
| updatedAt | String | Thời gian cập nhật giao dịch gần nhất theo chuẩn RFC-3339, time zone UTC+7 |

#### Thất bại

> HTTP Status Code != 200

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/credit-card/refund' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653' \
  -d '{
  "merchantRefId": "7Xthy1kbi",
  "transactionId": "01HJAG6Q3XMJBRJW28N1T8D6MM",
  "amount": 1000000,
  "currency": "VND"
}'
```

### Request

#### REQUEST
