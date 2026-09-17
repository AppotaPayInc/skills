<!-- source: https://docs.appotapay.com/payment/refund-detail -->

# Kiểm tra giao dịch hoàn tiền

Endpoint: `GET` `/api/v2/transaction/refund/{refundRefId}`

### Header Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| X-APPOTAPAY-AUTH | required | String | Cách tạo JWT_TOKEN |  |
| Content-Type | required | String | Giá trị: `application/json` |  |
| X-Request-ID | optional | String | Định dạng UUIDv4. Request ID để kiểm tra yêu cầu khi xảy ra sự cố | max:40 |
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

### URL params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| refundRefId | required | String | Mã tham chiếu giao dịch hoàn tiền |

### Query params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| type | optional | String | Loại tham chiếu giao dịch`TRANSACTION_ID` Get theo mã giao dịch phía AppotaPay`PARTNER_ORDER_ID` Get theo mã giao dịch phía PartnerMặc định là: `TRANSACTION_ID` |

### Dữ liệu trả về

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| refundId | required | String | Mã giao dịch hoàn tiền phía AppotaPay |
| transactionId | required | String | Mã giao dịch thanh toán phía AppotaPay |
| partnerRefId | required | String | Mã tham chiếu giao dịch hoàn tiền phía đối tác |
| amount | required | Integer | Số tiền hoàn |
| currency | required | String | Đơn vị tiền tệ (chấp nhận VND) |
| reason | required | String | Lý do hoàn tiền |
| status | required | String | Trạng thái hoàn tiền |
| createdAt | required | String | Thời gian thực hiện giao dịch |
| refundedAt | optional | String | Thời gian thực hoàn tiền nếu giao dịch hoàn tiền thành công |

## Ví dụ

### Response

```json
{
    "refundId": "f28a4ac3-e407-45f1-902b-bc05c6c50dfa",
    "transactionId": "AP241453209745",
    "partnerRefId": "5f61cf4f41e2b",
    "amount": 10000,
    "currency": "VND",
    "reason": "test refund",
    "status": "success",
    "createdAt": "2024-09-11T11:21:17+07:00",
    "refundedAt": "2024-09-11T11:21:17+07:00"
}
```

### Error

```json
{
    "errorCode": 1,
    "message": "Invalid Params"
}
```

#### Bảng mã lỗi

| Mã lỗi | Mô tả |
| --- | --- |
| 1 | Thông tin yêu cầu thiếu hoặc không hợp lệ |
| 36 | Giao dịch không tồn tại |
| 401 | Unauthorized |

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v2/transaction/refund/{refundRefId}?type=TRANSACTION_ID' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'X-Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653'
```

### Request

#### REQUEST
