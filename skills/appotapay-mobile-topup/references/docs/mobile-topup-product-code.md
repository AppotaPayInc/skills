<!-- source: https://docs.appotapay.com/mobile-topup/product-code -->

# API danh sách mã sản phẩm

Endpoint: `/api/v2/service/topup/productCodes`

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

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi trả về |
| message | String | Mô tả chi tiết mã lỗi |
| data | Array | Thông tin danh sách mã sản phẩm của tất cả các nhà mạng |
| data.telco | String | Tên nhà mạng (xem thêm phần Phụ Lục bảng nhà mạng) |
| data.products | Array | Thông tin danh sách mã sản phẩm tương ứng với nhà mạng |
| data.products.id | Integer | Thông tin id mã sản phẩm |
| data.products.productCode | String | Thông tin mã sản phẩm |
| data.products.amount | String | Số tiền tương ứng với mã sản phẩm |

## Ví dụ

### Response

```json
{
  "errorCode": 0,
  "message": "Thành công",
  "data": [
    {
      "telco": "common",
      "description": "Danh sách mã sản phẩm dùng chung cho các nhà mạng",
      "products": [
        {
            "id": 1,
            "productCode": "topup_10",
            "amount": 10000
        }
        ...
      ]
    },
    {
      "telco": "viettel",
      "description": "Danh sách mã sản phẩm dùng cho nhà mạng viettel",
      "products": [
        {
          "id": 1,
          "productCode": "viettel_10",
          "amount": 10000
        }
        ...
      ]
    },
    {
      "telco": "vinaphone",
      "description": "Danh sách mã sản phẩm dùng cho nhà mạng vinaphone",
      "products": [
        {
          "id": 3,
          "productCode": "vinaphone_20",
          "amount": 20000
        }
        ...
      ]
    },
    {
      "telco": "itel",
      "description": "Danh sách mã sản phẩm dùng cho nhà mạng itel",
      "products": [
        {
          "id": 4,
          "productCode": "topup_10",
          "amount": 20000
        }
        ...
      ]
    },
    {
      "telco": "gtel",
      "description": "Danh sách mã sản phẩm dùng cho nhà mạng gtel",
      "products": [
        {
          "id": 5,
          "productCode": "topup_10",
          "amount": 10000
        }
        ...
      ]
    }
  ]
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v2/service/topup/productCodes' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json'
```

### Request

#### REQUEST
