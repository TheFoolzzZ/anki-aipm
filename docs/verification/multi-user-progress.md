# 多用户进度隔离验证

验证时间：2026-10-17。

- `tests/multi-user.test.ts` 覆盖用户名规范化、长度与字符限制、迁移与 API 契约、以及按 `userId` 分开的复习预览缓存。公共课程正文在 `clearUserSessionCaches()` 之后仍然保留。
- 旧格式、没有 `userId` 的 Bootstrap 快照会被拒绝，避免把上一位用户的进度画出来。
- 迁移 `supabase/migrations/202610170001_multi_user_profiles.sql` 已在当前学习项目的数据库执行。已有 1 个用户完成用户名回填，设置行仍在，`apm_register_user` 与唯一索引已存在，迁移版本 `202610170001` 已登记。短用户名会被函数拒绝，没有留下测试账号。
