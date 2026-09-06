# AI PM Recall Studio 实施计划

更新：2026-09-06。当前任务是完成第 1、2 大章全部学习单元的制卡、审校、发布与远端回读验证。

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
| 交接与目标 | completed | docs/HANDOVER.md、README、operations齐备 |
| 全量扩卡 / 语音 / Vercel发布 | future | 不在本轮完成范围 |

## 当前完成判据

1. 三个 accepted 批次覆盖第1章7篇、第2章4篇课程，共20+25张新卡。
2. 每张卡只有一个学习目标，包含必答点、误区、稳定身份和真实来源 hash/行范围。
3. validate 与 dry-run 无阻断错误；发布事务不会覆盖 review_states/review_events。
4. 远端回读卡片、修订、active_revision、来源引用和章节计数全部一致。
5. 测试、typecheck、build通过；spec、progress、findings、verification、handover同步。

## 管理规则

实施先改spec；决定写ADR；过程写progress；证据写verification。数据库仅apm_对象，密钥不入文档。已实现、已测试、已验收分别记录。
