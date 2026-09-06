# AI PM Recall Studio 实施计划

更新：2026-09-06。当前任务是在既有制卡成果上补齐 Vercel 构建、环境门禁、发布材料和可复现步骤；本轮不直接创建 Vercel 项目或切换生产域名。

| 阶段 | 状态 | 说明 |
| --- | --- | --- |
| 环境/设计/spec | completed | 原始设计、实施spec、ADR已落盘 |
| 工程与数据库结构 | completed | Next.js主体、11张apm表、2个RPC |
| 身份/课程/FSRS API | implemented | 核心测试及数据库事务验证通过；浏览器端未全验收 |
| 页面与响应式视觉 | implemented | 主体代码、类型检查、生产构建通过；视觉待验收 |
| 数据上传 | completed | 9章70篇59卡，隔离与事务已测 |
| 浏览器闭环/视觉验收 | deferred | 登录页可见；登录动作被审核连接错误中断；按最新范围延期 |
| 制卡与发布规范 | completed | 当前样卡命令与未来批次工具明确区分 |
| 批次发布工具 | completed | validate → dry-run → publish → verify、事务发布和幂等账本已验证 |
| 第1章制卡 | completed | 7篇课程20张，全部逐卡来源与教学审校 |
| 第2章制卡 | completed | 4篇课程25张，全部逐卡来源与教学审校 |
| 第1、2章上传与回读 | completed | 45张新卡入库；总计59张，原样卡与用户复习进度未覆盖 |
| Vercel构建配置 | completed | 固定Node版本、框架/安装/构建命令、部署忽略清单和环境预检 |
| Preview发布手册 | completed | 环境变量、Git/CLI步骤、健康检查、学习闭环和回滚 |
| Vercel就绪验证 | completed | deploy check、精确vercel-build模拟、健康检查和配置扫描通过 |
| 交接与目标 | completed | docs/HANDOVER.md、README、operations齐备 |
| 全量扩卡 / 语音 / Vercel实际发布 | future | 不在本轮完成范围 |

## 当前完成判据

1. Vercel 能从仓库根目录用锁定的 Node/npm 依赖完成 Next.js 构建，不要求上传本地知识库或私有 seed 文件。
2. 缺少三项运行时必需变量、包含占位值或误开本机自动登录时，Vercel 构建必须提前失败且不打印秘密。
3. 文档分别说明 Dashboard Git 导入与 CLI Preview 路径、环境变量作用域、健康检查、访问码登录、生产晋级和回滚。
4. `deploy:check`、测试、typecheck、build通过；部署材料不包含凭据或本机路径。
5. README、operations、progress、findings、verification、handover同步；实际未部署必须明确。

## 管理规则

实施先改spec；决定写ADR；过程写progress；证据写verification。数据库仅apm_对象，密钥不入文档。已实现、已测试、已验收分别记录。
