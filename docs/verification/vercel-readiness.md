# Vercel 发布就绪验证

日期：2026-09-06。结论：仓库已具备Vercel构建与发布所需配置、环境门禁和操作材料；尚未创建Vercel项目，也没有Preview或Production部署证据。

## 构建与门禁

| 检查 | 结果 |
| --- | --- |
| 仓库配置检查 | passed |
| 缺少Vercel必需变量 | 按预期failed，列出3个变量名且不输出值 |
| `APM_DEV_AUTO_LOGIN=true` | 按预期failed，不允许Vercel自动登录 |
| 有效变量 + 自动登录关闭 | passed |
| `npm ci` 全新安装 | 150 packages，passed |
| `npm run typecheck` | passed |
| `npm test` | 9/9 passed |
| `npm run build` | passed |
| 精确 `npm run vercel-build` 模拟 | passed |

构建使用Next.js 16.3.4、Node 22.23.2；路由产物包含动态页面 `[[...slug]]` 和Node运行时API `[...path]`。

## 运行时健康检查

请求本机 `/api/health` 得到HTTP 200：

```json
{"ok":true,"storage":"supabase","schemaReady":true,"requiredMigrations":2}
```

这证明当前运行时能连接Supabase并读取两个必需迁移。它不替代Vercel Preview环境的相同检查。

## 安全与边界

- 构建门禁要求 `NEXT_PUBLIC_SUPABASE_URL`、`SUPABASE_SECRET_KEY`、`APM_SESSION_SECRET`，拒绝占位值、过短secret与 `APM_DEV_AUTO_LOGIN=true`。
- `.vercelignore` 排除本地环境、私有seed、课程批次、迁移和测试材料；应用运行不依赖这些文件。
- 扫描部署材料未发现真实凭据或本机绝对路径。
- 当前应用缺少登录限流和公众账号管理；仓库就绪不等于可以无保护地公开分享。
