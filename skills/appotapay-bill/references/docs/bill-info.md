<!-- source: https://docs.appotapay.com/bill/info -->

# API Truy vấn thông tin hoá đơn

## API Truy vấn thông tin hoá đơn

Endpoint: `/api/v1/service/bill/check`

Method: `POST`

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
| partnerRefId | √ | String | Mã giao dịch phía đối tác, duy nhất cho mỗi giao dịch (mã này sẽ được dùng khi thực hiện gọi API thanh toán hoá đơn) |
| billCode | √ | String | Mã hoá đơn/thanh toán |
| serviceCode | √ | String | Mã dịch vụ (xem thêm phần Phụ Lục bảng mã dịch vụ) |
| signature | √ | String | Chữ ký các tham số truyền lên API, các tham số được đưa vào chữ ký theo thứ tự bao gồm: billCode + partnerRefId + serviceCode (xem thêm phần cách tạo signature) |

### Dữ liệu trả về

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| errorCode | Integer | Mã lỗi trả về |
| message | String | Mô tả chi tiết mã lỗi |
| billDetail | Array of Object | Mảng thông tin chi tiết hoá đơn |
| billDetail[].billNumber | String | ID của hoá đơn |
| billDetail[].period | String | Kỳ thanh toán hoá đơn |
| billDetail[].amount | Integer | Số tiền hoá đơn |
| billDetail[].billCreated | String | Ngày tạo hoá đơn |
| billDetail[].billExpiry | String | Ngày hết hạn thanh toán |
| billDetail[].billType | String | Loại hoá đơn |
| billDetail[].billOtherInfo | String | Các thông tin khác |
| billDetail[].isPartialPaymentAllowed | Boolean | Hoá đơn có cho phép thanh toán từng phần hay không (mặc định: false) |
| billDetail[].extraInfo | String | Thông tin bổ sung |
| customerInfo | Object | Thông tin khách hàng |
| customerInfo.customerCode | String | Mã khách hàng |
| customerInfo.customerName | String | Tên khách hàng |
| customerInfo.customerAddress | String | Địa chỉ khách hàng |
| customerInfo.customerOtherInfo | String | Thông tin khác |
| customerInfo.extraInfo | String | Thông tin mở rộng |

## Ví dụ

### Request

```json
{
    "partnerRefId": "AB123",
    "billCode": "PD12121",
    "serviceCode": "ENVHN",
    "signature": "b10294bae53e89919b3efd62a763bf3..."
}
```

### Response

```json
{
    "errorCode": 0,
    "message": "Thành công",
    "billDetail": [
        {
            "billNumber": "117934",
            "period": "4/2020",
            "amount": 100000,
            "billCreated": "",
            "billExpiry": "",
            "billType": "",
            "billOtherInfo": "", "isPartialPaymentAllowed": false, "extraInfo": ""
        }
    ],
    "customerInfo": {
        "customerCode": "PA12121",
        "customerName": "Nguyen Van A",
        "customerAddress": "Ha Noi",
        "customerOtherInfo": "PA11",
        "extraInfo": ""
    }
}
```

### Code Examples

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v1/service/bill/check' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  -d '{
  "partnerRefId": "AB123",
  "billCode": "PD12121",
  "serviceCode": "ENVHN",
  "signature": "b10294bae53e89919b3efd62a763bf3..."
}'
```

### Request

#### REQUEST
