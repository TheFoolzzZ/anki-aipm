# Recall 项目交接

更新：2026-09-06。以下路径均相对项目根目录。

## 最新授权边界

用户最新要求：**添加发布到Vercel所必须的构建文件和材料，以及发布步骤。** 仓库构建与发布材料已完成；本轮没有用户授权创建外部Vercel项目或切换生产域名，因此实际Preview/Production发布仍待执行。此前第1章7篇20张、第2章4篇25张的制卡与上传已经完成。

2026-09-07 追加：已修复本地每次页面跳转重新 bootstrap 导致的约2秒以上卡顿。客户端数据壳现在跨路由持久化，初始化请求去重，bootstrap 体积缩小约73%，卡片/学习/设置/已读链路去除多次不必要全量刷新。Supabase Primary 已核实在 Mumbai `ap-south-1`，Vercel Functions 必须保持仓库配置的 `bom1`。

用户已确认工作日 30 分钟。语音面试延后。允许子 Agent 承担数据、测试、文档和次一级模型验收；主 Agent 负责系统设计与核心 UI。浏览器使用已登录 Chrome，不再使用 Tabbit。

## 当前成果

- 已有产品/课程/数据初始设计三份，实施前冻结 v0.1 spec 与 ADR。
- Next.js / React / TypeScript 主体工程已建立，CSS 使用深墨底色、冰蓝/淡紫、半透明叠卡与浅色专注卡片。
- 页面代码：登录、今日、知识地图与16周路线、章节与课程阅读、卡片搜索筛选/详情、FSRS四档学习与撤销、进度、设置、语音预告。
- 后端：私有访问码用户、签名 Cookie、服务器调度预览、原子评分/撤销 RPC、版本冲突校验、幂等事件、课程和用户进度读取。
- Supabase 已有独立 apm_ 表结构；9章、70篇课程及来源、59张卡及修订已上传，第1章20张、第2章25张。
- 正式 `validate → diff → publish → verify` 发布链、事务 RPC 和批次账本已实现；三批内容位于 `content/batches/`。
- Vercel 仓库构建材料已齐：固定 Node 22、锁文件安装、环境门禁、部署忽略清单、健康检查与 Preview/Production 手册；尚未创建 Vercel 项目或产生部署 URL。

**这不是整站验收通过声明。** 页面代码存在且构建成功，不代表所有用户流程已经在浏览器中验证。

## 验证证据

| 项目 | 状态 | 证据/边界 |
| --- | --- | --- |
| npm test | 9/9 通过 | 含正式批次发布与部署健康检查契约测试；部分 API 仍为静态契约测试 |
| npm run typecheck | 通过 | 主体 UI 写入后再次通过 |
| npm run build | 通过 | 主体 UI / CSS 写入后生产构建成功，动态页面与 API 路由生成 |
| Supabase seed | 通过 | seed-result.json 与 content-inventory.md |
| 第1、2章批次发布 | 通过 | ch01-ch02-card-publishing.md；三批逐卡回读和幂等验证通过 |
| 匿名隔离、RPC 事务行为 | 通过 | database-verification.md / database-result.json；测试用户已清理 |
| 本机启动 | 通过 | npm run dev Ready，127.0.0.1:3210 |
| 浏览器加载 | 部分通过 | Chrome 打开根路径后进入登录页，看到访问码表单与本机进入按钮 |
| 登录后 UI / 学习闭环 | 未验收 | 点击本机进入按钮被自动审批系统以 adapter_eof 审核连接断开中断，没有登录成功证据 |
| 桌面/手机视觉 | 未验收 | 尚未截图审阅；不要引用自评审美分数 |
| Vercel实际发布 | 未执行 | 尚无Vercel项目、Preview或Production URL |
| Vercel仓库就绪 | 通过 | `npm run deploy:check`、精确 `vercel-build` 模拟及 `/api/health` 均通过 |
| 交互性能修复 | 通过 | 连续导航41ms/12ms且无bootstrap；详见 `docs/verification/interaction-performance.md` |

当前 dev server 在工具会话 73763 启动；会话编号只是本次执行线索，不保证跨会话仍有效。接手先检查端口，若未运行执行 npm run dev。构建会话 87964 已成功结束。不要为了运行项目重复生成/替换密钥。

## 文件定位

