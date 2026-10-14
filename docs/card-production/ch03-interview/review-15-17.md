# 3.15–3.17 独立内容复核

日期：2026-10-01。审阅者未参与这三模块编写；检查最终JSON共20张（5/5/10）、模块母题/实践/八维台账、coverage和relations。仅写审阅意见，未改批次、未发布、未评分。

结论：M15、M16可以保留核心设计；M17有1项发布前阻塞（新增卡重复），另有2项题答/评分对齐建议。主编已经删除M15 trace重复卡、将structured-response改为两策略机制、将M17 RAG组合改为层级关系，这些修订均有效。

## 发布前阻塞

### B1：M17 structured-data-action 与 C06 重复，应合并复用

对象：`ch03.interview.m17.structured-data-action.001`。

- C06正面已经问“模型输出了工具名称和参数，是否代表业务操作已经完成？怎样判断真实完成？”，必答为生成与执行分离、真实业务结果证明完成。
- 新卡问“用了Function Call，就已经提交报销”是否成立，第二必答仍是JSON/调用建议不证明提交、须真实执行链；从退货改成报销不形成新评分目标。
- 新卡第一点“提取可无副作用”有补充价值，但已经由M15 structured-response的ToolStrategy数据承载机制及母题解释；可保留在M17母题/原题纠错，不必再新增一张核心卡。
- 新卡answer_short开头“工具调用产生待执行的动作请求”也容易与后半句“工具策略仅做结构化提取”形成分类歧义。工具调用可以承载结果数据，不能把所有调用都定义为外部业务动作。

最小修改：删除这张未发布新卡；其目标映射改为C06，加上需要时复用M15 structured-response及已发布 `ch03.prompt.json-validation.001`。保留M17母题中的数据/动作区别；原生问题O10“用了Function Call还需要Prompt吗”还应复用 `ch03.llm.application-routing.001` 或已有Prompt职责卡，不用删除卡后仅留api-fit代表全部意图。

同步更新M17 coverage中O10/O11/O45/O51及母题短卡清单、逐卡自检、新卡数量；M17关系中该卡→C06和M15关系中structured-response→该卡要删除或改为实际保留目标。否则会产生悬空引用。

## 题答与评分建议

### S1：M17 missing-arguments 必答中的可信身份属于未提问目标

正面仅问酒店日期/酒店ID缺失时默认与澄清；第二必答却额外强制“身份等可信参数由服务端提供”。这项要求虽然正确，但不是正面要求的酒店偏好/默认判断，也与C07现有身份授权目标重叠。建议把第二点缩为“低风险默认须有明确规则、可向用户说明；关键日期/酒店选择不能猜”，身份参数保留为解析/可选追问。这样答清全部正面动作的学习者不会因未提身份被判不掌握。

### S2：M16 centroid-classification 的机制复述应在正面直接提出

当前正面已给“每类标注样本汇成中心、选最近类别”的过程，实际只问是否自动归类；第一必答又强制完整复述标注→编码/汇聚→距离分类。建议在正面补“这一分类流程怎样工作”，或将第一点从强制复述缩为“类别中心/最近关系只是相对匹配信号”。第二点的多意图/未知类/拒识是清晰的核心缺口，无须新增卡。

## 逐卡独立判断

