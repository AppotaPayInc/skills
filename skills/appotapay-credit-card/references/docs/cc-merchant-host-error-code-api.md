<!-- source: https://docs.appotapay.com/cc-merchant-host/error-code-api -->

# Error Code API

Bảng mã lỗi cho các API

### EndPoint

`GET` `/credit-card/error-code/list`

### Header Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| X-APPOTAPAY-AUTH | required | String | Cách tạo JWT_TOKEN |  |
| Content-Type | required | String | Giá trị: `application/json` |  |
| X-Request-ID | optional | String | Định dạng UUIDv4. Request ID để kiểm tra yêu cầu khi xảy ra sự cố | max:42 |
| Language | optional | String | Giá trị `vi` hoặc `en` tương ứng với link thanh toán sẽ là tiếng việt hoặc tiếng anh, (mặc định: `vi`) | in:vi,en |

```json
{
    "X-APPOTAPAY-AUTH": "JWT_TOKEN",
    "Content-Type": "application/json",
    "X-Request-ID": "Your_Unique_id",
    "Language": "vi"
}
```

### Response Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| errorCode | required | Integer | Mã lỗi |
| message | required | String | Mô tả lỗi |
| errors | optional | Array of Object | Mô tả lỗi chi tiết các trường nếu có |
| errors.field | required | Object | Trường dữ liệu bị lỗi |
| errors.reason | required | Object | Mô tả trường dữ liệu bị lỗi |

#### Thành công

> Http Status Code 200 - OK

```json
{
    "errorCode": 0,
    "message": "Success",
    "data": [
        {
            "code": 1,
            "message": "Thông tin yêu cầu thiếu hoặc không hợp lệ"
        }
    ]
}
```

#### Thất bại

> HTTP Status Code != 200

Với errorCode trả về, vui lòng tham khảo bảng mã lỗi tại đây

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/credit-card/error-code/list' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi'
```

### Request

#### REQUEST
