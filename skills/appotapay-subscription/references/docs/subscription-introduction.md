<!-- source: https://docs.appotapay.com/subscription/introduction -->

# Giới thiệu tổng quan

Chúng tôi cung cấp dịch vụ để cho phép doanh nghiệp của bạn kết nối thanh toán định kỳ với các gói sản phẩm/ sản phẩm cần thu phí theo chu kỳ cụ thể.

Khi doanh nghiệp của bạn thực hiện kết nối mô hình Merchant-hosted (Thanh toán quốc tế), bạn có thể cho phép khách hàng nhập thông tin thanh toán trên trang của bạn và thực hiện các bước tiếp theo. Tài liệu này sẽ cung cấp chi tiết về cách thức kết nối thanh toán định kỳ cho doanh nghiệp của bạn.

## Mô hình kết nối

## Mô hình kết nối

| STT | Thực hiện | Bước chính | Mô tả |
| --- | --- | --- | --- |
| 1 | End user | Khởi tạo giao dịch | Trên trang của Merchant, thực hiện Nhập thông tin cá nhân |
| 2 | End user | Chọn plan mong muốn với dịch vụ merchant đang cung cấp |  |
| 3 | End user | Chọn phương thức thanh toán mong muốn (hiện AppotaPay cung cấp 1 phương thức là Credit card để thực hiện
thanh toán) |  |
| 4 | End user | Nhập thông tin thanh toán (thông tin thẻ, billing info,...) |  |
| 5 | End user | Gửi thông tin và xác nhận thực hiện thanh toán đính kỳ |  |
|  | Tạo customer |  |  |
| 6 | Merchant | Tạo khách hàng | Ghi nhận các thông tin MC đã gửi: Thông tin khách hàng (chỉ tạo khách hàng cá nhân Individual) →
Gửi request để tạo Customer trước khi tạo payment method (customer cũng có thể tạo trong request tạo payment
method) |
| 7 | AppotaPay | Nhận yêu cầu tạo customer, xử lý hệ thống để tạo customer và phản hồi |  |
| 8 | Merchant | Ghi nhận thông tin customer ID |  |
|  | Tạo payment method |  |  |
| 9 | Merchant | Tạo phương thức thanh toán | Ghi nhận thông tin, Send request tạo Payment method với customer ID đã nhận ở Bước 8 (kèm theo
return_url của merchant để khi có kết quả payment linking sẽ trả về đây) gồm các thông tin - Customer
(hoặc Customer ID) - Payment method - Billing info - Card info |
| 10 | AppotaPay | Kiểm tra sự tồn tại của Customer ID trong request - Nếu chưa tồn tại → Chuyển bước 11 - Nếu
đã tồn tại → Chuyển bước 13 |  |
| 11 | AppotaPay | Phản hồi lỗi cho merchant |  |
| 12 | Merchant | Nhận thông tin và hiển thị lỗi cho user |  |
| 13 | AppotaPay | Tạo payment method và phản hồi kết quả cho Merchant |  |
| 14 | Merchant | Nhận thông tin phản hồi cho payment method |  |
| 15 | Merchant | Kiểm tra trạng thái của payment method REQUIRES_ACTION → chuyển bước 16 ACTIVE → chuyển
bước 25 PENDING → chuyển bước 22 |  |
|  | Trạng thái của Payment method là REQUIRES_ACTION |  |  |
| 16 | Merchant | Xác thực phương thức thanh toán | Redirect user đến action.url để thực hiện action cân thiết |
| 17 | End user | User thực hiện action theo như url hiển thị → Hệ thống AppotaPay xử lý và điều hướng về return url
tương ứng với từng kết quả: bước 18 → Đồng thời AppotaPay cũng trigger event liên quan và callback
cho Merchant: bước 22 |  |
| 18 | AppotaPay | Kiểm tra thông tin user input, xử lý hệ thống → redirect user đến return url tương ứng với trạng thái của
payment method (mà Merchant đã cung cấp trước đó) - Nếu payment method failed → redirect về
failureReturnUrl - Nếu payment method activated → redirect về successReturnUrl |  |
| 19 | Merchant | Merchant kiểm tra trạng thái payment method - Failure → chuyển bước 20 - Success → chuyển
bước 21 |  |
| 20 | Merchant | Nhận kết quả payment method, update trạng thái Hiển thị lỗi cho user → thực hiện lại giao dịch
khác |  |
| 21 | Merchant | Nhận kết quả trạng thái payment method, update trạng thái Hiển thị loading page và chờ thực hiện
các bước tiếp theo để hoàn thành thanh toán định kỳ → chuyển bước 25 |  |
|  | Trạng thái của Payment method là PENDING Merchant chờ phản hồi từ phía AppotaPay về trạng
thái cụ thể qua callback |  |  |
| 22 | AppotaPay | Chờ kết quả phương thức thanh toán | Trigger event liên quan đến payment method và call back cho Merchant - Payment method activated -
event: payment_method.activated - status:ACTIVE - Payment method failed - event:
payment_method.failed - status: FAILED |
| 23 | Merchant | Kiểm tra event và trạng thái trong event - Nếu status = FAILED → Bước 24 - Nếu status =
ACTIVATED → Bước 25 |  |
| 24 | Merchant | Hiển thị lỗi cho user và kết thúc giao dịch, khởi tạo giao dịch khác |  |
|  | Trạng thái của Payment method là ACTIVE → Chuyển đến bước 25 |  |  |
|  | Tạo plan |  |  |
| 25 | Merchant | Tạo plan | Bắt đầu khởi tạo Plan, gửi request gồm các thông tin - Customer ID - Payement method ID
- Schedule info (interval, retry, failed cycle action,...) |
| 26 | AppotaPay | Kiểm tra sự tồn tại của Customer ID và Payment method - Nếu không tồn tại → chuyển bước 24
- Nếu có tồn tại → chuyển bước 27 |  |
| 27 | AppotaPay | Kiểm tra trạng thái của payment method ID đã tồn tại - Nếu khác ACTIVE → chuyển bước 24 -
Nếu ACTIVE → chuyển bước 28 |  |
| 28 | AppotaPay | Khởi tạo plan và phản hồi thông tin plan được khởi tạo và trạng thái Đồng thời hệ thống AppotaPay
cũng chủ động kiểm tra thông tin và trạng thái, bắt đầu callback plan activation cho Merchant (thực hiện tại
bước 33) |  |
| 29 | Merchant | Kiểm tra trạng thái plan - REQUIRES_ACTION → chuyển bước 30 - PENDING → chuyển bước 32
- ACTIVE → chuyển bước 36 |  |
| 30 | Merchant | Redirect user đến actions.url (được trả trong response) để user thực hiện thêm các action cần thiết |  |
| 31 | User | User thực hiện action theo như url hiển thị → Hệ thống AppotaPay xử lý sau đó trigger event liên
quan đến plan activation: bước 33 |  |
| 32 | Merchant | Chờ actiovation webhook từ AppotaPay (Đồng thời hệ thống AppotaPay cũng chủ động kiểm tra thông
tin và trạng thái, bắt đầu callback plan activation cho Merchant (thực hiện tại bước 33)) |  |
| 33 | AppotaPay | Nhận webhook event | AppotaPay sau khi xử lý xong thông tin của plan sẽ callback plan activation cho Merchant Đồng thời
kiểm tra plan có yêu cầu charge ngay lập từ (bước 38) |
| 34 | Merchant | Kiểm tra event và trạng thái plan - Nếu event là subscription.plan.activated và status là ACTIVE →
chuyển bước 36 - Nếu event là subscription.plan.inactivated và status là INACTIVE → chuyển bước
35 |  |
| 35 | Merchant | Hiển thị lỗi cho end user |  |
| 36 | Merchant | Chờ webhook event liên quan đến cycle được khởi tạo hoặc thanh toán cho plan |  |
| 37 | Merchant | Tiếp nhận thông tin về cycle event |  |
| 38 | AppotaPay | Kiểm tra plan có yêu cầu charge ngay lập tức hay không - Nếu No → chuyển bước 39 - Nếu Yes
→ chuyển bước 40 |  |
| 39 | AppotaPay | AppotaPay callback event cho cycle đầu tiên (khởi tạo thành công) - event subscription.cycle.created và
status là SCHEDULED Lưu ý: thời gian trừ tiền sẽ theo thông tin anchor_date được gửisang |  |
| 40 | AppotaPay | AppotaPay callback event cho cycle đầu tiên (thanh toán thành công) - event subscription.cycle.succeeded và
status là SUCCEEDED |  |
| 41 | AppotaPay | Sau khi callback xong event thanh toán thành công cho cycle đầu tiên AppotaPay callback event cho
cycle tiếp theo (khởi tạo thành công) - event: subscription.cycle.created và status là SCHEDULED |  |
| 42 | Merchant | Hiển thị kết quả plan và cycle |  |