| 模块/卡 | 判断 | 具体依据与边界 |
| --- | --- | --- |
| M15 framework-boundary | 通过 | 明确区分LangChain应用封装、LangGraph状态编排、LangSmith追踪评估；未把框架当模型或业务质量保证。LangGraph/LangSmith为外部补充，本地L11–21仅为LangChain概念锚点，卡内已标第一方。 |
| M15 model-adapter | 通过 | 核心新增是统一接口与实际消息/能力契约的区别；与通用模型选型卡的质量/成本比较有交集，但第一必答提供独立接口边界，不建议仅凭共享“回归测试”词删卡。 |
| M15 fork-join-contract | 通过 | 真并行/等待全部的前提、关键路径、分支失败状态与汇总验收对齐；并行2/8/5秒明确编辑假设。它是正文应用机制，不要求背旧Chain类名。 |
| M15 thread-memory | 通过 | checkpointer、thread恢复及归属校验有具体机制；区分会话持久化/租户隔离/长期存储，区别于泛泛“记忆新鲜度”。客户端随机thread不能代替服务端授权边界正确。 |
| M15 structured-response | 通过 | 新版正面及三必答覆盖原生约束、ToolStrategy Schema/参数承载、错误反馈/抛出；已经与通用JSON事实校验分开。90秒合理，不背SDK参数。 |
| M16 centroid-classification | 建议S2后通过 | 类别中心和最近相对排序机制正确；多意图与未知类可暴露真实误分。正面是否要求机制复述需收紧。 |
| M16 semantic-dedup | 通过 | 去重改变证据集合、聚类只组织同主题，两者不同；否定/区域/版本反例充分。没有把固定95%或余弦分数当重复概率。 |
| M16 content-recommendation | 通过 | 已有观看信号可能是必修/搜索失败，内容相似不等于兴趣或任务价值；与3.2冷启动卡“缺少历史信号如何起步”不是同一情境机制，可保留。 |
| M16 cross-modal-alignment | 通过 | 同形状与配对训练对齐分开；图文负例和精确SKU字段正确。与3.10同模态换模型迁移有相关前提，评分对象不同；本批M20已复用此卡，无需重复。 |
| M16 score-calibration | 通过 | 分数非概率，答案支持关系/困难负例/误答代价形成门槛；区别于3.10数学度量兼容。余弦范围应按非零向量理解，非零条件可留解析，不必额外必答。 |
| M17 C06 | 通过 | 保留旧身份修订；模型请求、真实执行、完成凭证对齐；异步200仅接收不等于完成，客户端/托管执行端未混为本地后端。 |
| M17 C07 | 通过 | 可信身份与对象范围两项直接对应正面；工具隐藏只是减少误选，不能构成授权保证。旧卡补强有必要，无须新增同义权限卡。 |
| M17 schema-contract | 通过 | 正面查询/提交混淆与职责、description、参数单位/范围及后端业务约束对应；没有把Schema结构校验写成意图/业务可执行保证。 |
| M17 missing-arguments | 建议S1后通过 | 默认/澄清机制及required不保证先追问正确；可信身份应转可选，避免评分越出正面。 |
| M17 structured-data-action | 阻塞B1 | 大部分评分复述C06执行边界；剩余“仅承载提取”由M15框架策略及母题承接，建议删草稿并改映射/关系。 |
| M17 rag-tool-composition | 通过 | 改版清楚区分RAG流程与Function Call请求机制，search_policy示例可以同时成立；已区别于旧application-routing用途分工，不强迫RAG只静态文档或调用只实时写动作。 |
| M17 call-result-correlation | 通过 | 两必答分别对应异步结果按标识关联、依赖仓库ID后再查运费；标识不等于业务幂等键的反例很具体。 |
| M17 api-fit | 通过 | 低频高价值和接口缺SKU两个前提足够，比例门槛非通用；缺能力不能靠模型补出，普通集成/缩任务边界为合理替代。 |
| M17 poc-failure-layers | 通过 | 正面四层责任均在答案展开，不只统计API200；分母和非happy-path要求有具体否定参数坏例，区别于3.12总体任务指标。 |
| M17 call-budget | 通过 | 比通用Token优化增加模型往返、工具结果、API/重试和执行关键路径；与M15并行分支契约有局部交集但整体评分目标不同。 |

## 台账和引用边界

1. 三模块本地source_hash与当前来源一致；抽查所有卡的引用主题与行范围，未发现跨课引用或错误主题。M15/16没有原生勾选清单，台账记录0；M17原生10条记录10，没有把55/59/79条正文/编辑登记混作原生清单数量。
2. M15 structured-response与thread-memory的checkpointer/两策略细节不在本地原文锚点中，依据来自第一方更新；批次解析及台账已标清这一点。现有字段source_refs只承载本课不可变来源，不代表本地这些行逐字包含外部细节。
3. 一些宽泛正文行动仅映射短卡，例如M15 O50“与研发高效协作”、O51“发现产品机会”、M17 O52“模型决策+专业算法”。短卡提供组成知识，不能据此宣称行动能力已完整验收；应保持母题/实践设计及执行0的口径，必要时在对应reason补“组成能力，完整产物由T1承接”。这不需要再增卡。
4. 母题完整串联了模型/框架/执行责任及异常路径，实践明确未执行；没有发现拿模拟流程或作者自检当真实业务实验。作者逐卡全16分不能直接转作独立审校分，本报告按具体问题判定。

## 本次小范围第一方复查

- [LangChain structured output](https://docs.langchain.com/oss/python/langchain/structured-output)：复查ProviderStrategy/ToolStrategy能力选择、结构收集与验证、handle_errors反馈/抛出。支持最终卡的机制描述；不把支持结构化输出的所有提供商/版本视为严格程度完全相同。
- [LangChain short-term memory](https://docs.langchain.com/oss/python/langchain/short-term-memory)：复查线程级状态与checkpointer；用户/租户归属验证是编辑工程要求，不是框架自动授权保证。
- [Claude tool-use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)：复查独立执行端、请求/结果关联与工具使用回路；不要求记tool_use_id等特定SDK字段。

没有重复大规模生态/性能调研。本报告不代表远端预检、发布、逐字段回读或实际学习验收。

## 受审文件快照

以下为JSON文件原始字节SHA-256，便于识别后续编辑已改变本报告对象（不是批次canonical JSON发布hash）：

- `content/batches/ch03-interview-20261001-m15.json`：`eefd20e6ddcc94eb1a3c64b28835e261ea4fe964aa783098edf94031f3c3df9d`；5张。
- `content/batches/ch03-interview-20261001-m16.json`：`b3102b550e9a56ecc82072acdd4c39a2e7e92e2f8b640d79edcbc3b35e2c9445`；5张。
- `content/batches/ch03-interview-20261001-m17.json`：`4ef5e0f4c5afa9bf245dba604378b78966272860c16e9f8d6825e33d8c68bf5a`；10张。

## 主编2026-10-02响应

B1删除structured-data-action新卡并同步覆盖/关系，数据与动作区别由C06/M15母题承接；S1去掉未提问身份强制点，S2正面明确类别中心机制。最终批次须重新validate/预检，后续发布状态见总验收。
