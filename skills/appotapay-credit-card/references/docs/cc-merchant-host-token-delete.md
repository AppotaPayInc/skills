<!-- source: https://docs.appotapay.com/cc-merchant-host/token-delete -->

# Token Delete

Xoá token đã tạo, thông tin token đã lưu trữ và liên kết với AppotaPay sẽ được xoá.

### EndPoint

`DELETE` `/credit-card/token/:tokenId`

### Header Params

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| X-APPOTAPAY-AUTH | required | String | Cách tạo JWT_TOKEN |  |
| Content-Type | required | String | Giá trị: `application/json` |  |
| X-Request-ID | optional | String | Định dạng UUIDv4. Request ID để kiểm tra yêu cầu khi xảy ra sự cố | max:42 |
| Language | optional | String | Giá trị `vi` hoặc `en` tương ứng với link thanh toán sẽ là tiếng việt hoặc tiếng anh, (mặc định: `vi`) | in:vi,en |
| X-Account-Ref-ID | optional | String | Mã định danh của tài khoản Sub account do AppotaPay cung cấp. Bắt buộc truyền khi thanh toán giao dịch của Sub account loại owner |  |

```json
{
    "X-APPOTAPAY-AUTH": "JWT_TOKEN",
    "Content-Type": "application/json",
    "X-Request-ID": "Your_Unique_id",
    "Language": "vi",
    "X-Account-Ref-ID": "9723f73b-9295-4acb-884b-ab6310c2e653"
}
```

### Request Params

#### URL Parameters

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| tokenId | required | String | Token ID mà bạn muốn xoá | Min:1 Max: 32 |

#### URL Query

| Tham số | Yêu cầu | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- | --- |
| merchantRefId | required | String | Mã tham chiếu cho yêu cầu của merchant | Min:1 Max: 40 |

### Example Request

```json
{
    "merchantRefId": "9IzaassK2"
}
```

### Response Params

```json
{
    "tokenId": "01hqhr4qqnk66d7tg3pk5md08c",
    "merchantRefId": "9IzaassK2",
    "isDeleted": true
}
```

#### Thành công

> Http Status Code 200 - OK

| Tham số | Kiểu dữ liệu | Mô tả | Lưu ý |
| --- | --- | --- | --- |
| tokenId | String | Token ID yêu cầu xoá |  |
| merchantRefId | String | Mã tham chiếu cho yêu cầu của merchant |  |
| isDeleted | String | Kết quả xoá token: `true`: Token xoá thành công. `false`: Token xoá thất bại, lý do có thể do token đang được xử lý thanh toán hoặc lỗi, có thể thử lại sau |  |

#### Thất bại

> HTTP Status Code != 200

### Ví dụ Code

```bash
curl --location 'https://gateway.dev.appotapay.com/credit-card/token/01hqhr4qqnk66d7tg3pk5md08c?merchantRefId=9IzaassK2' \
  --header 'X-APPOTAPAY-AUTH: JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Request-ID: Your_Unique_id' \
  --header 'Language: vi' \
  --header 'X-Account-Ref-ID: 9723f73b-9295-4acb-884b-ab6310c2e653'
```

### Request

#### REQUEST
