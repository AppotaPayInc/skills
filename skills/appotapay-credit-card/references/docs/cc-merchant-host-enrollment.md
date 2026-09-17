<!-- source: https://docs.appotapay.com/cc-merchant-host/enrollment -->

# Check 3DS Enrollment

Nếu bạn muốn xác thực thẻ với 3D-secure trước khi thực hiện thanh toán, bạn có sử dụng API này (có thể dùng thông tin thẻ hoặc token đã tạo trước đó (nếu có))

### EndPoint

`POST` `/credit-card/enrollment`

### Header Params

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

### Request Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| card | required_if | Object | Required nếu tham số tokenId không truyền lên Thông tin thẻ |  |
| card.number | required | String | Số thẻ | 16 số |
| card.holderName | required | String | Tên chủ thẻ | Min: 1 Max: 50 bao gồm: 0- 9, a-z, A-Z, khoảng trắng |
| card.expirationMonth | required | String | Tháng hết hạn của thẻ, bao gồm cả số 0 ở đầu (VD: 03) | Format: MM |
| card.expirationYear | required | String | Năm hết hạn của thẻ (VD.: 25) | Format: YY |
| card.cvv | required | String | Card verification number, hay CVV Mã số bí mật của thẻ, gồm 3 hoặc 4 số |  |
| tokenId | required_if | String | Required nếu tham số card không truyền lên Token ID để thanh toán thay thông tin thẻ |  |
| amount | required | Float | Số tiền thanh toán (VD: 1000) | Hỗ trợ VND |
| merchantRefId | required | String | Mã tham chiếu, định danh cho yêu cầu khởi tạo từ merchant | Min: 1 Max: 40 |
| returnUrl | required | String | URL để điều hướng khách hàng sau khi thực hiện 3DS | Là URL hợp lệ |
| currency | required | String | Loại tiền thanh toán. Bao gồm 3 ký tự theo chuẩn ISO-4217 | Hỗ trợ: VND |
| customer | optional | Object | Thông tin khách hàng Nếu có thông tin khách hàng, bạn cần truyền đầy đủ tất cả thông tin |  |
| customer.browser | optional | Object | Thông tin trình duyệt customer |  |
| customer.browser.clientIp | optional | String | Địa chỉ IP của thiết bị khách hàng thanh toán | IPv4 Min: 7 Max: 45 |
| customer.browser.userAgent | optional | String | User Agent của khách hàng. Thông tin được thu thập từ header được gửi từ thiết bị của khách hàng Được sử dụng cho quản lý rủi ro VD: `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/92.0.4512.0 Safari/537.36` | Max: 500 |
| customer.browser.referrer | optional | String | Địa chỉ trước đó được điều hướng đến trang thanh toán của merchant Được sử dụng cho quản lý rủi ro VD: AppotaPay - The leading online payment company in Vietnam | Min: 1 Max: 500 |
| customer.browser.acceptLanguage | optional | String | Ngôn ngữ thiết bị của khách hàng VD: vi-VN, en-US Được sử dụng cho quản lý rủi ro | Min: 2 Max: 10 |
| billing | optional | Object | Thông tin thanh toán của chủ thẻ đã đăng ký với tổ chức phát hành thẻ Nếu truyền thông tin billing, bạn cần truyền đầy đủ tất cả thông tin và tương ứng với thông tin đã đăng ký với ngân hàng phát hành |  |
| billing.firstName | optional | String | Tên của chủ thẻ Hữu ích với frictionless 3DS 2.0 | Min: 1 Max: 50 |
| billing.lastName | optional | String | Họ và tên đệm của chủ thẻ Hữu ích với frictionless 3DS 2.0 | Min: 1 Max: 50 |
| billing.email | optional | String | Email khách hàng đã đăng ký với issuer Hữu ích với frictionless 3DS 2.0 | Min: 1 Max: 255 |
| billing.phoneNumber | optional | String | Số điện thoại khách hàng đã đăng ký với issuer Hữu ích với frictionless 3DS 2.0 | Min: 8 Max: 20 |
| billing.province | optional | String | Tỉnh, tiểu bang, khu vực cư trú. Nếu khách hàng thuộc tiểu bang của Mỹ, bắt buộc phải nhập mã tiểu bang (VD: nhập CA thay cho California) Hữu ích với frictionless 3DS 2.0 | Min: 1 Max: 100 |
| billing.city | optional | String | Thành phố, thị trấn Hữu ích với frictionless 3DS 2.0 | Min: 1 Max: 100 |
| billing.country | optional | String | 2 ký tự trong bảng mã quốc gia theo chuẩn ISO 3166-2 Hữu ích với frictionless 3DS 2.0 | Min: 2 Max: 2 |
| billing.addressLine1 | optional | String | Địa chỉ thanh toán thứ nhất mà khách đã đăng ký với issuer Hữu ích với frictionless 3DS 2.0 | Min: 1 Max: 100 |
| billing.addressLine2 | optional | String | Địa chỉ thanh toán thứ hai mà khách đã đăng ký với issuer Hữu ích với frictionless 3DS 2.0 | Min: 1 Max: 100 |
| billing.postalCode | optional | String | Mã bưu điện Hữu ích với frictionless 3DS 2.0 | Min: 1 Max: 10 |

