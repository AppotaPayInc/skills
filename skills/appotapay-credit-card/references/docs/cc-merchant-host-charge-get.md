<!-- source: https://docs.appotapay.com/cc-merchant-host/charge-get -->

# Charge: Get

## Charge: Get

Bạn có thể sử dụng API để xem chi tiết thông tin giao dịch.

### EndPoint

`GET` `/credit-card/charge/:creditCardRefId`

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

#### URL Parameter

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| creditCardRefId | required | String | Transaction ID được tạo bảo AppotaPay khi charge thành công, hoặc Reference ID được gửi trong yêu cầu từ merchant |

#### Query Parameter

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| referenceType | optional | String | - `APPOTAPAY_REFERENCE_ID` nếu sử dụng mã giao dịch (id) được tạo bởi AppotaPay, trả trong phần phản hồi khi sử dụng API Create Charge (giá trị mặc định) - `MERCHANT_REFERENCE_ID` nếu sử dụng mã tham chiếu merchant gửi trong yêu cầu charge |

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

Response giống với API Charge: Create

#### Thất bại

> HTTP Status Code != 200

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/credit-card/charge/:creditCardRefId' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'X-Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653'
```

### Request

#### REQUEST