- `src/components/studio.tsx`：当前全部页面及客户端交互，后续可在明确需要时拆分，避免为了架构重写。
- `src/app/globals.css`：完整响应式视觉；`src/app/[[...slug]]/page.tsx` 页面分发；`src/app/layout.tsx` 布局。
- `src/app/api/[...path]/route.ts`：API 入口。
- `src/lib/{types,learning,scheduler,crypto,repository,db}.ts`：数据契约、计划/FSRS、签名、数据访问。
- `supabase/migrations/202609050001_learning_core.sql`：已应用表与 RPC。
- `supabase/migrations/202609060001_content_batches.sql`：已应用正式批次账本与发布 RPC。
- `scripts/prepare-content.ts`：固定14样卡与70篇课程转换。
- `scripts/content-{validate,diff,publish,verify}.ts`：正式内容发布链。
- `content/batches/`：第1、2章三个 accepted 批次，共45张。
- `scripts/seed.ts`：依赖顺序 upsert；`scripts/verify-database.ts`：远端隔离/事务验证。
- `.env.local`：已有真实配置，禁止打印；`.env.example`：无密钥模板。
- `data/private/seed.json`：原文/样卡生成产物，已忽略，不进版本库。
- `vercel.json` / `.vercelignore`：Vercel构建合同与上传排除项。
- `scripts/check-deployment.mjs`：仓库及Vercel环境门禁；不打印变量值。
- `docs/deployment/vercel.md`：环境配置、Preview、Production、验收与回滚步骤。

## 下一轮实施顺序与完成判据

### P0：完成现有闭环验收

1. 先读本文件、v0.1 spec、ADR、数据库验证报告；确认 dev 与数据库连接。
2. 在 Chrome 进行本机登录；如遇审核机制再次失败，说明准确原因，不把审核系统故障描述为应用 bug。
3. 实测今日 → 学习 → 显示答案 → 四档之一 → 下张 → 刷新 → 持久化；实测撤销、重试、设置版本变化、卡片来源与课程阅读。
4. 检查桌面和手机布局、键盘、对话框焦点、错误与空状态、浏览器控制台。以截图和实际操作记录为证据，可让次一级模型做独立代码/视觉验收。
5. 修复发现后只重跑相关检查，更新验证报告；未经此步骤，不标记 v0.1 功能闭环验收完成。

### P1：建立可扩展制卡发布链（已完成）

已实现批次文件校验、dry-run 差异、事务发布与回读。重复发布同批次返回同结果；发布失败整体回滚；内容发布不写个人复习表。后续文字实质变化必须以 revision+1 的新批次发布。

### P2：逐章扩卡（第1、2章已完成）

下一步建议审校现有14张，再优先技术攻克 RAG / Agent / Evals。每批10–20张，逐张出处与教学审校。总目标360张是规划，不强制凑数。没有卡片的课程仍可阅读，并明确显示待制。

### P3：分享准备

仓库构建材料已完成。下一步在Vercel导入GitHub仓库、分别配置Preview/Production环境变量并完成预览验收；认证限流、跨用户隔离和材料可分享范围确认后再公开分享。当前不实现语音面试；其模型、实时连接和费用须另立 spec。

## 已知实现限制与应重点审查的点

- prepare/seed 仍只用于重建14张初始样卡；正式扩量必须使用 `content:*` 链路。
- 来源引用保存历史 hash，但阅读页打开最新来源，尚未按 source_revision_id 定位快照或行号。
- 评分预览有效10分钟；提交后的超时重试若令牌已过期，API会先拒绝，尚未实现“过期但已提交事件”的结果恢复。
- 当前预算依赖学习选择队列；指定单卡练习可超出新卡计划，属于自由练习入口，UI尚未单独说明。
- 阅读只保存已读标记，不记录用时；每日预算只扣除复习事件耗时。
- 统计只拉最近1000事件；不是无限历史报表。
- 卡片对话框有原生dialog行为，但无障碍命名、手机导航关闭体验尚需验收。
- Settings表单冲突后的恢复、网络中断后的评分/撤销重试行为需要真实页面检查。
- 当前只有私有访问码体系，没有注册/找回/限流/用户管理；不能直接宣称可公开多用户发布。
- 外部字体有系统回退；原文图片当前转成外链，不在页面内渲染。

## 项目管理约定

用户要求所有操作落回文档。需求与验收写 spec，改变方向写 ADR，执行写 progress，事实与问题写 findings，证据放 verification，接手状态更新本文件。旧设计中涉及 GPT-6、实时语音、完整卡量、Supabase Auth 的内容不自动代表当前实现。

不修改非 `apm_` 对象，不上传凭据，不把测试/模拟结果表述为真实用户验收。下一轮从 P0 浏览器闭环或 P2 后续章节扩卡中选择。
