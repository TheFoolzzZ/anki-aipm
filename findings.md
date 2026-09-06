# 实施发现

## 2026-09-05 初始核对

- 项目当前仅有三份设计稿，没有应用代码。
- 用户已授权 spec 先行后开发，启动网站，并按连接指南在现有 Supabase 项目中新建独立对象。
- 连接指南指向一个既有私有 Supabase 环境；本项目只复用本机连接配置，不记录原项目名称或凭据。
- 指南中原应用使用自定义 Token 会话，旧表权限较宽；本项目不直接复用旧用户表、旧 cookie 名或旧策略。
- 语音面试明确延后；其余课程与记忆流程本轮实现。
- 既有设计盘点为 9 章、70 篇源文、14 张设计样卡、16 周路径；360 为规划预算，不是已生成内容。

## 决策与实时验证

后续补充数据库可达性、运行环境、依赖版本和数据导入证据；不记录密钥值。

- 已从指南指定环境仅复制 Supabase 三项配置到本项目被忽略的 `.env.local`，文件权限0600；独立生成会话 secret 与本项目所有者 ID/访问码，未输出值。
- Node 22.23.2；相关项目已安装 Next 16.1.6、React 19.2.3、ts-fsrs 5.2.3，可作兼容参考。
- 默认沙箱npm查询失败为ENOTFOUND；正在申请正常联网查询。
- 首次Supabase只读工具调用因自动审批流adapter_eof未执行；静态核对GET与无敏感日志后重试已获准启动。
- 用户已移除Tabbit并授权CUA及次一级模型验收；frontend-design已重读，新视觉ADR已记录。

## 2026-09-06 最终状态补充

- 实测Supabase已有11张apm表、2个RPC，9章70篇14卡已上传；见verification报告。
- tsx CLI在sandbox中IPC监听EPERM，已统一相关脚本为node --import tsx运行，不影响脚本逻辑。
- 当前seed不是修订发布工具：固定14张断言、ignoreDuplicates修订、跨请求upsert。扩卡前必须实现校验/dry-run/版本激活/回读。
- 浏览器只验收到登录页，进入按钮审核系统adapter_eof中断；不是已证实的应用登录故障。
- 当前记录阅读完成但不计阅读时间；事件分析最多1000条，来源阅读默认最新版本。
- 用户收敛本轮交付为主体结构、目标与交接，未完成UI实测保留到下一轮。

## 2026-09-06 第1、2章扩卡

- 第1章包含7篇源文，第2章包含4篇源文；现有试点14张均位于第3、5章，因此本轮45张均为新增稳定卡片，不涉及已有卡片修订。
- 现有 `seed.ts` 跨请求 upsert 且对同 revision 使用 `ignoreDuplicates`，不符合正式批次发布要求；必须通过新增受限事务 RPC 写入并在最后切换 active revision。
- 批次文件只保存卡片内容、相对来源路径、hash和行范围，不保存源全文、本机绝对路径或凭据。
- 远端 dry-run 确认45张全为新增；三个批次发布后逐字段回读均通过，账本 hash 与本地批次一致。
- 发布后 `apm_cards=59`、`apm_card_revisions=59`、`apm_content_batches=3`；章节分布为第1章20、第2章25、第3章12、第5章2。
- 发布前后 `apm_review_states=0`、`apm_review_events=0`，说明内容发布未污染个人学习记录；第1章批次再次 diff 为20张 unchanged，再次 publish 返回同一账本结果。

## 2026-09-06 Vercel发布准备

- Vercel官方当前为新项目默认最新LTS（现为Node 24），但本项目已在Node 22验证；通过 `package.json#engines.node=22.x` 固定运行主版本，避免平台默认漂移。
- Next.js由Vercel自动识别输出目录，不应把 `.next` 配成自定义Output Directory；仓库只显式固定framework、`npm ci`和受门禁的build命令。
- 线上运行只读取Supabase URL、服务端secret与session secret；anon key、owner ID/access code、KB路径只用于本地导入或验证。
- Vercel环境变量只应用到后续部署，变量更新后必须重新部署；Preview与Production分别配置和验收。
- 精确 `vercel-build` 模拟通过；缺失三项必需变量时门禁按预期失败且只显示变量名。新版健康接口真实返回 `ok=true`、`schemaReady=true`、`requiredMigrations=2`。
