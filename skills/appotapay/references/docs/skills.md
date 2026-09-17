<!-- source: https://docs.appotapay.com/skills -->

# AppotaPay AI Skills

## AppotaPay AI Skills

AppotaPay AI Skills là các gói hướng dẫn, script và tài liệu tham chiếu giúp trợ lý AI (AI coding agent)
khám phá và tích hợp Cổng thanh toán AppotaPay một cách chuẩn nhất. Cài đặt một lần, sau đó chỉ cần
yêu cầu agent "tích hợp thanh toán AppotaPay" — agent sẽ tự làm theo đúng luồng chính thức: tạo JWT
`X-APPOTAPAY-AUTH`, tạo đơn thanh toán, xác minh chữ ký IPN/redirect, kiểm tra trạng thái và hoàn tiền.

Skills tuân theo chuẩn mở Agent Skills nên dùng được với nhiều agent: Claude
Code, Cursor, Copilot và hơn 40 công cụ khác.

AI có thể mắc sai lầm. Hãy đảm bảo kiểm tra kỹ trước khi triển khai lên Production.

Toàn bộ skill là mã nguồn mở tại github.com/AppotaPayInc/skills.

## Skills là gì?

Mỗi skill là một thư mục chứa file `SKILL.md` (mô tả ngắn để agent tự nhận biết khi nào dùng), kèm thư mục
`references/` (bảng tham số đầy đủ) và `scripts/` (đoạn mã chạy được: tạo JWT, xác minh IPN). Agent chỉ nạp
chi tiết khi cần (progressive disclosure), và luôn đối chiếu với tài liệu mới nhất trước khi sinh code nên
không bị dùng dữ liệu cũ.

## Cài đặt

```bash
/plugin marketplace add AppotaPayInc/skills
/plugin install appotapay@appotapay-skills
```

```bash
npx skills add AppotaPayInc/skills
```

```bash
pnpm dlx skills add AppotaPayInc/skills
```

```bash
yarn dlx skills add AppotaPayInc/skills
```

```bash
bun x skills add AppotaPayInc/skills
```

Sao chép các thư mục trong `skills/` vào thư mục skills của agent, ví dụ `~/.claude/skills/` (Claude Code),
`~/.cursor/skills/` (Cursor), hoặc `.claude/skills/` trong một project cụ thể.

```bash
git clone https://github.com/AppotaPayInc/skills.git
```

Skills hoạt động với mọi agent tuân theo chuẩn Agent Skills.

## Cập nhật skill

Cập nhật lên phiên bản mới nhất:

```bash
npx skills update AppotaPayInc/skills
```

```bash
pnpm dlx skills update AppotaPayInc/skills
```

```bash
yarn dlx skills update AppotaPayInc/skills
```

```bash
bun x skills update AppotaPayInc/skills
```

Trên Claude Code, dùng `/plugin marketplace update appotapay-skills` rồi `/reload-plugins`.
