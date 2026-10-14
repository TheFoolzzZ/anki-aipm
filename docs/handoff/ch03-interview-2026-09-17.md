# 交接文档：anki-pm 第三章全量补齐与面试关联复习

生成时间：2026-09-17。工作区：/Users/klein/WebstormProjects/workspace/anki-pm
目标：**以「B 端 / Agent 产品经理面试准备」为最终目标，完成第三章全部 26 节的知识梳理、题卡编写完善、知识关联、上传与验收。**

---

## 1. 一句话状态

**已完成：项目理解、第三章真实基线盘点、本轮实施合同（spec）。未完成：26 节题卡生产、关联功能实现、上传发布、验收。**
当前远端仍为 2026-09-13 的旧状态（172 卡 / 217 修订 / 26 批次），本轮**尚未发布任何内容**，学习记录为 0，未被触碰。

---

## 2. 本轮任务的完整思考链路（按发生顺序）

| 阶段 | 产出 | 说明 |
| --- | --- | --- |
| ① 理解项目与旧进度 | 阅读 spec / 计划 / 验收证据 | 见 `docs/specs/v0.1-learning-core.md`、`docs/plans/2026-09-10-card-quality-production.md`、`docs/verification/ch03-quality-review.md` |
| ② 只读核对代码 | 确认学习链路、FSRS、发布事务真实存在 | 学习页/评分/撤销在 `src/components/studio.tsx`；发布事务在 `supabase/migrations/202609060001_content_batches.sql` |
| ③ 发现范围偏差 | **旧计划只做到 3.12，实际目录有 26 节** | 旧覆盖表 `docs/specs/module-question-coverage.md` 只列到 3.12 为「已完成」，3.13–3.26 未制卡 |
| ④ 建立真实基线 | `scripts/ch03-inventory.ts` + 两个 JSON | 只读核对 26 节来源 hash、远端卡数、学习记录 |
| ⑤ 写本轮实施合同 | `docs/specs/ch03-interview-completion.md` | 定义能力域框架、卡片规范、命名与 position 规则、关联方案、验收标准 |
| ⑥ 尝试并行生产 | **失败：子代理 429 Credits exhausted** | 未产出任何卡片，需主代理串行完成 |

---

## 3. 已落地产物清单（真实存在的文件）

| 路径 | 作用 |
| --- | --- |
| `/Users/klein/WebstormProjects/workspace/anki-pm/docs/specs/ch03-interview-completion.md` | **本轮实施合同**，续做前必读 |
| `/Users/klein/WebstormProjects/workspace/anki-pm/scripts/ch03-inventory.ts` | 来源 hash 校验 + 远端只读快照脚本；`--after` 生成发布后快照 |
| `/Users/klein/WebstormProjects/workspace/anki-pm/artifacts/ch03-interview/source-index.json` | 26 节真实路径、hash、行数、checklist 行号 |
| `/Users/klein/WebstormProjects/workspace/anki-pm/artifacts/ch03-interview/before.json` | 发布前基线：172 卡 / 217 修订 / 26 批次 / 0 学习记录 |
| `/Users/klein/WebstormProjects/workspace/anki-pm/.workbuddy-ai/memory/2026-09-15.md` | 项目阅读结论（进度边界、文档陈旧点） |
| `docs/card-production/ch03-interview/`（已建空目录） | 待写入 26 节生产文档 |
| `artifacts/ch03-interview/reviews/`（已建空目录） | 待写入审校记录 |

---

## 4. 真实基线（2026-09-15 实测，非文档推断）

- 第三章 **26 节**，来源文件全部可读、hash 与远端 `apm_source_revisions` 一致，无漂移。
- 第三章现有卡 **97 张**；全库 **172 卡 / 217 修订 / 26 批次**；复习状态与事件均为 **0**。
- 全文 checklist 勾选项共 **447 条**（比旧记录的 271 条多，旧覆盖表有遗漏）。