### Example Request

```json
{
    "merchantRefId": "7Xthy1kbi",
    "amount": 1000000,
    "currency": "VND",
    "returnUrl": "https://devtool.vn",
    "tokenId": "01hjag3z1dfmznj52hhk33njy8",
    "customer" : {
        "browser": {
            "clientIp": "127.0.0.1",
            "userAgent": "127.0.0.1",
            "referrer": "127.0.0.1",
            "acceptLanguage": "en-US"
        }
    },
    "billing" : {
        "firstName": "Sheryl",
        "lastName": "Nhung",
        "email": "nhunghoang@email.com",
        "phoneNumber": "02345686432",
        "alternatePhoneNumber": "02345686432",
        "province": "VP",
        "city": "VT",
        "country": "VN",
        "addressLine1": "81 Lang Ha",
        "addressLine2": "17 Mai Anh Tuan",
        "postalCode": "10000"
    }
}
```

Khi người dùng được chuyển hướng đến trang xác thực để thực hiện 3DS, trong quá trình xác minh, AppotaPay sẽ thu thập dữ liệu thiết bị từ trình duyệt của người dùng. Merchant không bắt buộc phải thu thập dữ liệu này từ người dùng và gửi dữ liệu này đến AppotaPay.

Dữ liệu này được sử dụng nhằm phát hiện gian lận để đảm bảo an toàn hơn cho các giao dịch. Dữ liệu được thu thập như sau:

