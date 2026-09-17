<!-- source: https://docs.appotapay.com/subscription/create-payment-method -->

# API Tạo payment method

## API Tạo payment method

Endpoint: `/api/v1/subs/payment-methods`

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
| paymentMethodRefId | Required | String | Mã định danh cho payment method được cung cấp bởi partner. Các request có paymenMethodRefId trùng nhau sẽ trả lỗi. | min:1, max: 50, format: alphanumeric |
| customerId | Conditional, bắt buộc nếu object customer không có thông tin | String | Customer ID được khởi tạo trong API Create customer |  |
| customer | Conditional, bắt buộc nếu trường customerId không có thông tin | Object | Thông tin khách hàng |  |
| customer.firstName | Conditional | String | Tên khách hàng | min:1, max: 50 |
| customer.lastName | Optional | String | Họ khách hàng | min:1, max: 50 |
| customer.mobileNumber | Optional | String | Số điện thoại Format: +[Mã vùng][Số điện thoại] Ví dụ: +84919333777 | min:1, max: 16, format: E.164 |
| customer.email | Optional | String | Email | min:1, max: 50 |
| customer.gender | Optional | String | Giới tính - MALE: nam - FEMALE: nữ
- OTHER: khác | in: MALE, FEMALE, OTHER |
| customer.dateOfBirth | Optional | String | Ngày sinh | format YYYY-MM-DD string |
| customer.placeOfBirth | Optional | String | Nơi sinh | max: 50 |
| customer.nationality | Optional | String | Mã quốc gia | format ISO 3166-2 Country Code |
| country | Required | String | Mã quốc gia của GD Giá trị được chấp nhận - ID: Indonesia
 - PH: Philippines - VN: Vietnam - TH:
Thailand - MY: Malaysia | Format ISO 3166-2 Country Code |
| currency | Required | String | Đơn vị tiền tệ | in: VND |
| paymentMethod | Required | String | Phương thức thanh toán - CC_SUBS: thanh toán với thẻ quốc tế
- EWALLET_SUBS: thanh toán với ví điện tử | in: CC_SUBS, EWALLET_SUBS |
| reusability | Required | String | Khả năng sử dụng lại của payment method - MULTIPLE_USE: sử dụng nhiều lần | in: MULTIPLE_USE |
| card | Conditional, bắt buộc nếu paymentMethod = 'CC_SUBS' | Object | Thông tin, thuộc tính thẻ |  |
| card.properties | Conditional, bắt buộc nếu paymentmethod = 'CC_SUBS' | Object | Thuộc tính |  |
| card.properties.skipThreeDSecure | Conditional, bắt buộc nếu paymentMethod = 'CC_SUBS' | String | Bỏ qua xác thực 3D secure khi khởi tạo Payment method - YES: Bỏ qua xác thực 3DS
 - NO: Thực hiện xác thực 3DS | in: YES, NO |
