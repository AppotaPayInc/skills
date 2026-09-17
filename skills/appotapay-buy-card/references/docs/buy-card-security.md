<!-- source: https://docs.appotapay.com/buy-card/security -->

# Bảo mật

## Bảo mật

## 1. Hướng dẫn tạo signature API Mua mã thẻ

### Ví dụ tham số truyền lên API

```json
{
  "partnerRefId": "AB123",
  "productCode": "AC100",
  "quantity": 10,
  "signature": "b10294bae53e89919b3efd62a763bf3..."
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Các trường được ký bao gồm `partnerRefId` + `productCode` + `quantity` 
Chuỗi được tạo ra với các tham số trên sẽ là:

> "partnerRefId=AB123&productCode=AC100&quantity=10"

> signature = HMAC_SHA256("partnerRefId=AB123&productCode=AC100&quantity=10", YOUR_SECRET_KEY)
