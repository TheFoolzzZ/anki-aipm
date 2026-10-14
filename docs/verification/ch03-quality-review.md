# 第3章质量批次审校与发布验收

日期：2026-09-13。范围：3.1–3.12。状态：内容与数据库发布验收完成；浏览器显示验收待授权。

## 基线

本次只读实测：87张卡 / 132个修订 / 14个批次 / 0个复习状态 / 0个复习事件。基线卡身份与版本快照暂存ignored artifacts/ch03-before.json，用于发布后比较。

## 重点事实核对

除逐模块本地原文之外，对易错机制核对第一方文档/论文：

- [scikit-learn 数据泄漏说明](https://scikit-learn.org/stable/common_pitfalls.html)：训练/测试分开，预处理拟合不得利用测试数据；用于审查ML验证与泄漏卡。
- [Hugging Face Tokenization算法说明](https://huggingface.co/docs/transformers/main/tokenizer_summary)：BPE、Unigram和WordPiece；用于审查算法与工具的分类，不能把SentencePiece一概当成另一个固定算法。
- [Hugging Face LoRA概念说明](https://huggingface.co/docs/peft/v0.7.0/en/conceptual_guides/lora)：冻结原权重、训练附加低秩参数；不能推导为启用适配器后原有输出能力绝不改变。
- [FlashAttention原论文](https://arxiv.org/abs/2205.14135)：exact attention通过分块优化IO；不能声称其直接消除了稠密注意力的二次计算量。

外部佐证是本轮审稿依据；卡片source_refs仍对应已导入的本地来源快照。任何编辑扩展均需明确标记，不能伪称原文结论。

## 验收层次

1. 内容：原目标逐条分流，题目/答案/评分对应、稳定事实、解释与反例、重复检查。
2. 本地：schema、来源hash/行号、身份与position。
3. 远端：diff → publish → verify逐字段/批次hash回读；前后数量与旧身份比较。
4. 展示：共享Answer已补上explanation纯文本展示、换行与空值处理；typecheck、15项测试、生产build通过。浏览器实际登录与显示尚未验证：自动审批拒绝点击“打开本机学习空间”，原因是缺少针对本机账号登录的明确授权；已提问，尚无针对该动作的答复，未绕过登录。

## 发布结果

12批85张新卡已全部 validate → diff → publish → verify 通过。最终远端172张卡、217个修订、26个批次。原87张卡的身份、活动修订、position和章节归属不变；复习状态/事件均保持0。第1、2章11个质量批次亦重新verify通过。

证据：[发布回读](ch03-publication.json)、[前后核对](ch03-database-reconciliation.json)、[第1、2章复验](ch01-ch02-reverify.json)、[271项原目标逐字和行号核对](ch03-source-coverage.json)。原目标登记271/271；冻结核心卡发布85/85。二者均不代表271项目标已被卡片完整覆盖或实践已执行。

## 主Agent逐卡复核（已审模块）

### m31

- `ch03.tech.feasibility-evidence.001`：通过；可行性分原理与资源，不承诺未实测结果。
- `ch03.tech.token-cost-ledger.001`：通过；独立复算日输入16元加输出16元；价格为题设。
- `ch03.tech.capacity-latency.001`：通过；600乘2除60为20次每秒，未混淆在线人数与并发。
- `ch03.tech.api-contract.001`：通过；接口和业务成功分层，明确异步受理语义。
- `ch03.tech.cache-validity.001`：通过；权限、知识版本与TTL分别约束缓存。
- `ch03.tech.async-idempotency.001`：通过；重试身份及副作用去重，未声称队列恰好一次。
- `ch03.tech.observability-response.001`：通过；监控到任务关联，保留日志最小化边界。
- `ch03.tech.evaluation-contract.001`：通过；离线与线上证据分开，未设置通用及格阈值。
### m39

- `ch03.prompt.task-contract.001`：通过；任务缺失字段规则明确，角色不补造事实。
- `ch03.prompt.few-shot-selection.001`：通过；标签边界先于示例，独立测试避免坏例过拟合。
- `ch03.prompt.reasoning-tool-choice.001`：通过；区分分步文本与真实工具观察，未要求内部推理。
- `ch03.prompt.json-validation.001`：通过；JSON语法结构语义三层清楚，未知不等于零。
- `ch03.prompt.regression-versioning.001`：通过；固定配置与分层回归，未把少量坏例全对当上线。
- `ch03.prompt.injection-boundary.001`：通过；执行侧权限和注入防御不依靠提示保密。
- `ch03.prompt.optimization-stop.001`：通过；资料缺口与行为缺口分开，不强制升级微调。
- `ch03.prompt.consistency-limit.001`：通过；投票比例不是校准概率，计入相关错误与成本。
### m310

- `ch03.vector.training-objective.001`：通过；语言能力与检索目标区分，跨语种需分层验证。
- `ch03.vector.rerank-candidate-ceiling.001`：通过；重排候选上限清楚，与旧混合检索定义卡不同。
- `ch03.vector.metric-compatibility.001`：通过；双侧单位归一化条件正确，近似索引仍需复测。
- `ch03.vector.ann-quality-budget.001`：通过；ANN邻居召回与业务相关召回分开，参数实验可执行。
- `ch03.vector.capacity-arithmetic.001`：通过；复算3.072GB、5亿Token、10元均正确，注明假设。
- `ch03.vector.compression-choice.001`：通过；PQ子向量量化描述合理，降维不任意截断。
- `ch03.vector.database-selection.001`：通过；条数不是选型充分条件，包含更新恢复与运维。
- `ch03.vector.hybrid-evaluation.001`：通过；MRR和Recall分母有定义，融合需要单路基线。

### m32

- `ch03.ml.problem-contract.001`：通过；业务任务包含预测时点与可用输入，未将业务目标直接当标签。
- `ch03.ml.learning-signals.001`：通过；按训练信号区分三类学习，未按任务名称机械分类。
- `ch03.ml.evaluation-split.001`：通过；训练验证测试职责清楚，强调组/时间隔离与一次最终检验。
- `ch03.ml.fit-diagnosis.001`：通过；训练线上差异先查分布与链路，不以现象直接断言过拟合。
- `ch03.ml.confusion-cost.001`：通过；独立复算准确率85%、精确率60%、召回75%、F1约66.7%，错误成本分开。
- `ch03.ml.ensemble-tradeoff.001`：通过；Bagging和Boosting机制区分，残差描述带平方损失条件。
- `ch03.ml.leakage-prevention.001`：通过；预测时可用性与预处理拟合范围分别限制泄漏。
- `ch03.ml.release-recovery.001`：通过；上线验收包含离线、真实服务及回退证据，不把模型文件交付当完成。

### m33

- `ch03.dl.hierarchical-representation.001`：通过；分层表示由目标与数据塑造，深度不是固定层数门槛。
- `ch03.dl.activation-nonlinearity.001`：通过；仿射复合仍是仿射，非线性不等于二元阈值。
- `ch03.dl.training-inference.001`：通过；反向求梯度与优化器更新职责分开，普通推理不自动训练。
- `ch03.dl.gradient-diagnosis.001`：通过；NaN及冻结存在替代解释，要求梯度证据与单因素复测。
- `ch03.dl.convolution-bias.001`：通过；参数共享与计算量区分，未夸大为任意变换不变性。
- `ch03.dl.recurrent-memory.001`：通过；三门职责明确，长依赖缓解不等于无限记忆。
- `ch03.dl.generative-mechanisms.001`：通过；GAN/VAE/扩散机制有区别，不把家族名当质量排名。
- `ch03.dl.selection-validation.001`：通过；从头训练与迁移分开，少样本不自动排除深度学习。

### m35

- `ch03.llm.generalization.001`：通过；通用能力由实际任务验证，不按参数阈值定义能力合格。
- `ch03.llm.training-stages.001`：通过；预训练与行为对齐分开，训练阶段不构成事实正确保证。
- `ch03.llm.encoder-decoder-fit.001`：通过；结构与目标及任务适配分开，避免只凭模型家族名选型。
- `ch03.llm.selection-evidence.001`：通过；同任务与分层验收支持选型，榜单不是唯一证据。
- `ch03.llm.deployment-tradeoff.001`：通过；数据边界、运行性能和完整成本共同约束部署选型。
- `ch03.llm.hallucination-controls.001`：通过；逐主张核对依据，真实引用不支持额外承诺。
- `ch03.llm.application-routing.001`：通过；指令、知识和真实工具执行分别交付证据，已要求m311删除重复子卡。

### m36

- `ch03.finetune.problem-selection.001`：通过；动态知识与行为缺口分开，不把微调当固定升级步骤。
- `ch03.finetune.lora-boundary.001`：通过；冻结base不代表启用适配器后行为绝不改变，资源优化不保证质量。
- `ch03.finetune.data-contract.001`：通过；示例质量与目标输出契约明确，未用数据量代替质量。
- `ch03.finetune.split-leakage.001`：通过；按来源与近重复隔离数据，未用训练样本验收泛化。
- `ch03.finetune.overfitting-diagnosis.001`：通过；训练验证差距需排除数据与测量问题后诊断，避免一律加数据。
- `ch03.finetune.acceptance.001`：通过；同任务对照基线且检查回归及维护代价，训练成功不等于可上线。
- `ch03.finetune.release-monitoring.001`：通过；模型适配器与配置版本关联，监控与回退保留实际结果证据。

### m37

- `ch03.tokenization.subword-tradeoff.001`：通过；子词权衡词表与序列长度，不把Token说成固定语义最小单位。
- `ch03.tokenization.bpe-process.001`：通过；BPE计数示例无并列歧义，训练合并与应用已有规则分开。
- `ch03.tokenization.wordpiece-boundary.001`：通过；WordPiece与BPE比较保留算法口径边界，未冒认某实现的精确训练公式。
- `ch03.tokenization.sentencepiece-layer.001`：通过；SentencePiece是工具框架，可承载不同算法，归一化可配。
- `ch03.tokenization.language-measurement.001`：通过；语言成本按相同任务实际编码测量，无固定中文倍率。
- `ch03.tokenization.number-code-diagnosis.001`：通过；数字代码切分仅是候选因素，算术工具与输入证据分开验证。

### m38

- `ch03.token.unit-vs-character.001`：通过；字符限制与完整请求Token预算是不同约束，tokenizer必须匹配。
- `ch03.token.request-monthly-cost.001`：通过；独立复算输入0.0052加输出0.0024=0.0076元，月费11400元，价格为假设。
- `ch03.token.context-reservation.001`：通过；独立复算6500输入+2000预留超出8000容量500，接口口径有明确假设。
- `ch03.token.long-context-verification.001`：通过；输入完整与模型使用能力分层诊断，位置实验不是通用修复保证。
- `ch03.token.optimization-quality.001`：通过；system位置不自动省钱，按成功任务总成本验证压缩。
- `ch03.token.usage-reconciliation.001`：通过；纯用户文本与完整请求用量先统一口径再判断账单差异。

### m34

- `ch03.transformer.qkv-aggregation.001`：通过；QK匹配与V汇聚分开，因果掩码及注意力不等于证据的边界明确。
- `ch03.transformer.multihead.001`：通过；多投影组合有机制解释，固定总维度下头数不能直接推导成本或能力。
- `ch03.transformer.position.001`：通过；位置表示与有效长文理解分开，无额外顺序结构条件下等变表述准确。
- `ch03.transformer.block-roles.001`：通过；FFN共享参数、残差路径与Norm缩放偏移职责清楚，未承诺跳算或正态分布。
- `ch03.transformer.architecture-families.001`：通过；经典BERT/GPT/T5信息流与训练任务对应，已删除3.5重复架构卡。
- `ch03.transformer.parallel-boundary.001`：通过；训练位置并行与生成前缀依赖区分，RNN并非完全不能利用并行硬件。
- `ch03.transformer.attention-cost.001`：通过；稠密位置配对n²正确，FlashAttention优化IO不消除二次算术项。

### m311

- `ch03.rag.source-ingestion-loss.001`：通过；原文件/解析/分块/最终输入逐级定位丢失，未让生成器猜私有例外。
- `ch03.rag.chunk-experiment.001`：通过；用条件与步骤实验区分于C03概念，固定任务比较质量及重复成本。
- `ch03.rag.update-deletion.001`：通过；删除传播涵盖索引缓存与会话，实际回读才证明失效生效。
- `ch03.rag.rewrite-constraint.001`：通过；硬约束与语义偏好分开，改写不得静默丢失条件，HyDE不作事实证据。
- `ch03.rag.context-compression.001`：通过；候选完整不保证最终输入完整，压缩前后条件反例比较可操作。
- `ch03.rag.conflicting-sources.001`：通过；已将重复幻觉题改成来源冲突判断；发布时间、适用范围与替代关系分开。
- `ch03.rag.cost-quality-budget.001`：通过；入库与在线成本分别计量，按成功任务评估且编辑扩展标识明确。

### m312

- `ch03.agent.task-fit.001`：通过；固定工作流与反馈规划有可观察区别；已去掉题面未要求的四组件背诵评分点。
- `ch03.agent.loop-stop-budget.001`：通过；成功、无进展及预算停止边界明确，循环上限由系统落实。
- `ch03.agent.ambiguous-tool-result.001`：通过；响应丢失不是业务未执行，状态查询与幂等恢复区分，3.1重复卡已移除。
- `ch03.agent.memory-freshness.001`：通过；当前明确约束与历史偏好区分，记忆来源时效与删除可验证。
- `ch03.agent.reflection-evidence.001`：通过；反思是诊断假设，实际行为与边界测试支持交付而非自评肯定。
- `ch03.agent.autonomy-release.001`：通过；查询与支付验收分开，具体动作批准可复用已有授权，未强制全自动。
- `ch03.agent.tool-result-trust.001`：通过；工具组合数据流有新增目标，不只重复提示注入定义；外部网页不能提供授权。
- `ch03.agent.trace-task-metrics.001`：通过；轨迹由抽象必要性落到可执行字段与指标分母，区别C14旧卡。

## 发布前去重结果

删除重复草稿：3.1计费→3.8、3.1异步幂等→3.12、3.4长上下文方案→3.8及实践、3.5架构→3.4、3.11知识/动作路由→3.5。3.11引用判断已重写为来源冲突判定。上述历史审校条目保留作决策轨迹，不代表删除草稿进入发布；最终范围以12个JSON为准，共85张。position空缺为有意保留。

## 模块最终交付清单

| 模块 | 原目标登记数 | 发布核心卡数 | 批次 |
| --- | ---: | ---: | --- |
| 3.1 | 36 | 6 | ch03-quality-m31 |
| 3.2 | 36 | 8 | ch03-quality-m32 |
| 3.3 | 29 | 8 | ch03-quality-m33 |
| 3.4 | 26 | 7 | ch03-quality-m34 |
| 3.5 | 25 | 6 | ch03-quality-m35 |
| 3.6 | 22 | 7 | ch03-quality-m36 |
| 3.7 | 12 | 6 | ch03-quality-m37 |
| 3.8 | 16 | 6 | ch03-quality-m38 |
| 3.9 | 15 | 8 | ch03-quality-m39 |
| 3.10 | 18 | 8 | ch03-quality-m310 |
| 3.11 | 28 | 7 | ch03-quality-m311 |
| 3.12 | 8 | 8 | ch03-quality-m312 |

## 验收边界与后续工作

- 7项原目标完整延期：3.4 O11/O22/O23，3.5 O04/O05/O15/O23；涉及当前模型许可、Scaling Law、涌现、压缩与MoE的充分来源。3.7 WordPiece训练细节部分延期，已有卡只考受支持的比较边界。其余母题和实践均仅完成设计，不声称用户已执行。
- 单卡答案质量采用原文核对、作者八维自检和主Agent逐卡复核；并未开展真人学习时间/效果实验。部分独立覆盖审查被子Agent配额中断，主Agent接手去重、台账逐字/行号与全文勾选目标核对，没有声称未产出的第三方审计已通过。
- UI登录待用户明确授权；授权后用Chrome检查卡片详情与学习页的解析、长文滚动和窄屏，仅显示验收，不提交学习评分。
- 已有3.1计费等原稿审核条目保留为历史，删除的key不在最终85张内。未修改已发布的第1、2章JSON；未执行Git commit、push或Vercel部署。

## 2026-09-13 线上Transformer卡数为0排查

用户报告线上课程本课卡片为0。只读Supabase确认Transformer课程（lesson_id=22a89337-7722-5401-a6e0-8f09e4dd3b75）有7张ch03.transformer卡，均active_revision=1且归属一致。Chrome中用户已有登录态的 https://anki-aipm.vercel.app/lessons/22a89337-7722-5401-a6e0-8f09e4dd3b75 初始确实显示“本课记忆卡片 · 0”；执行页面reload后读取同一标题为“本课记忆卡片 · 7”。未重新登录、未提交已读或学习评分、未重发批次。

原因：Studio把bootstrap存入React state；data存在时初始加载effect直接返回，站内课程切换复用旧卡列表。数据库外部发布不会主动使浏览器内存失效；刷新后新bootstrap取得已发布数据。当前问题已通过刷新恢复，无需改库。本次没有修改代码或部署；自动检测内容更新属于后续体验改进。此次只确认线上课程卡数，不能据此声称本地新增的展开解析UI已部署或完整展示验收已通过。
