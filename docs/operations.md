# 运行与部署

## 本机

在项目根目录使用 Node 22，依赖版本由 package-lock.json 固定。`npm ci` 后 `npm run dev`，仅监听 `127.0.0.1:3210`。

已有 `.env.local` 是本机配置，已忽略且权限限制为所有者读写。不要提交、复制到文档或输出真实凭据。连接服务端使用 SUPABASE_SECRET_KEY；客户端不接触此密钥。APM_SESSION_SECRET 用于签名 session 与复习预览；APM_OWNER_ACCESS_CODE 用 SHA-256 存储在 apm_users。

本机开发登录必须同时满足 development、APM_DEV_AUTO_LOGIN=true、localhost/127.0.0.1。生产使用访问码登录，不能把本机自动进入按钮当作生产身份方案。

## 数据库

已执行 `supabase/migrations/202609050001_learning_core.sql` 和 `supabase/migrations/202609060001_content_batches.sql`。当前为 12 张 apm_ 表和 3 个 apm_ RPC。新表启用 RLS，拒绝 anon/authenticated 直接访问；个人数据由服务端校验用户并按 user_id 限制。

`npm run content:prepare` → `npm run db:seed` → `npm run db:verify` 为当前试点复现路径。准备脚本只接受当前固定 14 张卡，不是全量内容发布工具。具体扩卡要求见制卡规范。

`content:prepare` 与 `db:seed` 仍只用于重建最初 14 张样卡。正式扩卡使用以下受控链路：

```sh
npm run content:validate -- --batch <file>
npm run content:diff -- --batch <file>
npm run content:publish -- --batch <file>
npm run content:verify -- --batch <file>
```

批次必须是 accepted、最多20张；发布 RPC 以批次 hash 幂等并在单个事务中写卡片、不可变修订和账本，不写 `apm_review_states` 或 `apm_review_events`。同批次 ID 如果内容变化会拒绝，卡片文字变化必须递增 revision。当前第1、2章三个批次见 `content/batches/`。

## Vercel 准备（仓库已就绪，尚未部署）

仓库已增加 `vercel.json`、`.vercelignore`、Node 22 固定、`vercel-build` 环境门禁和部署健康检查。提交前执行 `npm run deploy:check`；Vercel 构建执行 `npm run vercel-build`，缺少必需变量或误开自动登录会失败。

Preview/Production 的环境变量、Dashboard/CLI 步骤、验收和回滚见 [Vercel 发布手册](deployment/vercel.md)。线上只配置 `NEXT_PUBLIC_SUPABASE_URL`、`SUPABASE_SECRET_KEY`、`APM_SESSION_SECRET`；`APM_DEV_AUTO_LOGIN` 保持 false 或不配置。不要上传本地知识库、seed 变量或明文访问码。

访问码通过受控渠道交付；当前没有注册、找回、多用户管理或速率限制，Production 只适合作为受控个人空间。先完成 Preview 登录、读取、评分、撤销、设置、刷新持久化、移动端与隔离验收，再晋级生产。

当前字体采用 Google Fonts CSS 与系统回退；离线/网络不可达时使用系统字体。分享知识库原文前需确认材料可被分享的范围，当前没有将其公开发布。

## 数据与统计边界

每日 30 分钟为计划预算；当前只累计复习事件 duration_ms，不记录阅读耗时。进度活动与成功率使用最近 1,000 条事件，已学习卡数来自当前状态；不是完整终身分析系统。跨日成功率无样本时显示空值。

运维时先读 docs/HANDOVER.md 和 task_plan.md，实施变化后同步 spec、迁移与验证结果。不要改旧项目数据来解决当前项目问题。
