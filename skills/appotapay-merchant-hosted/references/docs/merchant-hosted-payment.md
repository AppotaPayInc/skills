<!-- source: https://docs.appotapay.com/merchant-hosted/payment -->

# Kết nối thanh toán

### EndPoint

`POST` `/api/v2/orders/create-payment`

### Header Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| X-APPOTAPAY-AUTH | required | String | Cách tạo JWT_TOKEN |  |
| Content-Type | required | String | Giá trị: `application/json` |  |
| X-Request-ID | optional | String | Định dạng UUIDv4. Request ID để kiểm tra yêu cầu khi xảy ra sự cố | max:42 |
| X-Language | optional | String | Giá trị `vi` hoặc `en` tương ứng với link thanh toán sẽ là tiếng việt hoặc tiếng anh, (mặc định: `vi`) | in:vi,en |
| X-Account-Ref-ID | optional | String | Mã định danh của tài khoản Sub account do AppotaPay cung cấp. Bắt buộc truyền khi thanh toán giao dịch của Sub account loại owner |  |

```json
{
    "X-APPOTAPAY-AUTH": "JWT_TOKEN",
    "Content-Type": "application/json",
    "X-Request-ID": "Your_Unique_id",
    "X-Language": "vi",
    "X-Account-Ref-ID": "9723f73b-9295-4acb-884b-ab6310c2e653"
}
```

### Request Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| transaction | required | Object | Thông tin giao dịch |  |
| transaction.amount | required | Integer | Số tiền thanh toán |  |
| transaction.currency | required | String | Đơn vị tiền tệ (VND) | Chấp nhận: VND |
| transaction.bankCode | required | String | Tham khảo Bảng mã Ngân hàng |  |
| transaction.paymentMethod | required | String | Tham khảo Bảng mã phương thức thanh toán |  |
| transaction.action | required | String | Hành động thanh toán muốn thực hiện (PAY), mặc định: PAY | Chấp nhận: PAY |
| sourceOfFunds | required | Object | Thông tin thẻ/tài khoản thanh toán |  |
| sourceOfFunds.type | required | Object | Loại thanh toán (card, account) | Chấp nhận: card/account |
| sourceOfFunds.card | required_if | Object | Thông tin thẻ thanh toán | Bắt buộc khi type = card |
| sourceOfFunds.card.cardNumber | required | String | Số thẻ |  |
| sourceOfFunds.card.cardHolderName | required | String | Tên chủ thẻ |  |
| sourceOfFunds.card.cardMonth | required | String | Tháng phát hành/ hết hạn được in trên thẻ Yêu cầu với từng bankCode như sau: LINK |  |
| sourceOfFunds.card.cardYear | required | String | Năm phát hành/ hết hạn được in trên thẻ Yêu cầu với từng bankCode như sau: LINK |  |
| sourceOfFunds.account | required_if | Object | Thông tin tài khoản | Bắt buộc khi type = account |
| sourceOfFunds.account.accountNumber | required | String | Số tài khoản |  |
| sourceOfFunds.account.accountHolderName | required | String | Tên chủ tài khoản |  |
| sourceOfFunds.account.identificationNumber | required | String | Số định danh cá nhân |  |
| partnerReference | required | Object | Thông tin phía đối tác |  |
| partnerReference.order.id | required | String | Mã đơn hàng phía đối tác | Max: 50 |
| partnerReference.order.info | required | String | Thông tin đơn hàng (tối đa 150 kí tự) | Max: 150 |
| partnerReference.order.extraData | optional | String | Thông tin tuỳ chọn bổ sung | Max: 200 |
| partnerReference.notificationConfig.notifyUrl | required | String | URL nhận kết quả giao dịch | Max: 100 |
| partnerReference.notificationConfig.redirectUrl | required | String | URL chuyển hướng trên trình duyệt | Max: 100 |

### Example Request

