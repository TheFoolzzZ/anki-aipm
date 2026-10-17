# Recall · AI PM 学习空间

基于本地 AI PM 知识库的课程阅读与间隔复习网站。当前版本完成主体代码和数据库底座；尚未完成登录后的浏览器验收，不作为正式发布版本。

## 运行

```sh
npm ci
npm run dev
```

访问 http://127.0.0.1:3210 。本机已有 `.env.local`，登录页提供“打开本机学习空间”；不要覆盖已有密钥。新环境参照 `.env.example`。

```sh
npm run typecheck
npm test
npm run build
npm run deploy:check
npm run content:prepare
npm run db:seed
npm run db:verify
npm run content:validate -- --batch content/batches/ch01-foundations-001.json
npm run content:diff -- --batch content/batches/ch01-foundations-001.json
npm run content:publish -- --batch content/batches/ch01-foundations-001.json
npm run content:verify -- --batch content/batches/ch01-foundations-001.json
```

内容准备、数据库及批次命令涉及本地知识库或远端 Supabase。首次建表与数据上传说明见文档。

## 当前内容与页面

- 9 个章节、70 篇原文；截至2026-10-14，独立 apm_ 表共408张卡、875个修订、107个批次。第1–3章326张新版题卡已按面试标准审校、发布并回读验证。
- 今日学习、知识地图、课程阅读、卡片库、FSRS 四档学习与撤销、进度、设置、访问码登录已实现代码。
- 卡数按学习目标确定，不设凑数门槛；第1–7章55课已有核心卡，第8/9章与语音面试尚待后续工作。
- Next.js 16.3.4、React 19.2.3、TypeScript、ts-fsrs 5.4.2、Supabase。

## 文档入口

1. [交接与下一步](docs/HANDOVER.md)
2. [实现规格与验收标准](docs/specs/v0.1-learning-core.md)
3. [零延迟交互与缓存架构规格（v0.2 已实现）](docs/specs/v0.2-instant-interaction-architecture.md) / [验证记录](docs/verification/v0.2-instant-interaction.md)
4. [制卡与入库规范](docs/specs/card-production-and-publishing.md)
5. [运行与部署](docs/operations.md)
6. [Vercel发布手册](docs/deployment/vercel.md)
7. [设计决策 ADR-001](docs/decisions/001-learning-core.md) / [ADR-002](docs/decisions/002-contextual-course-navigation.md) / [ADR-003](docs/decisions/003-instant-interaction-architecture.md)
8. [阶段计划](task_plan.md) / [执行日志](progress.md)
9. [数据库实测](docs/verification/database-verification.md) / [第1、2章发布验证](docs/verification/ch01-ch02-card-publishing.md) / [核心审查](docs/verification/core-review.md)

原始设计保存在 docs/plans。新增决定以当前 spec、ADR 和 handover 为准，旧设计不是已实现能力清单。

## 题卡质量与发布（2026-09-13）

制卡与旧卡审校先读[题目与答案质量标准](docs/specs/question-and-answer-quality-standard.md)，逐模块范围见[原生题源与补题覆盖表](docs/specs/module-question-coverage.md)。第1–3章23个模块的质量生产文档已完成；本轮第3章85张新卡已发布并回读，总库172张。详见[内容验收报告](docs/verification/ch03-quality-review.md)与[生产计划](docs/plans/2026-09-10-card-quality-production.md)。母题/实践与延期项按文档继续，登记覆盖不等于学习掌握。

### 2026-09-18 前五节修订

3.1–3.5补强35张旧卡、新增34张，五批已发布并逐字段回读。原生目标152条全部登记，综合/实践任务保留文档级；关联目录尚未接入前端。详见[本轮验收](docs/verification/ch03-first-five-interview-20260918.md)。

### 2026-10-01 扩展至第十节

3.6–3.10补强35张旧卡、新增9张；五批已发布回读，前十节累计113张卡。实践与不可证原始训练细节保留明确边界，见[本轮验收](docs/verification/ch03-six-ten-interview-20261001.md)。

### 2026-10-02 扩展至第二十节

3.11–3.20补强22张旧卡、新增46张；十批已发布并回读。原生勾选与非勾选题源分别登记，重复目标跨课复用。详见[本轮验收](docs/verification/ch03-eleven-twenty-interview-20261001.md)。

### 2026-10-02 扩展至30课范围完成

第三章实际26节已完成，并按原文顺延4.1–4.3/5.1。本轮77新卡、6旧卡补强，十批全部上传回读；所选30节264卡，全库338卡。原题登记与实践完成分别计数，关系UI与部署未包含。详见[本轮验收](docs/verification/course21-30-interview-20261002.md)。

### 2026-10-03 推进至第7章结束

5.2–7.3新增67张、补强C13，十四批68条已上传并回读，全库405张；第1–7章55课都有核心卡。实践、关系UI及部署不混作已完成。详见[本轮验收](docs/verification/course31-44-interview-20261003.md)。

### 2026-10-03 导航与视觉改造

顶部切换全站模块，知识地图内使用章节/课程目录、搜索与可点击面包屑。阅读页支持跨章节上下课与正文目录；本课练习和单卡练习完成后停止，每日复习保持全库FSRS调度。视觉统一为浅色学习空间，手机使用课程目录抽屉。实现已通过22项测试、类型检查与构建；隔离页面交互与尺寸检查通过，真实账号验收、主观视觉评审及上线未完成。见[改造规格](docs/specs/navigation-and-visual-refresh.md)与[验证记录](docs/verification/navigation-and-visual-refresh.md)。


### 2026-10-08 第三章逐题重构完成

250张旧卡全部按真实面试标准重写并新增修订：118张假设STAR、132张编号解释，全部补齐追问和评分。26批发布、回读与身份/旧版/学习记录对账通过。标准见[答案质量规范](docs/specs/question-and-answer-quality-standard.md)，证据见[本轮验收](docs/verification/ch03-interview-restructure-20261007.md)。浏览器展示与前端部署未混作内容完成。

### 2026-10-14 第一、二章面试题卡发布完成

第一章44张、第二章32张完成独立审校，11批实际发布并逐字段回读；前三章共326张新版题卡。第三章26批再次回读通过，旧卡身份、历史修订与学习记录保持。已在真实页面检查新版答案及来源跳转；内容更新通过刷新读取数据库，无须重新部署前端。详见[本轮验收](docs/verification/ch01-ch02-interview-20261011.md)。
