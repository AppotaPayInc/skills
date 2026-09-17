<!-- source: https://docs.appotapay.com/payment/list -->

# Lấy danh sách giao dịch

## API lấy danh sách giao dịch

### EndPoint

`GET` `/api/v2/orders/transactions`

### Header Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| X-APPOTAPAY-AUTH | required | String | Cách tạo JWT_TOKEN |
| Content-Type | required | String | Giá trị: `application/json` |

```json
{
    "X-APPOTAPAY-AUTH": "Bearer JWT_TOKEN",
    "Content-Type": "application/json"
}
```

### Request Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| startTime | optional | Integer | Thời gian bắt đầu (bắt buộc khi có thời gian kết thúc) |
| endTime | optional | Integer | Thời gian kết thúc (bắt buộc khi có thời gian bắt đầu) |
| status | optional | String | Trạng thái giao dịch muốn tìm kiếm |
| paymentMethod | optional | String | Phương thức thanh toán muốn tìm kiếm |
| limit | optional | Integer | Tối thiểu là 1, tối đa là 50 (không truyền mặc định là 15) |
| page | optional | Integer | Tối thiểu là 1 (không truyền mặc định là 1) |

### Response Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| pagination | required | Object | Thông tin phân trang |
| pagination.total | required | Integer | Tổng số bảng ghi |
| pagination.page | required | Integer | Page hiện tại |
| pagination.limit | required | Integer | Limit hiện tại |
| transactions | required | Array | Danh sách giao dịch |

### Thành công

> Http Status Code 200 - OK

#### Example Response

```json
{
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 15
  },
  "transactions": [
    {
      "errorCode": 0,
      "status": "success",
      "amount": 1000000,
      "currency": "VND",
      "orderId": "9MOmaZigD",
      "bankCode": "MASTERCARD",
      "paymentMethod": "CC",
      "paymentType": "WEB",
      "appotapayTransId": "AP241447565422",
      "transactionTs": 1715848036,
      "extraData": "CPM"
    }
  ]
}
```

### Thất bại

> HTTP Status Code != 200
> Với errorCode trả về, vui lòng tham khảo bảng mã lỗi tại đây

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/api/v2/orders/transactions?startTime=1715848036&endTime=1715848036&limit=15&page=1' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json'
```

### Request

#### REQUEST