```json
{
  "transaction": {
    "amount": 10000,
    "currency": "VND",
    "bankCode": "VCB",
    "paymentMethod": "ATM",
    "action": "PAY"
  },
  "sourceOfFunds": {
    "type": "card",
    "card": {
      "cardNumber": "9704000000000018",
      "cardHolderName": "NGUYEN VAN A",
      "cardMonth": "03",
      "cardYear": "07"
    }
  },
  "partnerReference": {
    "order": {
      "id": "5f61cf4f41e2b",
      "info": "test thanh toan",
      "extraData": ""
    },
    "notificationConfig": {
      "notifyUrl": "https://devtool.vn/ipn",
      "redirectUrl": "https://devtool.vn/redirect",
    }
  }
}
```

### Response Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| transaction | required | Object | Thông tin giao dịch |
| transaction.transactionId | required | String | Mã giao dịch phía Appotapay |
| transaction.status | required | String | Trạng thái giao dịch |
| transaction.errorCode | required | Integer | Bảng mã lỗi |
| transaction.errorMessage | required | String | Mô tả lỗi |
| transaction.partnerCode | required | String | Mã đối tác |
| transaction.amount | required | Integer | Số tiền thanh toán |
| transaction.orderAmount | required | Integer | Số tiền đơn hàng |
| transaction.fee | required | Object | Phí thanh toán |
| transaction.fee.customer_fee | required | String | Phí thanh toán tính cho khách hàng |
| transaction.currency | required | String | Đơn vị tiền tệ |
| transaction.bankCode | required | String | Mã Ngân hàng khách hàng đã chọn |
| transaction.paymentMethod | required | String | Phương thức thanh toán |
| transaction.action | required | String | Loại thanh toán |
| transaction.createdAt | required | String | Thời gian tạo giao dịch. (định dạng chuẩn RFC-3339) |
| transaction.updatedAt | required | String | Thời gian cập nhật giao dịch. (định dạng chuẩn RFC-3339) |
| authentication | required | Object |  |
| authentication.verificationUrl | required | String | URL xác nhận thanh toán |
| authentication.verificationMethod | required | String | Phương thức xác nhận thanh toán (OTP) |
| authentication.verificationStatus | required | String | Trạng thái xác nhận thanh toán |

### Thành công

> Http Status Code 200 - OK

