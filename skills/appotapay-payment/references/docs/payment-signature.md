<!-- source: https://docs.appotapay.com/payment/signature -->

# Cách tạo signature

## Ví dụ tham số truyền lên API

```json
{
    "amount": 10000,
    "orderId": "5f61cf4f41e2b",
    "orderInfo": "test thanh toan",
    "bankCode": "VCB",
    "paymentMethod": "ATM",
    "clientIp": "103.53.171.140",
    "extraData": "",
    "notifyUrl": "http://yourwebsite.com/ipn",
    "redirectUrl": "http://yourwebsite.com/redirect"
}
```

Thứ tự các tham số để tạo ra `signature` sẽ được sort theo thứ tự alphabet 
Chuỗi được tạo ra với các tham số trên sẽ là:

> amount=10000&bankCode=VCB&clientIp=103.53.171.140&extraData=&notifyUrl=http://yourwebsite.com/ipn& orderId=5f61cf4f41e2b&orderInfo=test thanh toan&paymentMethod=ATM&redirectUrl=http://yourwebsite.com/redirect

> signature = HMAC_SHA256("amount=10000&bankCode=VCB&clientIp=103.53.171.140& extraData=&notifyUrl=http://yourwebsite.com/ipn& orderId=5f61cf4f41e2b&orderInfo=test thanh toan&paymentMethod=ATM&redirectUrl=http://yourwebsite.com/redirect", YOUR_SECRET_KEY)
