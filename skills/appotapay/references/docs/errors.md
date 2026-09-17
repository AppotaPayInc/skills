<!-- source: https://docs.appotapay.com/errors -->

# Xử lý lỗi

## Xử lý lỗi

## HTTP Status Code

| Http Status Code | Mô tả |
| --- | --- |
| 200 - OK | Request được thực hiện thành công |
| 400 - Bad Request | Request không được chấp nhận, thường là do sai hoặc thiếu các tham số yêu cầu |
| 401 - Unauthorized | Không thể xác thực tài khoản (API Keys không tồn tại, partnerCode không tồn tại, JWT Token bị hết hạn hoặc không xác thực được) |
| 403 - Forbidden | Không có quyền truy cập để thực hiện request hoặc IP truy cập chưa được whitelist |
| 404 - Not Found | Tài nguyên truy cập không tồn tại |
| 500 - Server Errors | Lỗi phía hệ thống AppotaPay |

## Một số mã lỗi phổ biến trên các APIs

| Mã lỗi | Mô tả |
| --- | --- |
| 1 | Thông tin yêu cầu thiếu hoặc không hợp lệ |
| 11 | Partner không tồn tại |
| 13 | Partner đã bị khoá |
| 14 | API Key không tồn tại |
| 15 | API Key chưa được kích hoạt hoặc đã bị khoá |
| 91 | Hệ thống đang bận, vui lòng thử lại sau |
| 92 | IP không được phép truy cập |
| 94 | Hệ thống đang bảo trì, vui lòng thử lại sau |
| 99 | Lỗi không xác định, vui lòng kiểm tra lại giao dịch sau |
| 500 | Hệ thống gặp lỗi, vui lòng thử lại Sau |
