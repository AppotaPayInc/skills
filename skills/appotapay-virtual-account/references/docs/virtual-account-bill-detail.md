<!-- source: https://docs.appotapay.com/virtual-account/bill-detail -->

# API Chi tiết hoá đơn

## API Chi tiết hoá đơn

Endpoint: `/api/v1/service/ebill/detail/{billCode}`

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
| billCode | √ | String | Mã đơn hàng phía Partner |

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi trả về |
| message | String | Chi tiết mã lỗi |
| billCode | String | Mã thanh toán theo quy định của AppotaPay |
| amount | Integer | Số tiền cần thanh toán |
| paidAmount | Integer | Số tiền đã thanh toán |
| billExpiryTime | Integer | Thời gian hết hạn giao dịch thanh toán hóa đơn |
| payment | Object | Payment information user paid |
| payment.bankAccounts | Array of Object | Thông tin tài khoản ngân hàng |
| payment.bankAccounts.bankCode | String | Mã ngân hàng |
| payment.bankAccounts.bankName | String | Tên ngân hàng |
| payment.bankAccounts.accountNo | String | Số tài khoản |
| payment.bankAccounts.accountName | String | Tên tài khoản |
| payment.bankAccounts.bankBranch | String | Chi nhánh ngân hàng |
| payment.bankAccounts.status | String | Trạng thái tài khoản active: tài khoản hoạt động bình thườnginactive: tài khoản tạm thời không hoạt độngclosed: tài khoản đã bị đóng |
| signature | String | Chữ ký các tham số truyền lên API, các tham số được đưa vào chữ ký theo thứ tự bao gồm: amount + billCode + billExpiryTime + errorCode + paidAmount + json_encode(payment) (xem thêm phần cách tạo signature) |

## Ví dụ

### Response

```json
{
    "errorCode": 0,
    "message": "Thành công",
    "billCode":"605823cdc67f4",
    "amount":50000,
    "paidAmount":0,
    "billExpiryTime":1616818154,
    "payment": {
        "bankAccounts": [{
        "bankCode": "WOORIBANK",
        "bankName": "WOORIBANK",
        "accountNo": "902000225811",
        "accountName": "AP NGUYEN VAN A",
        "bankBranch": "",
        "status": "active"
        }]
    },
    "signature": "73c600b139fcd08eecf811d1c5869504d039f1ed8b320ede614ab0 9469c4a44b"
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/ebill/detail/{billCode}' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json'
```

### Request

#### REQUEST
