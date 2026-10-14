# 3.23–3.26 独立交叉审校

日期：2026-10-02。审阅者负责3.21/3.22生产，未参与23–26生产。本记录只审校，不改批次/台账、不上传、不写学习记录。当前为进行中快照，M24及M25/M26台账尚未落盘，不能宣称四课全部验收。

## 已确认的修改要求

1. **M23 regression-error-scale，评分超范围，发布前须改。** 正面只问MSE/RMSE/MAE计算及RMSE的大误差机制；required_points第3项要求“结合缺货/积压成本”未被正面询问。将该项移为可选追问/边界，保留2个必答；或正面明确要求不要直接比较不同指标数值。已有解析边界充分，无需增加一张同题卡。
2. **M26重复目标核查。** 当前已落盘11卡，未见先前提出的event-delivery-state、confirm-freshness，说明这两目标已经移出本批；最终台账须明确复用M19 integration-boundary、M12 ambiguous-tool-result及C07，不丢掉原题。object-data-permissions包含Ontology Schema资源、对象数据和Action提交资格三级，是与通用身份权限卡不同的新增机制，可保留；需确保三级区别是主评分点。
3. **M26 reference-operational 需保持本体建模目标。** 政策版本与实例来源边界已在M14 context-record-contract覆盖。此新卡可保留的独立点是参考对象/术语与业务实例类型、关系及读写治理分层；不要改回泛泛“检查时间/证据再授权”题。现稿有分层与类型引用，可作为建议而非硬退回。

## M23 当前审校结论

20卡（C04旧身份修订+19新卡），批次来源/hash/行范围及30–90秒、1–3必答、解析<=1000已另检查。29/29原生勾选逐句/逐行/hash吻合；232台账项均未发现空原句或错误锚点。医学Sensitivity/Specificity与采纳率已在母题M2完整说明，映射T3实践未做；只读结构未当临床验证。其余源文观点、示例阈值/数字和SDK时效均有纠错边界。

| 卡尾名 | 独立判断与依据 |
| --- | --- |
| C04 | 3/5=60%、3/10=30%计算正确；标注全集不完整与重复文档边界充分，保留旧目标身份。 |
| roc-pr-threshold | ROC/PR横纵轴、工作点与稀少正类误报量区分正确；同分常量ROC-AUC=0.5纠错成立。 |
| probability-quality | 排序与真实类别负log惩罚分开，校准需概率桶观察，未把Log Loss单值当校准证明。 |
| multiclass-average | Macro/Weighted/Micro聚合机制明确；限定Micro-F1=Accuracy条件，不以总体掩盖高风险小类。 |
| regression-error-scale | 算术与量纲正确：50件²、约7.07件、5件；必答3超正面范围，待改。 |
| r2-baseline | R²=-0.2→SSE为SST1.2倍正确，恒定目标、负值与真实基线区别充分。 |
| ndcg-gain | gain、位置折损、IDCG与任务成功分开；第二评分点为计算协议约定，可由“为何不能互换”涵盖。 |
| rank-objectives | Hit、首相关MRR、多相关AP/MAP明确；AP截断约定不混用，90秒负担合理。 |
| text-metric-boundary | BLEU/ROUGE/BERTScore三种匹配对象清楚，保留否定/承诺反例；三项比较可90秒，不强背公式。 |
| perplexity-comparison | 真实序列交叉熵指数及同分词口径正确，业务成功边界充分。 |
| detection-protocol | IoU定位与置信排序AP分开，阈值/插值/类别平均协议可解释，不自动保证业务安全。 |
| segmentation-overlap | 全背景99%陷阱、IoU/Dice分母与同二值集合转换正确；空集合约定明示。 |
| ocr-field-metric | 字符单位和字段整体正确单位不同，1000.00/100.00例能暴露业务误解。 |
| verification-rates | 冒名和本人分母明确；TAR=1-FRR带同决策条件，1:1/1:N不混同。 |
| cluster-validity | silhouette a/b与ARI参考分组区分正确；正面问“有用”故稳定/可解释/动作必答对齐。不需背ARI全公式；90秒机制比较合理。 |
| drift-types | P(X)、P(Y)、P(Y|X)区分且指出严格label shift假定；输入变化非任务质量失败证据。 |
| drift-detection | PSI分箱、KS CDF、KL非对称差异准确；样本/分箱/零频约定属于“怎样检查”范围。90秒只概括三机制与触发边界，不强背三公式。 |
| ab-guardrails | 代理/主指标/护栏与分流窗口对齐，长期伤害与统计/商业差异清楚；与M02 release-recovery的发布方式目标不同。 |
| serving-metrics | TTFT/完整/端到端、请求/事务/Token单位及业务成功分开，比M01 QPS基本术语有流式分位/负载独立点。 |
| dashboard-alert | 受众/决策轴与模型/产品/工程对象轴分开，报警有责任与预案，未套经验阈值。 |

M23机械检查不替代内容修正；上述评分范围问题修复后须重新读取对应字段与台账后签结论。

## M25 当前批次内容审校

15卡，C09/C10/C11/C14身份保留修订，其余11新目标。全部题答及必答逐条读取，计算核对Kappa=0.5、G-Eval示例期望4.3；source_refs均属本课hash与合法行范围。台账/母题尚未落盘，原生24条覆盖待复核，不能据卡片内容确认全模块覆盖。

