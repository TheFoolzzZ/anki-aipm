# Vercel 发布手册

状态：2026-09-06 已完成仓库与本地构建准备，尚未创建或绑定 Vercel 项目，尚无 Preview/Production URL。

## 1. 仓库内构建合同

- `package.json` 固定 Node `22.x`；Vercel 当前默认新项目使用最新 LTS，因此不能依赖平台默认值。
- `package-lock.json` 与 `npm ci` 固定依赖树。
- `vercel.json` 显式选择 Next.js、`npm ci` 和带环境门禁的 `npm run vercel-build`。Next.js 输出目录由 Vercel 自动识别，不填写自定义 Output Directory。
- 当前 Supabase Primary 已在 Dashboard 核实为 Mumbai `ap-south-1`，因此 Vercel Node.js Functions 固定到同城 `bom1`。不要在 Dashboard 改成默认 `iad1`；跨洲的函数到数据库往返会直接放大登录、课程正文和复习 API 延迟。
- `.vercelignore` 排除课程批次、迁移、测试证据、本地配置和生成物；运行时只上传应用代码与必要依赖。
- `scripts/check-deployment.mjs` 在构建前验证配置和三项必需变量，只输出变量名和错误类型，不输出值。

依据：[Vercel 项目配置](https://vercel.com/docs/project-configuration)、[支持的 Node.js 版本](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)、[排除部署文件](https://vercel.com/docs/deployments/vercel-ignore)。

## 2. Vercel 环境变量

在 Project → Settings → Environment Variables 中配置。Preview 和 Production 都要配置，但 `APM_SESSION_SECRET` 建议使用不同值，避免两个环境共享登录 Cookie 信任域。

| 变量 | Preview | Production | 说明 |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | 必需 | 必需 | 当前 Recall 数据所在 Supabase HTTPS URL |
| `SUPABASE_SECRET_KEY` | 必需 | 必需 | 仅服务端使用；不要使用 anon key 代替 |
| `APM_SESSION_SECRET` | 必需 | 必需 | 至少32字符；可用 `openssl rand -base64 48` 生成 |
| `APM_DEV_AUTO_LOGIN` | `false`或不配置 | `false`或不配置 | 禁止在 Vercel 打开本机自动登录 |

不要配置 `KB_SOURCE_PATH`、`APM_OWNER_ID`、`APM_OWNER_ACCESS_CODE` 或 `NEXT_PUBLIC_SUPABASE_ANON_KEY`：它们只服务本地导入、seed、自动登录或数据库验证，不被线上运行时使用。访问码已经以哈希存于 `apm_users`；用户登录时输入访问码，不需要把明文放进 Vercel。

环境变量变更只影响后续部署；修改后必须重新部署。参见 [Vercel 环境变量](https://vercel.com/docs/environment-variables)。

本机若需要使用 Vercel 的 `.env` 批量导入，可准备仓库根目录 `import.env`。该文件必须保持 `0600` 权限并由 Git 忽略；导入完成后以本节表格为准，确认线上自动登录为 `false`。即使导入界面列出本地工具变量，它们也不属于线上运行依赖。

## 3. 推荐路径：GitHub 导入 + Preview

1. 在 Vercel Dashboard 选择 Add New → Project，导入 `TheFoolzzZ/anki-aipm`。
2. Root Directory 保持仓库根目录；Framework Preset 应显示 Next.js。不要覆盖 Install、Build、Output Directory 或 Function Region，仓库中的 `vercel.json` 是版本化事实来源；部署摘要应显示 Mumbai `bom1`。
3. 在 Preview 与 Production 分别添加上表三项必需变量；`APM_DEV_AUTO_LOGIN` 不配置或明确填 `false`。
4. 在项目Git设置中确认Production Branch为 `main`；首次从其他分支或Pull Request生成Preview。
5. 构建日志应依次出现 `Deployment check passed (Vercel environment)` 和 Next.js `Compiled successfully`。
6. 打开 `<preview-url>/api/health`，必须返回 HTTP 200、`ok: true`、`schemaReady: true`。
7. 在 Preview 使用已有学习访问码完成：登录 → 今日 → 打开卡片 → 显示答案 → 评分 → 刷新后状态仍在 → 撤销 → 设置保存 → 打开课程来源。用测试学习者验收，避免污染正式进度。
8. 检查手机与桌面视口、Vercel Function error logs，并确认页面显示59张卡。
9. Preview 验收通过后合并到 `main` 触发 Production；再次执行健康检查和一次只读登录/课程抽查。

性能验收需分别记录首次登录/初始化、页面内连续导航、卡片详情和显示答案。首次动态请求仍可能受冷启动和用户到 Mumbai 的公网距离影响；页面内导航不应再次出现“正在展开你的知识地图…”，Function 日志中也不应因 `/today`、`/curriculum`、`/cards` 互跳而新增 `/api/bootstrap`。

Preview 与 Production 的行为说明见 [Vercel Environments](https://vercel.com/docs/deployments/environments)。

## 4. 可选路径：Vercel CLI

CLI 仅在需要手动 Preview 或复现云构建时使用，不要求全局安装，可用 `npx vercel@latest`：

```sh
npx vercel@latest link
npx vercel@latest env ls
npx vercel@latest pull --environment=preview
npx vercel@latest build
npx vercel@latest deploy --prebuilt
```

验证 Preview 后再执行：

```sh
npx vercel@latest deploy --prod
```

`.vercel/` 是本地项目绑定与环境缓存，已被 `.gitignore` 忽略，不得提交。若 Vercel 环境变量有变化，重新执行 `vercel pull`。官方流程参见 [CLI 部署指南](https://vercel.com/docs/projects/deploy-from-cli) 与 [`vercel pull`](https://vercel.com/docs/cli/pull)。

## 5. 发布前后检查

本地提交前：

```sh
npm ci
npm run deploy:check
git status --short
```

部署后：

```sh
curl --fail-with-body https://<deployment-domain>/api/health
```

然后核对登录 Cookie 只在 HTTPS 下发送、API 错误日志不包含凭据、Supabase 中个人复习数据仍按用户隔离。当前访问码认证没有注册、找回和速率限制，因此 Production 仅适合作为受控个人空间；补齐滥用防护前不要面向公众传播访问码。

## 6. 回滚与变量轮换

- 代码故障：在 Vercel Deployments 中选择上一条已验收部署并 Promote/Rollback，不执行数据库 reset，不删除卡片或复习事件。
- 环境变量错误：修正对应 Preview/Production 变量后重新部署；旧部署不会自动取得新变量。
- 数据库故障：先停止晋级，依据 `docs/operations.md` 和迁移记录诊断。应用回滚不会自动回滚 Supabase schema。
- `SUPABASE_SECRET_KEY` 或 `APM_SESSION_SECRET` 疑似泄露时立即轮换。轮换会使旧部署失效或现有登录 Cookie 失效，这是预期行为。
