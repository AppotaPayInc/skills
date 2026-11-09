<!-- source: https://docs.appotapay.com/mobile-topup/mobile-topup-async -->

# API Nạp tiền điện thoại bất đồng bộ

Endpoint: `/api/v2/service/topup/charging-async`

Method: `POST`

Header: Cách tạo JWT_TOKEN

Language: en | vi

```json
{
    "X-APPOTAPAY-AUTH": Bearer JWT_TOKEN,
    "Content-Type": "application/json",
    "Language": LANGUAGE
}
```

- Đối tác phải đăng ký URL nhận IPN với AppotaPay trước khi sử dụng API này. Nếu chưa có URL nhận IPN, AppotaPay sẽ không gửi được kết quả giao dịch cho đối tác và yêu cầu nạp tiền bị từ chối với mã lỗi `1034`.
- API chỉ trả về xác nhận đã tiếp nhận giao dịch, không trả về kết quả nạp tiền. Kết quả cuối được gửi qua IPN.
- Xem thêm tổng quan luồng bất đồng bộ.

### Tham số

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Ghi chú |
| --- | --- | --- | --- | --- |
| partnerRefId | √ | String | Mã giao dịch phía đối tác, duy nhất cho mỗi giao dịch | max_length: 50 |
| telco |  | String | Tên nhà mạng (xem thêm phần Phụ Lục bảng nhà mạng) |  |
| telcoServiceType | √ | String | Loại dịch vụ prepaid: Nạp tiền điện thoại trả trướcpostpaid: Nạp tiền điện thoại trả sau |  |
| productCode | √ | String | Mã sản phẩm (xem thêm API lấy bảng mã sản phẩm) |  |
| phoneNumber | √ | String | Số điện thoại nạp tiền (truyền dạng: 09x, 08x,..) |  |
| signature | √ | String | Chữ ký các tham số truyền lên API, các tham số được đưa vào chữ ký theo thứ tự bao gồm: partnerRefId + phoneNumber + productCode + telco + telcoServiceType (xem thêm phần cách tạo signature) |  |

Chú ý:

- APPOTAPAY đã hỗ trợ Partner trong việc chủ động kiểm tra nhà mạng của SĐT truyền sang.

- Partner có thể sử dụng bảng mã sản phẩm chung để truyền vào API mà không cần định nghĩa rõ product_code theo từng nhà mạng của SĐT (Bảng mã này dùng với nạp topup thường, không dùng cho topup data).

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi trả về. `35`: giao dịch đã được tiếp nhận và đang chờ xử lýCác mã khác: giao dịch không được tiếp nhận (xem bảng mã lỗi) |
| message | String | Mô tả chi tiết mã lỗi |

Chú ý: `errorCode = 35` không phải kết quả cuối của giao dịch. Đối tác chỉ được cập nhật đơn hàng thành công/thất bại khi nhận được IPN có trạng thái cuối hoặc khi API kiểm tra trạng thái giao dịch trả về trạng thái cuối.

## Ví dụ

### Request

```json
{
    "partnerRefId": "AB123",
    "telco": "viettel",
    "telcoServiceType": "prepaid",
    "phoneNumber": "0866123456",
    "productCode": "viettel_10",
    "signature": "5a2774918a29cf4d2bdb78cccceb956f4c27837fad09a03a56e1df68b1bf29dd"
}
```

### Response

Tiếp nhận giao dịch thành công

```json
{
    "errorCode": 35,
    "message": "Giao dịch đang chờ xử lý vui lòng kiểm tra lại sau"
}
```

Không tiếp nhận được giao dịch

```json
{
    "errorCode": 31,
    "message": "Mã giao dịch bị trùng"
}
```

## IPN (Instant Payment Notification)

Khi giao dịch có kết quả cuối, AppotaPay gửi thông báo tới URL nhận IPN mà đối tác đã đăng ký. Đối tác kiểm tra tính toàn vẹn dữ liệu qua tham số `signature`, sau đó cập nhật trạng thái đơn hàng.

Method: `POST`

### Header

```json
{
    "Content-Type": "application/json"
}
```

