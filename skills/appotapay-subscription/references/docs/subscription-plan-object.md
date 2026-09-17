<!-- source: https://docs.appotapay.com/subscription/plan-object -->

# Plan Object

Plan object sẽ gồm customer object, schedule object để thiết lập thanh toán định ký cho một người dùng cuối cụ thể.

Mỗi object có cấu trúc như sau:

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| planRefId | String | Mã định danh cho plan được cung cấp bởi partner |
| planId | String | Plan ID |
| customerId | String | Customer ID |
| currency | String | Đơn vị tiền tệ |
| amount | Integer | Số tiền thanh toán |
| paymentMethods | Array | Danh sách payment method (Chỉ áp dụng với mô hình Merchant hosted) |
| paymentMethods.*.paymentMethodId | String | Payment method ID |
| paymentMethods.*.rank | Integer | Thứ tự ưu tiên phương thức thanh toán sẽ được sử dụng trong chu kỳ thanh toán |
| immediateActionType | String | Thực hiện trừ tiền ngay thì tạo thành công plan, null: tiền trừ vào thời điểm anchorDate - FULL_AMOUNT: thực hiện trừ tiền khi khởi tạo plan thành công |
| failedCycleAction | String | Hành động khi cycle thực hiện thanh toán thất bại - STOP: Dừng toàn bộ plan - RESUME: Bỏ qua cycle thất bại và tiến hành cycle kế tiếp |
| serviceName | String | Tên dịch vụ bạn thực hiện thanh toán định kỳ (Chỉ áp dụng với mô hình Checkout page) |
| status | String | Trạng thái của plan: - PENDING: plan đang khởi tạo, chờ trạng thái cuối từ AppotaPay - REQUIRES_ACITON: plan cần thực hiện thêm 1 số action để kích hoạt - ACTIVE: plan đã được kích hoạt để thực hiện thanh toán định kỳ - INACTIVE: plan đã đóng hoặc khởi tạo thất bại |
| actions | Array | Nếu status = REQUIRES_ACTION, object có các thông tin cụ thể để thực hiện action tiếp theo cho kích hoạt payment method |
| actions.*.url | String | URL thực hiên action |
| actions.*.action | String | Loại action - AUTH: thực hiện liên kết thanh toán hoặc thanh toán - RESEND_AUTH: Gửi lại mã uỷ quyền cho khách hàng - PAY: AppotaPay gửi link thanh toán để user có thể nhập thông tin thanh toán và thực hiện thanh toán Subscription |
| actions.*.method | String | Method thực hiện action - GET - POST |
| schedule | Object | Cấu hình chu kỳ thanh toán định kỳ |
| schedule.interval | String | Tần suất thực hiện thanh toán định kỳ |
| schedule.intervalCount | String | Đơn vị khoảng thời gian giữa 2 chu kỳ liên tiếp |
| schedule.totalRecurrence | Integer | Tổng số lần thanh toán định kỳ trong plan null: không giới hạn |
| schedule.anchorDate | String | Thời điểm thực hiện thanh toán định kỳ Default: ngày khởi tạo plan thành công Giá trị hợp lệ: ngày từ 1-28 (của 1 tháng) Lưu ý: nếu anchorDate: null và thời điểm khởi tạo plan là ngày 29/30/31 của tháng, anchorDate mặc định sẽ lấy value là ngày 1 của tháng tiếp theo |
| schedule.retryInterval | String | Tần suất thực hiện thanh toán lại trong 1 cycle nếu thanh toán xảy ra vấn đề |
| schedule.retryIntervalCount | Integer | Đơn vị khoảng thời gian giữa 2 lần thực hiện thanh toán lại |
| notificationConfig | Object | Cấu hình cách thức thanh toán cho dịch vụ thanh toán định kỳ |
| notificationConfig.[subscription.cycle.retrying] | Array | Kênh thanh toán bạn muốn người dùng nhận khi thanh toán cycle không thành công và người dùng có thể thực hiện thanh toán lại. Giá trị được chấp nhận ["EMAIL"] |
| notificationConfig.[subscription.cycle.succeeded] | Array | Kênh thanh toán bạn muốn người dùng nhận khi thanh toán cycle thành công.. Giá trị được chấp nhận ["EMAIL"] |
| notificationConfig.[subscription.cycle.failed] | Array | Kênh thanh toán bạn muốn người dùng nhận khi cycle thất bại (không thể tiếp tục thanh toán cycle Giá trị được chấp nhận ["EMAIL"] |
| notificationConfig.[subscription.plan.activated] | Array | Kênh thanh toán bạn muốn người dùng nhận khi Plan thanh toán định kỳ được khởi tạo và kích hoạt thành công. Giá trị được chấp nhận ["EMAIL"] |
| notificationConfig.[subscription.plan.inactivated] | Array | Kênh thanh toán bạn muốn người dùng nhận khi Plan thanh toán định kỳ tạm dừng Giá trị được chấp nhận ["EMAIL"] |
| currencyExchange | Object |  |
| currencyExchange.amount | Number | Số tiền quy đổi Hỗ trợ 2 số thập phân, ví dụ: 12.02 |
| currencyExchange.currency | String | Đơn vị tiền tệ chuyển đổi Hỗ trợ: USD |
| createdAt | String | Thời gian tạo Plan (ISO 8601) |
| updatedAt | String | Thời gian cập nhật (ISO 8601) |

### Ví dụ

```json
{
    "planRefId": "ASKJLKALK299",
    "planId": "01HRVJZV0W9NK63SDDXHW04T9H",
    "customerId": "01HRVM5AA6JCKZJ8ERZ6MKKFJZ",
    "currency": "VND",
    "amount": 85000,
    "paymentMethods": [
        {
            "paymentMethodId": "01HRVM7BFCP1QH7R6MFPASVH0W",
            "rank": 1
        }
    ],
    "immediateActionType": "FULL_AMOUNT",
    "failedCycleAction": "STOP",
    "status": "PENDING",
    "actions": [],
    "schedule": {
        "interval": "DAY",
        "intervalCount": 1,
        "totalRecurrence": 3,
        "anchorDate": "2024-01-13T15:23:40+07:00",
        "retryInterval": "DAY",
        "retryIntervalCount": 1
    },
    "createdAt": "2024-01-29T11:36:02+07:00",
    "updatedAt": "2024-01-29T11:36:04+07:00"
}
```
