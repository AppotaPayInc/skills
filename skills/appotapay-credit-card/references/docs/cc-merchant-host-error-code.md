<!-- source: https://docs.appotapay.com/cc-merchant-host/error-code -->

# Bảng mã lỗi

## Bảng mã lỗi

| Mã lỗi | Mô tả |
| --- | --- |
| 0 | Thành công |
| 1 | Giá trị không hợp lệ |
| 2 | Signature không hợp lệ |
| 3 | Partner không tồn tại |
| 4 | Giao dịch đã tồn tại, vui lòng thử lại giao dịch khác |
| 5 | Người dùng huỷ giao dịch |
| 6 | Yêu cầu bị trùng lặp |
| 7 | Lỗi không thể tạo giao dịch phía nhà cung cấp |
| 9 | Giao dịch thất bại |
| 10 | Giao dịch đã được hoàn tiền |
| 11 | Giao dịch không thể hoàn tiền |
| 12 | Giao dịch không thể hoàn tiền do số tiền hoàn vượt quá tổng tiền giao dịch |
| 13 | Quốc gia phát hành thẻ không được hỗ trợ |
| 14 | Giao dịch không tồn tại |
| 15 | Giao dịch đã hết hạn thanh toán |
| 16 | Thẻ nằm trong danh sách cấm thanh toán |
| 17 | Thẻ bị từ chối do IP không được phép thanh toán |
| 18 | Số lượng thẻ thanh toán vượt quá quy định trong 15 phút tính theo địa chỉ IP |
| 19 | Số lượng thẻ thanh toán vượt quá quy định trong 30 phút tính theo địa chỉ IP |
| 20 | Số lượng thẻ thanh toán vượt quá quy định trong 24 giờ tính theo địa chỉ IP |
| 21 | Tổng tiền thanh toán vượt quá giới hạn trong 1 ngày bởi đầu thẻ |
| 22 | Số tiền vượt quá quy định theo đầu bin |
| 23 | Địa chỉ IP thanh toán không trùng với quốc gia phát hành thẻ |
| 25 | Giao dịch hoàn tiền thất bại |
| 35 | Giao dịch đang chờ xử lý |
| 40 | Không thể tạo token thanh toán |
| 41 | Token thanh toán không hợp lệ |
| 42 | Xoá token bị lỗi |
| 43 | Token thẻ không tồn tại |
| 44 | Giao dịch thất bại do token thanh toán không hợp lệ |
| 45 | Giao dịch không thể hoàn tiền do số tiền nhỏ hơn mức tối thiểu |
| 46 | Giao dịch không thể hoàn tiền do số tiền lớn hơn mức tối đa |
| 60 | Thẻ thanh toán bị từ chối bởi nhà cung cấp |
| 61 | Thẻ thanh toán không hợp lệ |
| 62 | Thẻ của bạn bị từ chối do đầu thẻ không được hỗ trợ |
| 63 | Thẻ hết hạn thanh toán |
| 64 | Số dư không đủ để thanh toán |
| 65 | Thẻ bị đánh cắp hoặc bị mất |
| 66 | Ngân hàng phát hành không khả dụng |
| 67 | Thẻ không hoạt động hoặc thẻ không được phép thực hiện các giao dịch không xuất trình thẻ |
| 68 | Giao dịch thất bại do việc xử lý giữa nhà cung cấp dịch vụ và ngân hàng phát hành thẻ |
| 69 | Thẻ đã đạt đến giới hạn tín dụng |
| 70 | Số xác minh thẻ không hợp lệ (CVN) |
| 71 | Tài khoản bị đóng băng |
| 72 | Thanh toán bị từ chối |
| 73 | Lỗi hệ thống cổng thanh toán, vui lòng thử lại |
| 74 | Đã vượt quá tần suất sử dụng hoặc số tiền tối đa cho mỗi lần sử dụng của thẻ Ghi nợ Pinless |
| 75 | Thẻ thanh toán bị từ chối bởi nhà cung cấp |
| 76 | Lỗi phía nhà cung cấp |
| 77 | Số tiền thanh toán không hợp lệ |
| 78 | Giao dịch không hỗ trợ hoàn tiền 1 phần |
| 79 | Nhà cung cấp không hỗ trợ hoàn tiền |
| 80 | Thẻ chưa kích hoạt hoặc chưa được ủy quyền |
| 81 | Yêu cầu xử lý bị quá thời gian bởi nhà cung cấp |
| 82 | Thẻ bị từ chối bởi nhà phát hành thẻ |
| 83 | Hết thời hạn hoàn tiền |
| 84 | Yêu cầu tạo token đã tồn tại trước đó, vui lòng thử lại yêu cầu khác |
| 85 | Token thanh toán đã hết hạn |
| 86 | Token thanh toán không khớp với merchant thanh toán |
| 87 | Thẻ thanh toán bị ngân hàng phát hành từ chối do nghi ngờ có khả năng gian lận |
| 88 | Thẻ thanh toán bị nhà cung cấp dịch vụ từ chối do nghi ngờ có khả năng gian lận |
| 89 | Yêu cầu bị từ chối do việc xác thực không hợp lệ hoặc chưa được cấp quyền |
| 90 | Người dùng gặp lỗi xác thực 3DS |
| 91 | Xác thực 3DS gặp lỗi hoặc có vấn đề trong quá trình xử lý, vui lòng thử lại yêu cầu khác |
| 92 | Token đã được sử dụng, vui lòng tạo token khác |
| 93 | Yêu cầu sử dụng mã authentication id đã được sử dụng, vui lòng thử yêu cầu với authentication id khác |
| 94 | Yêu cầu sử dụng mã authentication id bị thiếu khoặc không hợp lệ |
| 95 | Không thể tìm thấy MID được chỉ định |
| 96 | Số tiền tối thiểu không hợp lệ do ở dưới mức cho phép thanh toán |
| 97 | Số tiền tối đa không hợp lệ do ở trên mức cho phép thanh toán |
| 98 | Yêu cầu không hợp lệ |
| 99 | Giao dịch đã được xử lý |
| 100 | Yêu cầu enrollment đã tồn tại, vui lòng thử yêu cầu khác |
| 101 | Mạng lưới xử lý thẻ gặp lỗi |
| 102 | Chủ thẻ chưa thực hiện enrollment. Vui lòng enrollment trước khi tiếp tục giao dịch |
| 103 | Chủ thẻ đã được Enroll. Vui lòng xác thực chủ thẻ trước khi tiếp tục giao dịch |
| 104 | IP thanh toán chưa được thiết lập |
| 105 | Tài khoản thanh toán của đối tác chưa được kích hoạt |
| 106 | Kênh thanh toán của đối tác chưa được kích hoạt |
| 107 | Kênh thanh toán của đối tác không hợp lệ |
| 108 | Đối tác chưa được cấu hình phương thức thanh toán |
| 109 | Token thanh toán đã được xoá trước đó |
| 110 | Số tiền thanh toán lớn hơn số tiền đã xác thực |
| 111 | Giao dịch hoàn tiền không tồn tại |
| 112 | Giao dịch reversal không tồn tại |
| 113 | Giao dịch reversal thất bại |
| 114 | Thời gian reverse giao dịch đã hết hạn |
| 115 | Giao dịch này đã được reversed trước đó |
| 116 | Giao dịch này không thể reverse |
| 117 | Giao dịch Authorization có trạng thái không hợp lệ để Capture |
| 118 | Giao dịch Authorization có số tiền không hợp lệ để Capture |
| 119 | X-Account-Ref-ID không hợp lệ |
| 401 | Yêu cầu cần được xác thực |
| 500 | Lỗi hệ thống |
