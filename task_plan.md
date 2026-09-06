# AI PM Recall Studio 实施计划

更新：2026-09-07。当前任务是定位并修复本地页面约 2 秒的普遍交互延迟，同时判断 Vercel 部署后的风险；以修改前后同口径浏览器与 API 计时作为完成证据。

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
| 交互性能诊断 | completed | 已确认路由切换重复 bootstrap、远程数据库往返、过大课程元数据和串行详情查询共同造成延迟 |
| 交互性能修复 | completed | 数据壳持久化，bootstrap 缩小73%，详情并行，学习页去除冗余全量查询，Vercel固定bom1 |
| 交接与目标 | completed | docs/HANDOVER.md、README、operations齐备 |
| 全量扩卡 / 语音 / Vercel实际发布 | future | 不在本轮完成范围 |

## 当前完成判据

1. 页面间客户端跳转不得重新请求完整 bootstrap，也不再回退到整页“正在展开”状态。
2. bootstrap 不传输页面未使用的课程 headings/source_key，卡片详情中的独立读取并行执行。
3. 显示答案不再为了单张卡片读取全部章节、课程、卡片与历史事件。
4. 用同一环境复测 API 与浏览器交互，记录 Vercel 上仍然存在和已消除的延迟来源。
5. 测试、typecheck、build通过，并同步 findings、progress、verification 与 handover。

## 管理规则

实施先改spec；决定写ADR；过程写progress；证据写verification。数据库仅apm_对象，密钥不入文档。已实现、已测试、已验收分别记录。
