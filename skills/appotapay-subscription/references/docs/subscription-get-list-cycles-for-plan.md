<!-- source: https://docs.appotapay.com/subscription/get-list-cycles-for-plan -->

# API Lấy danh sách cycle của plan

Endpoint: `/api/v1/subs/plans/{planId}/cycles`

Method: `GET`

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

### Tham số

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Validate |
| --- | --- | --- | --- | --- |
| page | Optional | Integer | Trang muốn lấy, default: 1 |  |
| limit | Optional | Integer | Số item trên một trang, default:20 |  |

### Dữ liệu trả về

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| data | Required | Array | Dữ liệu trả về |
| data.*.cycleId | Required | String | Cycle ID |
| data.*.cycleNumber | Required | Integer | Số thứ tự của cycle |
| data.*.currency | Required | Integer | Đơn vị tiền tệ |
| data.*.amount | Required | Integer | Số tiền thanh toán |
| data.*.scheduledAt | Required | String | Thời gian dự kiến thanh toán (định dạng chuẩn ISO-8601) |
| data.*.status | Required | String | Trạng thái của cycle: - SCHEDULED: cycle đã được khởi tạo và chờ đến thời gian thực hiện - PENDING: quá trình thanh toán định kỳ đang diễn ra (cycle không thể cập nhật) - RETRYING: cycle cần thực hiện thanh toán lại - FAILED: tất cả các attempt/retry được cấu hình thực hiện cho cycle đều thất bại - SUCCEEDED: cycle thực hiện thanh toán thành công - CANCELLED: cycle bị huỷ do yêu cầu từ merchant |
| data.*.createdAt | Required | String | Thời gian tạo cycle (ISO 8601) |
| data.*.updatedAt | Required | String | Thời gian cập nhật (ISO 8601) |
| meta | Required | Object | Thông tin phân trang |
| meta.page | Required | Integer | Trang hiện tại |
| meta.limit | Required | Integer | Số item trên một trang |
| meta.total | Required | Integer | Tổng số item |
| meta.pages | Required | Integer | Tổng số trang |

### Thành công

> Http Status Code 200 - OK

```json
{
    "data": [
        {
            "cycleId": "01HRVK1SZ5DTDQNRSBYCE14D81",
            "cycleNumber": 4,
            "currency": "VND",
            "amount": 85000,
            "scheduledAt": "2024-01-29T17:20:47+07:00",
            "status": "CANCELLED",
            "createdAt": "2024-01-26T17:30:30+07:00",
            "updatedAt": "2024-01-27T17:45:31+07:00"
        },
        {
            "cycleId": "01HRVK22S1ZA0Y3HYXFPZV23EY",
            "cycleNumber": 3,
            "currency": "VND",
            "amount": 405100,
            "scheduledAt": "2024-01-26T17:30:00+07:00",
            "status": "FAILED",
            "createdAt": "2024-01-26T17:22:18+07:00",
            "updatedAt": "2024-01-27T17:41:59+07:00"
        },
        {
            "cycleId": "01HRVK2D64BD35WVBCS65SNH07",
            "cycleNumber": 1,
            "currency": "VND",
            "amount": 85000,
            "scheduledAt": "2024-01-26T17:20:47+07:00",
            "status": "SUCCEEDED",
            "createdAt": "2024-01-26T17:20:51+07:00",
            "updatedAt": "2024-01-26T17:20:51+07:00"
        },
        {
            "cycleId": "01HRVK2NEYCHVZYJG3CK3HEQMQ",
            "cycleNumber": 2,
            "currency": "VND",
            "amount": 85000,
            "scheduledAt": "2024-01-27T17:20:47+07:00",
            "status": "SUCCEEDED",
            "createdAt": "2024-01-26T17:20:51+07:00",
            "updatedAt": "2024-01-26T17:22:18+07:00"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 4,
        "pages": 1
    }
}
```

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

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/subs/plans/01HRVGAJSP7SX83X7AQ9QQYMBE/cycles?page=1&limit=20' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653'
```

### Request

#### REQUEST
