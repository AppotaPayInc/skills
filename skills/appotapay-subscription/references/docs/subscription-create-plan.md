<!-- source: https://docs.appotapay.com/subscription/create-plan -->

# API Tạo plan

Endpoint: `/api/v1/subs/plans`

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

### Tham số

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Validate |
| --- | --- | --- | --- | --- |
| planRefId | Required | String | Mã định danh cho plan được cung cấp bởi partner. Các request có planRefId trùng nhau sẽ trả lỗi. | min:1, max: 50, format: alphanumeric |
| customerId | Required | String | Mã khách hàng |  |
| currency | Required | String | Đơn vị tiền tệ | in: VND |
| amount | Required | Integer | Số tiền thanh toán | min: 5000, max: 100000000 |
| country | Conditional, bắt buộc nếu trường paymentMethods không có thông tin | String | Mã quốc gia của GD Giá trị được chấp nhận - ID: Indonesia - PH: Philippines - VN: Vietnam - TH: Thailand - MY: Malaysia | Format ISO 3166-2 Country Code |
| returnUrl | Conditional, bắt buộc nếu trường paymentMethods không có thông tin | String | Đường dẫn điều hướng về AppotaPay sẽ gửi kết quả chi tiết qua URL này với một số thông tin như sau: LINK |  |
| paymentMethods | Optional | Array | Danh sách payment method (Chỉ áp dụng với mô hình Merchant hosted) |  |
| paymentMethods.*.paymentMethodId | Optional | String | Payment method ID |  |
| paymentMethods.*.rank | Optional | Integer | Thứ tự ưu tiên phương thức thanh toán sẽ được sử dụng trong chu kỳ thanh toán | min: 1 |
| paymentLinkForFailedAttempt | Optional | String | Nhận link thanh toán trong webhook nếu thanh toán cho chu kỳ thất bại - YES: nhận link thanh toán - NO: không nhận link thanh toán | default: NO, in: YES,NO |
| immediateActionType | Optional | String | Thực hiện trừ tiền ngay thì tạo thành công plan, null: tiền trừ vào thời điểm anchorDate - FULL_AMOUNT: thực hiện trừ tiền khi khởi tạo plan thành công | in: FULL_AMOUNT |
| failedCycleAction | Required | String | Hành động khi cycle thực hiện thanh toán thất bại - STOP: Dừng toàn bộ plan - RESUME: Bỏ qua cycle thất bại và tiến hành cycle kế tiếp | in: STOP, RESUME |
| serviceName | Optional | String | Tên dịch vụ bạn thực hiện thanh toán định kỳ (Chỉ áp dụng với mô hình Checkout page) | max:30 |
| schedule | Required | Object | Cấu hình chu kỳ thanh toán định kỳ |  |
| schedule.interval | Required | String | Tần suất thực hiện thanh toán định kỳ | in: DAY, WEEK, MONTH |
| schedule.intervalCount | Required | Integer | Đơn vị khoảng thời gian giữa 2 chu kỳ liên tiếp | min: 1 |
| schedule.totalRecurrence | Optional | Integer | Tổng số lần thanh toán định kỳ trong plan null: không giới hạn | min: 1 |
| schedule.anchorDate | Optional | String | Thời điểm thực hiện thanh toán định kỳ Default: ngày khởi tạo plan thành công Giá trị hợp lệ: ngày từ 1-28 (của 1 tháng) Lưu ý: nếu anchorDate: null và thời điểm khởi tạo plan là ngày 29/30/31 của tháng, anchorDate mặc định sẽ lấy value là ngày 1 của tháng tiếp theo | format: ISO-8601 |
| schedule.retryInterval | Conditional, bắt buộc nếu paymentLinkForFailedAttempt = ‘YES’ | String | Tần suất thực hiện thanh toán lại trong 1 cycle nếu thanh toán xảy ra vấn đề | in: DAY |
| schedule.retryIntervalCount | Conditional, bắt buộc nếu paymentLinkForFailedAttempt = ‘YES’ | Integer | Đơn vị khoảng thời gian giữa 2 lần thực hiện thanh toán lại | min:1 |
| schedule.totalRetry | Conditional, bắt buộc nếu paymentLinkForFailedAttempt = ‘YES’ | Integer | Tổng số lần thanh toán lại null: không thực hiện thanh toán lại | min:1, max: 10 |
| notificationConfig | Optional | Object | Cấu hình cách thức thanh toán cho dịch vụ thanh toán định kỳ |  |
| notificationConfig.[subscription.cycle.retrying] | Optional | Array | Kênh thanh toán bạn muốn người dùng nhận khi thanh toán cycle không thành công và người dùng có thể thực hiện thanh toán lại. Giá trị được chấp nhận ["EMAIL"] |  |
| notificationConfig.[subscription.cycle.succeeded] | Optional | Array | Kênh thanh toán bạn muốn người dùng nhận khi thanh toán cycle thành công.. Giá trị được chấp nhận ["EMAIL"] |  |
| notificationConfig.[subscription.cycle.failed] | Optional | Array | Kênh thanh toán bạn muốn người dùng nhận khi cycle thất bại (không thể tiếp tục thanh toán cycle Giá trị được chấp nhận ["EMAIL"] |  |
| notificationConfig.[subscription.plan.activated] | Optional | Array | Kênh thanh toán bạn muốn người dùng nhận khi Plan thanh toán định kỳ được khởi tạo và kích hoạt thành công. Giá trị được chấp nhận ["EMAIL"] |  |
| notificationConfig.[subscription.plan.inactivated] | Optional | Array | Kênh thanh toán bạn muốn người dùng nhận khi Plan thanh toán định kỳ tạm dừng Giá trị được chấp nhận ["EMAIL"] |  |
| currencyExchange | Optional | Object |  |  |
| currencyExchange.amount | Optional | Number | Số tiền quy đổi Hỗ trợ 2 số thập phân, ví dụ: 12.02 | min: 0.10, max: 9999999999 |
| currencyExchange.currency | Optional | String | Đơn vị tiền tệ chuyển đổi Hỗ trợ: USD |  |

### Example Request

```json
{
    "planRefId": "ASKJLKALK299",
    "customerId": "01HRVGAJSP7SX83X7AQ9QQYMBE",
    "currency": "VND",
    "amount": 85000,
    "paymentMethods": [
        {
            "paymentMethodId": "01HRVJY8ZMZFHRHE3KG2S24KKW",
            "rank": 1
        }
    ],
    "immediateActionType": "FULL_AMOUNT",
    "failedCycleAction": "STOP",
    "schedule": {
        "interval": "DAY",
        "intervalCount": 1,
        "totalRecurrence": 3,
        "anchorDate": "2024-01-13T15:23:40+07:00",
        "retryInterval": "DAY",
        "retryIntervalCount": 1,
        "totalRetry": 1
    }
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
    "errorCode": 1,
    "message": "Thông tin yêu cầu thiếu hoặc không hợp lệ",
    "errors": [
        {
            "field": "planRefId",
            "reason": "Trường plan ref id không được bỏ trống."
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
| 3002 | Mã tham chiếu Partner đã bị trùng, vui lòng thực hiện lại |
| 3003 | Customer không tồn tại |
| 3004 | Payment method không tồn tại |
| 3012 | Payment method không hợp lệ |

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/subs/plans' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653' \
  -d '{
  "planRefId": "ASKJLKALK299",
  "customerId": "01HRVGAJSP7SX83X7AQ9QQYMBE",
  "currency": "VND",
  "amount": 85000,
  "paymentMethods": [
    {
      "paymentMethodId": "01HRVJY8ZMZFHRHE3KG2S24KKW",
      "rank": 1
    }
  ],
  "immediateActionType": "FULL_AMOUNT",
  "failedCycleAction": "STOP",
  "schedule": {
    "interval": "DAY",
    "intervalCount": 1,
    "totalRecurrence": 3,
    "anchorDate": "2024-01-13T15:23:40+07:00",
    "retryInterval": "DAY",
    "retryIntervalCount": 1,
    "totalRetry": 1
  }
}'
```

### Request

#### REQUEST
