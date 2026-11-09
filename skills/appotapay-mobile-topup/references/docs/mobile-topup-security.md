<!-- source: https://docs.appotapay.com/mobile-topup/security -->

# Bảo mật

## Bảo mật

## 1. Hướng dẫn tạo signature API Nạp tiền điện thoại

> Áp dụng cho cả API nạp tiền đồng bộ (/api/v2/service/topup/charging) và API nạp tiền bất đồng bộ (/api/v2/service/topup/charging-async), 2 API dùng chung bộ tham số và cách ký request.

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

## 3. Hướng dẫn kiểm tra signature IPN nạp tiền bất đồng bộ

Áp dụng cho IPN của luồng nạp tiền bất đồng bộ. Đối tác tạo lại `signature` từ dữ liệu nhận được rồi so sánh với `signature` AppotaPay gửi sang, chỉ cập nhật đơn hàng khi 2 giá trị khớp nhau.

### Ví dụ tham số AppotaPay gửi sang

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

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`amount` + `appotapayTransId` + `errorCode` + `partnerRefId` + `phoneNumber` + `productCode` + `status` + `telco` + `telcoServiceType` + `time` + `topupAmount`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "amount=10000&appotapayTransId=01J7G2DYZTPCGHM3AAF8ANZC7J&errorCode=0&partnerRefId=AB123&phoneNumber=0866123456&productCode=viettel_10&status=success&telco=viettel&telcoServiceType=prepaid&time=2026-08-17T10:15:30+07:00&topupAmount=10000"

> signature = HMAC_SHA256("amount=10000&appotapayTransId=01J7G2DYZTPCGHM3AAF8ANZC7J&errorCode=0&partnerRefId=AB123&phoneNumber=0866123456&productCode=viettel_10&status=success&telco=viettel&telcoServiceType=prepaid&time=2026-08-17T10:15:30+07:00&topupAmount=10000", YOUR_SECRET_KEY)
