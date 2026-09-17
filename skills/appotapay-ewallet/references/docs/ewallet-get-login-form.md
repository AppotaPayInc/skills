<!-- source: https://docs.appotapay.com/ewallet/get-login-form -->

# Authentication Link

Backend hệ thống của Partner trả về Authentication Link này để mở ra login form. Khách hàng nhập thông tin trên login form để liên kết tài khoản Ví AppotaPay.

### EndPoint

`GET` `/oauth/login`

### Request Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| client_key | required | String | Thông tin API_KEY trên Application |  |
| scope | required | String | Phạm vi quyền hạn. Tham khảo Scope | Value: "user.info,user.apoint_payment,user.wallet_payment" |
| response_type | required | String | Kiểu dữ liệu trả về | Value: "code" |
| redirect_uri | required | String | CALLBACK_URI Sau khi liên kết thành công hệ thống sẽ gọi đường dẫn này kèm AUTHORIZATION_CODE, state |  |
| state | optional | String | Thông tin này thường được sử dụng để chống giả mạo request |  |

### Example Request

https://ewallet.dev.appotapay.com/oauth/login?client_key=YOUR_API_KEY&scope=user.info,user.payment&response_type=code&redirect_uri=YOUR_REDIRECT_URI&state=YOUR_STATE

### Response Params

- Success: Response login page
- Error: Redirect error page

### Scope

| Tên quyền hạn | Mô tả |
| --- | --- |
| user.info | Lấy thông tin cơ bản (fullname , apoint_balance,...) |
| user.apoint_payment | Sử dụng số dư APoint để thanh toán dịch vụ |
| user.wallet_payment | Sử dụng số dư ví để thanh toán dịch vụ |
