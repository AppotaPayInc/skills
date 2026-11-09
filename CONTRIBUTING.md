# Hướng dẫn đóng góp

Tài liệu này dành cho developer AppotaPay muốn thêm một product area mới vào bộ skill, hoặc cập nhật một skill có sẵn khi tài liệu API thay đổi.

## Repo này là gì

Đây là bộ [Agent Skills](https://agentskills.io) giúp các AI coding agent như Claude Code, Cursor hay Copilot tích hợp AppotaPay đúng cách. Mỗi skill là một thư mục trong `skills/`. Agent đọc file `SKILL.md` trước, khi cần chi tiết mới mở thêm các file trong `references/`.

```
skills/appotapay-bill/
├── SKILL.md                     # agent đọc file này đầu tiên
├── references/
│   ├── docs/                    # bản chụp tự động từ docs.appotapay.com, không sửa tay
│   │   ├── bill-info.md
│   │   └── bill-payment.md
│   └── signature.md             # tài liệu tự viết (không bắt buộc)
└── scripts/                     # script hỗ trợ (không bắt buộc)
```

| Thành phần | Vai trò | Ai sửa |
|---|---|---|
| `SKILL.md` | Agent đọc toàn bộ file này mỗi khi dùng skill | Người |
| `references/docs/` | Bản Markdown của docs.appotapay.com | Script |
| `references/*.md` | Giải thích và bảng tra cứu tự viết | Người |
| `scripts/` | Script Node/Python/PHP chạy được | Người |

Có một điều cần nhớ xuyên suốt: `references/docs/` chỉ là bản chụp tài liệu tại lần sync gần nhất, nên có thể đã cũ. Vì vậy mọi `SKILL.md` đều phải dặn agent mở trang tài liệu live để đối chiếu trước khi sinh code.

## Chuẩn bị

Bạn cần Node 18 trở lên (các script dùng `fetch` có sẵn của Node, không phải cài thêm package nào) và quyền push vào repo.

Chạy lệnh sau để chắc môi trường đã sẵn sàng:

```bash
node scripts/validate-skills.mjs      # kết quả đúng: ✓ N skills valid, M indexed
```

## Thêm product area mới

Phần này đi qua từng bước bằng một ví dụ: giả sử AppotaPay vừa ra mắt dịch vụ trả góp, tài liệu nằm ở `https://docs.appotapay.com/installment/...`.

### Bước 1: Đọc tài liệu live

Đầu tiên, xem area này có những trang nào:

```bash
node skills/appotapay/scripts/fetch-doc.mjs index installment
```

Lệnh này liệt kê mọi trang có `installment` trong đường dẫn. Trang nào không có số version ở đầu đường dẫn là bản hiện hành; các trang bắt đầu bằng `1.1/` hay `1.0/` là bản cũ được lưu lại.

Sau đó đọc các trang chính, bắt đầu từ trang giới thiệu và trang bảo mật:

```bash
node skills/appotapay/scripts/fetch-doc.mjs installment/introduction
node skills/appotapay/scripts/fetch-doc.mjs installment/security
```

Đừng bỏ qua trang `security`, vì nó cho biết area này dùng kiểu chữ ký nào (xem Bước 5). Script tự chuyển HTML sang Markdown và giữ nguyên bảng tham số cùng code mẫu, nên bạn có thể đọc thẳng trên terminal.

### Bước 2: Khai báo skill nào sở hữu các trang này

Mở [skills/appotapay/scripts/sync-references.mjs](skills/appotapay/scripts/sync-references.mjs) và thêm một dòng vào bảng `OWNERS`:

```js
const OWNERS = [
  ['cc-merchant-host/', 'appotapay-credit-card'],
  ['installment/',      'appotapay-installment'],   // dòng mới
  ...
];
```

Script so khớp theo tiền tố đường dẫn và lấy dòng khớp đầu tiên, nên tiền tố dài hơn (cụ thể hơn) phải đặt phía trên. Trang nào không khớp dòng nào sẽ bị script báo là orphan. Đừng bỏ qua cảnh báo này, vì nó có nghĩa là AppotaPay vừa thêm trang mới mà chưa skill nào nhận.

### Bước 3: Sync bản chụp tài liệu

```bash
node skills/appotapay/scripts/sync-references.mjs
```

Script đọc `sitemap.xml`, tải mọi trang bản hiện hành, chuyển sang Markdown rồi ghi vào `references/docs/` của từng skill. Lưu ý là nó xoá sạch các thư mục này trước khi ghi lại, nên trang nào đã bị gỡ khỏi docs cũng sẽ biến mất khỏi repo. Cuối cùng script in số trang của từng skill:

```
synced 152/152 pages
    7  appotapay-bill
    6  appotapay-installment      ← area mới
   ...
```

Sync xong, hãy xem lại `git diff`. Nếu bản chụp của skill khác cũng thay đổi, nghĩa là AppotaPay vừa sửa docs ở đó và skill đó có thể cần cập nhật theo (xem phần [Cập nhật skill có sẵn](#cập-nhật-skill-có-sẵn)).

### Bước 4: Viết SKILL.md

Tạo file `skills/appotapay-installment/SKILL.md`. Bạn có thể tham khảo [appotapay-bill](skills/appotapay-bill/SKILL.md) cho một skill đơn giản và [appotapay-subscription](skills/appotapay-subscription/SKILL.md) cho một skill có nhiều luồng.

Phần frontmatter ở đầu file là bắt buộc:

```yaml
---
name: appotapay-installment          # phải trùng tên thư mục
description: >-
  Trả góp qua AppotaPay: đăng ký kỳ hạn, chuyển đổi giao dịch đã thanh toán
  sang trả góp, nhận IPN kết quả chuyển đổi, tra cứu kỳ hạn khả dụng.
  Use when the user integrates installment payments, trả góp, chuyển đổi
  trả góp, or asks about /api/v2/installment endpoints.
  Requires appotapay-auth for the JWT.
license: MIT
metadata:
  version: "0.2.0"
  source: https://docs.appotapay.com/installment/introduction
---
```

Trong đó `description` là trường quan trọng nhất. Agent chỉ dựa vào trường này để quyết định có dùng skill hay không, nên hãy viết sao cho nó dễ khớp với câu hỏi của người dùng:

- Liệt kê những việc cụ thể người dùng sẽ nhờ agent làm. Một câu chung chung như "tích hợp thanh toán" không giúp agent phân biệt skill này với các skill khác.
- Viết cả tiếng Việt lẫn tiếng Anh, vì người dùng gõ "tích hợp trả góp" cũng nhiều như gõ "installment".
- Ghi đúng đường dẫn endpoint, vì người dùng hay dán thẳng URL vào để hỏi.
- Ghi rõ skill này cần skill nào khác, ví dụ `Requires appotapay-auth for the JWT`.

Để so sánh, đây là một description viết chưa tốt:

```yaml
description: Skill cho tính năng trả góp của AppotaPay.
```

Nó không nói skill làm được gì, không có từ khoá tiếng Anh, cũng không có endpoint, nên agent không biết khi nào cần dùng.

Phần nội dung bên dưới frontmatter nên có các mục sau, theo thứ tự:

1. **Base URL** cho sandbox và production. Đừng mặc định là `gateway.*`: POS dùng `pos-gw.*`, còn OAuth của ví điện tử dùng `ewallet.*`.
2. **Bảng endpoint**, mỗi dòng gồm việc cần làm, method và path.
3. **Luồng xử lý**, viết trong code block, đánh số từng bước và ghi rõ bước nào bắt buộc kiểm tra chữ ký.
4. **Chữ ký**: dùng kiểu nào, ký trên những trường nào (xem Bước 5).
5. **Xử lý lỗi**, đặc biệt là trường hợp timeout với các API chuyển tiền.
6. **Tài liệu tham khảo**, trỏ tới các file trong `references/docs/`.

Agent đọc toàn bộ `SKILL.md` mỗi lần dùng skill, nên hãy giữ file này ngắn gọn. Phần chi tiết dài thì để trong `references/`.

### Bước 5: Xác định kiểu chữ ký

Đây là bước dễ sai nhất. AppotaPay không dùng chung một kiểu chữ ký mà có tới 5 kiểu khác nhau tuỳ dịch vụ. Chi tiết đầy đủ nằm trong [skills/appotapay-auth/references/signature.md](skills/appotapay-auth/references/signature.md), nơi các kiểu này được gọi là Family A đến E. Bảng dưới đây chỉ tóm tắt:

| Kiểu | Dùng ở đâu | Quy tắc tạo chữ ký |
|---|---|---|
| A | `/api/v1/service/...`, thanh toán ví điện tử | Lấy đúng các trường tài liệu liệt kê, sắp xếp theo alphabet, nối thành `key=value&…` rồi ký HMAC-SHA256 |
| B | IPN và redirect của cổng thanh toán v2 | `HMAC_SHA256(data thô, SECRET_KEY)` |
| C | Phụ lục `payment/signature` | Giống kiểu A nhưng ký trên tham số đơn hàng ở dạng phẳng |
| D | POS | Header `X-Signature = HMAC_SHA256(raw JSON body)` |
| E | Gạch thẻ (charging card) | `SHA256(chuỗi nối theo thứ tự cố định + secret_key)`, không dùng HMAC |

Với kiểu A, mỗi endpoint ký trên một tập trường khác nhau, và ngay trong cùng một endpoint thì request và response cũng ký trên các trường khác nhau. Nếu area mới dùng kiểu A, hãy thêm dòng cho nó vào bảng trong `signature.md`.

Để chắc mình ký đúng, hãy so chuỗi trước khi ký (canonical string) với ví dụ trong tài liệu:

```bash
APPOTAPAY_SECRET_KEY=test node skills/appotapay-auth/scripts/sign-params.mjs \
  --fields amount,orderId,partnerRefId \
  --params '{"amount":10000,"orderId":"abc","partnerRefId":"xyz"}'
# canonical string được in ra stderr, phải khớp từng ký tự với ví dụ trong tài liệu
```

Khi chữ ký bị từ chối, lỗi gần như luôn nằm ở canonical string chứ không phải ở bước HMAC. Ba lỗi hay gặp nhất:

- Mảng và object được chuyển thành chuỗi theo cách khác nhau tuỳ endpoint.
- Trường rỗng vẫn phải có mặt trong chuỗi, ví dụ `extraData=`.
- Dấu cách được giữ nguyên, không URL-encode.

### Bước 6: Đăng ký skill installment ở 4 nơi

Đến đây thư mục `skills/appotapay-installment/` đã chạy được trên máy bạn, nhưng chưa ai khác biết tới nó. Mỗi nơi dưới đây phục vụ một cách cài đặt hoặc một cách agent tìm skill. Thiếu 1 chỗ thì skill cũng không dùng được.

#### 1. `.well-known/agent-skills/index.json`

Thêm một phần tử vào cuối mảng `skills`:

```json
{
  "name": "appotapay-installment",
  "description": "Installment payments via AppotaPay: register terms, convert a paid transaction to installments, result IPN.",
  "path": "/skills/appotapay-installment/SKILL.md",
  "version": "0.2.0"
}
```

- `name` trùng tên thư mục, `path` trỏ đúng tới file `SKILL.md` vừa tạo.
- `description` ở đây chỉ cần một câu tiếng Anh ngắn như các entry khác, không phải chép lại `description` dài trong frontmatter.
- `version` phải bằng `metadata.version` trong `skills/appotapay-installment/SKILL.md`.

#### 2. `SKILL.md` ở thư mục gốc

File này có hai bảng, và skill installment phải có mặt ở cả hai.

Bảng "What's bundled" cho agent biết bộ skill gồm những gì:

```markdown
| **appotapay-installment** | Installment: register terms, convert a paid transaction, result IPN |
```

Bảng "Routing" cho agent biết khi nào cần chuyển sang skill installment:

```markdown
| Split a payment into installments (trả góp) | **appotapay-installment** |
```

Validator chỉ kiểm tra file có nhắc tới `appotapay-installment` hay không, nên nếu thêm vào một bảng mà quên bảng kia thì vẫn qua. Hãy tự kiểm cả hai bảng.

#### 3. `skills/appotapay/SKILL.md` (skill điều hướng)

Khi người dùng hỏi chung chung kiểu "tích hợp AppotaPay", agent mở skill này trước, rồi dựa vào bảng "Decision: which sub-skill to load" để chọn skill con. Thêm một dòng cho installment, kèm từ khoá tiếng Việt như các dòng khác:

```markdown
| **Installment payments**: register terms, convert a paid transaction to installments (trả góp) | **appotapay-installment** |
```

Tiếp theo là bảng "Base URLs". Nếu tài liệu ghi installment dùng host `gateway.*` giống phần lớn các dịch vụ khác, bạn không cần thêm dòng mới, chỉ cần thêm `installment` vào danh sách ở dòng đầu:

```markdown
| Payment, merchant-hosted, credit card, subscription, bill, topup, buy-card, charging-card, firm-banking, virtual-account, installment | `https://gateway.dev.appotapay.com` | `https://gateway.appotapay.com` |
```

Nếu installment dùng host riêng (giống POS dùng `pos-gw.*`), hãy thêm một dòng mới thay vì sửa dòng này.

Validator không kiểm tra file này, nên bỏ sót cũng không bị báo lỗi. Hãy tự mở file ra xem lại sau khi sửa.

#### 4. `README.md`

Thêm một dòng vào bảng "What's inside" để người xem repo trên GitHub biết có skill này:

```markdown
| `appotapay-installment` | Installment: register terms, convert a paid transaction, result IPN |
```

Xong cả bốn nơi thì chuyển sang Bước 7 để chạy validator.

### Bước 7: Kiểm tra

```bash
node scripts/validate-skills.mjs
```

Nếu mọi thứ ổn, bạn sẽ thấy `✓ N skills valid, M indexed`. Script kiểm tra những điểm sau:

- `name` trong frontmatter trùng tên thư mục.
- Có đủ `description`, `version` và `source`.
- Mọi đường dẫn `references/…` và `scripts/…` nhắc tới trong `SKILL.md` đều tồn tại.
- `references/docs/` không rỗng.
- `index.json` khớp với danh sách thư mục skill.
- Bảng `OWNERS` không trỏ tới skill không tồn tại.
- `SKILL.md` gốc và `README.md` đã nhắc tới skill mới.

Nếu bạn có viết thêm script cho skill, nhớ chạy thử:

```bash
node skills/appotapay-installment/scripts/<script>.mjs
```

### Bước 8: Tăng version và commit

Tăng `metadata.version` trong mọi `SKILL.md` bạn đã sửa, đồng thời tăng version trong `.claude-plugin/plugin.json` và `.well-known/agent-skills/index.json`. Cả release dùng chung một số version. Người đã cài plugin chỉ nhận được bản mới khi version thay đổi.

```bash
git checkout -b feat/installment-skill
git add skills .well-known .claude-plugin README.md SKILL.md
git commit
```

Commit message nên có dòng đầu ngắn gọn, phần thân giải thích lý do thay đổi thay vì liệt kê lại các file đã sửa. Không thêm dòng ghi công cho công cụ AI.

Sau đó mở PR vào `main`. Trong mô tả PR, ghi rõ area nào, bản chụp có bao nhiêu trang, dùng kiểu chữ ký nào và bạn đã test những gì.

## Cập nhật skill có sẵn

AppotaPay có thể sửa tài liệu bất cứ lúc nào mà không báo trước, nên hãy sync lại định kỳ:

```bash
node skills/appotapay/scripts/sync-references.mjs
git diff --stat                       # xem area nào thay đổi
git diff skills/appotapay-bill        # đọc kỹ thay đổi của từng area
```

Sau đó so `SKILL.md` với bản chụp mới. Một số thay đổi sẽ làm hỏng các tích hợp đang chạy:

| Thay đổi | Hậu quả |
|---|---|
| Thêm hoặc bớt trường trong chữ ký | Mọi merchant ký sai, toàn bộ request bị từ chối |
| Đổi endpoint path hoặc host | Request gửi sai địa chỉ |
| Đổi bảng mã trạng thái hoặc mã lỗi | Merchant hiểu sai kết quả giao dịch |
| Thêm ràng buộc mới (số tiền tối thiểu/tối đa, độ dài trường) | Request hôm qua còn hợp lệ, hôm nay đã lỗi |

Gặp những thay đổi này thì phải sửa `SKILL.md`, đừng coi đó chỉ là bản chụp thay đổi.

Nếu cần lấy cả các bản tài liệu cũ:

```bash
node skills/appotapay/scripts/sync-references.mjs --archived
```

## Kiểm tra skill có hoạt động không

Cài skill vào máy rồi thử hỏi như người dùng thật:

```bash
cp -r skills/appotapay-installment ~/.claude/skills/
```

Mở một session mới và hỏi theo ít nhất ba cách: một câu tiếng Việt tự nhiên (ví dụ "tích hợp trả góp AppotaPay" hoặc "làm sao chuyển đổi giao dịch sang trả góp"), một câu tiếng Anh, và một câu chỉ dán endpoint. Sau đó kiểm tra hai điều:

- Agent có tự chọn đúng skill không? Nếu không, `description` chưa đủ tốt, hãy sửa rồi thử lại.
- Code agent sinh ra có khớp với tài liệu không?

## Những quy tắc phải tuân thủ

1. **Không sửa tay các file trong `references/docs/`.** Lần sync sau sẽ ghi đè mất. Nội dung tự viết hãy đặt trực tiếp trong `references/`.
2. **Mọi `SKILL.md` đều phải dặn agent mở tài liệu live để đối chiếu.** Đây là cách giữ skill đúng trong khoảng thời gian giữa hai lần release.
3. **Không tự nghĩ ra endpoint, tên trường hay mã lỗi.** Khi không chắc, hãy mở tài liệu ra xem. Một skill sai còn tệ hơn một skill thiếu, vì nó khiến agent tự tin sinh ra code hỏng.
4. **Cảnh báo về phạm vi PCI** trong mọi skill có dữ liệu thẻ thô đi qua server của merchant.
5. **Không gửi lại request chuyển tiền bị timeout khi chưa kiểm tra trạng thái.** Skill phải dặn agent tra trạng thái giao dịch theo `partnerRefId` trước, và nếu cần gửi lại thì dùng đúng `partnerRefId` cũ.
6. **Chạy `node scripts/validate-skills.mjs` trước mỗi lần commit.**

## Cần hỗ trợ

Nếu thấy tài liệu sai hoặc thiếu, hãy mở issue trong repo này hoặc hỏi team Payment Gateway. Nguồn chuẩn luôn là <https://docs.appotapay.com>
