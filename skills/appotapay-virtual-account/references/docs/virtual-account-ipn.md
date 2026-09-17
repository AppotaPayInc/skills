<!-- source: https://docs.appotapay.com/virtual-account/ipn -->

# Instant Payment Notification

> Partner xây dựng một URL IPN để nhận kết quả thanh toán. AppotaPay thực hiện request kèm params đến IPN của Partner khi có giao dịch thanh toán.

## IPN

Kiểm tra kĩ thông số các trường amount & signature

Mỗi giao dịch đều có một mã `transactionId` duy nhất. Hãy đảm bảo rằng mỗi giao dịch chỉ được xử lý một lần duy nhất dựa trên mã này.

Method: `POST`

Header:

```json
{
    "Content-Type": "application/json"
}
```

### Dữ liệu truyền sang IPN URL

> Đối tác sử dụng hàm JSON_Decode để giải mã dữ liệu ở dạng json trước khi thực hiện kiểm tra

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| apiKey | String | Mã api key |
| partnerCode | String | Mã số đối tác |
| billCode | String | Mã đơn hàng |
| amount | Integer | Số tiền thanh toán |
| bankAccountNumber | String | Số tài khoản |
| bankAccountName | String | Tên tài khoản |
| bankCode | String | Mã ngân hàng |
| requestTime | Integer | Thời gian send IPN |
| transactionTime | Integer | Thời gian thanh toán giao dịch |
| transactionId | String | Mã giao dịch |
| extraData | String | Thông tin thêm |
| version | String | Phiên bản hiện tại IPN |
| memo | String | Nội dung chuyển khoản |
| signature | String | Chữ ký các tham số trả về từ API, các tham số được đưa vào chữ ký theo thứ tự bao gồm: amount + apiKey + bankAccountName + bankAccountNumber + bankCode + billCode + extraData + memo + partnerCode + requestTime + transactionId + transactionTime + version (xem thêm phần cách tạo signature) |

## Ví dụ

### Response

```json
{
    "apiKey": "oMhJpkz7K6HDcR6S",
    "partnerCode": "TEST",
    "billCode": "123456",
    "amount": 100000,
    "bankAccountNumber": "902098898909",
    "bankAccountName": "NGUYEN VAN A",
    "bankCode": "WOORIBANK",
    "requestTime": 1577811600,
    "transactionTime": 1577811600,
    "transactionId": "AP1212121212",
    "extraData": "test",
    "version": "1.0",
    "memo": "test chuyen tien",
    "signature": "b10294bae53e89919b3efd62a763bf3228e260ef1a329..."
}
```

## Thông tin từ IPN trả về

| StatusCode (String) | StatusDetail (String) |
| --- | --- |
| 00 | Success |
| 11 | Signature not match |
| 15 | Duplicate transactionId |
| 16 | Unknow Error |
| 99 | Timeout |

### Ví dụ

```json
{
    "statusCode": 00,
    "statusDetail": "Success"
}
```

### Response format

- Khi xác nhận giao dịch thành công thông qua IPN, đối tác cần phản hồi lại cho AppotaPay xác nhận đã nhận được kết quả
- Trường hợp phía Partner không phản hồi lại thành công, phía AppotaPay sẽ phản hồi thêm tối đa 3 lần, mỗi lần cách nhau 5 phút
- Phản hồi được coi là thành công khi `HTTP code = 200`

Example success response

> HTTP Code: 200

> Body:

```json
{
    "statusCode": 00,
    "statusDetail": "Success"
}
```
