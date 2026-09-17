<!-- source: https://docs.appotapay.com/cc-merchant-host/charge-capture -->

# Charge: Capture

Bạn có thể capture trong vòng 7 ngày sau khi authorization thành công

### EndPoint

`POST` `/credit-card/:authorizationId/capture`

### Header Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| X-APPOTAPAY-AUTH | required | String | Cách tạo JWT_TOKEN |  |
| Content-Type | required | String | Giá trị: `application/json` |  |
| X-Request-ID | optional | String | Định dạng UUIDv4. Request ID để kiểm tra yêu cầu khi xảy ra sự cố | max:42 |
| Language | optional | String | Giá trị `vi` hoặc `en` tương ứng với link thanh toán sẽ là tiếng việt hoặc tiếng anh, (mặc định: `vi`) | in:vi,en |
| X-Account-Ref-ID | optional | String | Mã định danh của tài khoản Sub account do AppotaPay cung cấp. Bắt buộc truyền khi thanh toán giao dịch của Sub account loại owner |  |

```json
{
    "X-APPOTAPAY-AUTH": "JWT_TOKEN",
    "Content-Type": "application/json",
    "X-Request-ID": "Your_Unique_id",
    "Language": "vi",
    "X-Account-Ref-ID": "9723f73b-9295-4acb-884b-ab6310c2e653"
}
```

### Request Params

#### Query Parameters

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| authorizationId | required | String | Mã giao dịch (id) được tạo bởi AppotaPay, trả trong phần phản hồi khi sử dụng API Create Charge |

#### Body

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| amount | required | String | Số tiền yêu cầu capture. Điều kiện: amount < authorizedAmount (authorizedAmount: số tiền hold thành công trong giao dịch Charge với Capture: False trước đó) | Min: 1000 |
| currency | required | String | Loại tiền thanh toán. Bao gồm 3 ký tự theo chuẩn ISO-4217. | Support VND |

### Example Request

```json
{
    "amount": 1000000,
    "currency": "VND"
}
```

### Response Params

```json
{
    "id": "01HQHRS9P9J5YPCJ09D94VW84F",
    "authenticationId": "01HQHRPNYW78CQJK7CAW1SJP9F",
    "merchantRefId": "hi8xGfznb",
    "status": "CAPTURED",
    "authorizedAmount": 1000000,
    "capturedAmount": 1000000,
    "currency": "VND",
    "approvalCode": "831000",
    "eci": "02",
    "reconciliationId": "AP241446381046",
    "bankReconciliationId": "7089196646896845103954",
    "tokenId": "01hqhrp3yhff7z7bvtq6whwz8t",
    "card": {
        "number": "520000XXXXXX2151",
        "expirationMonth": "12",
        "expirationYear": "29",
        "cardBrand": "MASTERCARD",
        "cardType": "CREDIT",
        "countryCode": "VI"
    },
    "chargeType": "BY_MULTIPLE_TOKEN",
    "createdAt": "2024-02-26T10:54:22+07:00",
    "updatedAt": "2024-02-26T10:56:04+07:00"
}
```

#### Thành công

> Http Status Code 200 - OK

The response is the same with Charge: Create API

#### Thất bại

> HTTP Status Code != 200

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/credit-card/01HQHRPNYW78CQJK7CAW1SJP9F/capture' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653' \
  -d '{
  "amount": 1000000,
  "currency": "VND"
}'
```

### Request

#### REQUEST
