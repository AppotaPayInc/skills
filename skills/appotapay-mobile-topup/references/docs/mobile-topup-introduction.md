<!-- source: https://docs.appotapay.com/mobile-topup/introduction -->

# Giới thiệu tổng quan

## Giới thiệu tổng quan

Tài liệu cung cấp cho đối tác các thông tin kết nối kỹ thuật tới cổng nạp tiền/data điện thoại trực tiếp

## Mô hình kết nối

AppotaPay cung cấp 2 cơ chế tích hợp dịch vụ nạp tiền linh hoạt, giúp tối ưu trải nghiệm người dùng và đảm bảo tỷ lệ thành công cao nhất.

### Flow luồng nạp tiền đồng bộ

Khi Partner gọi API nạp tiền, hệ thống xử lý trực tiếp với nhà mạng và trả về ngay kết quả cuối cùng (SUCCESS/FAILED/ PENDING) trong phản hồi của API

### Flow luồng nạp tiền bất đồng bộ

Khi Partner gọi API nạp tiền, hệ thống ghi nhận request và trả về ngay trạng thái ghi nhận thành công.

Sau khi xử lý thành công hoặc thất bại với nhà mạng, AppotaPay sẽ chủ động gửi thông báo kết quả giao dịch qua IPN/Webhook mà Partner đã đăng ký sử dụng trên hệ thống của AppotaPay.

## Lựa chọn luồng nạp tiền

AppotaPay hỗ trợ 2 luồng nạp tiền, đối tác lựa chọn một trong hai tuỳ theo mô hình hệ thống:

| Tiêu chí | Đồng bộ (Sync) | Bất đồng bộ (Async) |
| --- | --- | --- |
| API nạp tiền | `/api/v2/service/topup/charging` | `/api/v2/service/topup/charging-async` |
| Thời gian phản hồi | Chờ tới khi có kết quả từ nhà mạng | Phản hồi ngay, không chờ nhà mạng |
| Kết quả cuối trả về ở đâu | Ngay trong response của API nạp tiền | Qua IPN AppotaPay gửi sang đối tác |
| Đối tác cần chuẩn bị | Không | Phải có URL nhận IPN và đăng ký với AppotaPay |
| Timeout phía đối tác | Cần cấu hình timeout dài | Không phụ thuộc thời gian xử lý của nhà mạng |
| Phù hợp với | Hệ thống xử lý theo request/response truyền thống | Hệ thống có lượng giao dịch lớn, cần giải phóng luồng xử lý nhanh |
