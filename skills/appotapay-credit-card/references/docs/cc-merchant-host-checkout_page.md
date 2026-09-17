<!-- source: https://docs.appotapay.com/cc-merchant-host/checkout_page -->

# checkout_page

## Tổng quan

- Trên Webiste, ứng dụng phía đối tác sau khi khách hàng lựa chọn dịch vụ hoặc sản phẩm và chọn thanh toán qua cổng thanh toán của AppotaPay.
- Server của đối tác gọi qua API của AppotaPay để tạo thông tin giao dịch và lấy được URL thanh toán
- Sau khi nhận được kết quả, website, ứng dụng phía đối tác điều hướng khách hàng tới URL trang thanh toán.

## Mô hình thanh toán

## Diễn giải các bước thanh toán

- Bước 1: Khách hàng chọn dịch vụ, sản phẩm sau đó chọn hình thức thanh toán qua thẻ ATM/Visa.
- Bước 2: Server phía đối tác gọi sang server AppotaPay nhận được URL thanh toán.
- Bước 3: AppotaPay PayGate phản hồi link thank toán cho partner.
- Bước 4: Website, ứng dụng phía đối tác điều hướng khách hàng tới URL trang thanh toán.
- Bước 5: Khách hàng thực hiện thanh toán.
- Bước 6: AppotaPay PayGate gửi yêu cầu thanh toán
- Bước 7: Bank/ Provider xử lý thanh toán và trả kết quả giao dịch
- Bước 8, 9: AppotaPay PayGate xử lý giao dịch sau đó redirect tới `redirectUrl` của đối tác, đồng thời server AppotaPay gọi tới IPN API (`notifyUrl`) của server phía đối tác để thông báo kết quả giao dịch.
- Bước 10: Partner server xử lý giao dịch và trả kết quả để hiển thị
- Bước 11: Website, ứng dụng phía đối tác hiển thị thông báo cho khách hàng.

## API tham chiếu

- API Payment
- API Get transaction
- API Refund
- API Get refund
