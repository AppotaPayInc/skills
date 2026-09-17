<!-- source: https://docs.appotapay.com/subscription/customer-object -->

# Customer Object

Customer object là một cấu trúc dữ liệu tiêu chuẩn để chứa thông tin liên quan đến một trong những khách hàng của bạn.

Khi một customer object được trả trong các endpoint của phần này, nội dung phản hồi sẽ chứa Đối tượng khách hàng. Mỗi đối tượng có cấu trúc như sau:

| Tham số | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| customerRefId | String | Mã định danh cho customer được cung cấp bởi partner |
| customerId | String | Customer ID |
| firstName | String | Tên |
| lastName | String | Họ |
| mobileNumber | String | Số điện thoại |
| email | String | Email |
| gender | String | Giới tính - MALE: nam - FEMALE: nữ
- OTHER: khác |
| dateOfBirth | String | Ngày sinh |
| placeOfBirth | String | Nơi sinh |
| nationality | String | Mã quốc gia |
| createdAt | String | Thời gian tạo. (định dạng chuẩn ISO-8601) |
| updatedAt | String | Thời gian cập nhật. (định dạng chuẩn ISO-8601) |

### Ví dụ

```json
{
    "customerRefId": "ASKJLKALK213",
    "customerId": "01HRVGAJSP7SX83X7AQ9QQYMBE",
    "firstName": "Ha",
    "lastName": "Phan",
    "mobileNumber": "+84123456789",
    "email": "ha@gmail.com",
    "gender": "MALE",
    "dateOfBirth": "1996-04-23",
    "placeOfBirth": "HN",
    "nationality": "EC",
    "createdAt": "2024-01-26T18:26:02+07:00",
    "updatedAt": "2024-01-26T18:26:02+07:00"
}
```
