# AI PM Recall Studio 实施计划

更新：2026-09-06。当前用户要求收敛到“完成主体结构、目标、制卡入库规范及交接”，暂不继续全站验收或扩卡。

| 阶段 | 状态 | 说明 |
| --- | --- | --- |
| 环境/设计/spec | completed | 原始设计、实施spec、ADR已落盘 |
| 工程与数据库结构 | completed | Next.js主体、11张apm表、2个RPC |
| 身份/课程/FSRS API | implemented | 核心测试及数据库事务验证通过；浏览器端未全验收 |
| 页面与响应式视觉 | implemented | 主体代码、类型检查、生产构建通过；视觉待验收 |
| 数据上传 | completed | 9章70篇14卡，隔离与事务已测 |
| 浏览器闭环/视觉验收 | deferred | 登录页可见；登录动作被审核连接错误中断；按最新范围延期 |
| 制卡与发布规范 | completed | 当前样卡命令与未来批次工具明确区分 |
| 交接与目标 | completed | docs/HANDOVER.md、README、operations齐备 |
| 全量扩卡 / 语音 / Vercel发布 | future | 不在本轮完成范围 |

## 下一轮优先级

P0 实测当前学习闭环 → P1 实现批次制卡发布工具 → P2 逐章补卡 → P3 分享准备。详细判据见 docs/HANDOVER.md。

## 管理规则

实施先改spec；决定写ADR；过程写progress；证据写verification。数据库仅apm_对象，密钥不入文档。已实现、已测试、已验收分别记录。
