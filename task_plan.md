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
| 课程原文图片内嵌 | completed | Supabase Markdown 中的 Cloudinary 图片按正文宽度懒加载，失败与非可信来源回退链接 |
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

## 2026-10-02 内容范围更新

题卡面试深化已完成第三章26节并顺延4.1–4.3/5.1，所选30课264卡；本批83条十事务全部回读，全库338。继续使用docs/specs/ch03-interview-completion.md及docs/verification/course21-30-interview-20261002.md管理，不另建计划体系。其余章节扩卡、关系UI、语音与实际部署仍future；本次内容/上传阶段completed。

## 2026-10-03 当前内容阶段

目标：连续完成5.2–7.3十四课生产/审校/上传/总对账，阶段in_progress；对应序号31–44，详细契约沿docs/specs/ch03-interview-completion.md。原先应用实现计划保持历史，不混作本轮题卡验证。前30课已发表JSON冻结，剩余新闻/大题库、UI与部署为后续范围。

## 2026-10-03 内容阶段完成

5.2–7.3十四课生产/审校/上传/总验收completed。以docs/verification/course31-44-interview-20261003.md为证据；全库405，第1–7章55课有核心卡。第8章新闻和第9章大题库、关系UI/语音/部署为后续，已有应用实现计划保持历史。

## 2026-10-03 导航与视觉改造

当前新增任务：重设计课程层级导航、阅读/自主练习/每日复习关系与整体视觉。实现和无真实账号的验证已完成；22项测试、类型检查、生产构建通过，隔离页面走通本课/单卡/撤销/异常重试与多尺寸布局。真实账号登录被自动审批拦截，用户授权仍待回复；主观截图视觉评审受工具限制，线上未发布，不标记获奖品质已达到。范围与证据见docs/specs/navigation-and-visual-refresh.md及docs/verification/navigation-and-visual-refresh.md。

## 2026-10-03 后续制卡表达约束

用户要求真实面试场景、尽量STAR且不需要个人经历；非STAR问题按一二三要点充分解释。已落实docs/specs/question-and-answer-quality-standard.md第6.3节与制卡入口，并制作docs/card-production/interview-answer-examples/rag-vs-finetuning.md示范；此要求用于后续制卡/旧卡修订，不将文档示范视为数据库已发布。

## 2026-10-03 当前任务：第三章逐题面试重构

状态in_progress。范围第三章3.1–3.26全部活动题卡，按答案质量标准1.1/STAR及编号规则重构正面、核心答案、评分与解析，保持身份/位置/概念键，以新批次revision+1发布并逐字段回读。先实时基线及源文核对→分模块改写→交叉审校/主编→全量检查→diff/publish/verify→全库与学习记录对账。详细合同见docs/specs/ch03-interview-completion.md文末。当前阶段：基线核对与模块输入准备。

## 2026-10-07 恢复第三章逐题面试重构

当前in_progress：使用当日新基线继续3.1–3.26全部活动卡。上次未产生新修订或发布；当日新产物使用20261007标识，保留旧计划与已有改动。当前阶段为实时版本/来源核对，然后并行逐模块改写及交叉审校。


## 2026-10-08 续接：第三章250卡草稿已齐

已保存26模块250张草稿（118 STAR / 132编号），全部含追问；draft契约/身份/revision/来源检查通过。上次因配额中断，现补齐m26十一卡并恢复m23有风险实验边界，作者完成m07两处算法示例修正。两组独立审校正在完成未覆盖模块与变更卡复审；尚未生成accepted批次、未发布，不将草稿或检查通过当完成。下一步：当前内容指纹全部pass→26批预检/发布/逐字段回读→全库与学习记录对账。


## 2026-10-08 第三章面试表达全量重构完成

3.1–3.26全部250旧卡逐题重构（118 STAR / 132编号），均有理由、具体例子、边界、追问与一致评分。113+137独立审校及当前内容指纹匹配通过，26新批全部预检/事务发布/逐字段回读通过。全库405卡/799修订/96批次；其他卡metadata、第三章250个旧活动修订、70个旧批次及学习记录摘要保持。类型检查与22测试通过。标准1.1第6.3及完成合同已沉淀；本阶段完成，真实浏览器展示和前端部署未计完成。详见docs/verification/ch03-interview-restructure-20261007.md。

## 2026-10-11 按第一章、第二章继续制卡

状态complete（2026-10-14）。先第一章1.1–1.7，再第二章2.1–2.4，沿答案标准1.1逐题补强为面试可回答的STAR/编号结构；先核对实际活动卡和源文，再决定缺口。现有目标保留稳定身份、位置、概念键，修订用新批次revision+1，不修改冻结批次、不覆盖学习记录。每章依次通过逐卡事实/教学独立审校、结构与来源检查、diff→publish→verify，并核对全库/历史修订/旧批次/学习摘要。不机械凑卡量，不把母题或实践登记当完成。证据保存artifacts/ch01-ch02-interview-20261011；当前阶段：只读基线。

2026-10-14完成证据：章1 44（22 STAR/22编号），章2 32（18 STAR/14编号），76全部独立审校pass；11批按章顺序事务发布/逐字段回读；全库408/875/107，旧修订/账本/身份/学习记录保护通过。第三章250/26本次再读回；前三章326张新版均可供学习。Chrome408列表、三章答案与来源导航抽验通过。详见docs/verification/ch01-ch02-interview-20261011.md。

## 2026-10-17 零延迟交互架构升级（SPEC-003）与多用户进度追踪方案设计（SPEC-004）

| 阶段 | 状态 | 说明 |
| --- | --- | --- |
| SPEC-003 零延迟客户端浅路由与预取缓存架构 | completed | 规格 `docs/specs/v0.2-instant-interaction-architecture.md`、决策 `docs/decisions/003-instant-interaction-architecture.md`、验证 `docs/verification/v0.2-instant-interaction.md` 及代码实现已全部落库 |

