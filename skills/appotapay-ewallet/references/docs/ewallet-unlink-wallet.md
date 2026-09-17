<!-- source: https://docs.appotapay.com/ewallet/unlink-wallet -->

# API Huỷ Liên Kết

## API Huỷ Liên Kết

### EndPoint

`POST` `/api/v1/users/app/destroy`

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
| access_token | required | String | User Access Token |  |

### Example Request

```json
{
  "client_key": "1VXlZjO7vY7BJokQyaGbA5b3C9eT040pEdQq",
  "access_token": "R3cIrn81uYHgNLPOeqrFoCtG8UzJ1VXlZjO7vY7"
}
```

### Response Params

```json
{
  "code": 200,
  "success": true
}
```

#### Thành công

> Http Status Code 200 - OK

| Tham số | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- |
| code | Integer | Mã lỗi |  |
| success | Boolean |  |  |

#### Thất bại

> HTTP Status Code != 200

| Tham số | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- |
| code | Integer | Mã lỗi |  |
| message | String | Mô tả thêm về lỗi |  |

### Ví dụ Code

```bash
curl --location 'https://ewallet.dev.appotapay.com/api/v1/users/app/destroy' \
  --header 'Content-Type: application/json' \
  -d '{
  "client_key": "1VXlZjO7vY7BJokQyaGbA5b3C9eT040pEdQq",
  "access_token": "R3cIrn81uYHgNLPOeqrFoCtG8UzJ1VXlZjO7vY7"
}'
```

### Request

#### REQUEST
