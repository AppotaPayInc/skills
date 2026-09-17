<!-- source: https://docs.appotapay.com/virtual-account/security -->

# Bảo mật

## 1. Hướng dẫn tạo signature API Tạo hoá đơn thanh toán

### Ví dụ tham số truyền lên API

```json
{
  "billCode": "60586f8d6a684",
  "billInfo": "Thanh toán hóa đơn",
  "serviceCode": "GAME",
  "customerName": "NGUYEN VAN A",
  "notifyUrl": "https://yourdomain.com/ipn",
  "amount": 50000,
  "billExpiryTime": 1616818154,
  "paymentCondition": "NO",
  "bankCode": "WOORIBANK",
  "signature": "abc123"
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`billCode` + `billInfo` + `serviceCode` + `customerName` + `notifyUrl` + `amount` + `billExpiryTime` + `paymentCondition` + `bankCode`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "amount=50000&bankCode=WOORIBANK&billCode=60586f8d6a684&billExpiryTime=1616818154&billInfo=Thanh toán hóa đơn&customerName=NGUYEN VAN A&notifyUrl=https://yourdomain.com/ipn&paymentCondition=NO&serviceCode=GAME"

> signature = HMAC_SHA256("amount=50000&bankCode=WOORIBANK&billCode=60586f8d6a684&billExpiryTime=1616818154&billInfo=Thanh toán hóa đơn&customerName=NGUYEN VAN A&notifyUrl=https://yourdomain.com/ipn&paymentCondition=NO&serviceCode=GAME", YOUR_SECRET_KEY)

### Ví dụ tham số trả về của API

```json
{
  "errorCode": 0,
  "message": "Thành công",
  "billCode": "60586f8d6a684",
  "payment": {
    "bankAccounts": [{
      "bankCode": "WOORIBANK",
      "bankName": "WOORIBANK",
      "accountNo": "902000225675",
      "accountName": "VAP001 PHAM MINH TUAN",
      "bankBranch": ""
    }]
  },
  "signature": "07a0127c496a24e1a72e5eb123da1e7bc603bbf444babc41fde20 63e5438a89f"
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`errorCode` + `billCode` + `json_encode(payment)`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "billCode=60586f8d6a684&errorCode=0&payment={"bankAccounts":[{"bankCode":"WOORIBANK","bankName":"WOORIBANK","accountNo":"902000225675","accountName":"VAP001 PHAM MINH TUAN","bankBranch":""}]}"
> signature = HMAC_SHA256("billCode=60586f8d6a684&errorCode=0&payment={"bankAccounts":[{"bankCode":"WOORIBANK","bankName":"WOORIBANK","accountNo":"902000225675","accountName":"VAP001 PHAM MINH TUAN","bankBranch":""}]}", YOUR_SECRET_KEY)

## 2. Hướng dẫn tạo signature API Chi tiết hoá đơn

### Ví dụ tham số trả về của API

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

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`amount` + `billCode` + `billExpiryTime` + `errorCode` + `paidAmount` + `json_encode(payment)`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "amount=50000&billCode=605823cdc67f4&billExpiryTime=1616818154&errorCode=0&paidAmount=0&payment={"bankAccounts":[{"bankCode":"WOORIBANK","bankName":"WOORIBANK","accountNo":"902000225675","accountName":"VAP001 PHAM MINH TUAN","bankBranch":""}]}"
> signature = HMAC_SHA256("amount=50000&billCode=605823cdc67f4&billExpiryTime=1616818154&errorCode=0&paidAmount=0&payment={"bankAccounts":[{"bankCode":"WOORIBANK","bankName":"WOORIBANK","accountNo":"902000225675","accountName":"VAP001 PHAM MINH TUAN","bankBranch":""}]}", YOUR_SECRET_KEY)

## 3. Hướng dẫn tạo signature API Đóng tài khoản thu hộ

### Ví dụ tham số truyền lên API

```json
{
  "accountNo": "902000668565",
  "billCode": "VA586f8d6a684",
  "partnerRefId": "123456",
  "signature": "abc123"
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`accountNo` + `billCode` + `partnerRefId`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "accountNo=902000668565&billCode=VA586f8d6a684&partnerRefId=123456"

> signature = HMAC_SHA256("accountNo=902000668565&billCode=VA586f8d6a684&partnerRefId=123456", YOUR_SECRET_KEY)

## 4. Hướng dẫn xử lý signature khi nhận IPN

### Ví dụ tham số truyền lên API

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

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`amount` + `apiKey` + `bankAccountName` + `bankAccountNumber` + `bankCode` + `billCode` + `extraData` + `memo` + `partnerCode` + `requestTime` + `transactionId`+ `transactionTime` + `version`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "amount=100000&apiKey=oMhJpkz7K6HDcR6S&bankAccountName=NGUYEN VAN A&bankAccountNumber=902098898909&bankCode=WOORIBANK&billCode=123456&extraData=test&memo=test chuyen tien&partnerCode=TEST&requestTime=1577811600&transactionId=AP1212121212&transactionTime=1577811600&version=1.0"

> signature = HMAC_SHA256("amount=100000&apiKey=oMhJpkz7K6HDcR6S&bankAccountName=NGUYEN VAN A&bankAccountNumber=902098898909&bankCode=WOORIBANK&billCode=123456&extraData=test&memo=test chuyen tien&partnerCode=TEST&requestTime=1577811600&transactionId=AP1212121212&transactionTime=1577811600&version=1.0", YOUR_SECRET_KEY)
