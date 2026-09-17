<!-- source: https://docs.appotapay.com/ewallet/get-account-info -->

# API Lấy Thông Tin Tài Khoản

### EndPoint

`GET` `/api/v1/users/accounts/info`

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
| token | required | String | User Access Token |  |

### Example Request

https://ewallet.dev.appotapay.com/api/v1/users/accounts/info?token=YOUR_ACCESS_TOKEN

### Response Params

```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "user_id": 1,
    "phone_number": "0900000000",
    "fullname": "NGUYEN VAN A",
    "wallet_balance": 100000000,
    "apoint_balance": 10000
  }
}
```

#### Thành công

> Http Status Code 200 - OK

| Tham số | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- |
| code | Integer | Mã lỗi |  |
| message | String | Mô tả thêm về lỗi |  |
| data | Object | Chi tiết dữ liệu |  |
| data.user_id | String | User ID |  |
| data.phone_number | String | Số điện thoại |  |
| data.wallet_balance | Integer | Số dư tài khoản ví |  |
| data.apoint_balance | Integer | Số dư APoint |  |
| data.fullname | String | Họ tên khách hàng |  |

#### Thất bại

> HTTP Status Code != 200

| Tham số | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- |
| code | Integer | Mã lỗi |  |
| message | String | Mô tả thêm về lỗi |  |

### Ví dụ Code

```bash
curl --location 'https://ewallet.dev.appotapay.com/api/v1/users/accounts/info?token=c3ec19b7a8d93a7ee7be88aa2f2be328' \
  --header 'Content-Type: application/json'
```

### Request

#### REQUEST