- Trên Webiste hoặc ứng dụng phía đối tác, sau khi khách hàng lựa chọn dịch vụ thanh toán định kỳ và chọn thanh toán qua cổng thanh toán của AppotaPay.
- Server của đối tác gọi qua API của AppotaPay để tạo thông tin giao dịch và nhận URL thanh toán
- Sau khi nhận thông tin, đối tác điều hướng khách hàng tới URL thanh toán để hoàn thành thanh toán dịch vụ

## Mô hình kết nối

## Mô hình kết nối

| STT | Thực hiện | Bước chính | Mô tả |
| --- | --- | --- | --- |
| 1 | End user | Khởi tạo giao dịch | Trên trang của đối tác, thực hiện Nhập thông tin cá nhân |
| 2 | End user | Chọn plan mong muốn với dịch vụ đối tác đang cung cấp |  |
| 3 | Partner | Tạo khách hàng | Đối tác gửi yêu cầu đến AppotaPay để tạo Customer |
| 4 | AppotaPay | Nhận yêu cầu tạo customer, xử lý hệ thống để tạo customer và phản hồi |  |
| 5 | AppotaPay | Phản hồi kết quả khởi tạo customer cho partner - Nếu khởi tạo khách hàng không thành công → thông báo lỗi
- Nếu khởi tạo khách hàng thành công → chuyển bước 6 |  |
| 6 | Partner | Tạo plan | Nhận phản hồi cho khởi tạo Customer, sau đó sử dụng customerId để khởi tạo plan sau đó. Đối tác gửi yêu cầu đến AppotaPay để tạo Plan |
| 7 | AppotaPay | Nhận yêu cầu tạo plan, xử lý hệ thống để tạo plan |  |
| 8 | AppotaPay | Tạo Payment link dành cho thanh toán và phản hồi đối tác |  |
| 9 | Partner | Nhập payment link từ AppotaPay và điều hướng người dùng đến payment link đó |  |
| 10 | End user | Chọn phương thức thanh toán | Lựa chọn phương thức thanh toán định kỳ và nhập thông tin thanh toánGửi thông tin thanh toán |
| 11 | AppotaPay | Nhận thông tin người dùng đã nhập, bắt đầu khởi tạo kênh thanh toán (payment method) |  |
| 12 | AppotaPay | Kiểm tra trạng thái khởi tạoREQUIRES_ACTION → chuyển bước 13ACTIVE → chuyển bước 17 |  |
|  | Trạng thái của Payment method là REQUIRES_ACTION |  |  |
| 13 | AppotaPay | Xác thực phương thức thanh toán | Điều hướng người dùng đến màn hình xác thực để thực hiện xác thực thông tin thanh toán |
| 14 | End user | Người dùng thực hiện xác thực tại màn hình được điều hướng đến Chuyển Bước 15 |  |
| 15 | AppotaPay | Hệ thống kiểm tra trạng thái xác thực sau khi người dùng đã thực hiệnNếu xác thực thất bại → chuyển Bước 16Nếu xác thực thành công → chuyển Bước 17 |  |
| 16 | AppotaPay | Hiển thị màn hình khởi tạo plan thất bại và điều hướng người dùng về trang của đối tác |  |
|  | Trạng thái của Payment method là ACTIVE → Chuyển đến bước 17 |  |  |
| 17 | AppotaPay | Thiết lập thanh toán định kỳ | Hệ thống thực hiện khởi tạo plan |
| 18 | AppotaPay | Kiểm tra trạng thái khởi tạo planACTIVE → chuyển bước 19PENDING → chuyển bước 20REQUIRES_ACTION → chuyển bước 22 |  |
| 19 | AppotaPay | Hiển thị kết quả khởi tạo plan thành công cho người dùng và điều hướng về trang của đối tác Đồng
thời đối tác cần chờ webhook về plan và cycle phía AppotaPay gửi về để xác nhận trạng thái plan và cycle
(nếu có) (Bước 25) |  |
| 20 | AppotaPay | Hiển thị màn hình Chờ xử lý liên quan đến plan và điều hướng về trang của đối tác Đồng thời đối
tác cần chờ webhook về plan và cycle phía AppotaPay gửi về để xác nhận trạng thái plan và cycle (nếu có)
(Bước 25) |  |
| 21 | Partner | Nhận kết quả khởi tạo plan và hiển thị kết quả trên trang của đối tác |  |
| 22 | AppotaPay | Điều hướng người dùng đến trang xác thực để thực hiện xác thực thêm |  |
| 23 | End user | Người dùng thực hiện xác thực tại màn hình được điều hướng đến Chuyển Bước 24 và 25 |  |
| 24 | AppotaPay | Hệ thống AppotaPay xử lý kết quả và thông báo kết quả khởi tạo plan và điều hướng về trang của đối tác Đồng thời đối
tác cần chờ webhook về plan và cycle phía AppotaPay gửi về để xác nhận trạng thái plan và cycle (nếu có)
(Bước 25) |  |
| 25 | AppotaPay | Nhận webhook event | Hệ thống xử lý để khởi tạo plan, cycle liên quan (nếu có) và webhook thông tin về cho đối tác |
| 26 | Partner | Nhận kết quả khởi tạo plan, cycle (nếu có) và thông báo với người dùng |  |

## API tham chiếu

- API Tạo Customer
- API Chi tiết Customer
- API Cập nhật Customer
- API Tạo Plan
- API Chi tiết Plan
- API Danh sách cycle của plan
- API Cập nhật Plan
- API Deactivate plan
- Plan Callback
- API Chi tiết Cycle
- API Cập nhật Cycle
- API Cancel Cycle
- API Force cycle attempt
- Cycle Callback