| 模块 | 标题 | checklist | 现有卡 | 原文行数 |
| --- | --- | ---: | ---: | ---: |
| 3.1 | AI 产品技术理解要求 | 36 | 6 | 1506 |
| 3.2 | 机器学习 | 36 | 8 | 2206 |
| 3.3 | 深度学习 | 29 | 8 | 1183 |
| 3.4 | Transformer | 26 | 7 | 1041 |
| 3.5 | LLM | 25 | 6 | 1051 |
| 3.6 | 模型微调 | 22 | 7 | 489 |
| 3.7 | Tokenization | 12 | 6 | 560 |
| 3.8 | Token 详解 | 16 | 6 | 466 |
| 3.9 | Prompt Engineering | 15 | 8 | 675 |
| 3.10 | 向量数据库与嵌入模型 | 18 | 8 | 743 |
| 3.11 | 讲透 RAG | 28 | 11 | 570 |
| 3.12 | 智能体（Agent） | 8 | 8 | 491 |
| 3.13 | SKILL | 10 | **0** | 520 |
| 3.14 | ContextEngineering | 0 | **0** | 537 |
| 3.15 | LangChain | 0 | **0** | 463 |
| 3.16 | Embedding | 0 | **0** | 526 |
| 3.17 | Function Call | 10 | 2 | 729 |
| 3.18 | A2A | 12 | **0** | 535 |
| 3.19 | MCP | 12 | 1 | 625 |
| 3.20 | VectorDB | 11 | **0** | 449 |
| 3.21 | LangGraph | 22 | **0** | 585 |
| 3.22 | AG-UI | 22 | **0** | 581 |
| 3.23 | 衡量AI产品的技术指标 | 29 | 1 | 2329 |
| 3.24 | WorkFlow | 24 | **0** | 1202 |
| 3.25 | Evals | 24 | 4 | 729 |
| 3.26 | FDE 与 Foundry Ontology | 0 | **0** | 2737 |

**缺口最大的 10 节（0 卡）**：3.13、3.14、3.15、3.16、3.18、3.20、3.21、3.22、3.24、3.26。

---

## 5. 已确立的关键决策（续做时不要重新讨论）

1. **不覆盖已发布 JSON**。改进同目标旧卡 → 保留 `canonical_key`，`revision = 当前活动版本 + 1`；新目标才用新 key。
2. **新卡命名**：`ch03.interview.mNN.<topic>.001`；**position = 1000 + 模块号×100 + 序号**（避免打乱旧卡排序，旧卡最大 position 为 98）。
3. **不追求固定题量**，每节补 2–6 张目标缺口卡；综合题拆成单点评分卡，完整串联框架写进模块文档。
4. **关联关系不放进 `concept_keys`**（它参与兄弟卡同日避让调度），改用独立文件 `content/ch03-knowledge-map.json`，类型限 `prerequisite / compare / extension`，前置不得成环、不得悬空。
5. **内容标准**沿用 `docs/specs/question-and-answer-quality-standard.md`：`answer_short` 结论、`required_points ≤ 3`、`explanation ≤ 1000 字符`（实质机制+案例+面试追问）、`pitfalls` 边界；30–90 秒指核心回忆评分，不要求背完整解析。
6. **发布链**沿用 `validate → diff → publish → verify`，脚本只读 `.env.local`；发布 RPC 仅 service_role，绝不触碰复习状态/事件。
7. **状态分层**：卡片入库成功 ≠ 前端展示可用 ≠ 线上已部署。三者必须分别记录。

---

## 6. 待办（按优先级）

### P0 — 内容生产（未完成，工作量最大）
- [ ] 26 节逐节：读取原文 → 登记原生 checklist（447 条逐条分流）→ 判定旧卡复用/修订 → 补新卡。
- [ ] 每节产出：`docs/card-production/ch03-interview/mNN.md`、`mNN-coverage.json`、`mNN-relations.json`、`content/batches/ch03-interview-20260915-mNN*.json`。
- [ ] 每节内容需含：知识点→理解目标→应用能力→面试考查方式、前置/相近/延伸、综合面试题与分层参考回答、逐卡具体审校、未覆盖项及理由。

