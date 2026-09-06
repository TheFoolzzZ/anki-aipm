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

- 9 个章节、70 篇原文、59 张卡已上传到独立 apm_ 表；其中第1章20张、第2章25张，另有第3、5章14张初始样卡。
- 今日学习、知识地图、课程阅读、卡片库、FSRS 四档学习与撤销、进度、设置、访问码登录已实现代码。
- 360 张为课程规划目标，尚未制成；语音面试仅有规划页。
- Next.js 16.3.4、React 19.2.3、TypeScript、ts-fsrs 5.4.2、Supabase。

## 文档入口

1. [交接与下一步](docs/HANDOVER.md)
2. [实现规格与验收标准](docs/specs/v0.1-learning-core.md)
3. [制卡与入库规范](docs/specs/card-production-and-publishing.md)
4. [运行与部署](docs/operations.md)
5. [设计决策](docs/decisions/001-learning-core.md)
6. [阶段计划](task_plan.md) / [执行日志](progress.md)
7. [数据库实测](docs/verification/database-verification.md) / [第1、2章发布验证](docs/verification/ch01-ch02-card-publishing.md) / [核心审查](docs/verification/core-review.md)

原始设计保存在 docs/plans。新增决定以当前 spec、ADR 和 handover 为准，旧设计不是已实现能力清单。