### Tham số AppotaPay gửi sang

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi giao dịch. `0` khi nạp tiền thành công, khác `0` khi thất bại (xem bảng mã lỗi) |
| status | String | Trạng thái cuối của giao dịch: `success` hoặc `error` |
| appotapayTransId | String | Mã giao dịch phía AppotaPay |
| partnerRefId | String | Mã giao dịch phía đối tác |
| phoneNumber | String | Số điện thoại nạp |
| productCode | String | Mã sản phẩm |
| amount | Integer | Số tiền giao dịch |
| topupAmount | Integer | Số tiền nạp cho thuê bao |
| telco | String | Tên nhà mạng Thông tin trả về có thể khác với request đầu vào do ghi nhận thực tế từ nhà mạng |
| telcoServiceType | String | Loại dịch vụ (giá trị có thể thay đổi theo thông tin thực tế của thuê bao do nhà mạng trả về) |
| time | String | Thời gian nạp tiền (định dạng chuẩn RFC-3339) |
| signature | String | Chữ ký dữ liệu IPN, các trường được ký bao gồm (amount + appotapayTransId + errorCode + partnerRefId + phoneNumber + productCode + status + telco + telcoServiceType + time + topupAmount) |

### Cách kiểm tra signature

Thứ tự các tham số để tạo ra `signature` được sort theo thứ tự alphabet, ghép thành chuỗi `key=value` nối bằng `&`, sau đó ký bằng `HMAC_SHA256` với `SECRET_KEY` của đối tác.

> signature = HMAC_SHA256("amount=10000&appotapayTransId=01J7G2DYZTPCGHM3AAF8ANZC7J&errorCode=0&partnerRefId=AB123&phoneNumber=0866123456&productCode=viettel_10&status=success&telco=viettel&telcoServiceType=prepaid&time=2026-08-17T10:15:30+07:00&topupAmount=10000", YOUR_SECRET_KEY)

Đối tác tự tạo lại `signature` từ dữ liệu nhận được rồi so sánh với `signature` AppotaPay gửi sang. Nếu không khớp, không được cập nhật đơn hàng.

### Ví dụ IPN

Giao dịch thành công

```json
{
    "errorCode": 0,
    "status": "success",
    "appotapayTransId": "01J7G2DYZTPCGHM3AAF8ANZC7J",
    "partnerRefId": "AB123",
    "phoneNumber": "0866123456",
    "productCode": "viettel_10",
    "amount": 10000,
    "topupAmount": 10000,
    "telco": "viettel",
    "telcoServiceType": "prepaid",
    "time": "2026-08-17T10:15:30+07:00",
    "signature": "44b2e44eaaecfbbe5d9512c323affad5a9515a7f606afc486de80b7c2f771f2f"
}
```

Giao dịch thất bại

```json
{
    "errorCode": 33,
    "status": "error",
    "appotapayTransId": "01J7G2DYZTPCGHM3AAF8ANZC7J",
    "partnerRefId": "AB124",
    "phoneNumber": "0866123456",
    "productCode": "viettel_10",
    "amount": 10000,
    "topupAmount": 10000,
    "telco": "viettel",
    "telcoServiceType": "prepaid",
    "time": "2026-08-17T10:15:30+07:00",
    "signature": "046ae200d3210f0a5417ac2b3a8ccc83edf6452f00c8655fd31a13e73e1f84d8"
}
```

### Phản hồi đối tác cần trả về

Đối tác trả về mã `HTTP 200` để xác nhận đã nhận IPN thành công. Mọi mã HTTP khác `200` đều được AppotaPay coi là gửi IPN thất bại.

| Tiêu chí | Giá trị |
| --- | --- |
| Mã xác nhận thành công | `HTTP 200` |
| Thời gian chờ kết nối | 5 giây |
| Thời gian chờ phản hồi | 10 giây |
| Số lần gửi tối đa | 4 lần (bao gồm lần gửi đầu tiên) |
| Khoảng cách giữa các lần gửi lại | 5 phút |

- AppotaPay chỉ gửi IPN khi giao dịch đã có kết quả cuối (`status` là `success` hoặc `error`), không gửi IPN cho giao dịch còn đang xử lý.
- Cùng một giao dịch có thể nhận IPN nhiều lần. Hệ thống đối tác cần chống xử lý trùng theo `partnerRefId`: nếu đơn đã được cập nhật kết quả trước đó thì bỏ qua và vẫn trả về `HTTP 200`.
- Nếu sau 4 lần gửi vẫn thất bại, AppotaPay dừng gửi lại. Đối tác cần chủ động gọi API kiểm tra trạng thái giao dịch để đối soát, hoặc liên hệ AppotaPay để gửi lại IPN thủ công.
- Chỉ xác nhận giao dịch thành công khi `status = success`, `errorCode = 0` và `signature` hợp lệ.

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v2/service/topup/charging-async' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  -d '{
  "partnerRefId": "AB123",
  "telco": "viettel",
  "telcoServiceType": "prepaid",
  "phoneNumber": "0866123456",
  "productCode": "viettel_10",
  "signature": "5a2774918a29cf4d2bdb78cccceb956f4c27837fad09a03a56e1df68b1bf29dd"
}'
```

### Request

#### REQUEST
