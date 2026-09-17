<!-- source: https://docs.appotapay.com/subscription/get-list-payment-methods -->

# API Lấy danh sách payment method

Endpoint: `/api/v1/subs/payment-methods`

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
| paymentMethodRefId | Optional | String | Mã định danh cho payment method được cung cấp bởi partner |  |
| customerId | Optional | String | Customer ID |  |
| paymentMethod | Optional | String | Phương thức thanh toán - CC_SUBS: thanh toán với thẻ quốc tế
- EWALLET_SUBS: thanh toán với ví điện tử |  |
| reusability | Optional | String | Khả năng sử dụng lại của payment method - MULTIPLE_USE: sử dụng nhiều lần |  |

### Dữ liệu trả về

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| data | Required | Array | Dữ liệu trả về một mảng chứa các Payment method object. Trả về mảng trống khi không có kết quả. |
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
            "paymentMethodRefId": "ASKJLKALK203980",
            "paymentMethodId": "6ed0eba4-1e86-4be0-9b00-6beec92953c2",
            "customerId": "3e9c3d0e-b0cc-4300-9752-6aaa4c0f0d44",
            "country": "VN",
            "currency": "VND",
            "paymentMethod": "CC_SUBS",
            "reusability": "MULTIPLE_USE",
            "card": {
                "properties": {
                    "skipThreeDSecure": "NO",
                    "successReturnUrl": "https://devtool.vn/success",
                    "failureReturnUrl": "https://devtool.vn/failure"
                },
                "cardInfo": {
                    "cardNumber": "520000-2151",
                    "cardMonth": "07",
                    "cardYear": "2034",
                    "cardHolderName": "Mai Minh"
                }
            },
            "billing": {
                "country": "EC",
                "city": "HN",
                "provinceState": "CG",
                "address": "CG",
                "zipcode": "530000"
            },
            "status": "ACTIVE",
            "actions": [
                {
                    "url": "https://acpg.dev.appotapay.com/subscription/authentication/redirect?reference_id=520ccb8f-88f1-4660-a75b-efb8a55f3ab8&signature=21984af4cb91c0f844a6f8762cfc018e74b9d7d32121d3b6da116e2117032416",
                    "action": "AUTH",
                    "method": "GET"
                }
            ],
            "createdAt": "2024-03-14T10:02:51+07:00",
            "updatedAt": "2024-03-14T10:05:54+07:00"
        },
        {
            "partnerRefId": "ASKJLKALK203979",
            "paymentMethodId": "01HRVKBXH9W9SZXEMJMRNY2YVD",
            "customerId": "01HRVK5K8V0D7ZGNA6PSQGD1DF",
            "country": "VN",
            "currency": "VND",
            "paymentMethod": "CC_SUBS",
            "reusability": "MULTIPLE_USE",
            "card": {
                "properties": {
                    "skipThreeDSecure": "NO",
                    "successReturnUrl": "https://devtool.vn/success",
                    "failureReturnUrl": "https://devtool.vn/failure"
                },
                "cardInfo": {
                    "cardNumber": "520000-2151",
                    "cardMonth": "07",
                    "cardYear": "2034",
                    "cardHolderName": "Mai Minh"
                }
            },
            "billing": {
                "country": "EC",
                "city": "HN",
                "provinceState": "CG",
                "address": "CG",
                "zipcode": "530000"
            },
            "status": "REQUIRES_ACTION",
            "actions": [
                {
                    "url": "https://acpg.dev.appotapay.com/subscription/authentication/redirect?reference_id=1bc5458d-fd4e-4bcc-8bd7-093b894e2665&signature=f9c1e781fb5717ac4ca14145291521189773785627d3bd3bd55b537eaaaeb28d",
                    "action": "AUTH",
                    "method": "GET"
                }
            ],
            "createdAt": "2024-03-13T16:47:47+07:00",
            "updatedAt": "2024-03-13T16:47:48+07:00"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 2,
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
    "errorCode": 500,
    "message": "Hệ thống gặp lỗi, vui lòng thử lại sau"
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
| 14 | API Key ko tồn tại |
| 15 | API Key chưa được kích hoạt hoặc đã bị khoá |
| 92 | IP không được phép truy cập |
| 99 | Lỗi không xác định, vui lòng liên hệ AppotaPay để biết thêm thông tin chi tiết |
| 401 | Lỗi xác thực |
| 500 | Hệ thống gặp lỗi, vui lòng thử lại sau |

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/subs/payment-methods?page=1&limit=20&paymentMethodRefId=PM123456789&customerId=3e9c3d0e-b0cc-4300-9752-6aaa4c0f0d44&paymentMethod=CC_SUBS&reusability=MULTIPLE_USE' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653'
```

### Request

#### REQUEST
