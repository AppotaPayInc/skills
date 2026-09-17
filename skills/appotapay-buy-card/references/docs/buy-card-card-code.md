<!-- source: https://docs.appotapay.com/buy-card/card-code -->

# API danh sách mã sản phẩm

## API danh sách mã sản phẩm

Endpoint: `api/v1/service/shopcard/products`

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
| data | Array of Object | Danh sách nhà cung cấp kèm mã thẻ |
| data[].productType | String | Nhà cung cấp thẻ |
| data[].productCodes | Array of Object | Danh sách thẻ |
| data[].productCodes[].name | String | Tên thẻ |
| data[].productCodes[].code | String | Mã thẻ |
| data[].productCodes[].value | Integer | Giá trị thẻ |

## Ví dụ

### Response

```json
{
    "data": [
        {
            "productType": "APPOTA",
            "productCodes": [
                {
                    "name": "Thẻ Appota 10.000đ",
                    "code": "AC10",
                    "value": 10000
                }
            ]
        },
        ...
    ],
}
```

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/shopcard/products' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json'
```

### Request

#### REQUEST
