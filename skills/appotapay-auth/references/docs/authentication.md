<!-- source: https://docs.appotapay.com/authentication -->

# Xác thực

API của AppotaPay được tổ chức xung quanh REST để rõ ràng và dễ hiểu. Tất cả APIs trả về theo JSON format. Để truy cập được tới APIs của chúng tôi,
bạn cần đăng ký tài khoản trên Partner Website của chúng tôi. Bạn có thể tạo và quản lý API Keys, API Secret Keys trong mục Quản lý Ứng dụng

Để xác thực tài khoản của bạn, bạn phải tạo JWT Token với Secret API Key và đưa vào các request tới các API của chúng tôi. Sau đây là một số bước để tạo API Key và xác thực tài khoản của bạn

1. Tạo Ứng dụng mới để lấy API Key, Secret API Key
2. Tạo JWT Token với Secret API Key
3. Đưa JWT Token vào Header các Request gửi tới API

Tất cả các API Request nên được thực hiện thông quan HTTPS. Secret API Key cần được giữ bảo mật và không được chia sẻ.

# Phương thức xác thực

- APIs của AppotaPay được xác thực dựa vào mã JWT (Json Web Token) được gửi kèm vào Header của mỗi truy vấn (Cách tạo mã JWT xem phần Phụ Lục)
- Tham số truyền tới API AppotaPay được xác thực dựa vào mã signature gửi kèm theo khi gọi API (Cách tạo mã signature xem phần Phụ Lục)
