# 第三章逐题面试重构：独立审校 B

审校日期：2026-10-07至2026-10-08。范围及已审模块：11–26，累计137张，全部pass。每卡有具体理由和实际审阅内容指纹，待审模块为空。

依据：`docs/specs/question-and-answer-quality-standard.md`第6.3节及`docs/specs/ch03-interview-completion.md`末尾2026-10-03全量重构/2026-10-07恢复执行约定。对照当前draft、同key活动快照和source-index指向的源文；以学习目标、技术因果、题答评分和安全边界逐题判断。结构、字数、身份字段核对仅为辅助，不是内容通过证据。

## 初审意见（保留历史，当前状态以逐卡表与JSON为准）

### ch03.rag.cost-quality-budget.001

保留入库/在线拆账与质量约束，能解释流量、重试及截短导致返工，STAR无虚构收益；但新增必答项“维护投入”未获核心或解析的实际解释，单位成功成本也未落实为可复现口径，题答评分尚未完全对齐。

- 字段：`required_points[1] / answer_short / explanation`。问题：必答点新增“同时计失败重试与维护投入”，正文实际只解释调用、设施、重试和返工，没有说明维护投入如何计入，也未定义单位成功成本的统计窗口和分子/分母。说“同任务比较”不足以判断这个新增评分点是否答对。
- 修改建议：在核心或解析补一句：同一统计期内把入库更新、在线调用/设施、失败重试、人工返工及按约定分摊的维护成本加总，再除以按预定义判据成功解决的任务数；或收回没有展开的新增评分要求。缓存的身份/版本限制继续保留。

### ch03.interview.m21.conditional-routing.001

保留标签/State/批准事实分层，明确优先级、未知值兜底和执行端授权，解析与必答点对齐；但原活动解析的补件循环终止/升级条件在新稿完全消失，源文397–413也明确要求循环限制，不符合本次不得简化安全边界的要求。

- 字段：`explanation / pitfalls`。问题：新稿只给未知值补件/重解析/人工兜底，没有保留原活动解析“循环到补件后需有终止和升级条件”。源文397–404要求核对循环次数限制，410–413要求超时、失败、退出出口；兜底重新入循环不等于有限退出。
- 修改建议：补充按进展、重解析/补件次数或等待时限停止循环并升级人工，达到边界不默认支付；可以引用复用既有停止卡，但本卡须保留有限出口这一判断，不必重复整张停止卡。

### ch03.interview.m21.interrupt-resume.001

恢复重跑节点、同thread检查点、稳定幂等与保存失败窗口均保留，STAR诊断和R复测充分，官方Interrupts确认重跑机制；但解析评分把审核身份核验写成加分，追问也未明确审核权限，削弱了人工恢复输入与有效批准的执行边界。

- 字段：`explanation【评分】 / explanation【面试追问】 / required_points[0]`。问题：评分明确称“身份核验为追问加分”，追问只核审核人、案件、批准版本，没有明确核该人的审批权限。能传resume/true不等于该输入来自有权审核者；将执行边界设成可省略的加分项会允许不安全答案合格。
- 修改建议：把恢复输入须核有效身份、权限、案件和批准版本写入恢复必答点或核心边界；评分说明“把true当有效批准”是错误，额外的API写法才可作为加分。无需新增第四必答点。

### ch03.interview.m22.event-render-diagnosis.001

保留thread/run贯穿发出、接收、处理、渲染的诊断目标，错归属与补丁失败分别举例，R覆盖真实断线、迟到及不重放写入；但原解析对保存/回放事件链的日志脱敏与访问限制被删除，在含客户资料和工具载荷的诊断场景中数据边界不完整。

- 字段：`answer_short A / explanation`。问题：A要求保存事件链复现，R要求回放，但删掉原活动解析“日志脱敏且限制访问”。销售助手事件可能含客户输入、CRM资料和工具参数；只说回放不重发邮件没有覆盖数据保存和访问边界。
- 修改建议：在保存/回放步骤恢复最小化、脱敏与受限访问，使用必要标识和载荷摘要定位；允许完整载荷时另受授权控制。保留回放展示不再次执行业务写入的现有限制。

## 来源核对与版本边界

四份原文的实际SHA-256均与source-index及卡内source_refs匹配，引用行范围可读且未越界。m11核对57–186、209–273、316–399、405–419、472–569；m12核对15–127、159–207、220–305、308–356、377–392、413–468；m21核对所有引用段并覆盖Node/Edge、检查点、人工恢复、路由/State、粒度与兼容；m22核对全部引用区间。案例、预算和失败验证是编辑假设或验收设计，不计已发生业务结果。

