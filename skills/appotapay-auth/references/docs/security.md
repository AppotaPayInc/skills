<!-- source: https://docs.appotapay.com/security -->

# Bảo mật

## Thông tin JWT Token

### Header

```json
{
    "typ": "JWT",
    "alg": "HS256",
    "cty": "appotapay-api;v=1"
}
```

### Payload

```json
{
    "iss": "YOUR_PARTNER_CODE",
    "jti": "YOUR_API_KEY" + "-" + time, // (ex time: 1614225624)
    "api_key": "YOUR_API_KEY",
    "exp": ... // expiration time (ex: 1614225624)
}
```

## Công cụ tạo JWT Token

Công cụ này giúp bạn tạo JWT Token để xác thực các request đến AppotaPay API. Vui lòng điền thông tin API Key, Secret Key và Partner Code của bạn.

## Thư viện tạo JWT

- Nodejs
- GoLang
- PHP
- JAVA
- C#
- Python

## Kiểm tra JWT Token

- Jwt.io
