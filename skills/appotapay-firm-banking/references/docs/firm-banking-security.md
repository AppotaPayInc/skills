<!-- source: https://docs.appotapay.com/firm-banking/security -->

# Bảo mật

## 1. Hướng dẫn về signature API chuyển tiền

### Ví dụ tham số truyền lên API

```json
{
  "bankCode": "TPBANK",
  "accountNo": "132100132400000",
  "accountType": "account",
  "accountName": "NGUYEN VAN A",
  "amount": 50000,
  "feeType": "payer",
  "partnerRefId": "Partner9999",
  "message": "ck tien",
  "customerPhoneNumber": "0374720460",
  "contractNumber": "1234567",
  "channel": "citad",
  "bankId": "11223344",
  "signature": "b5bb9a6e9c71281fb1e9js"
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm `accountName` + `accountNo` + `accountType` + `amount` + `bankCode` + `bankId` + `channel` + `contractNumber` + `customerPhoneNumber` + `feeType` + `message` + `partnerRefId` 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "accountName=NGUYEN VAN A&accountNo=132100132400000&accountType=account&amount=50000&bankCode=TPBANK&bankId=11223344&channel=citad&contractNumber=1234567&customerPhoneNumber=0374720460&feeType=payer&message=ck tien&partnerRefId=Partner9999"

> signature = HMAC_SHA256("accountName=AP APPOTAPAY&accountNo=9704000000000018&accountType=card&amount=10000&bankCode=APPOTA_TEST&bankId=11223344&channel=citad&contractNumber=1234567&customerPhoneNumber=0374720460&feeType=payer&message=Test transfer payment&partnerRefId=mBC5n7jU3", YOUR_SECRET_KEY)

### Ví dụ tham số trả về của API

```json
{
  "errorCode": 0,
  "message": "Thành công",
  "transaction": {
    "amount": 50000,
    "transferAmount": 50000,
    "appotapayTransId": "AP19992831832",
    "time": "27-10-2021 10:03:59"
  },
  "account": {
    "balance": 2000000
  },
  "signature": "b5bb9a6e9c71281fb1e06d"
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`amount` + `appotapayTransId` + `errorCode` + `time` + `transferAmount`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "amount=50000&appotapayTransId=AP19992831832&errorCode=0&time=27-10-2021 10:03:59&transferAmount=50000"

> signature = HMAC_SHA256("amount=50000&appotapayTransId=AP19992831832&errorCode=0&time=27-10-2021 10:03:59&transferAmount=50000", YOUR_SECRET_KEY)

## 2. Hướng dẫn về signature API trạng thái giao dịch

### Ví dụ tham số trả về của API

```json
{
  "errorCode": 0,
  "message": "Thành công",
  "transaction": {
    "phoneNumber":"0987777888",
    "amount":50000,
    "transferAmount":50000,
    "appotapayTransId":"01EQTH129581",
    "accountNo":"9704000000000018",
    "accountName":"AP APPOTAPAY",
    "time": 1608778440
  },
  "signature": "b5bb9a6e9c71281fb1e06d"
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`amount` + `appotapayTransId` + `errorCode` + `time` + `transferAmount`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "amount=50000&appotapayTransId=01EQTH129581&errorCode=0&time=1608778440&transferAmount=50000"

> signature = HMAC_SHA256("accountNo=132100132400000&accountType=account&bankCode=TPBANK&partnerRefId=P199212928", YOUR_SECRET_KEY)

## 3. Hướng dẫn check signature khi xử lý kết quả giao dịch pending

### Ví dụ tham số được truyền lên

```json
{
  "errorCode": 0,
  "message": "Thành công",
  "transaction": {
    "amount": 50000,
    "transferAmount": 50000,
    "transferStatus": "success",
    "appotapayTransId": "AP19992831832",
    "partnerRefId": "615fb520099dq4",
    "time": "27-10-2021 10:03:59"
  },
  "signature": "681b80d9dff4bc8d17c8b07ee3ef0fb8e3f1a12148184507c7d80a0bee6efe6d"
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`amount` + `appotapayTransId` + `errorCode` + `partnerRefId` + `time` + `transferAmount` + `transferStatus`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "amount=50000&appotapayTransId=AP19992831832&errorCode=0&partnerRefId=615fb520099dq4&time=27-10-2021 10:03:59&transferAmount=50000&transferStatus=success"

> signature = HMAC_SHA256("amount=50000&appotapayTransId=AP19992831832&errorCode=0&partnerRefId=615fb520099dq4&time=27-10-2021 10:03:59&transferAmount=50000&transferStatus=success", YOUR_SECRET_KEY)

## 4. Hướng dẫn về signature API Kiểm tra thông tin tài khoản

### Ví dụ tham số truyền lên API

```json
{
  "bankCode": "TPBANK",
  "accountNo": "132100132400000",
  "accountType": "account",
  "partnerRefId":"P199212928",
  "signature": "b5bb9a6e9c71281fb1e06d"
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`bankCode` + `accountNo` + `accountType` + `partnerRefId`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> accountNo=132100132400000&accountType=account&bankCode=TPBANK&partnerRefId=P199212928

> signature = HMAC_SHA256("accountNo=132100132400000&accountType=account&bankCode=TPBANK&partnerRefId=P199212928", YOUR_SECRET_KEY)

### Ví dụ tham số trả về của API

```json
{
  "errorCode": 0,
  "message": "Thành công",
  "accountInfo": {
    "accountNo":13210013240000,
    "accountName":"NGUYEN VAN A",
    "bankCode":"TPBANK",
    "accountType":"account"
  },
  "signature": "b5bb9a6e9c71281fb1e06d"
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`accountName` + `accountNo` + `errorCode`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "accountName=NGUYEN VAN A&accountNo=13210013240000&errorCode=0"

> signature = HMAC_SHA256("accountName=NGUYEN VAN A&accountNo=13210013240000&errorCode=0", YOUR_SECRET_KEY)
