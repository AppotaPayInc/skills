<!-- source: https://docs.appotapay.com/subscription/update-customer -->

# API Cập nhật customer

Endpoint: `/api/v1/customers/{customerId}`

Method: `PATCH`

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
| customer | Required | Object | Thông tin khách hàng |  |
| customer.firstName | Required | String | Tên khách hàng | min:1, max: 50 |
| customer.lastName | Optional | String | Họ khách hàng | min:1, max: 50 |
| customer.mobileNumber | Optional | String | Số điện thoại Format: +[Mã vùng][Số điện thoại] Ví dụ: +84919333777 | min:1, max: 16, format: E.164 |
| customer.email | Optional | String | Email | min:1, max: 50 |
| customer.gender | Optional | String | Giới tính - MALE: nam - FEMALE: nữ - OTHER: khác | in: MALE, FEMALE, OTHER |
| customer.dateOfBirth | Optional | String | Ngày sinh | format YYYY-MM-DD string |
| customer.placeOfBirth | Optional | String | Nơi sinh | max: 50 |
| customer.nationality | Optional | String | Mã quốc gia | format ISO 3166-2 Country Code |

### Example Request

```json
{
    "customer": {
        "firstName": "Ha",
        "lastName": "Phan",
        "mobileNumber": "+84123456789",
        "email": "ha@gmail.com",
        "gender": "MALE",
        "dateOfBirth": "1996-04-23",
        "placeOfBirth": "HN",
        "nationality": "EC"
    }
}
```

### Dữ liệu trả về

### Thành công

> Http Status Code 200 - OK

Dữ liệu trả về thành công sẽ chứa một Customer object

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
    "errorCode": 1,
    "message": "Thông tin yêu cầu thiếu hoặc không hợp lệ",
    "errors": [
        {
            "field": "customer.firstName",
            "reason": "Trường customer.first name phải là một chuỗi."
        }
    ]
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
| 3003 | Customer không tồn tại |

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/customers/ASKJLKALK213' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653' \
  -d '{
  "customer": {
    "firstName": "Ha",
    "lastName": "Phan",
    "mobileNumber": "+84123456789",
    "email": "ha@gmail.com",
    "gender": "MALE",
    "dateOfBirth": "1996-04-23",
    "placeOfBirth": "HN",
    "nationality": "EC"
  }
}'
```

### Request

#### REQUEST
