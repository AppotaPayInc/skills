<!-- source: https://docs.appotapay.com/mobile-topup/data-package-topup -->

# API Lấy danh sách gói theo số điện thoại

## API Lấy danh sách gói theo số điện thoại

API này chỉ phục vụ việc kiểm tra các gói dữ liệu di động

Endpoint: `/api/v1/service/topup/{phone_number}/products`

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
| phone_number | √ | String | Số điện thoại nạp tiền (truyền dạng: 09x, 08x,..) |
| telco_service_type | √ | String | Loại dịch vụ prepaid: Nạp tiền điện thoại trả trướcpostpaid: Nạp tiền điện thoại trả sau |
| value |  | String | Giá trị gói (truyền dạng: 10000,20000,30000,..) |

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi trả về |
| message | String | Mô tả chi tiết mã lỗi |
| *.productCode | String | Mã sản phẩm |
| *.amount | Integer | Giá của gói |
| *.type | String | Kiểu gói (data) |
| *.telco | String | Tên nhà mạng |
| *.description | String | Mô tả chi tiết của gói |

## Ví dụ

### Request

```json
{
    "telco_service_type": "prepaid",
}
```

### Response

Thành công

```json
{
    "errorCode": 0,
    "message": "Thành công",
    "data": [
        {
            "productCode": "D24",
            "amount": 20000,
            "type": "topup_data",
            "telco": "mobifone_data",
            "description": "- Tổng lưu lượng data của gói là 24GB\n- Thời hạn áp dụng của gói là 24 giờ"
        },
        {
            "productCode": "7ED_DC",
            "amount": 70000,
            "type": "topup_data",
            "telco": "mobifone_data",
            "description": "- Tổng lưu lượng data của gói là 56GB\n- Thời hạn áp dụng của gói là 7 ngày"
        }
    ]
}
```

Thất bại

```text
{
    "errorCode": 91,
    "message": "Hệ thống đang bận, vui lòng thử lại sau"
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/topup/0912345678/products?telco_service_type=prepaid' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json'
```

### Request

#### REQUEST
