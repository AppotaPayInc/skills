<!-- source: https://docs.appotapay.com/merchant-hosted/merchant_hosted -->

# merchant_hosted

## Tổng quan

## Tổng quan

Khi doanh nghiệp của bạn kết nối mô hình Merchant-hosted (Thanh toán thẻ/ tài khoản nội địa), bạn có thể cho phép khách hàng nhập thông tin thanh toán trên trang của bạn và thực hiện các bước tiếp theo. Tài liệu này cung cấp đầy đủ về cách thức kết nối thanh toán thẻ/ tài khoản nội địa cho doanh nghiệp của bạn.

## Mô hình thanh toán

## Diễn giải các bước thanh toán

| Bước | Thực hiện | Mô tả |
| --- | --- | --- |
| 1 | End user | User đặt hàng và thực hiện thanh toán, lựa chọn thanh toán bằng ATM |
| 2 | Partner | Hệ thống Merchant hiển thị màn hình Nhập thông tin thẻ/ tài khoản |
| 3 | End user | Nhập thông tin thẻ/ tài khoản để thực hiện thanh toán |
| 4 | Partner | Partner gửi yêu cầu thanh toán |
| 5 | AppotaPay | Kiểm tra thông tin partner Nếu Partner hợp lệ, AppotaPay tạo giao dịch và gửi yêu cầu thanh toán đến Bank/Provider |
| 6 | Bank/Provider | Thực hiện kiểm tra thông tin thẻ/ tài khoản và phản hồi kết quả |
|  | AppotaPay | Kiểm tra kết quả khởi tạo giao dịch - Nếu khởi tạo giao dịch không thành công → chuyển bước 7 - Nếu khởi tạo giao dịch thành công → chuyển bước 9 |
| 7 | AppotaPay | Trả kết quả giao dịch cho Partner |
| 8 | Partner | Nhận và hiển thị kết quả giao dịch |
| 9 | AppotaPay | Gửi partner redirect_url để user verify |
| 10 | Partner | Có thể nhúng URL xác thực lên trang của partner sau đó hiển thị cho user |
| 11 | End user | Nhập thông tin xác thực |
| 12 | Bank/Provider | Xử lý thanh toán và phản hồi kết quả |
| 13 | AppotaPay | Điều hướng về trang của partner |
| 14 | AppotaPay | IPN kết quả thanh toán cho partner (nếu giao dịch thành công) |
| 15 | Partner | Xử lý và hiển thị kết quả giao dịch |

## API tham chiếu

- API Payment
- API Get transaction
- API Refund
- API Get refund