### P1 — 关联功能（未完成）
- [ ] 建立 `content/ch03-knowledge-map.json`，合并 26 节 relations，校验无自关联/重复/悬空/成环。
- [ ] 前端：在共用 `Answer`（`src/components/studio.tsx`）下方展示关联卡（类别+标题+理由），支持打开详情与跳转 `/study?card=<id>`；**跳转不得计为完成**。
- [ ] 补测试并跑 `npm test`、`npm run typecheck`、`npm run build`。

### P2 — 发布与验收（未完成）
- [ ] 主代理逐卡审校（作者自检不能替代主编审校）。
- [ ] `content:validate` → `content:diff` → `content:publish` → `content:verify`，逐批执行；失败即停并保留真实状态。
- [ ] 发布后用 `scripts/ch03-inventory.ts --after` 生成快照，核对数量增量与学习记录仍为 0。
- [ ] 真实页面展示验收（**不提交学习评分**）；线上部署需用户明确授权。

---

## 7. 已知阻碍与风险

1. **子代理配额曾 429 失败**（2026-09-15），并行生产方案不可用；改为主代理串行、分节保存。
2. **旧文档状态陈旧**：README 仍写 59 卡、交接文档称「尚无部署」但线上已有 Vercel 页面；以 `docs/verification/ch03-quality-review.md` 与本次基线为准。
3. **Git 进度落后**：`main` 最新提交为 2026-09-09 的 `189959f`；质量批次、生产/验收文档、解析展示等均为**未提交**状态，不能视为已推送或已部署。
4. **旧 7 项延期 + WordPiece 训练细节部分延期**仍未解决（涉及模型许可、Scaling Law、涌现、压缩与 MoE 充分来源）；本轮改为「可核验的许可准入方法」，不考当前具体产品许可。
5. **前端线上显示缓存问题**：外部发布后浏览器 bootstrap 内存快照不刷新（曾出现课程卡数 0，reload 后恢复）；自动失效未实现，属后续改进。
6. **未授权事项不得绕过**：登录/评分等真实操作需用户明确授权；未获授权时只做只读核对并如实记录。

---

## 8. 续做建议（下一位接手者）

1. 先读 `docs/specs/ch03-interview-completion.md`（本轮合同），再读 `artifacts/ch03-interview/source-index.json`。
2. **从 0 卡的 10 节开始**（3.13/3.14/3.15/3.16/3.18/3.20/3.21/3.22/3.24/3.26），收益最大。
3. 每完成一节立即保存 md/json/batch，并跑 `node --import tsx scripts/content-validate.ts --batch <file>`（node 绝对路径：`/Users/klein/.workbuddy-ai/binaries/node/versions/22.22.2-2/bin/node`）。
4. 需要外部事实时用 WebSearch + WebFetch 第一方文档，并在模块文档记录 URL、核对日期、支持的具体结论；本地原文不自动等于事实正确。
5. 全部批次发布后再做前端关联功能，避免关系引用到未发布的 key。

### 建议调用的技能（Suggested skills）
- `tencent-docs-routing` — 若需要生成/编辑 Word、PPT、Excel 交付物（如面试题库导出）。
- `find-skills` — 若遇到能力缺口（如需要额外自动化/浏览器验证能力）时先搜索，不要直接说做不到。
- `agent-browser` — 需要真实浏览器登录验收页面展示时（**须先获用户授权**）。
- `product-management-workflows`（当前 Expert 自带）— 用于「知识点→能力→面试考查」框架与优先级判断。

---

## 9. 敏感信息说明

本交接文档**不包含**任何密钥、访问码、数据库连接串或个人信息。
`.env.local`、`import.env`、`data/private/` 已被 `.gitignore` 排除；发布所需凭据仅由脚本从本地读取，不得写入任何文档或提交。