```json
{
  "transaction": {
    "transactionId": "AP123",
    "status": "pending",
    "errorCode": 35,
    "errorMessage": "Giao dịch đang chờ xử lý",
    "partnerCode": "TEST",
    "amount": 11327,
    "orderAmount": 10000,
    "fee": {
      "customer_fee": 1327
    },
    "currency": "VND",
    "bankCode": "VCB",
    "paymentMethod": "ATM",
    "action": "PAY",
    "createdAt": "2023-11-13 15:23:40.000",
    "updatedAt": "2023-11-13 15:23:40.000"
  },
  "authentication": {
    "verificationUrl": "https://ibanking.dev.appotapay.com/domestic-card/napas/confirm-otp?tran=eyJ0cmFuc0lkIjoiMDFIUjY4UFA3NEgxS1RINjNTV0ZKVllDNE4iLCJkYXRhS2V5IjoiNjdydzl4VFpLdEt0TTh4ZGtiRDlKYVhZbVROM1BCdlVHWDZIcnJpeTFuRGIwUksvRkp5Z2ZiWEo2SUt6U2ZWZGtwTmhEYmp1MTcxNXFqbWpndUlyL20xWTVtT0VKS0NlcEIwOCtQamlSZit2R2xEcTlFeU9FV3FjVnBEVjI4UWswbzQ5eEtTRXNFanBBZWJoRVNZMUNRRnlmWVMwU2NiQnJha0xWZ1FOMng3WTBUeGc4Uk9ESFhLK1N4SG80NFRNWUxtRkdSWk0xNExpOHBONHhrNWlyN1EvRkVoVVBqSDQ2aE50aCtQSFRkeW5MNlVKcnlOOEphcVdXaUNJOU1uVFJhcklraFU3MUlkU3REWFdwMlNQcEVhSTRZUGZuRElhZGhnRWF6Zk9WWm0zUjJibUxIMHllTEEwZndXTDY3VHk1ZFZpOUZwVWp4R01iZDZnMHB3eDNnZG1TcUkreHJLbTRJTUo4TEErN0JNU3JJTW9rUHVqZkY0UGd4Vk9vd3QrNUl4c0kvek40eGlPa1VjUWFwdWhoOTlpa1l0YTViNEpYTks3THZ3VVltYz0iLCJuYXBhc0tleSI6Ik1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBcmJQNmlGbDBaOXBESHY1bmkvZmhsNE1FNkFmUDE2RTV6bXJIWWZ0YUJsY3ZxMWJXUndrMVRIMjNPcllRNm42akVHSWJtclZYeklNMDBsazcyMy9aSHR2YnlabGQ4cjVUY0VoNU0raC9qSXUzL0o5Z3FOWUdUbzlqTEowRHZSZFNmemJEV0pxUEltUGZjR0pEUlBUckV0Y2txbWQ4SHZrVTZKM01DUHJnMElPR1RZcGxVbXc2RFoyNWcxU3BCU2IxQ0FXR3FQMzZucXl4Tlo0aE5KMDhhZ0hRYlJjL0lDSFViLzgrL1VqREVUWDk2U1lWbitHQktick1NL05jZ2lKVjdVWGJFbVE5T0VpTTNCYkk1c3JoQ090MG9Zb0NwMHNKY3BMY0xiUmxwZEM3L25WNDRLUHR5MXJrWjMyS2xCdWZ6M1VWZ2dYcEhQejBrMHl4WVR2bC93SURBUUFCOk1JSUN0VENDQVowQ0JnRm9rbzg5K0RBTkJna3Foa2lHOXcwQkFRVUZBREFlTVJ3d0dnWURWUVFERXhOVVpYTjBJRU5CSUVObGNuUnBabWxqWVhSbE1CNFhEVEU1TURFeU9EQXpORFEwTjFvWERURTVNREV5T1RBek5EUTBOMW93SGpFY01Cb0dBMVVFQXhNVFZHVnpkQ0JEUVNCRFpYSjBhV1pwWTJGMFpUQ0NBU0l3RFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCQUsyeitvaFpkR2ZhUXg3K1o0djM0WmVEQk9nSHo5ZWhPYzVxeDJIN1dnWlhMNnRXMWtjSk5VeDl0enEyRU9wK294QmlHNXExVjh5RE5OSlpPOXQvMlI3YjI4bVpYZksrVTNCSWVUUG9mNHlMdC95ZllLaldCazZQWXl5ZEE3MFhVbjgydzFpYWp5SmozM0JpUTBUMDZ4TFhKS3BuZkI3NUZPaWR6QWo2NE5DRGhrMktaVkpzT2cyZHVZTlVxUVVtOVFnRmhxajkrcDZzc1RXZUlUU2RQR29CMEcwWFB5QWgxRy8vUHYxSXd4RTEvZWttRlovaGdTbTZ6RFB6WElJaVZlMUYyeEprUFRoSWpOd1d5T2JLNFFqcmRLR0tBcWRMQ1hLUzNDMjBaYVhRdS81MWVPQ2o3Y3RhNUdkOWlwUWJuODkxRllJRjZSejg5Sk5Nc1dFNzVmOENBd0VBQVRBTkJna3Foa2lHOXcwQkFRVUZBQU9DQVFFQUZYSzQ4cDcxUzg3RW1ybkNtNVl2djQyT3h6aDBCMTgvcTRqbjg5MXhTMWFiRlJrVzJqZEN2cGMzSVVRTDZneStKRlFjWTJOU2FMaElZZ0JhZm1jbmdpQkZ0NGtrVHFVdXdTZElXdWRsM2pZa081OFNPWUtkeFc4amJYTTVLd1R1anBiMGdZQnBmMXU1ODI4Um1FcTZZRW9nL3l4L2hZUU9GUWxmSUJCWkZObVVKN1U1VERDRkwyd1Q1TXFQZzJjZmIxRGlydmVEM3NMU0lVYzkwSUpNM2VVWGZ6WHFrd2RyQ0tEWlJTdVYzVE1IQ2hpMUlSaW8yZmc3emVzaTlIbGlGdWVhZWtrdnlubndYb0c0MUxLYU1TQk1NL01kcmIydG0yOWpWWW5sWUo4Q29qK2RPaldoVTJ5ODNkRmk1REdyOGEzZnRXT2MrckV6MnpsT1VLUkY3UT09IiwiZXhwaXJ5RGF0ZSI6MTcwOTYwOTI0NSwiY2xpZW50SXAiOiIxMjcuMC4wLjEiLCJkZXZpY2VJZCI6IkRJMTc4MzQ2MzUyNSIsInBhbmVyQ29kZSI6Ilh1QXBwb3RhUGF5IiwiUGFydG5lck5hbWUiOiJYdUFwcG90YVBheSIsImFwaU9wZXJhdGlvbiI6IlBVUkNIQVNFX0FDQ09VTlQiLCJsYW5ndWFnZSI6InZpIiwidmVyc2lvbiI6InYxIn0=&sign=97b25a7e38d6501bbaeb4fa0793670209e3f6987e9c48f6b1fc58f0d828f79fa",
    "verificationMethod": "OTP",
    "verificationStatus": "AUTHENTICATE_REQUIRED"
  }
}
```

