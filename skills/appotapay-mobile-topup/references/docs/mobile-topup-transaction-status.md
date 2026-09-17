<!-- source: https://docs.appotapay.com/mobile-topup/transaction-status -->

# API Kiểm tra trạng thái giao dịch

## API Kiểm tra trạng thái giao dịch

Endpoint: `/api/v1/service/topup/transaction/{partnerRefId}`

Method: `GET`

Header: Cách tạo JWT_TOKEN

Language: en | vi

```json
{
    "X-APPOTAPAY-AUTH": Bearer JWT_TOKEN,
    "Content-Type": "application/json",
    "Language": LANGUAGE
}
```

### Tham số

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| partnerRefId | √ | String | Mã giao dịch phía đối tác đưa vào API url |

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi trả về |
| message | String | Mô tả chi tiết mã lỗi |
| transaction | Object | Thông tin giao dịch |
| transaction.amount | Integer | Số tiền giao dịch |
| transaction.topupAmount | String | Số tiền nạp |
| transaction.phoneNumber | String | Số điện thoại nạp |
| transaction.appotapayTransId | String | Mã giao dịch phía AppotaPay |
| transaction.time | String | Thời gian giao dịch |
| transaction.telco | String | Tên nhà mạng |
| transaction.telcoServiceType | String | Loại dịch vụ (giá trị có thể thay đổi theo thông tin thực tế của thuê bao do nhà mạng trả về) |
| signature | String | Chữ ký thông tin giao dịch trả về, các trường được ký bao gồm (amount + appotapayTransId + errorCode + phoneNumber + time + topupAmount) (xem thêm phần cách tạo signature) |

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/topup/transaction/AB123' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json'
```

### Request

#### REQUEST