| card.properties.successReturnUrl | Conditional, bắt buộc nếu skipThreeDSecure = NO | String | Đường dẫn điều hướng về sau khi xác thực thành công AppotaPay sẽ gửi kết quả chi tiết qua URL này với một số thông tin như sau: LINK | max:100 |
| card.properties.failureReturnUrl | Conditional, bắt buộc nếu skipThreeDSecure = NO | String | Đường dẫn điều hướng về sau khi xác thực thất bại AppotaPay sẽ gửi kết quả chi tiết qua URL này với một số thông tin như sau: LINK | max:100 |
| card.cardInfo | Conditional, bắt buộc nếu paymentmethod = 'CC_SUBS' | Object | Thông tin thẻ |  |
| card.cardInfo.cardNumber | Conditional, bắt buộc nếu paymentMethod = 'CC_SUBS' | String | Số thẻ | max: 20 |
| card.cardInfo.cardMonth | Conditional, bắt buộc nếu paymentMethod = 'CC_SUBS' | String | Tháng hết hạn của thẻ, bao gồm cả số 0 ở đầu (VD: 03) | format: MM |
| card.cardInfo.cardYear | Conditional, bắt buộc nếu paymentMethod = 'CC_SUBS' | String | Năm hết hạn của thẻ (VD: 2024) | format: YYYY |
| card.cardInfo.cardHolderName | Optional | String | Tên chủ thẻ | max: 50 |
| ewallet | Conditional, bắt buộc nếu paymentmethod = 'EWALLET_SUBS' | Object | Thông tin, thuộc tính ví điện tử |  |
| ewallet.serviceCode | Conditional, bắt buộc nếu paymentMethod = 'EWALLET_SUBS' | String | Mã Ví |  |
| ewallet.properties | Conditional, bắt buộc nếu paymentMethod = 'EWALLET_SUBS' | Object | Thuộc tính |  |
| ewallet.properties.successReturnUrl | Conditional, bắt buộc nếu paymentMethod = 'EWALLET_SUBS' | String | Đường dẫn điều hướng về sau khi xác thực thành công |  |
| ewallet.properties.pendingReturnUrl | Conditional, bắt buộc nếu paymentMethod = 'EWALLET_SUBS' | String | Đường dẫn điều hướng về sau khi xác thực đang xử lý |  |
| ewallet.properties.failureReturnUrl | Conditional, bắt buộc nếu paymentMethod = 'EWALLET_SUBS' | String | Đường dẫn điều hướng về sau khi xác thực thất bại |  |
| billing | Optional | Object | Thông tin thanh toán |  |
| billing.country | Required nếu 1 trường trong object có dữ liệu | String | Mã quốc gia | Format ISO 3166-2 Country Code |
| billing.city | Required nếu 1 trường trong object có dữ liệu | String | Thành phố | min:1, max: 50 |
| billing.provinceState | Required nếu 1 trường trong object có dữ liệu | String | Khu vực, quận huyện | min:1, max: 50 |
| billing.address | Required nếu 1 trường trong object có dữ liệu | String | Địa chỉ | min:1, max: 100 |
| billing.zipcode | Required nếu 1 trường trong object có dữ liệu | String | Mã zip | min:1, max: 10, format: numeric |

### Example Request

```json
{
    "paymentMethodRefId": "ASKJLKALK16640",
    "customer": {
        "firstName": "Ha",
        "lastName": "Phan",
        "mobileNumber": "+84123456789",
        "email": "ha@gmail.com",
        "gender": "MALE",
        "dateOfBirth": "1996-04-23",
        "placeOfBirth": "HN",
        "nationality": "EC"
    },
    "country": "VN",
    "currency": "VND",
    "paymentMethod": "CC_SUBS",
    "reusability": "MULTIPLE_USE",
    "card": {
        "properties" : {
           "skipThreeDSecure": "NO",
           "successReturnUrl": "https://devtool.vn/success",
           "failureReturnUrl": "https://devtool.vn/failure"
        },
        "cardInfo" : {
           "cardNumber": "5200000000001096",
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
    }
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/subs/payment-methods' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653' \
  -d '{
  "paymentMethodRefId": "ASKJLKALK16640",
  "customer": {
    "firstName": "Ha",
    "lastName": "Phan",
    "mobileNumber": "+84123456789",
    "email": "ha@gmail.com",
    "gender": "MALE",
    "dateOfBirth": "1996-04-23",
    "placeOfBirth": "HN",
    "nationality": "EC"
  },
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
      "cardNumber": "5200000000001096",
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
  }
}'
```

### Request

#### REQUEST

### Dữ liệu trả về

### Thành công

> Http Status Code 200 - OK

Dữ liệu trả về thành công sẽ chứa một Payment method object

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
            "field": "paymentMethodRefId",
            "reason": "Trường payment method ref id không được bỏ trống."
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
| 3013 | 3D Secure là bắt buộc |
| 3027 | Thông tin khách hàng không hợp lệ |
