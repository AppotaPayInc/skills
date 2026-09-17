<!-- source: https://docs.appotapay.com/ewallet/get-refresh-token -->

# API Refresh Token

API này được sử dụng để lấy lại ACCESS_TOKEN trong trường hợp ACCESS_TOKEN bị hết hạn. Sau khi gọi lấy refresh token thành công, refresh token cũ sẽ không còn hiệu lực

### EndPoint

`POST` `/api/v1/oauth/refresh_token`

### Header Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| Content-Type | required | String | Giá trị: `application/json` |  |

```json
{
    "Content-Type": "application/json"
}
```

### Request Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| client_key | required | String | API KEY AppotaPay cung cấp |  |
| secret_key | required | String | SECRET KEY AppotaPay cung cấp |  |
| grant_type | required | String | Mặc định: authorization_code |  |
| refresh_token | required | String | Refresh token trả về ở API Lấy Access Token Tài Khoản Ví |  |

### Example Request

```json
{
  "client_key": "1VXlZjO7vY7BJokQyaGbA5b3C9eT040pEdQq",
  "secret_key": "R3cIrn81uYHgNLPOeqrFoCtG8UzJ",
  "grant_type": "authorization_code",
  "refresh_token": "R3cIrn81uYHgNLPOeqrFoCtG8UzJ1VXlZjO7vY7"
}
```

### Response Params

```json
{
  "code": 200,
  "data": {
    "access_token": "c3ec19b7a8d93a7ee7be88aa2f2be328",
    "token_type": "Bearer",
    "refresh_token": "c09eb4ed6c65d152de9fcd74fdfe9cce",
    "expiry_in": 1659411793,
    "refresh_token_expiry_in": 1659411793
  }
}
```

#### Thành công

> Http Status Code 200 - OK

| Tham số | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- |
| code | Integer | Mã lỗi |  |
| data | Object | Chi tiết dữ liệu |  |
| data.access_token | String | Access Token của hệ thống Appota. |  |
| data.token_type | String | Loại token | Mặc định: Bearer |
| data.refresh_token | String | Refresh Token của hệ thống Appota. |  |
| data.expiry_in | Integer | Thời hạn của access token | Unix timestamp |
| data.refresh_token_expiry_in | Integer | Thời hạn của refresh token | Unix timestamp |

#### Thất bại

> HTTP Status Code != 200

| Tham số | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- |
| code | Integer | Mã lỗi |  |
| message | String | Mô tả thêm về lỗi |  |

### Ví dụ Code

```bash
curl --location 'https://ewallet.dev.appotapay.com/api/v1/oauth/refresh_token' \
  --header 'Content-Type: application/json' \
  -d '{
  "client_key": "1VXlZjO7vY7BJokQyaGbA5b3C9eT040pEdQq",
  "secret_key": "R3cIrn81uYHgNLPOeqrFoCtG8UzJ",
  "grant_type": "authorization_code",
  "refresh_token": "R3cIrn81uYHgNLPOeqrFoCtG8UzJ1VXlZjO7vY7"
}'
```

### Request

#### REQUEST
