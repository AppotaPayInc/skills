<!-- source: https://docs.appotapay.com/subscription/refund-object -->

# Refund Object

Mỗi object có cấu trúc như sau:

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| refundId | String | Mã giao dịch hoàn tiền phía AppotaPay |
| attemptId | String | Mã định danh cho attempt thanh toán thành công trong cycle cần thực hiện refund. Mã được trả trong cycle object |
| refundRefId | String | Mã tham chiếu giao dịch hoàn tiền phía đối tác |
| amount | Integer | Số tiền hoàn |
| currency | String | Đơn vị tiền tệ |
| reason | String | Lý do hoàn tiền - FRAUDULENT: Lừa đảo - DUPLICATE: Bị trùng- REQUESTED_BY_CUSTOMER: Yêu cầu của khách- CANCELLATION: Hủy bỏ- OTHER: khác |
| status | String | Trạng thái hoàn tiền |
| createdAt | String | Thời gian thực hiện giao dịch (ISO 8601) |
| updatedAt | String | Thời gian cập nhật giao dịch (ISO 8601) |

### Ví dụ

```json
{
    "refundId": "4c1016c7-74fc-4856-aff0-8754a1a20482",
    "attemptId": "01HY2TRW9EBTPWGPJDGPD9JMA9",
    "refundRefId": "ASKJLKALK20398139",
    "amount": 1000,
    "currency": "VND",
    "reason": "REQUESTED_BY_CUSTOMER",
    "status": "success",
    "createdAt": "2024-06-18T18:21:24+07:00",
    "updatedAt": "2024-06-18T19:21:24+07:00"
}
```
