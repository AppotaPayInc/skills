<!-- source: https://docs.appotapay.com/subscription/plan-action-callback -->

# PLan action callback

## PLan action callback

Sau khi tạo plan và khách thực hiện xác thực thông tin, hệ thống AppotaPay callback kết quả của requires action cho đối tác

- Sử dụng tham số `signature` để kiểm tra tính toàn vẹn của dữ liệu nhận được, phía đối tác tạo ra signature từ dữ liệu nhận được từ AppotaPay sau đó so sánh với tham số `signature` AppotaPay gửi sang.

## Redirect

AppotaPay sẽ gửi kết quả qua API URL của phía đối tác đã gửi lên API qua tham số `returnUrl`, server phía đối tác kiểm tra tính toàn vẹn dữ liệu qua tham số `signature` sau đó cập nhật trạng thái của plan.

### Request params

> Phương thức: GET

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| data | String | Thông tin giao dịch ở dạng base64encode & json_encode |
| signature | String | Chữ ký kiểm tra dữ liệu signature = `HMAC_SHA256(data, secretKey)` |
| time | String | Thời gian phản hồi |

### Giải mã dữ liệu

1. Đối tác sử dụng hàm `Base64Decode` để giải mã giữ liệu ở dạng string
2. Sử dụng hàm `JSON_Decode` để giải mã giữ liệu lần 2 ở dạng json

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| planRefId | Required | String | Mã tham chiếu của Partner |
| planId | Required | String | Plan ID |
| customerId | Required | String | Customer ID |
| currency | Required | String | Đơn vị tiền tệ |
| amount | Required | Integer | Số tiền thanh toán |
| paymentMethods | Required | Array | Danh sách payment method (Chỉ áp dụng với mô hình Merchant hosted) |
| paymentMethods.*.paymentMethodId | Required | String | Payment method ID |
| paymentMethods.*.rank | Required | Integer | Thứ tự ưu tiên phương thức thanh toán sẽ được sử dụng trong chu kỳ thanh toán |
| immediateActionType | Optional | String | Thực hiện trừ tiền ngay thì tạo thành công plan, null: tiền trừ vào thời điểm anchorDate - FULL_AMOUNT: thực hiện trừ tiền khi khởi tạo plan thành công |
| failedCycleAction | Required | String | Hành động khi cycle thực hiện thanh toán thất bại - STOP: Dừng toàn bộ plan - RESUME: Bỏ qua cycle thất bại và tiến hành cycle kế tiếp |
| serviceName | Optional | String | Tên dịch vụ bạn thực hiện thanh toán định kỳ (Chỉ áp dụng với mô hình Checkout page) |
| status | Required | String | Trạng thái của plan: - PENDING: plan đang khởi tạo, chờ trạng thái cuối từ AppotaPay - REQUIRES_ACITON: plan cần thực hiện thêm 1 số action để kích hoạt - ACTIVE: plan đã được kích hoạt để thực hiện thanh toán định kỳ - INACTIVE: plan đã đóng hoặc khởi tạo thất bại |
| actions | Optional | Array | Nếu status = REQUIRES_ACTION, object có các thông tin cụ thể để thực hiện action tiếp theo cho kích hoạt payment method |
| actions.*.url | Optional | String | URL thực hiên action |
| actions.*.action | Optional | String | Loại action - AUTH: thực hiện liên kết thanh toán hoặc thanh toán - RESEND_AUTH: Gửi lại mã uỷ quyền cho khách hàng |
| actions.*.method | Optional | String | Method thực hiện action - GET - POST |
| schedule | Required | Object | Cấu hình chu kỳ thanh toán định kỳ |
| schedule.interval | Required | String | Tần suất thực hiện thanh toán định kỳ |
| schedule.intervalCount | Required | String | Đơn vị khoảng thời gian giữa 2 chu kỳ liên tiếp |
| schedule.totalRecurrence | Optional | Integer | Tổng số lần thanh toán định kỳ trong plan null: không giới hạn |
| schedule.anchorDate | Optional | String | Thời điểm thực hiện thanh toán định kỳ Default: ngày khởi tạo plan thành công Giá trị hợp lệ: ngày từ 1-28 (của 1 tháng) Lưu ý: nếu anchorDate: null và thời điểm khởi tạo plan là ngày 29/30/31 của tháng, anchorDate mặc định sẽ lấy value là ngày 1 của tháng tiếp theo |
| schedule.retryInterval | Optional | String | Tần suất thực hiện thanh toán lại trong 1 cycle nếu thanh toán xảy ra vấn đề |
| schedule.retryIntervalCount | Optional | Integer | Đơn vị khoảng thời gian giữa 2 lần thực hiện thanh toán lại |
| notificationConfig | Object | Cấu hình cách thức thanh toán cho dịch vụ thanh toán định kỳ |  |
| notificationConfig.[subscription.cycle.retrying] | Optional | Array | Kênh thanh toán bạn muốn người dùng nhận khi thanh toán cycle không thành công và người dùng có thể thực hiện thanh toán lại. Giá trị được chấp nhận ["EMAIL"] |
| notificationConfig.[subscription.cycle.succeeded] | Optional | Array | Kênh thanh toán bạn muốn người dùng nhận khi thanh toán cycle thành công.. Giá trị được chấp nhận ["EMAIL"] |
| notificationConfig.[subscription.cycle.failed] | Optional | Array | Kênh thanh toán bạn muốn người dùng nhận khi cycle thất bại (không thể tiếp tục thanh toán cycle Giá trị được chấp nhận ["EMAIL"] |
| notificationConfig.[subscription.plan.activated] | Optional | Array | Kênh thanh toán bạn muốn người dùng nhận khi Plan thanh toán định kỳ được khởi tạo và kích hoạt thành công. Giá trị được chấp nhận ["EMAIL"] |
| notificationConfig.[subscription.plan.inactivated] | Array | Kênh thanh toán bạn muốn người dùng nhận khi Plan thanh toán định kỳ tạm dừng Giá trị được chấp nhận ["EMAIL"] |  |
| createdAt | Required | String | Thời gian tạo Plan (ISO 8601) |
| updatedAt | Required | String | Thời gian cập nhật (ISO 8601) |
