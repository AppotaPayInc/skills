<!-- source: https://docs.appotapay.com/subscription/deactive-plan -->

# API Deactive plan

Endpoint: `/api/v1/subs/plans/{planId}/deactivate`

Method: `POST`

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

### Dữ liệu trả về

### Thành công

> Http Status Code 200 - OK

Dữ liệu trả về thành công sẽ chứa một Plan object

### Thất bại

> HTTP Status Code != 200

#### Error response params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| errorCode | required | Integer | Mã lỗi |
| message | required | String | Mô tả lỗi |
| errors | optional | Array | Mô tả lỗi chi tiết các trường nếu có |
| errors.*.field | optional | String | Trường dữ liệu bị lỗi |
| errors.*.reason | optional | String | Mô tả trường dữ liệu bị lỗi |

```json
{
    "errorCode": 3005,
    "message": "Plan không tồn tại"
}
```

### Bảng mã lỗi thường gặp

Mã lỗi đầy đủ vui lòng xem tại đây

| Mã lỗi | Mô tả |
| --- | --- |
| 0 | Thành công |
| 1 | Thông tin yêu cầu thiếu hoặc không hợp lệ |
| 11 | Partner không tồn tại |
| 13 | Partner đã bị khoá |
| 14 | API Key không tồn tại |
| 15 | API Key chưa được kích hoạt hoặc đã bị khoá |
| 92 | IP không được phép truy cập |
| 99 | Lỗi không xác định, vui lòng liên hệ AppotaPay để biết thêm thông tin chi tiết |
| 401 | Lỗi xác thực |
| 500 | Hệ thống gặp lỗi, vui lòng thử lại sau |
| 3005 | Plan không tồn tại |
| 3006 | Plan đã inactive trước đó |
| 3046 | Plan đang chờ xử lý, vui lòng kiểm tra lại sau |

### Code Examples

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/subs/plans/01HRVGAJSP7SX83X7AQ9QQYMBE/deactivate' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653'
```

### Request

#### REQUEST
