<!-- source: https://docs.appotapay.com/partner/account-balance -->

# Truy vấn số dư tài khoản

Môi trường kết nối

| Môi trường | Domain |
| --- | --- |
| Production | https://gateway.appotapay.com |
| Dev | https://gateway.dev.appotapay.com |

Endpoint: `/api/v1/service/accounts/balance`

Method: `GET`

Header: Cách tạo JWT_TOKEN

```json
{
    "X-APPOTAPAY-AUTH": Bearer JWT_TOKEN,
    "Content-Type": "application/json"
}
```

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi |
| message | String | Mô tả chi tiết mã lỗi |
| account | Object | Thông tin tài khoản |
| account.balance | Integer | Số dư tài khoản |

## Ví dụ

### Response

```json
{
    "errorCode": 0,
    "message": "Thành công",
    "account": {
        "balance": 2000000
    }
}
```

### Code Examples

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/accounts/balance' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'Language: vi'
```

### Request

#### REQUEST