### Thất bại

> HTTP Status Code != 200
> Với errorCode trả về, vui lòng tham khảo bảng mã lỗi tại đây

#### Error response params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| errorCode | required | Integer | Mã lỗi |
| message | required | String | Mô tả lỗi |
| errors | optional | Array of Object | Mô tả lỗi chi tiết các trường nếu có |
| errors.field | required | Object | Trường dữ liệu bị lỗi |
| errors.reason | required | Object | Mô tả trường dữ liệu bị lỗi |

```json
{
  "errorCode": 1,
  "message": "Invalid Params",
  "errors": [
    {
      "field": "transaction.amount",
      "reason": "Field amount is required"
    },
    {
      "field": "transaction.currency",
      "reason": "Field currency is required"
    }
  ]
}
```

#### Bảng mã lỗi

| Mã lỗi | Mô tả |
| --- | --- |
| 1 | Thông tin yêu cầu thiếu hoặc không hợp lệ |
| 30 | Mã đơn hàng đã bị trùng, vui lòng thực hiện lại giao dịch |
| 32 | Số tiền không hợp lệ |
| 90 | X-Account-Ref-ID không hợp lệ |
| 140 | Partner không có quyền sử dụng paymentMethod |
| 141 | Partner không có quyền sử dụng bankCode |
| 500 | Hệ thống gặp lỗi, vui lòng thử lại sau |

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v2/orders/create-payment' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'X-Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653' \
  -d '{
  "transaction": {
    "amount": 10000,
    "currency": "VND",
    "bankCode": "VCB",
    "paymentMethod": "ATM",
    "action": "PAY"
  },
  "sourceOfFunds": {
    "type": "card",
    "card": {
      "cardNumber": "9704000000000018",
      "cardHolderName": "NGUYEN VAN A",
      "cardMonth": "03",
      "cardYear": "07"
    }
  },
  "partnerReference": {
    "order": {
      "id": "5f61cf4f41e2b",
      "info": "test thanh toan",
      "extraData": ""
    },
    "notificationConfig": {
      "notifyUrl": "https://devtool.vn/ipn",
      "redirectUrl": "https://devtool.vn/redirect"
    }
  }
}'
```

### Request

#### REQUEST
