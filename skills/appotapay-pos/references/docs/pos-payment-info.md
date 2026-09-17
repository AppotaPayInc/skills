<!-- source: https://docs.appotapay.com/pos/payment-info -->

# Giới thiệu tổng quan

- Khách hàng chọn sản phẩm/dịch vụ ở cửa hàng và chọn thanh toán qua máy POS
- Máy POS xử lý tạo giao dịch, điều hướng tới màn thanh toán qua thẻ hoặc quét mã QR
- Sau khi có kết quả thanh toán sẽ xử lý thông báo kết quả giao dịch

## Quy trình thanh toán

### Diễn giải luồng

- Bước 1: Khách hàng chọn sản phẩm và yêu cầu thanh toán.
- Bước 2: Máy bán hàng gửi yêu cầu thanh toán tới Partner Server.
- Bước 3: Partner Server gửi yêu cầu thanh toán tới AppotaPay.
- Bước 4: AppotaPay tạo yêu cầu thanh toán tới máy POS.
- Bước 5: Máy POS tạo yêu cầu thanh toán qua thẻ ATM/Credit Card, QR tới Bank/Provider và hiển thị màn hình yêu cầu khách hàng thanh toán.
- Bước 6: Khách hàng thực hiện thanh toán.
- Bước 7: Máy POS và Bank/Provider xử lý thanh toán của khách hàng.
- Bước 8: Bank/Provider trả kết quả giao dịch thanh toán.
- Bước 9: Máy POS gửi xác nhận thanh toán hoặc huỷ thanh toán cho AppotaPay.
- Bước 10: AppotaPay gửi IPN xác nhận trạng thái giao dịch cho Partner Server.
- Bước 11: Partner Server trả kết quả của giao dịch cho máy bán hàng.
- Bước 12: Máy POS xử lý và hiển thị kết quả giao dịch cho khách hàng.

## Quy trình kết toán giao dịch (Settlement)

### Diễn giải luồng

- Bước 1: Thu ngân/Khách hàng yêu cầu kết toán giao dịch (Settlement).
- Bước 2: Máy POS gửi yêu cầu kết toán giao dịch sang Bank/Provider.
- Bước 3: Bank/Provider xử lý kết toán giao dịch.
- Bước 4: Bank/Provider trả kết quả kết toán giao dịch.
- Bước 5: Máy POS cập nhật kết quả kết toán giao dịch tới AppotaPay.
- Bước 6: Máy POS hiển thị kết quả kết toán giao dịch cho Thu ngân/Khách hàng.

## Quy trình huỷ thanh toán (Void)

### Diễn giải luồng

- Bước 1: Thu ngân/Khách hàng yêu cầu huỷ giao dịch (hoàn tiền).
- Bước 2: Máy POS gửi yêu cầu huỷ giao dịch cho AppotaPay.
- Bước 3: Máy POS tạo yêu cầu huỷ giao dịch tới Bank/Provider.
- Bước 4: Bank/Provider xử lý yêu cầu huỷ giao dịch.
- Bước 5: Bank/Provider trả kết quả huỷ giao dịch.
- Bước 6: Máy POS gửi yêu cầu cập nhật trạng thái giao dịch tới AppotaPay.
- Bước 7: AppotaPay gửi IPN xác nhận trạng thái giao dịch về Partner Server.
- Bước 8: Máy POS xử lý và hiển thị kết quả xử lý huỷ giao dịch cho Thu ngân/Khách hàng.

## Thông tin tích hợp

### Môi trường tích hợp

- Dev: Được sử dụng để kiểm thử, debug trong quá trình tích hợp.
- Production: Môi trường chạy thật sau khi tích hợp thành công.

### Thông tin kết nối

- PARTNER CODE: Mã đối tác AppotaPay cung cấp sau khi hoàn tất đăng ký tài khoản.
- API KEY: Được dùng để kết nối tới API, được AppotaPay cung cấp.
- SECRET KEY: Được dùng để tạo, xác thực chữ ký điện tử (signature).
- Terminal ID: Mã định danh của thiết bị.

| Môi trường | Domain | Incoming IP | OutComing IP |
| --- | --- | --- | --- |
| Dev | https://pos-gw.dev.appotapay.com | 58.187.8.221 | 58.187.8.222 |
| Production | https://pos-gw.appotapay.com |  | 54.151.252.252, 52.76.192.70, 43.239.223.231 |

## Thông tin kết nối Dev

### Tài khoản Dev

| PartnerCode | TESTPOS |
| --- | --- |
| ApiKey | Iux2JV4x1Sh0Z3s3La1XTU75N3vPDhuY |
| SecretKey | uHIlkPbx1ZB7AtgSYEuiqcMWTC2DfXyL |
| TerminalID | TID-01JQ3Q9PCK0AB8 |

## API tham chiếu

- API Yêu cầu thanh toán
- API Danh sách giao dịch
- API Chi tiết giao dịch
- Xử lý kết quả thanh toán
- Bảng mã lỗi