- Địa chỉ IP của khách hàng
- Cấu hình trình duyệt (user-agent, language, screen size, time zone)
- Nguồn trang được điều hướng trước đó

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/credit-card/enrollment' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653' \
  -d '{
  "merchantRefId": "7Xthy1kbi",
  "amount": 1000000,
  "currency": "VND",
  "returnUrl": "https://devtool.vn",
  "tokenId": "01hjag3z1dfmznj52hhk33njy8",
  "customer": {
    "browser": {
      "clientIp": "127.0.0.1",
      "userAgent": "127.0.0.1",
      "referrer": "127.0.0.1",
      "acceptLanguage": "en-US"
    }
  },
  "billing": {
    "firstName": "Sheryl",
    "lastName": "Nhung",
    "email": "nhunghoang@email.com",
    "phoneNumber": "02345686432",
    "alternatePhoneNumber": "02345686432",
    "province": "VP",
    "city": "VT",
    "country": "VN",
    "addressLine1": "81 Lang Ha",
    "addressLine2": "17 Mai Anh Tuan",
    "postalCode": "10000"
  }
}'
```

### Request

#### REQUEST

### Response Params

```json
{
    "id": "01HQHR9W32E2RDSF6KM51PSJ92",
    "merchantRefId": "HJ1OsUcDI",
    "tokenId": "01hqhr8vgdw64qhqgvm2tsbpew",
    "status": "PENDING",
    "amount": 1000000,
    "currency": "VND",
    "deviceDataCollectionUrl": "https://acpg.dev.appotapay.com/credit-card/authenticate?id=01HQHR9W32E2RDSF6KM51PSJ92&signature=cf6e30824b5e66e0c401701f3416e72c5b069a01c3a80a316cf9e54f9b855675",
    "card": {
        "number": "400000XXXXXX0010",
        "expirationMonth": "12",
        "expirationYear": "29",
        "cardBrand": "MASTERCARD",
        "cardType": "CREDIT",
        "country": "VN"
    }
}
```

#### Thành công

> Http Status Code 200 - OK

| Tham số | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- |
| id | String | Mã định danh phía AppotaPay trả về cho Merchant Merchant có thể sử dụng id này trong API Charge, tương ứng với authenticationId nếu giao dịch có xác thực 3DS |  |
| merchantRefId | String | Mã tham chiếu, định danh cho yêu cầu khởi tạo từ merchant | Min:1 Max:40 |
| tokenId | String | Token ID để thanh toán thay thông tin thẻ, được khởi tạo trước đó (API Create token) | Min:1 Max:32 |
| amount | String | Số tiền thanh toán |  |
| currency | String | Loại tiền thanh toán. Bao gồm 3 ký tự theo chuẩn ISO-4217 | Hỗ trợ: VND |
| card | String | Thông tin thẻ để thanh toán |  |
| card.number | String | Số thẻ | 16 numbers |
| card.expirationMonth | String | Tháng hết hạn của thẻ, bao gồm cả số 0 ở đầu (VD: 03) | Format: MM |
| card.expirationYear | String | Năm hết hạn của thẻ (VD.: 25) | Format: YY |
| status | String | Trạng thái của xác thực có thể trả về: `CARD_ENROLLED` thẻ đã check enroll và chờ xác thực từ phía người dùng `ENROLLMENT_CHECK_FAILED` không thể check enroll do issuer hoặc card network `CARD_NOT_ENROLLED` thẻ chưa được enroll `VERIFIED` xác minh 3DS đã thành công, khi nhận trạng thái đã xác thực này, giá trị eci có thể là một trong những giá trị sau: 05, 02, 06, 01, có thể tiến hành authorization `FAILED` kiểm tra 3DS thất bại `PENDING` khi giao dịch thẻ có 3DS 2.0 hoặc phía xử lý là MIGS. Điều hướng user tới trang xác thực 3DS để tiếp tục quá trình thanh toán |  |
| deviceDataCollectionUrl | String | Nếu trạng thái là `CARD_ENROLLED` hoặc `PENDING`, có thể khách hàng đến URL này để thực hiện xác thực 3DS |  |
| eci | String | Electronic Commerce Indicator (ECI) mã code cho thẻ đã enroll. ECI có thông tin khi xác thực 3DS thành công hoặc thất bại: 05 hoặc 02 - Xác thực thành công, tiến hành authorization 06 hoặc 01 - Thẻ không được enroll hoặc đã bị bỏ qua do luồng frictionless, tiến hành authorization 07 hoặc 00 - Xác thực thất bại |  |

#### Thất bại

> HTTP Status Code != 200

> Lưu ý
> 
> CARD_ENROLLED | PENDING → Giao dịch nên được xác minh trước khi Charge, tạo 1 trang xác thực 3DS để khách hàng thực
> hiện xác minh
> CARD_NOT_ENROLLED → Có thể tiến hành charge không Xác thực 3DS
> ENROLLMENT_CHECK_FAILED → Có thể tiến hành charge không Xác thực 3DS

### 3DS Verification Window

Nếu thẻ được đăng ký 3DS, điều hướng khách hàng tới `deviceDataCollectionUrl` để thực hiện 3DS hoặc hiển thị trang 3DS
trong iframe.

### Sau khi 3DS Verification

- Sau khi khách hàng hoàn thành xác thực 3DS, khách hàng sẽ được điều hướng đến return_url của Merchant gửi trong yêu
cầu Check 3DS Enrollment. authentication_id và status sẽ được trả về thông tin trên URL query.
- Thông đầy đủ của một xác thực 3DS sẽ không được gửi vào return_url và thông tin trả trên URL về kết quả 3DS có thể
không chính xác hoàn toàn vì có thể gặp trường hợp một bên thứ ba thực hiện truyền thông tin khác để đánh lừa hệ thống
Merchant.
- Để chắc chắn về kết quả 3DS và toàn bộ thông tin phản hồi từ AppotaPay, Merchant cần gọi API sang hệ thống AppotaPay
để lấy chính xác kết quả 3DS.

#### Điều hướng người dùng về trang của Merchant

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| authenticationId | String | Khi điều hướng người dùng về trang của Merchant, authenticationId sẽ được gửi kèm trong query URL. Merchant có thể sử dụng authenticationId gọi API Get Authentication để kiểm tra xác thực chính xác của Enrollment. Nếu xác thực thành công, có thể sử dụng authenticationId trong API Charge để thực hiện thanh toán. |
| status | String | Trạng thái xác thực - `VERIFIED` (3DS xác thực thành công) - `FAILED` (3DS xác thực thất bại) |
