<!-- source: https://docs.appotapay.com/mobile-topup/security -->

# Bảo mật

## 1. Hướng dẫn tạo signature API Nạp tiền điện thoại

### Ví dụ tham số truyền lên API

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

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`partnerRefId` + `phoneNumber` + `productCode` + `telco` + `telcoServiceType`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "partnerRefId=AB123&phoneNumber=0866123456&productCode=viettel_10&telco=viettel&telcoServiceType=prepaid"

> signature = HMAC_SHA256("partnerRefId=AB123&phoneNumber=0866123456&productCode=viettel_10&telco=viettel&telcoServiceType=prepaid", YOUR_SECRET_KEY)

### Ví dụ tham số trả về của API

```json
{
  "errorCode": 0,
  "message": "Thành công",
  "transaction": {
    "phoneNumber": "0866123456",
    "amount": 100000,
    "topupAmount": 100000,
    "productCode": "viettel_10",
    "appotapayTransId": "01JCM8K321W0ZFHK99T8JBXR2P",
    "time": "14-11-2024 09:38:43"
  },
  "account": {
    "balance": 3402291841
  },
  "signature": "c0bd34c43314165b1474c190c71fee22bca6bd0cf8273853bb9acb510d6063bf"
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`amount` + `appotapayTransId` + `topupAmount` + `errorCode` + `time` + `phoneNumber` + `productCode`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "amount=100000&appotapayTransId=01JCM8K321W0ZFHK99T8JBXR2P&errorCode=0&phoneNumber=0866123456&productCode=viettel_10&time=14-11-2024 09:38:43&topupAmount=100000"

> signature = HMAC_SHA256("amount=100000&appotapayTransId=01JCM8K321W0ZFHK99T8JBXR2P&errorCode=0&phoneNumber=0866123456&productCode=viettel_10&time=14-11-2024 09:38:43&topupAmount=100000", YOUR_SECRET_KEY)

## 2. Hướng dẫn tạo signature API Kiểm tra trạng thái giao dịch

### Ví dụ tham số trả về của API

```json
{
  "errorCode": 0,
  "message": "Thành công",
  "transaction": {
    "phoneNumber": "0866123456",
    "amount": 100000,
    "topupAmount": 100000,
    "appotapayTransId": "01JCM8K321W0ZFHK99T8JBXR2P",
    "time": "14-11-2024 09:38:43"
  },
  "signature": "c0bd34c43314165b1474c190c71fee22bca6bd0cf8273853bb9acb510d6063bf"
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`amount` + `appotapayTransId` + `topupAmount` + `errorCode` + `time` + `phoneNumber`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "amount=100000&appotapayTransId=01JCM8K321W0ZFHK99T8JBXR2P&errorCode=0&phoneNumber=0866123456&time=14-11-2024 09:38:43&topupAmount=100000"

> signature = HMAC_SHA256("amount=100000&appotapayTransId=01JCM8K321W0ZFHK99T8JBXR2P&errorCode=0&phoneNumber=0866123456&time=14-11-2024 09:38:43&topupAmount=100000", YOUR_SECRET_KEY)