| 卡尾名 | 独立判断与依据 |
| --- | --- |
| C09 | 四组件数据流清楚，运行/评分/报告职责可在小脚本实现，不误造服务架构。 |
| C10 | 最终上下文、源文过期、生成误用正确；旧身份修订虽与M11相关，属既有目标增强而非新造重复。 |
| C11 | 对调按候选身份对齐，冲突“不确定”不强认等质，未宣称消除全部偏差。 |
| C14 | 任务成功与可观察过程安全分开，不访问隐藏思维；保留旧身份。 |
| grader-selection | Schema/规则、语义相似及证据Rubric分工明确，不把“否定词相似”作为正确证据。 |
| production-benchmark | 公开模型任务和生产应用环境分布不同，未将榜单当通用智力上限。 |
| dataset-representation | 风险挑战集/真实分布集分开报告，权重与合成偏差明示，区别M02训练/验证隔离。 |
| reference-evidence | reference-free不等于无源文/真值，开放多有效答案合理。 |
| rubric-atomic | 两人可执行的行为锚点/否决/证据与校准完整，对齐“如何改规则”。 |
| g-eval-expectation | 合法评分归一化期望正确，logprobs截断及多Token约定充分；不当真值概率或通用降方差保证。 |
| kappa-calibration | 偶然一致修正正确，边际与Pe=1退化边界明确，Kappa不是准确率。 |
| paired-regression | 同题配对、失败保分母、随机波动/红线分开，单次90→92未当显著。 |
| cache-identity | 输出缓存与评分缓存两层键、判据/裁判版本及重生成/重判分区别，是对M01普通答案缓存的独立延伸；不以复用旧输出当新波动测量。 |
| cascade-audit | 所有出口抽审避免早期自信错漏掉，成本/错误联合判定，非只看争议队列。 |
| badcase-curation | 反馈信号→核验证据/期望→去敏/去重/版本→回归链完整；未把用户退出自动当负标签。 |

## M26 当前批次内容审校

11新卡，独立目标从对象/关系/动作机制展开，不采地方自建Mongo/TuGraph注册表为Foundry官方Schema。卡片来源/hash/行范围及长度/必答/耗时检查通过；完整台账尚未落盘，原文3.26无勾选，正文明确问题登记待检查。

| 卡尾名 | 独立判断与依据 |
| --- | --- |
| fde-delivery | 工作贴近客户工程落地，组织角色界限有条件；招聘第一方的精确链接待文档核对。 |
| ontology-layer | 明确operational ontology对象/属性/链接与动作治理，非图数据库/向量库等同；只针对企业操作本体，不冒充全部哲学本体定义。 |
| object-identity | 类型/实例、命名空间和权威跨源映射正确；ObjectRef扩展标识编辑设计，不当官方固有字段。 |
| link-semantics | 端点相同但创建/配送语义不同，基数需定义，推荐权重不当权限证据，方向/权重非Foundry强制。 |
| action-function | Action配置变更/提交规则，Function承载逻辑且可为Action支持，非同义；第一方function-backed actions核对成立。 |
| intent-granularity | 新点是将完整意图的确定性编排下沉动作，而非仅重复跨系统事务；部分失败已问，必答对齐。 |
| projection-authority | 可浏览投影与动作权威状态分层及写时校验，比普通缓存有效性增加对象读写链路。明确Foundry并非全部缓存，避免地方设计普遍化。 |
| object-data-permissions | 类型资源、对象数据、动作资格层次正确；Foundry两类安全区别可支持，跨缓存/异步是编辑防漏补充。 |
| reference-operational | 参考对象/业务实例分层可保留；评分应持续聚焦建模与引用治理，避免泛化回M14过期制度题。 |
| extracted-rule-boundary | 源文提取候选规则/代码与受控Action注册分开；否定条件漏抽反例揭示特有风险，非只问LLM不保证执行。 |
| draft-state-provenance | 草稿/确认对象不同可写动作、来源/版本及修订链清楚；主体是正式业务对象状态，不仅UI编辑冲突。 |

## 第一方交叉核对（2026-10-02）

- [scikit-learn metrics](https://scikit-learn.org/stable/modules/model_evaluation.html)：loss、回归、分类与排序口径。
- [Clustering](https://scikit-learn.org/stable/modules/clustering.html)：silhouette与ARI定义及局限。
- [SciPy KS](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ks_2samp.html)：一维CDF差异及检验前提。
- [Cohen kappa](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.cohen_kappa_score.html)：偶然一致的公式与类别边际。
- [G-Eval论文](https://arxiv.org/abs/2303.16634)：概率加权评分为论文机制，不当通用质量保证。
- [Foundry Ontology](https://www.palantir.com/docs/foundry/ontology/overview)：semantic/kinetic对象与动作逻辑定位。
- [Function-backed actions](https://www.palantir.com/docs/foundry/action-types/function-actions-overview)：Action可用规则或调用Function，二者不等同。
- [Ontology permissions](https://www.palantir.com/docs/foundry/object-permissioning/ontology-permissions)及[Action permissions](https://www.palantir.com/docs/foundry/action-types/permissions)：资源管理与对象数据/动作许可不同。

## 未完成审校

M24批次/台账、M25/M26台账/母题仍在生产中。审阅者继续独立读取落盘产物；此处不是发布批准。真实实践、独立学习实验、浏览器与上传均不在本审校执行范围。

## 主编最终处理（2026-10-02）

原审阅快照的待完成项现已补齐。M23误差卡只留计算及平方机制2点，未问业务损失移到追问；C10正面增加修复验证。M24独立主审删除5重复候选，剩6个不同目标并收窄failure-policy必答到正面三类异常，Dify Human Input第一方核对已补；25/26母题、实践、台账和八维作者审校已保存。M26删4重复候选，保留11本体/FDE新目标，原移出目标在母题/旧卡映射承接。M25四条延期断言原句及4.2两条技术名录空锚点修正，LF行号与控制字符分割错误已统一。121原生勾选及967台账项、所有映射/来源hash通过，实践执行0；这完成内容审校，不等于已上传或运行验收。
