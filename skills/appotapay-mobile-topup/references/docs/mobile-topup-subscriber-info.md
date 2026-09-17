<!-- source: https://docs.appotapay.com/mobile-topup/subscriber-info -->

# API kiểm tra thông tin thuê bao

## API kiểm tra thông tin thuê bao

Endpoint: `/api/v1/service/topup/{phoneNumber}/info`

Method: `GET`

Header: Cách tạo JWT_TOKEN

Language: en | vi

```json
{
    "X-APPOTAPAY-AUTH": Bearer JWT_TOKEN,
    "Content-Type": "application/json",
    "Language": LANGUAGE
}
```

### Tham số

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| phoneNumber | √ | String | Số điện thoại để kiểm tra thông tin thuê bao (truyền dạng: 09x, 08x,..) |

## Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi trả về |
| message | String | Mô tả chi tiết mã lỗi |
| data | Object | Thông tin thuê bao |
| data.phone_number | String | Số điện thoại để kiểm tra thông tin thuê bao |
| data.telco | String | Tên nhà mạng |

### Thành công

```json
{
    "errorCode": 0,
    "message": "Thành công",
    "data": {
        "phone_number": "0968324567",
        "telco": "viettel"
    }
}
```

### Thất bại

```json
{
    "errorCode": 37,
    "message": "Số điện thoại không đúng"
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/topup/0968324567/info' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json'
```

### Request

#### REQUEST
