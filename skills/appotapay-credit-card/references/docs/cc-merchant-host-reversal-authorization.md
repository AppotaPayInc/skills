<!-- source: https://docs.appotapay.com/cc-merchant-host/reversal-authorization -->

# Reverse Authorization

Bạn có thể sử dụng API để huỷ uỷ quyền, với các giao dịch có trạng thái `AUTHORIZED` và chưa thực hiện capture.

Thời gian tối đa để thực hiện huỷ uỷ quyền là T+7 từ thời điểm uỷ quyền (authorization) thành công. Nếu giao dịch đó sau 7 ngày không được capture hoặc reversal, chúng tôi sẽ thực hiện huỷ uỷ quyền.

### EndPoint

`POST` `/credit-card/reversal`

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

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| authorizationId | required | String | Mã giao dịch (id) được tạo bởi AppotaPay, trả trong phần phản hồi khi sử dụng API Create Charge với capture: false |
| merchantRefId | required | String | Mã tham chiếu, định danh cho yêu cầu khởi tạo từ merchant |

### Example Request

```json
{
    "merchantRefId": "MufRIHgy13",
    "authorizationId": "01HJAFB1GMVTC74SN2FMA5PG5X"
}
```

### Response Params

```json
{
    "reversalId": "01HQHS26CFK4CEGE2QW0PATV5B",
    "authorizationId": "01HQHRZQNJE4BWRB8P9P5Z8BE7",
    "merchantRefId": "MufRIHgy11",
    "amount": 1000000,
    "currency": "VND",
    "status": "success",
    "createdAt": "2024-02-26T10:59:13+07:00",
    "updatedAt": "2024-02-26T10:59:15+07:00",
    "reversedAt": "2024-02-26T10:59:14+07:00"
}
```

#### Thành công

> Http Status Code 200 - OK

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| merchantRefId | String | Mã tham chiếu, merchant gửi trong request |
| authorizationId | String | Mã giao dịch khi thực hiện authorization |
| reversalId | String | Mã giao dịch huỷ uỷ quyền, AppotaPay tạo và trả cho merchant |
| amount | Number | Số tiền đã huỷ uỷ quyền |
| status | String | Trạng thái huỷ uỷ quyền `success`: yêu cầu huỷ uỷ quyền thành công `error`: huỷ uỷ quyền không thành công `pending`: yêu cầu huỷ uỷ quyền đang được xử lý |
| errorInformation | Object | Lý do thất bại |
| errorInformation.errorCode | Integer | Mã lỗi thất bại, xem chi tiết tại error code |
| errorInformation.message | String | Mô tả lý do thất bại |
| errorInformation.details | Array or Object | Chi tiết thông tin thất bại |
| errorInformation.details.field | String | Trường gây ra lỗi |
| errorInformation.details.reason | String | Lý do |
| createdAt | String | Thời gian khởi tạo giao dịch theo chuẩn RFC-3339, time zone UTC+7 |
| updatedAt | String | Thời gian cập nhật giao dịch gần nhất theo chuẩn RFC-3339, time zone UTC+7 |
| reversedAt | String | Thời gian thực hiện huỷ uỷ quyền theo chuẩn RFC-3339, time zone UTC+7 |

#### Thất bại

> HTTP Status Code != 200

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/credit-card/reversal' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653' \
  -d '{
  "merchantRefId": "MufRIHgy13",
  "authorizationId": "01HJAFB1GMVTC74SN2FMA5PG5X"
}'
```

### Request

#### REQUEST
