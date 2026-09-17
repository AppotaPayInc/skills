<!-- source: https://docs.appotapay.com/cc-merchant-host/reversal-detail -->

# Reversal Detail

Bạn có thể sử dụng API để xem thông tin chi tiết lệnh Huỷ uỷ quyền

### EndPoint

`GET` `/credit-card/reversal/:creditCardReversalId`

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
| creditCardReversalId | required | String | Mã giao dịch huỷ uỷ quyền AppotaPay trả về khi merchant khởi tạo yêu cầu huỷ uỷ quyền thành công hoặc Reference ID được gửi trong yêu cầu từ merchant |

#### Query Parameter

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| referenceType | optional | String | - `APPOTAPAY_REFERENCE_ID` mã giao dịch (id) được tạo bởi AppotaPay, trả trong phần phản hồi khi sử dụng API Create Charge với capture: false (giá trị mặc định) - `MERCHANT_REFERENCE_ID` nếu sử dụng mã tham chiếu merchant gửi trong yêu cầu huỷ uỷ quyền |

### Response Params

```json
{
  "reversalId": "01HQHS26CFK4CEGE2QW0PATV5B",
  "authorizationId": "01HQHRZQNJE4BWRB8P9P5Z8BE7",
  "merchantRefId": "MufRIHgy11",
  "amount": 1000000,
  "currency": "VND",
  "status": "success",
  "createdAt": "2024-02-26T10:59:13+07:00",
  "updatedAt": "2024-02-26T10:59:15+07:00",
  "reversedAt": "2024-02-26T10:59:14+07:00"
}
```

#### Thành công

> Http Status Code 200 - OK

Response giống với API Reverse Authorization

#### Thất bại

> HTTP Status Code != 200

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/credit-card/reversal/:creditCardReversalId' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653'
```

### Request

#### REQUEST
