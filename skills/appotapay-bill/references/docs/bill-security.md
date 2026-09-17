<!-- source: https://docs.appotapay.com/bill/security -->

# Bảo mật

## Bảo mật

## 1. Hướng dẫn tạo signature API Truy vấn thông tin hoá đơn

### Ví dụ tham số truyền lên API

```json
{
  "partnerRefId": "AB123",
  "billCode": "PD12121",
  "serviceCode": "ENVHN",
  "signature": "b10294bae53e89919b3efd62a763bf3..."
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm `billCode` + `partnerRefId` + `serviceCode` 
Chuỗi được tạo ra với các tham số sẽ là:

> "billCode=PD12121&partnerRefId=AB123&serviceCode=ENVHN"

> signature = HMAC_SHA256("billCode=PD12121&partnerRefId=AB123&serviceCode=ENVHN", YOUR_SECRET_KEY)

## 2. Hướng dẫn tạo signature API Thanh toán hoá đơn

### Ví dụ tham số truyền lên API

```json
{
  "amount": 100000,
  "billDetail": [
    {
      "billNumber": "117934",
      "period": "4/2020",
      "amount": 100000,
      "billCreated": "",
      "billExpiry": "",
      "billType": "",
      "billOtherInfo": "",
      "isPartialPaymentAllowed": false,
      "extraInfo": ""
    }
  ],
  "partnerRefId": "AB123",
  "billCode": "PD12121",
  "serviceCode": "ENVHN",
  "signature": "b10294bae53e89919b3efd62a763bf3..."
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm `amount` + `billCode` + `billDetail` + `partnerRefId` + `serviceCode` 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "amount=100000&billCode=PD12121&billDetail=Array&partnerRefId=AB123&serviceCode=ENVHN"

> signature = HMAC_SHA256("amount=100000&billCode=PD12121&billDetail=Array&partnerRefId=AB123&serviceCode=ENVHN", YOUR_SECRET_KEY)

### Ví dụ tham số trả về của API

```json
{
  "errorCode": 0,
  "message": "Thành công",
  "billDetail": [
    {
      "billNumber": "117934",
      "period": "4/2020",
      "amount": 100000,
      "billCreated": "",
      "billExpiry": "",
      "billType": "",
      "billOtherInfo": "",
      "isPartialPaymentAllowed": false,
      "extraInfo": ""
    }
  ],
  "transaction": {
    "amount": 100000,
    "billAmount":100000,
    "appotapayTransId": "01ARXAAWEBDS",
    "time": "10-04-2020 10:10:10"
  },
  "account": {
    "balance": 12200000
  },
  "signature": "b10294bae53e89919b3efd62a763bf3228e260ef1a329..."
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm (`amount` + `appotapayTransId` + `billAmount` + `errorCode` + `time`) 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "amount=100000&appotapayTransId=01ARXAAWEBDS&billAmount=100000&errorCode=0&time=10-04-2020 10:10:10"

> signature = HMAC_SHA256("amount=100000&appotapayTransId=01JCM8K321W0ZFHK99T8JBXR2P&errorCode=0&phoneNumber=0866123456&time=14-11-2024 09:38:43&topupAmount=100000", YOUR_SECRET_KEY)
