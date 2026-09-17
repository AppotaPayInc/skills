<!-- source: https://docs.appotapay.com/subscription/payment-method-object -->

# Payment Method Object

Payment method object đề cập đến nguồn tiền hoặc công cụ thanh toán được sử dụng để thanh toán. Mỗi object có cấu trúc như sau:

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| paymentMethodRefId | String | Mã định danh cho payment method được cung cấp bởi partner |
| paymentMethodId | String | Payment Method ID |
| customerId | String | Mã khách hàng |
| country | String | Mã quốc gia của GD |
| currency | String | Đơn vị tiền tệ |
| paymentMethod | String | Phương thức thanh toán - CC_SUBS: thanh toán với thẻ quốc tế - EWALLET_SUBS: thanh toán với ví điện tử |
| reusability | String | Khả năng sử dụng lại của payment method - MULTIPLE_USE: sử dụng nhiều lần |
| card | Object | Thông tin, thuộc tính thẻ |
| card.properties | Object | Thuộc tính |
| card.properties.skipThreeDSecure | String | Bỏ qua xác thực 3D secure khi khởi tạo Payment method - YES: Bỏ qua xác thực 3DS - NO: Thực hiện xác thực 3DS |
| card.properties.successReturnUrl | String | Đường dẫn điều hướng về sau khi xác thực thành công AppotaPay sẽ gửi kết quả chi tiết qua URL này với một số thông tin như sau: LINK |
| card.properties.failureReturnUrl | String | Đường dẫn điều hướng về sau khi xác thực thất bại AppotaPay sẽ gửi kết quả chi tiết qua URL này với một số thông tin như sau: LINK |
| card.cardInfo | Object | Thông tin thẻ |
| card.cardInfo.cardNumber | String | Số thẻ, 6 số đầu - 4 số cuối (VD 123456xxxxx1234) |
| card.cardInfo.cardMonth | String | Tháng hết hạn của thẻ, bao gồm cả số 0 ở đầu (VD: 03) |
| card.cardInfo.cardYear | String | Năm hết hạn của thẻ (VD: 2024) |
| card.cardInfo.cardHolderName | String | Tên chủ thẻ |
| ewallet | Object | Thông tin, thuộc tính ví điện tử |
| ewallet.serviceCode | String | Mã Ví |
| ewallet.properties | Object | Thuộc tính |
| ewallet.properties.successReturnUrl | String | Đường dẫn điều hướng về sau khi xác thực thành công |
| ewallet.properties.pendingReturnUrl | String | Đường dẫn điều hướng về sau khi xác thực đang xử lý |
| ewallet.properties.failureReturnUrl | String | Đường dẫn điều hướng về sau khi xác thực thất bại |
| ewallet.account | Object | Thông tin tài khoản ví |
| ewallet.account.accountNumber | String | Số tài khoản |
| ewallet.account.name | String | Tên tài khoản |
| billing | Object | Thông tin thanh toán |
| billing.country | String | Mã quốc gia |
| billing.city | String | Thành phố |
| billing.provinceState | String | Khu vực, quận huyện |
| billing.address | String | Địa chỉ |
| billing.zipcode | String | Mã zip |
| status | String | Trạng thái: - PENDING: yêu cầu khởi tạo payment method đã được gửi, AppotaPay đang xử lý để kích hoạt, chờ callback từ AppotaPay để update trạng thái - REQUIRES_ACTION: cần thực hiện thêm action để kích hoạt payment method, các action phổ biến là OTP validation hoặc redirect user đến authentication page - ACTIVE: payment method đã được activate có thể sử dụng cho payment request - INACTIVE: payment method không thể sử dụng để thực hiện giao dịch - EXPIRED: Authorization hết hạn hoặc hết hiệu lực - FAILED: khởi tạo payment method thẻ thất bại |
| actions | Array | Nếu status = REQUIRES_ACTION, object có các thông tin cụ thể để thực hiện action tiếp theo cho kích hoạt payment method |
| actions.*.url | String | URL thực hiên action |
| actions.*.action | String | Loại action - AUTH - thực hiện liên kết thanh toán hoặc thanh toán - RESEND_AUTH - Gửi lại mã uỷ quyền cho khách hàng |
| actions.*.method | String | Method thực hiện action - GET - POST |
| createdAt | String | Thời gian tạo Payment method (ISO 8601) |
| updatedAt | String | Thời gian cập nhật (ISO 8601) |

### Ví dụ

```json
{
    "paymentMethodRefId": "ASKJLKALK16640",
    "paymentMethodId": "01HRVJY8ZMZFHRHE3KG2S24KKW",
    "customerId": "01HRVM5AA6JCKZJ8ERZ6MKKFJZ",
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
            "cardNumber": "520000-1096",
            "cardMonth": "07",
            "cardYear": "2034",
            "cardHolderName": "Mai Minh"
        }
    },
    "billing": {
        "country": "VN",
        "city": "HN",
        "provinceState": "CG",
        "address": "CG",
        "zipcode": "530000"
    },
    "status": "REQUIRES_ACTION",
    "actions": [
        {
            "url": "https://acpg.dev.appotapay.com/subscription/authentication/redirect?reference_id=35681250-792f-4ad2-8e53-0ac795fa75ff&signature=5f40d475cd227065135186be8299b94fb70aad49729303e52b59233220c4fcfb",
            "action": "AUTH",
            "method": "GET"
        }
    ],
    "createdAt": "2024-01-29T11:30:31+07:00",
    "updatedAt": "2024-01-29T11:30:32+07:00"
}
```
