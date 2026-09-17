<!-- source: https://docs.appotapay.com/charging-card/transaction-status -->

# API Kiểm tra trạng thái giao dịch

Endpoint: `/v1/services/transaction/check?api_key=YOUR_API_KEY`

Method: `GET`

Header: Cách tạo JWT_TOKEN

```json
{
    "X-APPOTAPAY-AUTH": Bearer JWT_TOKEN,
    "Content-Type": "application/json"
}
```

### Tham số

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| partner_code | √ | String | Mã Partner code nhận được từ phía AppotaPay cung cấp |
| transaction_id | √ | String | Mã giao dịch phía đối tác |
| signature | √ | String | Thông tin hash các params gửi sang API (signature= SHA256(partner_co de + transaction_id + secret_key)) Secret key phía AppotaPay cung cấp |

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| error_code | String | Mã lỗi |
| message | String | Mô tả chi tiết mã lỗi |
| data | Object | Mô tả chi tiết giao dịch khi thành công |
| data.amount | Integer | Mệnh giá thẻ |
| data.serial | String | Seri thẻ |
| data.transaction_id | String | Mã giao dịch phía AppotaPay |
| data.time | String | Thời gian giao dịch |

## Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/v1/services/transaction/check?api_key=YOUR_API_KEY&partner_code=PARTNER_CODE&transaction_id=unique_transaction_id_12345&signature=calculated_signature_hash' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json'
```

## Request

#### REQUEST
