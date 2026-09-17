<!-- source: https://docs.appotapay.com/cc-merchant-host/refund-detail -->

# Refund: Detail

## Refund: Detail

Bạn có thể sử dụng API để xem chi tiết thông tin giao dịch Hoàn trả

### EndPoint

`GET` `/credit-card/refund/:creditCardRefundId`

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

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| refundId | required | String | Mã giao dịch refund phía AppotaPay |  |

#### Query Parameter

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| referenceType | optional | String | - `APPOTAPAY_REFERENCE_ID` nếu sử dụng mã giao dịch được tạo bởi AppotaPay, trả trong phần phản hồi khi gửi yêu cầu uỷ quyền thành công (giá trị mặc định) - `MERCHANT_REFERENCE_ID` nếu sử dụng mã tham chiếu merchant gửi trong yêu cầu huỷ uỷ quyền |  |

### Response Params

```json
{
    "refundId": "01HQJ41Q7135ZNJTKTWB92BTVH",
    "transactionId": "01HQHRWBC773J6CJV9VRZMBXD2",
    "merchantRefId": "S68O0whWv",
    "amount": 500000,
    "currency": "VND",
    "status": "success",
    "createdAt": "2024-02-26T14:11:12+07:00",
    "updatedAt": "2024-02-26T14:11:15+07:00"
}
```

#### Thành công

> Http Status Code 200 - OK

Response giống với API Refund: Create

#### Thất bại

> HTTP Status Code != 200

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/credit-card/refund/01HQJ41Q7135ZNJTKTWB92BTVH?referenceType=APPOTAPAY_REFERENCE_ID' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653'
```

### Request

#### REQUEST