- m11：原文472–498的“RAG更低成本/最佳组合”，555的无证采用比例及559的固定经验参数没有作为新稿无条件结论。C01保留有条件选型；C03/分块实验保留机制与对照。检索外部输入通常不自动更新生成参数，与[RAG原论文](https://arxiv.org/abs/2005.11401)的参数/非参数存储区分相容；该论文也包含训练，不能推成RAG永不训练。
- C02：[Elasticsearch RRF](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)支持按排名融合不同相关性信号，而不是直接加原始异质分数。精确编号等值约束与BM25相关性区别是稿件明确保留的工程边界。
- C05：[Ragas Faithfulness](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/)核对主张是否由给定上下文支持，[Response Relevancy](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/answer_relevance/)核对回应问题且不评价事实准确性；稿件没有将二者包办资料真实性。改写卡的HyDE辅助性质对照[HyDE论文](https://arxiv.org/abs/2212.10496)，不把生成文档当真实商品证据。
- m12框架职责：核对[LangChain Agents](https://docs.langchain.com/oss/python/langchain/agents)、[LlamaIndex Agents](https://developers.llamaindex.ai/python/framework/module_guides/deploying/agents/)和[CrewAI Agents](https://docs.crewai.com/v1.15.23/en/concepts/agents)。循环、工具/数据与角色/目标侧重有第一方依据，支持可以重叠；不据此推断品牌优劣或普遍能力排名。具体构造器不是本卡评分对象。
- m12循环/选型：[Anthropic Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)支持环境真实反馈、停止条件和可预测工作流基线。外部网页诱导外发的风险对照[Anthropic prompt injection研究](https://www.anthropic.com/research/prompt-injection-defenses)；模型鲁棒性不能作为执行权限保证。其余幂等、恢复、授权、删除传播属于卡片显式的业务设计/验收约束，不声称框架默认替业务实现。
- m21：[LangGraph Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api)确认部分字段更新、默认覆盖、列表追加及图迁移的节点/键/类型兼容边界；空列表不会清追加字段。新版本可以有专门覆盖机制，但稿件只讲覆盖契约，不要求某API字段永久不变。[Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)确认同thread恢复以及中断所在节点从开头重跑，故通知须幂等，检查点不保证外部正好一次。源文221的“不重新计算”不能直接继承为任意节点内部保证。
- m21需改的循环出口来自源文397–404及原活动解析；有效身份/权限属于执行授权条件，不由LangGraph恢复原语自动提供。源文132“理赔必须LangGraph”、105“远超BPM”及示例效率目标未被新稿作为事实承诺。
- m22传输：[WHATWG SSE](https://html.spec.whatwg.org/multipage/server-sent-events.html)确认传输事件/数据，不限文本Token。[AG-UI Events](https://docs.ag-ui.com/concepts/events)核对messageId文本组装、toolCallId参数/结果关联及消息/run终态区别；TOOL_CALL_END不是CRM保存成功证据。[State](https://docs.ag-ui.com/concepts/state)核对快照替换及按序应用JSON Patch，断线后校对基线需要应用实现。
- m22中断版本：截至本次读取，官方Events的RunFinished正文描述optional outcome及interrupt，但同页“Draft Events / Modified Lifecycle Events”仍把中断感知扩展标为DRAFT。不能凭单个章节断言所有SDK已经稳定支持；稿件保留双方版本核对是正确边界。[Tools](https://docs.ag-ui.com/concepts/tools)支持确认工具和关联回复；弹窗、共享状态、按钮白名单都不授予业务执行权限。


## 本轮追加与定点复核

追加m13六张、m14六张、m23二十张；所有卡均已对照活动目标和具体来源，概念/机制/对比使用编号，适用方案/诊断才用STAR。m13、m14、m23实际源文hash均匹配source-index；引用区间逐项核对。

成本卡原意见已修复并定点复核通过，原意见保留于上方历史。C01依据用户指定重新核对三项必答：链路及作用位置、场景维护取舍、真实权限/数据边界均有核心/解析支持，与【评分】一致。其余原三条revise未收到修复，继续保留。

新增需改：`ch03.interview.m23.ab-guardrails.001`，恢复真实有风险实验的业务授权和相应风险审查边界，依据原活动解析及源文1658；不要求所有场景机械加审批。

m13第一方核对：[Agent Skills格式](https://agentskills.io/specification)支持SKILL.md必需、资源脚本可选；[OpenAI函数调用](https://developers.openai.com/api/docs/guides/function-calling)、[LangChain Tools](https://docs.langchain.com/oss/python/langchain/tools)、[Dify工具节点](https://docs.dify.ai/en/cloud/use-dify/nodes/tools)确认工具请求/应用执行、调用契约及节点接入，不把宿主术语当通用兼容协议。使用[OpenAI Docs技能](/Users/klein/.codex/skills/.system/openai-docs/SKILL.md)仅作官方事实核对，未调用API。

m14：[Anthropic上下文工程](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)支持每次推理上下文、轻量指针与按需加载的任务取舍；[Embedding指南](https://developers.openai.com/api/docs/guides/embeddings)定位相关性表示，不提供普通检索向量无损还原字串的契约。源文214/223的解码和固定压缩率、532的无证70%没有被继承。

m23分类/回归：[scikit-learn评测](https://scikit-learn.org/stable/modules/model_evaluation.html)核对概率损失、曲线、平均与回归定义；[Clustering](https://scikit-learn.org/stable/modules/clustering.html#clustering-performance-evaluation)核轮廓a/b及ARI机制。计算独立复算3/5、3/10、999误报、MSE/RMSE/MAE与R²倍数，无错误。源文Micro等同Accuracy、MAE不区分大小、MAP要求用户看完等过强句未沿用。

文本指标对照[BLEU论文](https://aclanthology.org/P02-1040.pdf)、[ROUGE论文](https://aclanthology.org/W04-1013.pdf)、[BERTScore论文](https://arxiv.org/abs/1904.09675)和[Hugging Face PPL](https://huggingface.co/docs/transformers/perplexity)；相似度/语言预测不证明事实。检测对照[COCO评测实现](https://github.com/cocodataset/cocoapi/blob/master/PythonAPI/pycocotools/cocoeval.py)，IoU匹配与置信扫描、阈值/类别聚合分开；Dice同集合单调关系复算正确。

漂移新增严格定义对照[Covariate Shift论文](https://jmlr.org/papers/v8/sugiyama07a.html)和[Label Shift论文](https://arxiv.org/abs/1802.03916)；KS核对[SciPy](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ks_2samp.html)。输入分布信号不等于质量失败或自动重训依据；0.25以及其他示例报警线均保留场景校准条件。A/B授权意见来自源文1658，不依赖外部网站推断。


## 追加m15–17与m24

25张已逐卡核对目标、核心、必答点、解析追问、安全及来源，均通过。源文hash匹配，引用区间已读，未照搬固定能力等级、比例、阈值或成本排行。

m15核对[LangChain概览](https://docs.langchain.com/oss/python/langchain/overview)、[短期记忆](https://docs.langchain.com/oss/python/langchain/short-term-memory)与[Structured output](https://docs.langchain.com/oss/python/langchain/structured-output)：持久保存不授权线程，原生约束与ToolStrategy有不同能力及有限错误反馈条件。m16对照[CLIP](https://arxiv.org/abs/2103.00020)配对训练与[Paraphrase Mining](https://sbert.net/examples/sentence_transformer/applications/paraphrase-mining/README.html)候选检索，不把同维度/归一化当语义对齐、近邻当事实等价。

m17交叉核对[Claude工具文档](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)及已读OpenAI官方函数调用：客户端和托管执行不同，关联ID不替业务幂等，Schema不替业务授权。m24对照[ReAct](https://arxiv.org/abs/2210.03629)与已核LangGraph Graph API/Interrupts，保留控制层次、受限调查、人工批准版本与节点重跑；平台表未当当前真实能力证明。


## 原四条意见定点复核完结

成本、m21条件路由、m21中断恢复、m22事件诊断的原四条意见均已逐卡复核修复并更新指纹，原具体问题保留在历史段落。C01链路/权限/外部服务数据/维护取舍的三项一致性保持通过。新增A/B授权边界仍需主编修复；其他已通过卡没有重新整组审查。


## 2026-10-08 增量核对

追加 m18–20、m25 共30卡，累计126卡；m26待独立审查。逐卡核对活动快照、引用源段、核心/必答点/解析/评分，写入的是实际阅读内容指纹。

m23 ab-guardrails已定向复核并关闭授权边界意见：实际有风险实验恢复业务授权及风险审查，缺条件先离线/受控验证；没有把所有无风险实验都增加审批。

新增需改：ch03.interview.m18.task-lifecycle.001。稳定生命周期机制正确，但旧状态字面未注明版本；核心宜用概念状态，解析注明0.3标签与1.0 TASK_STATE_*的表示差异，具体接口按约定版本核对。

来源核对：[A2A现行规范](https://a2a-protocol.org/latest/specification/)及[任务生命周期](https://a2a-protocol.org/latest/topics/life-of-a-task/)，[MCP架构](https://modelcontextprotocol.io/specification/2026-07-28/architecture)与[授权](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)。m18的Send Message幂等不被保证、取消尝试不等于业务回滚；m19区分Host/Client/Server、协议授权与业务权限、stdio与HTTP，未把工具发现当分布式事务。

m25对照[G-Eval论文](https://arxiv.org/pdf/2303.16634)、[MT-Bench论文](https://arxiv.org/abs/2306.05685)、[Cohen Kappa文档](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.cohen_kappa_score.html)、[LangSmith评估概念](https://docs.langchain.com/langsmith/evaluation-concepts)。概率加权分数不是事实正确概率；位置交换只检查稳定性；Kappa保留边际分布和Pe=1边界；参考无关不等于无需证据。成本/缓存/级联卡保留失败分母、版本身份与双向抽审，无固定比例或排行。


## 2026-10-08 m26逐题核对与收口

新增m26的11张已全部逐题核对原活动目标、全部引用源段及当前内容，共完成B组137卡。源文3.26-FDE-Ontology.md实测SHA-256与source-index及卡片引用一致（bc06c7d23e21ef7d7097a8b9f4b6a2e76dc343110adec7722fa661e93ea76086）。保留源文出处同时纠正其自建实现与官方定义混写，未把医疗字段/年限、固定数量门槛或关系衰减数值纳入评分。

第一方核对：[Ontology overview](https://www.palantir.com/docs/foundry/ontology/overview/)、[Action types overview](https://www.palantir.com/docs/foundry/action-types/overview/)、[Functions overview](https://www.palantir.com/docs/foundry/functions/overview/)、[Function-backed actions](https://www.palantir.com/docs/foundry/action-types/function-actions-overview/)。动作定义变化及副作用，函数提供业务逻辑，函数支持动作属于组合；草稿核心/必答/解析/评分已同步区分。原Function=ActionType、ConfirmLevel、runner注册表及Event Bus循环均未再冒充通用官方接口。

权限与关系另核[Object permissioning](https://www.palantir.com/docs/foundry/object-permissioning/overview/)、[Link types](https://www.palantir.com/docs/foundry/object-link-types/link-types-overview/)。资源Schema与实例/关系数据分层，动作提交还需现行授权；同端点可有不同职责关系，双向遍历不用重复维护同一事实。新稿保留后端租户身份、撤权缓存和异步路径，复合动作保留逐步结果/幂等/失败恢复，确认版本不可被AI覆盖，外部归档须真实回执。

截至本次收口，m23实际有风险实验授权/风险审查修复已通过；历史四处交回意见均已定向复审关闭。唯一未关闭内容意见是m18 task-lifecycle状态字面版本口径，详见JSON findings；没有机械更新已通过卡的指纹。


## 2026-10-08 最后定向复审

m18 task-lifecycle：实际阅读修复后的完整卡，对照上次内容，正面/核心中文机制与解析0.3旧标签、1.0 TASK_STATE_*表示差异一致；三项必答及评分仍考中断/终态、关联和新任务。有限历史/留存权限、即时Message、报价完成不等于批准均保留。版本口径意见关闭。

C01：实际阅读最新整卡，新增训练样本、配置/计算资源、模型版本/回归及人力迭代时间，并同时计算RAG资料治理、检索调优和权限工程。以上展开已有维护取舍评分；required_points、核心与解析评分三项一致，未增加隐藏考点。按每周政策场景比较，不宣称微调普遍更贵。授权资料→版本权限索引→按验证身份检索现行条款→证据片段给模型生成链路、外部嵌入/重排/生成数据去向、权限缓存撤销和留存边界保留完整。

新增技术投入描述对照[OpenAI监督微调流程](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)及[微调最佳实践](https://developers.openai.com/api/docs/guides/fine-tuning-best-practices)：数据准备、训练作业、超参数、模型标识和独立评估/迭代属于实际工程工作。人力与时长为场景成本比较维度，不引用固定数值或承诺结果。使用通用机制，未把该厂商具体产品可用性或API字段变成评分目标。

m26共11张已独立逐题核对并通过，详见前文第一方证据及每卡理由。本次仅m18 task-lifecycle与C01定向更新指纹和理由；所有137张当前完整内容指纹核验匹配，未机械更新其他pass指纹。当前无需改key、无pending。只修改review-b.json/.md，accepted稿和发布动作由主编处理。

## 逐卡结论

已审模块11–26，共137张；pass137、revise0，pending为空。以下当前状态覆盖前文历史审查状态。

| 模块 | canonical_key | 结论 | 具体理由 |
| --- | --- | --- | --- |
| 11 | C01 | pass | 定向复核最新版整卡：解析新增训练样本、训练配置/计算资源、模型版本及回归的技术投入与人力迭代时间，也明确RAG资料治理/检索调优/权限工程，场景比较无固定成本排行。原政策授权接入→版本权限索引→验证身份检索现行条款→片段给模型带依据生成链路、嵌入/重排/生成数据去向与撤权/日志缓存边界均保留。三项required_points对应核心和评分，新增解释展开已有维护取舍，不增加隐藏评分条件；R为验证计划，无虚构实测。 |
| 11 | C02 | pass | 保留语义/词项互补、融合和单路基线目标；编号每点解释信号作用、异质分数及分查询验证。A-17/A-71反例说明BM25不是等值过滤，追问能定位编号切片退化；未把混合当准确性保证。 |
| 11 | C03 | pass | 保留块大小取舍目标，编号解释小块的聚焦/关系断裂、大块的混主题/输入负担及局部Overlap代价；解析包含编码长度与最终预算边界，追问否定“召回更全必然更好”，不以固定经验参数代替任务验证。 |
| 11 | C05 | pass | 保留忠实度与相关度辨析，以保修/退款两方向反例解释二者独立，新增来源真实性边界与Ragas定义相符；三个编号均有判断对象，追问说明错资料仍可能忠实，未用引用数量或单分数代替质量。 |
| 11 | ch03.interview.m11.rag-lifecycle.001 | pass | 保留完整离线/在线机制与输入/权重区别，上传未入索引和召回后条件被裁剪两例分别解释失败位置；核心包含版本/权限和最终输入，追問说明政策更新需验证同步，“通常”未排斥带训练的RAG研究方案。 |
| 11 | ch03.rag.chunk-experiment.001 | pass | 保留结构切分实验目标，A说明如何保留前提、控制同资料/查询/下游变量、核对最终输入，R同时约束噪声与资源；解析区分局部Overlap和跨章关系，追问给出多设备拆分方案，无通用最佳参数。 |
| 11 | ch03.rag.conflicting-sources.001 | pass | 保留原题制度冲突裁决目标，STAR按范围/生效、权威/替代、缺证据处理推进，解释相关性与制度效力不同；500/800明确是假设，追问覆盖同时有效的情形，R是检验而非已实现额度。 |
| 11 | ch03.rag.context-compression.001 | pass | 保留有损压缩诊断目标，候选/压缩/最终输入三级对照支持必答点；核心说明资格原句及关联例外为何保留，解析用拆封反例区分流畅摘要与支持事实。R同时比较质量和输入收益并允许回退。 |
| 11 | ch03.rag.cost-quality-budget.001 | pass | 再次定向复核当前整卡：相较已复核修复稿，仅R中“比較”改为“比较”；同统计期完整成本分子、成功分母、维护分摊/不重复计费/零成功、缓存权限版本及质量回退均保留，核心/必答点/评分仍一致，更新当前内容指纹。 |
| 11 | ch03.rag.rewrite-constraint.001 | pass | 保留硬条件不被改写吞掉的诊断目标；STAR有原问逐项对照、结构化过滤与语义/词项分工、缺字段核实和边界回测。解析警惕“以下”变“左右”，HyDE仅作检索辅助，未将虚构型号价格作为依据。 |
| 11 | ch03.rag.source-ingestion-loss.001 | pass | 原PDF例外丢失目标保留；诊断STAR逐层追到解析、块、候选和实际请求，区别提取失败与关联丢失，按根因重处理并确认索引；正反商品回测和追问都有明确证据，未让模型猜私有条款。 |
| 11 | ch03.rag.update-deletion.001 | pass | 保留文档删除传播目标，按ID/版本追派生块索引，并区分缓存和会话历史；解释反复重建为何不能修历史输入，R含旧问题回读、新版本可用及同步窗口。删除历史与不再作为现行依据的产品边界清楚。 |
| 12 | ch03.agent.ambiguous-tool-result.001 | pass | 保留超时未知与防重复写目标，STAR区分发送/执行/响应，按查回状态分成功、未执行、未知，再复用稳定标识；解析说明已建单丢响应窗口，追问查询也超时就暂停，R要求真实单据回读，补偿仍受授权约束。 |
| 12 | ch03.agent.autonomy-release.001 | pass | 保留搜索与支付分开验收的目标，A明确旅客行程金额退改与恢复、可审查交易和实质变更授权；解析以价格变动解释旧确认边界，追问减少已授权低风险确认，R用误支付/超时/接管验证，不宣称全自动必然终点。 |
| 12 | ch03.agent.loop-stop-budget.001 | pass | 保留反馈循环及成功/失败停止目标，A按新增证据判断进展、换查询并由执行器限制次数时长费用；解析说明ReAct观察改变决策，追问预算到界交付已核实部分。多分支预算汇总边界保留，R没有虚构效率成果。 |
| 12 | ch03.agent.memory-freshness.001 | pass | 保留当前硬约束覆盖历史偏好及可控持久化目标，A提供来源/时间/范围、事实与推断区分、更正删除与用户隔离；解析避免本次上午要求污染永久偏好，追问追踪摘要缓存删除传播，记忆不扩大支付外发授权。 |
| 12 | ch03.agent.reflection-evidence.001 | pass | 保留反思候选与真实修复证据目标，诊断STAR说明同模型盲点、实际输入输出测试及原失败回归；空输入实例和追问具体，R仅支持测试覆盖范围。编译、自评和未测集成边界均清楚。 |
| 12 | ch03.agent.task-fit.001 | pass | 保留固定路径与反馈驱动调查的选型目标，STAR有确定性基线、动态观察用途和结果/工具/权限前提；追问让固定分支充分时先用工作流，R要求有限任务证据。工具调用、RAG、记忆均未被误作Agent自主性充分条件。 |
| 12 | ch03.agent.tool-result-trust.001 | pass | 保留外部内容信任边界与跨工具泄漏目标；A同时限制客户读取和收件对象，并追踪数据流，解析解释只读查询组合邮件仍会外发。R测试真实动作及正常对照，拒绝文本不当作防住，日志不复制全部敏感数据。 |
| 12 | ch03.agent.trace-task-metrics.001 | pass | 保留结果/合规/资源三个验收面，A具体记录关联ID、版本、真实结果和重试用量，失败超时不被删分母；两个正确报告但读取权限不同的例子解释平均分遮蔽风险，追问区分独立成功与接管后完成，敏感轨迹最小化。 |
| 12 | ch03.interview.m12.agent-component-roles.001 | pass | 保留规划/工具/记忆/反思的职责及反馈链，编号解释计划与真实行动区别、检索记忆与参数训练区别；购买日期、拆封状态、地区错误例子串起组件。追问允许固定工作流，未把四组件当每个Agent必备或记忆当授权。 |
| 12 | ch03.interview.m12.agent-framework-roles.001 | pass | 三个框架及组织侧重均保留，核心解释循环、数据工具接入和角色任务协作，并限定重叠与版本。退款例子说明运行设施不能决定业务权限/完成事实，追问给出单Agent基线，第一方文档支持职责而非品牌排行。 |
| 13 | ch03.interview.m13.intent-routing.001 | pass | 保留规则/模型/混合路由及否定意图目标，各编号有速度、可控、语义误判和延迟取舍；本次写草稿且禁止外发明确，混合不固定规则优先。解析用同词不同动作解释错误，追問用误动作代价判断顺序，执行独立校验没有退化。 |
| 13 | ch03.interview.m13.orchestration-dependencies.001 | pass | 保留四种编排、部分失败和硬约束目标，STAR按天气独立/建日程依赖用户选择安排并行与串行；循环有成功、无进展和预算停止，保留北京结果及时间，只重查失败部分。追问禁止擅自涨预算，R验证未选择不能创建，无虚构实测。 |
| 13 | ch03.interview.m13.platform-vocabulary.001 | pass | 保留OpenAI函数工具、LangChain Tool、Dify节点与知识流程包区别，编号说明模型请求由应用执行、框架工具接入和宿主凭证职责。第一方核对支持这些机制，迁移要映射参数结果错误身份关联，追問有允许/拒绝验证；未依赖旧Assistants或唯一BaseTool入口。 |
| 13 | ch03.interview.m13.result-contract.001 | pass | 保留稳定成功/失败/调用关联契约目标，编号解释城市错误澄清、临时故障有限恢复和写入未知先查状态；并行两城错贴与默认晴天反例具体。字段名不硬背成协议，追问要求输入/权限/临时/未知类别，错误文本不升级指令。 |
| 13 | ch03.interview.m13.skill-layers.001 | pass | 原能力封装/流程包双语境目标保留，编号解释SKILL.md知识资源和可执行入口并非一一对应；退货包例子逐层区分加载、请求、宿主执行、业务回读。Agent Skills第一方格式支持脚本可选，追问与评分同步，包自述不扩大权限。 |
| 13 | ch03.interview.m13.skill-portfolio.001 | pass | 保留功能/执行渠道/风险分类轴及能力粒度目标，STAR对四种产出界定参数、错误和权限，万能工具及每字段工具反例说明两端代价；优先级看价值、错误与依赖，R用覆盖/误选/维护证据而非固定数量，只读隐私边界保留。 |
| 14 | ch03.interview.m14.context-on-demand.001 | pass | 保留按需上下文与调用依赖目标，STAR从当前实现/接口追返回字段的调用方与错误契约，再按路径符号版本粗到细，摘要冲突回原文；login user/account反例解释故障，追问核当前源码和运行，R明确未读边界及按需等待代价。 |
| 14 | ch03.interview.m14.context-record-contract.001 | pass | 保留订单/客服口述/未来制度的时态与权威目标，STAR区分对象、获取/事件/生效时间，回读当前订单并标关系冲突；今天读未来政策不适用于今天的例子有因果，追问允许相关历史，R缺元数据保留不确定，不按最近文本拼事实。 |
| 14 | ch03.interview.m14.context-scope.001 | pass | 保留每次推理实际可见信息以及Prompt/RAG重叠目标，三个编号含指令工具资料历史、指令与背景重叠及检索组织生成；制度例子解释缺资料与任务含糊需不同修复，追问覆盖时间权限预算状态，不照搬RAG只找不组织。 |
| 14 | ch03.interview.m14.context-task-state.001 | pass | 保留长任务硬约束、状态分类和未知付款机制，编号解释早期选择仍决定合法后续、证据ID/版本可回查及超时不证明未执行；丢响应摘要为失败会再付的例子具体，追问核同请求业务状态。无需保留全聊天，但不能抹去真实尝试和副作用。 |
| 14 | ch03.interview.m14.context-utilization-limit.001 | pass | 保留未引用不等于浪费及精简验证目标，STAR建立事实/条件/权限基线，再看实际输入主张与边界对照；拒答不引用权限条款的例子说明引用率不是内在利用证据。R越权即回退，人工基线也可能漏条件，未用固定比例替代内容判断。 |
| 14 | ch03.interview.m14.embedding-codec-boundary.001 | pass | 保留检索Embedding与无损编码区别，编号解释任务相关表示不提供原字串还原契约、应保存受控原文/版本/定位并按权限加载；否定退款条件例子具体，摘要追问指出同样有损。第一方Embedding用途支持边界，未否定专门解码研究或声称固定压缩率。 |
| 15 | ch03.interview.m15.fork-join-contract.001 | pass | 保留并行关键路径与必需支路失败语义，编号说明串行加最慢支路/汇总及排队资源，2/5/8秒是假设而非实测；合规超时不能空列表通过。追问仅重跑仍有效输入的失败支路，停止等待不等于取消下游和写动作去重边界保留。 |
| 15 | ch03.interview.m15.framework-boundary.001 | pass | 保留LangChain应用接口/Agent组织、LangGraph状态编排、LangSmith追踪评估三层目标，编号解释框架不训练模型；ERP新证据与箱/件错误例子说明接入不是质量证明。追问现有直连基线，旧六大模块/市场地位不当现行事实。 |
| 15 | ch03.interview.m15.model-adapter.001 | pass | 保留接口能力与业务行为两类兼容目标，STAR核工具/结构化/窗口/流式再同发票坏例逐字段回归，计重试和人工成本；未知金额填0例子具体，追问说明供应商特有行为迁移成本。R关键切片不达标回退，无接口成功即上线。 |
| 15 | ch03.interview.m15.structured-response.001 | pass | 保留原生约束与ToolStrategy两机制/能力前提，编号说明工具Schema参数由框架校验收集、可仅返回数据、失败有限反馈或抛出。第一方Structured output支持策略和配置差异，追问拒绝重试必成，结构通过不证明合同金额事实。 |
| 15 | ch03.interview.m15.thread-memory.001 | pass | 保留重启丢状态与串用户两个根因，STAR先核持久checkpointer/正确thread，再服务端绑定身份租户并核实际输入；thread=1及进程内保存器分别解释两故障。随机ID不授权、短期与长期不混用，R分别验证连续性和隔离。 |
| 16 | ch03.interview.m16.centroid-classification.001 | pass | 保留标注编码→按类汇聚中心→新工单距离候选完整机制，最近类即使全远仍存在、类别多峰与多意图有实际解释；退款闪退只交技术会漏资金诉求。追问新类先定义样本并回归旧类，不把平均准确率或近邻当可靠单标签。 |
| 16 | ch03.interview.m16.content-recommendation.001 | pass | 保留内容近邻与偏好/岗位学习价值目标，STAR解释必修观看歧义，召回后按权限先修重复覆盖筛排，再比岗位路线基线；采购员退供需求例子具体，R限定预期。点击/完成和能力提升不混为已证收益。 |
| 16 | ch03.interview.m16.cross-modal-alignment.001 | pass | 保留同维不等于语义坐标对齐，编号解释配对训练/兼容编码器输入及配对负例评测；CLIP第一方机制支持，蓝工服防护等级反例解释检索信号不能代替SKU规格。追问归一化仅改尺度，视觉输入能力不等于检索表示。 |
| 16 | ch03.interview.m16.score-calibration.001 | pass | 保留余弦分数性质与支持关系校准，核心给非零向量[-1,1]、困难负例和独立样本错误代价，华南0.9不能支持华东运费的例子具体。追问高阈值仍可放困难负例，正确否定可相关，模型/语料变更复测，无0.8通用概率线。 |
| 16 | ch03.interview.m16.semantic-dedup.001 | pass | 保留近邻候选/事实等价与聚类/删除区别，STAR核地区否定版本后才合并并保留出处，冲突负例与各地区回测支持R；解释同主题分组可保留差异而删除改证据可达性。95%不当重复概率，高阈值/模型相似判断不免原文审查。 |
| 17 | C06 | pass | 保留请求、执行、真实业务完成三层，编号说明客户端/托管执行差异及成功失败未知回传；拒权仍称提交、异步排队200两个例子支撑完成边界。第一方工具文档支持，追问超时先查去重，结构化预填不被当作真实提交。 |
| 17 | C07 | pass | 保留Prompt不构成权限控制及函数/对象两层授权，编号明确可信身份、租户资源与模型user_id区别，角色隐藏候选仍每次执行校验；跨租户order_id和直接旧请求例子解释绕过路径，数据最小化审计保留，评分不靠模型自觉。 |
| 17 | ch03.interview.m17.api-fit.001 | pass | 保留低占比高价值与真实API能力边界，STAR按价值风险替代总成本、盘字段时效状态后补SKU或缩范围；解析解释工具调用不能造明细，追問估算不能当库存事实。10%只题面假设，不继承固定比例/勾选上线门槛。 |
| 17 | ch03.interview.m17.call-budget.001 | pass | 保留完整任务多轮模型/Schema/返回、API/重试成本及并行关键路径，编号有排队尾部及按瓶颈优化；酒店先回但等航班、删仅查询描述造成误调用两例具体。缓存身份时效、写结果不复用、不能编实时余票，追问流式仅改善等待感。 |
| 17 | ch03.interview.m17.call-result-correlation.001 | pass | 保留异步调用关联及仓库依赖，编号按调用ID而非顺序归属，库存价格独立并行、运费等成功仓库字段；解析币种错贴库存的例子具体。追問并行写需业务冲突授权，消息调用ID不替代业务幂等，缺字段不猜仓库。 |
| 17 | ch03.interview.m17.missing-arguments.001 | pass | 保留参数结构与真实意图来源区别，STAR追用户/确认偏好/推断、关键日期酒店澄清及低风险公开默认规则，可信身份不由模型提供；预算每晚/总额税币示例充分。R验证不猜订单，required字段齐全不等于预订许可。 |
| 17 | ch03.interview.m17.poc-failure-layers.001 | pass | 保留选择/参数/执行/结果使用/业务完成分层诊断，STAR记录预期与实际、核执行状态再忠实回答，固定分母覆盖否定多意图故障；closed=true和正确返回后摘要写错分别归因。追问最终成功仍记录首轮重试代价和副作用，API成功不等任务成功。 |
| 17 | ch03.interview.m17.rag-tool-composition.001 | pass | 保留RAG流程与Function Call机制不同层级目标，编号沿search_policy执行检索再把片段交生成解释组合；应用固定检索不需模型选择也成立。出处日期、读检索与写提交职责清楚，追问与两必答对齐，不按数据形态/实时性划互斥。 |
| 17 | ch03.interview.m17.schema-contract.001 | pass | 保留职责描述与Schema业务约束目标，STAR把查询/创建退货拆清，必填类型单位范围加业务端可退量校验；search/create与元/分例子解释动作歧义和合法数字仍错误。近似否定/缺参回测及授权拒绝充分，不以工具数为目标。 |
| 18 | ch03.interview.m18.agent-discovery.001 | pass | 保留Agent Card发现职责，编号对齐技能输入输出范围、共同接口/认证版本、真实性准入和质量验证；件/公斤反例与市场准入追問具体。声明/签名不担保业务质量，名片不放明文凭证，不背旧endpoint/authentication为固定Schema。 |
| 18 | ch03.interview.m18.async-updates.001 | pass | 保留轮询/流式/推送与连接/任务状态区别，STAR按双方能力和在线需求选择，断线先读原任务与产物；新增首次task ID丢失靠持久关联、SendMessage可选幂等、取消后查副作用符合第一方。R断线/重复测试不冒充已回滚。 |
| 18 | ch03.interview.m18.delegation-boundary.001 | pass | 保留Client发起/Server承接与不透明内部执行目标，编号解释任务契约不要求交工具/模型、统一通信不保证报价币种数量与履约；追问无需内部工具清单，固定库存API替代合理，不把A2A当训练/开发框架。 |
| 18 | ch03.interview.m18.message-artifact.001 | pass | 保留Message交流、Part内容、Artifact产物三层，编号解释补地点和报价不按JSON区分；20行再10行例子说明增量追加/覆盖误用，追问按交付契约核条目单位条件。官方允许产物增量，首批非完成，form非跨版本核心类型。 |
| 18 | ch03.interview.m18.parallel-quote-aggregation.001 | pass | 保留各供应商任务、主控等待/失败及Artifact统一口径目标，STAR核数量税费运费币种交期有效期，不猜缺口；已获两家只能条件建议，追问总任务不能抹子状态。R验覆盖范围，未响应非零报价，不承诺全市场最优。 |
| 18 | ch03.interview.m18.protocol-composition.001 | pass | 保留远端Agent委派与ERP工具接入目标，STAR让A2A交换任务/报价、MCP或既有API读自家数据，主控核单位有效期审批、执行端授权回读；供应商内部自治例子具体。R只验接口及业务契约，横纵类比不排除状态或强迫重写。 |
| 18 | ch03.interview.m18.task-lifecycle.001 | pass | 定向复核修复后的完整卡：正面/核心改为中文状态机制，解析明确0.3旧input-required/working标签与1.0 TASK_STATE_*的版本表示差异，实现依双方约定版本核对。等待补充非失败、正确task/context关联、终态不可重启及新需求关联新任务三项核心/必答/评分一致；有限历史/留存权限、即时Message和报价完成非批准边界仍保留。原版本口径意见关闭。 |
| 19 | C08 | pass | 保留Function Call意图、MCP发现交互和应用执行三层，核心沿Host获准工具、意图校验、Client/Server/ERP执行和关联回传讲完整链；get_stock例子及库存0却答100追问具体，协议授权不代对象权限，模型支持不等MCP已接通。 |
| 19 | ch03.interview.m19.discovery-call-loop.001 | pass | 保留连接/版本能力→工具Schema发现→Host获准意图校验→Client真实调用→结果关联回传/使用链，编号每层明确证据；列表未交模型/Server没请求/输入遗漏各有排查。未硬背版本报文，Schema存在不证明后端权限或业务完成。 |
| 19 | ch03.interview.m19.host-client-server.001 | pass | 保留Host应用协调、Client通信、Server能力三个职责，编号有数仓和文档两Client分工，自研/第三方与本地/远程独立；追問多用户须身份隔离授权。模型选工具审批不都归Client，本地连通不扩权限，纠正源文固定维护者。 |
| 19 | ch03.interview.m19.integration-boundary.001 | pass | 保留MCP统一交互不供跨系统事务，STAR按对象记录成功/失败依赖、停合同就绪通知、回读再按授权补偿或接管；不能假装已创建不存在。追问封装仍须后端另实现证明事务，恢复去重与不可逆补偿边界完整。 |
| 19 | ch03.interview.m19.server-admission.001 | pass | 保留关键恢复能力硬门槛与准入试点目标，STAR按任务风险补撤销或缩范围，核版本传输部署认证/对象权限及运维；八查询却不能撤回例子解释覆盖率不替闭环。自研同样试点，80%/Star不通用，许可法律断言未继承。 |
| 19 | ch03.interview.m19.server-primitives.001 | pass | 保留Resource上下文/Tool操作/Prompt模板三原语，编号把指标定义、按日期查询、月报模板对应并说明只读Tool和模板不执行；Host仍组织资料不是自动完整RAG。追问无需凑齐能力，官方机制支持，无读写二分错误。 |
| 19 | ch03.interview.m19.transport-compatibility.001 | pass | 保留stdio进程与Streamable HTTP、SSE可选及版本兼容目标，编号新增HTTP可选授权规范与stdio环境配置路径，经第一方核对一致；进程失败/远程认证例子可定位，追问先工具列表缓存映射，授权不代资源范围且不读取凭证值。 |
| 20 | ch03.interview.m20.recovery-exit.001 | pass | 保留同Embedding换库与隔离恢复目标，STAR导出表示规范ID元数据原文映射、核维度距离过滤兼容、复用条件及追平增删改；下架字段丢失例子说明搜索运行不等业务正确。R恢复窗口回退、禁止复活删除对象，多副本不代备份。 |
| 21 | ch03.interview.m21.conditional-routing.001 | pass | 定向复核修复：正面、核心第二点、必答点2及评分恢复进展/次数/等待时限、停止和人工升级，明确触界不默认支付；模型标签/状态/有效批准分层及执行端材料金额校验保留，来源397–413支持循环出口，不固定通用次数。 |
| 21 | ch03.interview.m21.graph-evolution.001 | pass | 保留节点身份、State名称/类型及业务兼容目标，STAR先盘旧检查点再保留路径/迁移/旧版完成，R使用真实旧检查点并要求回退；金额对象与可选字段追问解释结构兼容不等于业务兼容，代码回退不能撤销外部动作边界保留。 |
| 21 | ch03.interview.m21.graph-execution.001 | pass | 保留State/Node/Edge分工与补件分支目标，编号沿missing_list解释数据、计算、路由及回路；普通代码节点和编译不证明业务规则均明确。Graph API支持机制，金额计算追问有契约/测试理由，未误背源文内建节点分类。 |
| 21 | ch03.interview.m21.interrupt-resume.001 | pass | 定向复核修复：题面/核心A/必答点1/追问/评分同步把有效身份、审批权限、原案件和批准版本设为恢复前提，true只输入而非批准；原thread/检查点、节点重跑、幂等及发送成功保存失败窗口均保留，R加入无权回复拒绝，无虚构实测。 |
| 21 | ch03.interview.m21.node-boundaries.001 | pass | 保留按独立契约/验收/失败策略划界与粒度取舍，STAR解释可重算和写入分开及支付失败牵连短信；四类实际产物支撑解析，追问允许紧密调用合并。R注入失败验证，明确拆节点仍不能消除幂等和外部结果核对责任。 |
| 21 | ch03.interview.m21.state-reducer.001 | pass | 保留原risk/notes数组计算和并发合并目标，明确部分更新保留risk，替换/追加分别给出实际结果；重复备注、错误金额累加和空列表不能清追加字段均有原因。Graph API核对一致，并发无reducer冲突不是最后到达者获胜。 |
| 21 | ch03.interview.m21.workflow-coexistence.001 | pass | 保留AI补件与既有BPM审批支付分工，A先比较既有实现，再按状态/人工等待痛点试图编排，定义案件ID/版本/状态/失败责任；单次检查基线与追问支持可替代方案，R是条件性验证，无案例效率承诺，跨系统事务/授权边界明确。 |
| 22 | ch03.interview.m22.confirmation-contract.001 | pass | 保留自定义INTERRUPT不等于全客户端支持的目标，编号给出确认工具参数、toolCallId回复和运行时等待/持久恢复职责；取消例子及LangGraph追问具体。官方Tools支持确认工具，Events确有Draft扩展，稿件未把草案字段写为稳定必填保证。 |
| 22 | ch03.interview.m22.event-render-diagnosis.001 | pass | 定向复核修复：题面、核心A、必答点2及评分恢复最小标识/载荷摘要、脱敏和受限访问，完整敏感载荷另受授权；终态错归属与补丁失败仍有分层证据，真实断线/迟到与回放不写入都保留，三个必答点与评分一致。 |
| 22 | ch03.interview.m22.event-semantic-layer.001 | pass | 保留SSE传输与AG-UI语义层辨析，编号解释结构化载荷、事件含义及双方适配职责；status=done例子暴露业务含义歧义，FAQ追问给出迁移条件。WHATWG及AG-UI支持机制，未照搬原文“SSE只能文本”或即插即用保证。 |
| 22 | ch03.interview.m22.event-visibility.001 | pass | 保留直接展示/轻提示/受控日志三层目标，STAR按用户下一步判断合并高频信息但保留失败待办；CRM/议程/确认例子具体，追问按影响决定告知。未承诺全部内部思维、固定300ms/2秒普适指标或透明即可靠。 |
| 22 | ch03.interview.m22.generative-ui-contract.001 | pass | 保留组件描述/渲染约定与展示不授权动作目标，STAR以允许组件、Schema、订单金额单位、降级及服务端校验建立完整链；缺单位例子和白名单追问有实际因果，无障碍及不执行任意脚本/HTML的安全边界保留。 |
| 22 | ch03.interview.m22.shared-state-authority.001 | pass | 保留用户草稿、Agent建议、批准版本的写入责任及并发冲突目标，STAR用版本校验阻旧更新，执行端核最终对象和授权；追问按批准粒度处理主题变更，R覆盖迟到和恢复并在冲突未解决时停发送，未把同步当事务或授权。 |
| 22 | ch03.interview.m22.state-snapshot-delta.001 | pass | 保留快照替换、JSON Patch有序更新与断线基线责任，删除再替换数组项例子解释漏补丁为何改错；追问给出先顺序应用再批量渲染，不能丢中间delta。官方State支持，未声称协议自带补放/离线事务。 |
| 22 | ch03.interview.m22.text-event-assembly.001 | pass | 保留messageId独立缓冲与START/CONTENT/END职责，交错A/B例子解释混拼错误，END不结束run及不自动去重边界清楚；追问允许工具继续加载，官方文本事件说明支持，无不适合的项目STAR。 |
| 22 | ch03.interview.m22.thread-run-lifecycle.001 | pass | 保留thread多run、起止事件与业务事实区分，run-A迟到终态不能关run-B加载态的实例具体，刷新追问指出授权读取历史而非ID自动存储。中断outcome明确需核对双方版本，不把RUN_FINISHED当邮件已发或全会话结束。 |
| 22 | ch03.interview.m22.tool-event-completion.001 | pass | 保留工具参数流与执行结果分离，按toolCallId关联结果并区分保存、权限失败及超时未知；客户端此时才调用CRM的明确假设解释END为何不证明成功。官方Events/Tools核对一致，追问要求对象/版本/状态，不用模型总结补造业务事实。 |
| 23 | C04 | pass | 原Recall/Precision计算目标保留，明确3/5=60%和3/10=30%及两种分母；编号解释查询标注范围和未标不等于不相关。解析分别指出漏命中标签与漏全集的影响，追问补多检索器候选而不假装全库真值，重复文档边界保留。 |
| 23 | ch03.interview.m23.ab-guardrails.001 | pass | 定向复核主编修复：pitfalls及解析恢复实际有风险随机实验须在已授权范围并完成相应风险审查，缺条件先离线/受控验证；主指标/代理、预定窗口停止线、随机单位、干扰和区间/业务收益判断均保留，未对所有无风险实验新增审批。原授权意见关闭。 |
| 23 | ch03.interview.m23.cluster-validity.001 | pass | 保留轮廓无外部真值与ARI参考分组目标，核心给a/b公式及样本对偶然一致校正；客户几何分离却无触达策略例子解释指标与运营收益差别。追问Purity每点一簇刷分，单簇/每点簇轮廓及特征距离边界明确。 |
| 23 | ch03.interview.m23.dashboard-alert.001 | pass | 保留战略/战术/运营决策及可行动报警目标，STAR绑定定义基线窗口切片、负责人、证据、降级恢复；退款P99例子串起三层用途，追问F1不能直接换固定收益。两个分类轴不一一对应，R为异常演练与误报校准，没有把示例阈值当行业标准。 |
| 23 | ch03.interview.m23.detection-protocol.001 | pass | 保留IoU定位、AP置信排序/匹配和mAP聚合目标，核心区分固定IoU下PR与跨IoU/类别平均；严格阈值匹配失败和小裂纹下钻有解释，追问看部署工作点。COCO实现支持不同协议不能横比，错类/重复框及无统一安全上线线边界保留。 |
| 23 | ch03.interview.m23.drift-detection.001 | pass | 保留PSI固定分箱、KS累积最大差与KL非对称机制，解释空箱、样本量及零概率约定；新店输入变而质量稳的例子支持调查先于重训，追问窗口/季节/分层持续条件。0.25不写成普适失败线，单变量稳定也不证明联合/条件稳定。 |
| 23 | ch03.interview.m23.drift-types.001 | pass | 保留P(X)、P(Y)、P(Y\|X)区别，新增严格covariate/label shift条件分别对照第一方论文正确；新客比例与催单退款关系例子支持两类判断。追问无实时标签仅监测信号，未拿预测频率、标签改名或直方图直接证明概念漂移/重训需要。 |
| 23 | ch03.interview.m23.multiclass-average.001 | pass | 保留Macro/Weighted/Micro机制与高风险小类目标，等权、支持数权重、先合计计数的顺序清楚；990/10例子解释全漏小类仍可99%总体准确。追問补样本与不确定性，Micro-F1等于Accuracy条件受限，不让Macro平均替代安全类召回。 |
| 23 | ch03.interview.m23.ndcg-gain.001 | pass | 保留等级增益、位置折损、理想归一目标，明确本课2^rel-1/log2(rank+1)与IDCG范围、K和零处理；3级前移与商品缺货例子分开排序与业务结果，追问核gain/标签/候选/并列。未将线性增益实现混算或把NDCG当满意度普遍必要条件。 |
| 23 | ch03.interview.m23.ocr-field-metric.001 | pass | 保留字符/编辑距离与关键字段正确不同单位目标，编号解释插入删除替换及整金额真值/格式/单位，1000.00→100.00一个字符导致十倍错误例子充分。追问对原票币种和业务字段核验，可解析不是正确，空真值/输出不是真值边界保留。 |
| 23 | ch03.interview.m23.perplexity-comparison.001 | pass | 保留真实Token概率到交叉熵指数及可比条件，编号使用自然对数exp与源文2底公式等价；旧客服话术低PPL仍错误的例子具体，追问解释分词粒度改变单位和分母。仍需测试文本、低PPL不保证事实/安全/业务三项均对齐。 |
| 23 | ch03.interview.m23.probability-quality.001 | pass | 保留排序/概率质量/校准目标，编号解释保持排序可保持AUC、负对数惩罚自信错误及概率分桶；非欺诈p从0.6到0.99的真实类概率与loss计算正确，追问要求独立留出评估。总体loss不保证分群校准，概率极化不宣称必然让全部loss变差。 |
| 23 | ch03.interview.m23.r2-baseline.001 | pass | 保留R²负值/业务基线目标，明确SSE与评估集均值SST，-0.2推出残差1.2倍正确；0.9仍须时间留出及可部署季节基线。追问-2对应3倍，恒定真值分母零和特征/泄漏边界清楚，不把R²当0到1准确率。 |
| 23 | ch03.interview.m23.rank-objectives.001 | pass | 保留Hit、MRR、MAP三种检索目标，编号给至少一条、首条倒数和二值AP相关位置精度/相关总数；三条合同依据只一条首位例子说明Hit/MRR可1而不完整。追问下钻多项召回，漏检不删分母、AP@K与检测AP协议不混用。 |
| 23 | ch03.interview.m23.regression-error-scale.001 | pass | 保留两天误差计算和大偏差机制，MSE=50件²、RMSE≈7.07件、MAE=5件正确，编号解释平方/开根与线性惩罚；两天均5件的对照说明分布影响，追问按方向和缺货/库存损失补度量，不跨量纲比较优劣或称MAE不区分大小。 |
| 23 | ch03.interview.m23.roc-pr-threshold.001 | pass | 保留ROC/PR轴与部署工作点目标，核心给FPR/TPR分母和阈值扫描，10万交易约999误报计算正确；解析区分AP与PR梯形面积，追问指出AUC不说明校准。常量分数与硬标签全负不混用，不把高AUC当业务安全。 |
| 23 | ch03.interview.m23.segmentation-overlap.001 | pass | 保留全背景99%像素准确率却前景全漏目标，前景IoU/Dice结果0及分母正确；编号要求按类/图/目标及双空约定，解释大图/背景掩盖。追问Dice=2IoU/(1+IoU)同二值集合单调，未将重叠或Dice替代件级检出。 |
| 23 | ch03.interview.m23.serving-metrics.001 | pass | 保留首Token/完整/端到端、吞吐单位和可用性目标，三个编号均有实际口径；0.3秒/12秒及HTTP200却未查订单解释服务与任务不等价，追问计重试工具人工。TPS事务/Token需明确、P99非最大及固定延迟示例不可通用均保留。 |
| 23 | ch03.interview.m23.text-metric-boundary.001 | pass | 保留BLEU/ROUGE/BERTScore比较对象和事实边界，核心说明裁剪n-gram与长度惩罚、ROUGE变体及上下文词向量；保证批准例子暴露高重叠越界，同义申请暴露低字面分。第一方机制相符，开放题追问用rubric/证据，未重复源文猫句错算。 |
| 23 | ch03.interview.m23.verification-rates.001 | pass | 保留冒名FAR及本人FRR/TAR的不同分母和阈值权衡，编号限定二值口径TAR=1-FRR；宽门槛可多放陌生人、零误放仍需样本量的解释具体。追问要求现场人员光线设备协议，1:1与1:N不混用，不继承金融统一阈值。 |
| 24 | ch03.interview.m24.concept-layers.001 | pass | 保留Workflow组织、State Graph建模、ReAct循环及Agent系统四层区别，编号以退款固定查单/争议调查/主管审核说明共存；图可固定无模型、ReAct可整个图实现。追问有向图可含回路并须终止升级，不照搬互斥/自治等级。 |
| 24 | ch03.interview.m24.failure-policy.001 | pass | 保留暂态通信/格式业务/审核等待不同故障语义，STAR分别有限重试、纠正补信息、挂起接管，解释重发错误输入和等待不产生批准；R三异常注入，缓存须版本时效权限。追问按可行动风险分报警，不三次后自动通过或默认金额修复。 |
| 24 | ch03.interview.m24.human-resume.001 | pass | 保留500→800旧批准失效及超时不授权，STAR保存对象金额证据政策版本、核审批人权限和版本再重审；R覆盖重复回复且获准退款用幂等与真实状态。LangGraph节点重跑副作用边界经第一方核对，追問服务端流水不靠按钮。 |
| 24 | ch03.interview.m24.hybrid-placement.001 | pass | 保留固定SOP/单次理解与受限动态调查选型，STAR限定工具权限预算停止、回交证据未决项给外层验证审批；多源清单已知可固定查询的例子/追问有替代方案。R覆盖冲突和预算，调查不能自定退款政策，Workflow同样需授权校验。 |
| 24 | ch03.interview.m24.llm-shapes.001 | pass | 保留调用结构、Few-shot示例、CoT推理与ReAct行动不同轴，编号解释一次可含示例、行动需观察，再选文本充分的一次抽取/校验；缺政策可先固定查询，追問推理文本不代外部动作证据。无策略成本排行或Few-shot格式保证。 |
| 24 | ch03.interview.m24.platform-proof.001 | pass | 保留按业务必须能力与目标版本部署选型，STAR列状态授权观测导出、真实批准/改金额/重启故障验证及全成本退出；云Demo与内网跨日要求的例子具体。追问缺证据给条件结论，不把旧Dify/Coze/LangGraph表当能力排名或实跑证明。 |
| 25 | C09 | pass | 保留Dataset/Runner/Grader/Reporter四职责及证据流，编号明确输入上下文、实际输出异常版本交评分再切片报告；任务ID/运行ID/系统评分版本可追溯。退款承诺及超时例子充分，追问一脚本可做、不为组件拆平台，裁判不能另生成被测答案。 |
| 25 | C10 | pass | 保留RAG最终输入而非候选召回的归因目标，STAR分解析检索缺失、过滤截断、生成误用及过期源，候选第8条截断/保证批准两例具体；R同坏例正常边界回归，Recall/忠实度或temperature=0不免责，换模型只是对照。 |
| 25 | C11 | pass | 保留双向比较按身份还原与位置偏差目标，编号识别(A,B)选A/(B,A)选B是冲突，预定不确定复核而非挑获胜；短正确/长承诺反例支持条款盲核。追问平局另报冲突，不等质，对调一致不保证事实或消除共享偏见。 |
| 25 | C14 | pass | 保留终点质量/可观察工具轨迹与任务失败/环境归因区分，编号列越权收费错参、返回状态及适当停止；超时未交付仍未成功，过程合理不豁免。追问三次相同可为轮询有限重试，必要安全检查不是无效绕路，无隐藏思维要求。 |
| 25 | ch03.interview.m25.badcase-curation.001 | pass | 保留反馈信号非真值→脱敏必要证据/期望→约束去重版本回归链，编号解释退出可能找到入口、地区时间条件不能脱掉；已发货直接取消例子有动作证据。追问修好保历史并增反例，自动入库不保证飞轮，不粗合不同条件。 |
| 25 | ch03.interview.m25.cache-identity.001 | pass | 保留生成缓存和评分缓存不同计算身份，STAR前者含完整输入/知识工具/模型配置，后者再含输出参考rubric裁判；政策变双失效、仅规则变可重判固定输出解释充分。追问实时状态/快照不可比范围，权限跨用户不绕过、旧输出不冒新运行。 |
| 25 | ch03.interview.m25.cascade-audit.001 | pass | 保留级联各出口可靠性与提前通过/拒绝双池审计，编号解释争议队列看不到早层自信错判、全链错误及成本/漂移重校准；流畅保证退款例子具体，追问可最少规则加人工。无四层必选、5%人工或70%省费保证。 |
| 25 | ch03.interview.m25.dataset-representation.001 | pass | 保留总体代表集与风险挑战集两个估计对象，STAR样本来源约束版本去重、合成核验后与真实对照，权重对齐所称流量；退货超采样不能估全部咨询，地区/时点差异不粗删。冷启动专家设计后试点，无科学固定配比。 |
| 25 | ch03.interview.m25.g-eval-expectation.001 | pass | 保留4×0.7+5×0.3=4.3与合法概率规范化机制，编号解释截断概率/多Token标签及裁判倾向非真值；长文偏好仍被加权的例子和无logprobs追問具体。G-Eval原论文支持概率加权，不声称必降方差或4.3代表43%正确。 |
| 25 | ch03.interview.m25.grader-selection.001 | pass | 保留规则结构/业务不变量、语义相似与复杂裁判人工分工，STAR用超可退额和否定反转说明可解析高分仍错；裁判须证据rubric校准，高风险争议人工。追问隔离执行真值代码、权限副作用，规则成本与举报含词不等违规保留。 |
| 25 | ch03.interview.m25.kappa-calibration.001 | pass | 保留κ=(Po-Pe)/(1-Pe)=0.5及类别边际偶然一致目标，编号解释高Po仍类别集中、共同误判与真值核验；Pe=1退化与序数加权边界清楚。追問盲核标准/证据不按人类或模型身份判对，无0.7/80%通用线。 |
| 25 | ch03.interview.m25.paired-regression.001 | pass | 保留同题配置评分版本、配对变化及波动/超时分母目标，STAR分总提升与退款承诺切片退化；必要重复看区间，R预定风险满足才切。追问模型适配作为变量记录归因，90→92不宣称显著、测试零错误不外推零风险。 |
| 25 | ch03.interview.m25.production-benchmark.001 | pass | 保留公开指定任务与目标生产系统分布差别，编号包含Prompt检索工具权限多轮，不只底座；算术高却漏地区例子解释迁移失败，追问榜单仅筛候选。公开不都污染/选择题、内部高分不外推所有流量，无通用智力上限。 |
| 25 | ch03.interview.m25.reference-evidence.001 | pass | 保留有参考允许等价及无标准答案不等无证据，编号说明源会议信息/任务Rubric约束；取消订单/终止采购可等价，编交期不能靠裁判常识。追问错误参考核权威输入后版本重评，漂亮摘要不自动忠实。 |
| 25 | ch03.interview.m25.rubric-atomic.001 | pass | 保留可观察事实/任务约束、档位扣分否决和同样本校准目标，编号给订单条件完整/无承诺与严重保证退款错误；风格单列不抵准确错误。追問评分JSON只可处理非可信，锚点仍可漏条件，无公开私有思维要求。 |
| 26 | ch03.interview.m26.action-function.001 | pass | 逐条对照现行Palantir Ontology、Action types、Functions及Function-backed actions：动作定义变化/条件/副作用，函数承载读计算及修改逻辑，组合仍受动作契约；原Function=Action Type错误已明确校正为自建命名。解析解释规则实现不需一动作一函数、ConfirmLevel非官方API及复杂逻辑发布边界，三项评分完全对应。 |
| 26 | ch03.interview.m26.draft-state-provenance.001 | pass | 保留草稿/确认/归档状态写权限、段落证据与AI/人工来源、确认责任人具体版本和修订追加。STAR测试并发确认/重生成/外部失败，解析v2不可覆盖、v3候选、编辑不等于全文核对、回执独立；无来源也不能补成无，未采医学年限或水印安全结论，评分对应原关键机制。 |
| 26 | ch03.interview.m26.extracted-rule-boundary.001 | pass | 原候选规则/元数据、独立受控执行实现和核验接入三项目标完整；核原段版本否定条件例外、权限副作用审计失败路径及越权漏条件样例均进入核心。未经批准付款反例解释抽取颠倒，已有接口不跳审批，来源链接追问说明支持性核验；不执行文档任意代码或混同官方动作，评分对应。 |
| 26 | ch03.interview.m26.fde-delivery.001 | pass | 原客户问题到工程实现及运行交付目标完整，STAR从门店/商品/时段/损失基线到权威数据授权、最小方案、异常监控交接和业务全成本验收。缺货原因分辨具体，FDE/PM/业务责任按组织确认，未强推本体或固定操作数门槛；R只是验证计划，不冒充个人成果，评分一致。 |
| 26 | ch03.interview.m26.intent-granularity.001 | pass | 保留完整意图接口、参数/结果/通知及幂等失败契约；STAR用逐人邀请状态、稳定幂等键、失败项重试/补偿，不重建会议。解析处理外部响应丢失先核事实、不同权限分阶段确认、预览绑定参数；跨系统一次调用不等于原子事务，R验收未虚构实测，三项评分对齐。 |
| 26 | ch03.interview.m26.link-semantics.001 | pass | 原关系类型/实例边、同端点不同职责和推荐非授权目标逐项保留；创建/收货责任示例解释为何不能混关系，权重不证明授权或因果。第一方确认同端点可有多个语义关系及双向遍历，反向边追问避免重复事实；本地权重衰减未当Foundry统一规范，评分对应。 |
| 26 | ch03.interview.m26.object-data-permissions.001 | pass | 保留Schema/动作资源、实例属性数据与动作提交三层权限，核心明确可信身份租户、具体对象、遍历/搜索/缓存/异步和撤权；跨租户及关系旁路测试与三项评分对齐。解析补管理员非全数据授权及受控审计，客户端tenant_id不作凭据；官方资源/数据分层核对一致。 |
| 26 | ch03.interview.m26.object-identity.001 | pass | STAR保留类型定义/实例、唯一命名空间及跨源映射证据，验证身份租户防同号串联，模糊映射先核实而非文本相似合并；ObjectRef局部范围与跨域身份契约区分清楚，定位不等于访问、SKU实例追问充分。三项核心/必答/评分一致，R为测试预期。 |
| 26 | ch03.interview.m26.ontology-layer.001 | pass | 对照原卡和源文98–141/761–772，保留语义映射、动作治理与跨源实现分层；三点均解释机制，并用订单状态权威属性与取消前条件说明，检索不替代采购批准。知识图谱规则及本体非天然安全边界仍在，核心/必答/评分对应，概念对比无需STAR。 |
| 26 | ch03.interview.m26.projection-authority.001 | pass | 原权威状态与投影分工目标完整：STAR明确当前权限/状态、条件写入防读取后并发、真实写入与同步修复；缓存/并发/同步失败验收未伪造结果。Resolver追问回答新鲜度限制，取消成功不重做业务来补投影，源文缓存设计未推广为全部Foundry对象。 |
| 26 | ch03.interview.m26.reference-operational.001 | pass | 保留规则与带时间来源的实例事实分层，稳定身份、适用地区/门店类型/生效版本关联，规则不等于批准或执行。门店类型与过期观察反例具体，历史依据不被政策更新覆盖，异常到通用规则需汇总验证受控变更；未把临床双图/永久只读当普遍限制，评分一致。 |

整张实际审阅draft card删除顶层review后，以scripts/content-batch-lib.ts的canonicalJson计算SHA-256；只提取纯函数，未加载其环境或数据库依赖。后续内容变更须对应卡复审再更新理由和指纹。
