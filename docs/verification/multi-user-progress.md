# 多用户进度隔离验证

验证时间：2026-10-17。

- `tests/multi-user.test.ts` 覆盖用户名规范化、长度与字符限制、迁移与 API 契约、以及按 `userId` 分开的复习预览缓存。公共课程正文在 `clearUserSessionCaches()` 之后仍然保留。
- 旧格式、没有 `userId` 的 Bootstrap 快照会被拒绝，避免把上一位用户的进度画出来。
- 迁移 `supabase/migrations/202610170001_multi_user_profiles.sql` 已写入仓库。当前环境只有 Supabase REST 密钥，没有可执行 DDL 的数据库连接，因此远端尚未应用该迁移，`npm run db:verify` 留到迁移之后。
