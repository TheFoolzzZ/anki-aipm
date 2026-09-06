# 运行与部署

## 本机

在项目根目录使用 Node 22，依赖版本由 package-lock.json 固定。`npm ci` 后 `npm run dev`，仅监听 `127.0.0.1:3210`。

已有 `.env.local` 是本机配置，已忽略且权限限制为所有者读写。不要提交、复制到文档或输出真实凭据。连接服务端使用 SUPABASE_SECRET_KEY；客户端不接触此密钥。APM_SESSION_SECRET 用于签名 session 与复习预览；APM_OWNER_ACCESS_CODE 用 SHA-256 存储在 apm_users。

本机开发登录必须同时满足 development、APM_DEV_AUTO_LOGIN=true、localhost/127.0.0.1。生产使用访问码登录，不能把本机自动进入按钮当作生产身份方案。

## 数据库

已执行 `supabase/migrations/202609050001_learning_core.sql`。仅新增 11 张 apm_ 表和 2 个 apm_ RPC，旧项目业务表未变更。新表启用 RLS，拒绝 anon/authenticated 直接访问，服务端校验用户并按 user_id 限制个人数据。

`npm run content:prepare` → `npm run db:seed` → `npm run db:verify` 为当前试点复现路径。准备脚本只接受当前固定 14 张卡，不是全量内容发布工具。具体扩卡要求见制卡规范。

当前 seed 跨多次 upsert，不是单事务；失败可在核对错误后重跑，不能声称具备原子批次发布。现有卡片修订 ignoreDuplicates，不会覆盖同版本答案。

## Vercel 准备（尚未部署）

1. 把代码放入独立仓库，保留 .gitignore，确认无 .env.local/data/private/真实凭据进入 Git。
2. Vercel 选择 Next.js，执行 npm run build；线上不使用绑定本机地址的 npm run start。
3. 配置 NEXT_PUBLIC_SUPABASE_URL、SUPABASE_SECRET_KEY、APM_SESSION_SECRET；将 APM_DEV_AUTO_LOGIN 关闭。APM_OWNER_ID/ACCESS_CODE 是本机 seed 配置，线上运行无需为 seed 暴露明文访问码。
4. 访问码通过受控渠道交付给使用者；当前没有注册、找回、多用户管理 UI，也没有速率限制，正式开放前需补认证与滥用防护验收。
5. KB_SOURCE_PATH 只用于本地导入，Vercel 从 Supabase 读取课程，不需要携带用户本地知识库目录。
6. 先在预览环境完成登录、读取、评分、撤销、设置、刷新持久化、移动端与跨用户隔离验收，再考虑正式发布。

当前字体采用 Google Fonts CSS 与系统回退；离线/网络不可达时使用系统字体。分享知识库原文前需确认材料可被分享的范围，当前没有将其公开发布。

## 数据与统计边界

每日 30 分钟为计划预算；当前只累计复习事件 duration_ms，不记录阅读耗时。进度活动与成功率使用最近 1,000 条事件，已学习卡数来自当前状态；不是完整终身分析系统。跨日成功率无样本时显示空值。

运维时先读 docs/HANDOVER.md 和 task_plan.md，实施变化后同步 spec、迁移与验证结果。不要改旧项目数据来解决当前项目问题。
