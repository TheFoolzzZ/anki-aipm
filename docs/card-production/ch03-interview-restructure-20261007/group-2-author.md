# 第2组作者记录：第三章3.5–3.10逐卡重构

2026-10-07。范围：模块05–10，共56张。依据质量标准第6.3节、全量重构合同文末与RAG/微调示范；基线来自本轮mNN-existing.json及source-index.json。保留学习目标、canonical_key、position、concept_keys与模块归属；revision仅为active_revision+1。全部为draft及作者自检，未进行独立审校、数据库写入或发布。

每条记录写明结构、实际内容变化、理由、源文支持和编辑边界；解析的假设例子不是个人经历或实测结果。source_refs使用清单已有hash及源文件LF行号，外部核对只在本文件记录，不新增来源表。

## 模块05：LLM（12张）

- `ch03.llm.generalization.001`｜STAR｜revision 2→3，position 33。实际改写与理由：从“能共用”改为能力迁移后的替换决策；A分别解释预训练和任务差异，R保留分类器作为有条件结论，避免通用模型必胜。 来源支持/编辑边界：第3章-技术攻克/3.5-LLM.md L9–90；正文支持预训练能力迁移；评论/退款例子和逐任务对照方法为编辑假设，未引用大小模型的绝对优劣表。
- `ch03.llm.training-stages.001`｜编号｜revision 2→3，position 34。实际改写与理由：重新按训练信号而非人格类比组织三点；补SFT仍逐Token生成与偏好误导例子，使机制和事实边界可口述。 来源支持/编辑边界：第3章-技术攻克/3.5-LLM.md L216–443；正文给出预测、示例和奖励优化路径；纠正SFT后不再预测Token的说法，配送日例子为假设。
- `ch03.llm.hallucination-controls.001`｜STAR｜revision 2→3，position 38。实际改写与理由：将概括性风险答案重写成保存输入→逐主张归因→按证据处理的STAR，R明确同时检查误拒，保留幻觉而非泛化上线目标。 来源支持/编辑边界：第3章-技术攻克/3.5-LLM.md L679–747；正文支持事实性/忠实性幻觉及检索核查；退款条款、证据检查顺序与误拒评测是编辑诊断设计。
- `ch03.interview.m05.icl-vs-training.001`｜编号｜revision 1→2，position 1504。实际改写与理由：按输入/参数/存储三个维度重写比较，增加自动再注入导致误归因的例子；属机制辨析，保留编号而不硬套STAR。 来源支持/编辑边界：第3章-技术攻克/3.5-LLM.md L537–547；正文说明示例可在当前输入中适配任务；会话隔离与应用重新注入的测试方法为编辑推演。
- `ch03.interview.m05.scaling-budget.001`｜编号｜revision 1→2，position 1501。实际改写与理由：新增固定预算的资源挤压因果，按经验规律→参数/Token分配→服务期边界展开，不把原评分点加编号充作答案。 来源支持/编辑边界：第3章-技术攻克/3.5-LLM.md L981–985；源文自查只提供目标，机制补充复用台账Kaplan/Hoffmann论文；不采纳固定Token配比。
- `ch03.interview.m05.emergence-measurement.001`｜STAR｜revision 1→2，position 1502。实际改写与理由：把涌现诊断改为测量假设检验STAR；增加严格多步评分的因果，R明确诊断不降验收门槛。 来源支持/编辑边界：第3章-技术攻克/3.5-LLM.md L508–580；正文给涌现概念；测量非线性补充据Schaeffer论文，十步算例明确为假设，不推断普遍门槛。
- `ch03.interview.m05.refusal-evaluation.001`｜STAR｜revision 1→2，position 1506。实际改写与理由：将定义嵌入拒答诊断STAR，加入旧模型配新过滤的归因对照和分类分母，避免把所有变化算给训练。 来源支持/编辑边界：第3章-技术攻克/3.5-LLM.md L782–809；正文支持过度保守风险；将过滤和输入变化列为候选原因、分母与回归为编辑诊断设计。
- `ch03.interview.m05.license-evidence.001`｜STAR｜revision 1→2，position 1503。实际改写与理由：用托管与客户分发的用途分叉重写准入STAR；R是可复核材料而非法律放行，避免依品牌旧许可表背结论。 来源支持/编辑边界：第3章-技术攻克/3.5-LLM.md L141–173；正文许可表提供选型话题，不作品牌准入结论；用途核对表为编辑流程，无具体法律判断。
- `ch03.llm.application-routing.001`｜编号｜revision 2→3，position 39。实际改写与理由：按指令/资料/执行重新解释接口责任，加入部分完成与空结果条件；属职责辨析，虽为场景判断仍用编号。 来源支持/编辑边界：第3章-技术攻克/3.5-LLM.md L873–942；源文明确检索与系统执行函数后回传；退货/订单链路为编辑假设，不增加Agent持续执行目标。
- `ch03.llm.deployment-tradeoff.001`｜STAR｜revision 2→3，position 37。实际改写与理由：从列条件改为报价不足下的部署决策STAR，补利用率和责任分配因果，R不沿用固定费用门槛。 来源支持/编辑边界：第3章-技术攻克/3.5-LLM.md L141–173；正文提供API/私有化比较；容量、利用率、迁移及数据流是编辑决策维度，不使用月费阈值。
- `ch03.llm.selection-evidence.001`｜STAR｜revision 2→3，position 36。实际改写与理由：把参数争论改为分层选型STAR，补平均值掩盖严重错误与路由代价，保持模型适用性目标。 来源支持/编辑边界：第3章-技术攻克/3.5-LLM.md L560–582；正文列规模选型，但固定参数下限不采纳；按业务分层与条件选型为编辑修正。
- `ch03.interview.m05.preference-dpo.001`｜编号｜revision 1→2，position 1505。实际改写与理由：把“流程更简单”的结论展开为两个训练机制及同一偏好风险，按比较维度编号，不将选型背景硬变成完整流程卡。 来源支持/编辑边界：第3章-技术攻克/3.5-LLM.md L490–504；正文与DPO论文支持路线区别；退款偏好数据是编辑例子，资源优劣不作为固定结论。

## 模块06：模型微调（9张）

- `ch03.finetune.split-leakage.001`｜STAR｜revision 2→3，position 44。实际改写与理由：将泄漏诊断写成事件溯源→按泛化目标分组→独立重比STAR，补分数下降的测量解释，不扩成通用数据治理题。 来源支持/编辑边界：第3章-技术攻克/3.6-模型微调.md L427–457；原文要求训练/验证/测试集；同源事件去重、组间隔离和时间外验证为编辑实验设计。
- `ch03.finetune.overfitting-diagnosis.001`｜STAR｜revision 2→3，position 45。实际改写与理由：给验证退化增加测量异常排除和检查点选择证据，R明确测试隔离；保留过拟合与容量机制。 来源支持/编辑边界：第3章-技术攻克/3.6-模型微调.md L401–425；原文支持过拟合、早停与rank干预；固定验证版本和检查点选择为编辑补强。
- `ch03.interview.m06.hyperparameter-experiment.001`｜STAR｜revision 1→2，position 1602。实际改写与理由：将三个超参数各自的因果作用放入核心A，补稀有样本与更新不稳两种证据分叉，避免只写实验验收口号。 来源支持/编辑边界：第3章-技术攻克/3.6-模型微调.md L401–423；原文定义学习率、Epoch、rank；实验固定项、有限候选和停止条件是编辑方案，不沿用建议数值。
- `ch03.finetune.acceptance.001`｜STAR｜revision 2→3，position 46。实际改写与理由：从风格观感转为任务增益STAR；明确自动字段与人工事实的分工，补净收益因果与条件上线。 来源支持/编辑边界：第3章-技术攻克/3.6-模型微调.md L427–464；原文列定量/定性/基座及Prompt/RAG对比；退款承诺、上线否决项与总成本口径为编辑假设。
- `ch03.interview.m06.method-evidence.001`｜STAR｜revision 1→2，position 1601。实际改写与理由：核心A逐一解释三种参数与存储机制，按用户补充限定QLoRA；补公平比较中的必要配置差异，避免方法名称排序。 来源支持/编辑边界：第3章-技术攻克/3.6-模型微调.md L89–105；第3章-技术攻克/3.6-模型微调.md L109–183；原文给全量、LoRA/QLoRA机制；量化冻结基座并训练适配器由用户指定HF PEFT官方资料确认，不使用卡型门槛。
- `ch03.finetune.lora-boundary.001`｜编号｜revision 2→3，position 42。实际改写与理由：按公式→行为分布→资源构成重写编号答案，加入适配器破坏标签格式的因果；明确用户要求的冻结量化基座边界。 来源支持/编辑边界：第3章-技术攻克/3.6-模型微调.md L109–183；正文给冻结W和低秩增量参与输出；QLoRA按用户核对的HF PEFT资料表述，回归例子为编辑假设。
- `ch03.finetune.release-monitoring.001`｜STAR｜revision 2→3，position 47。实际改写与理由：重写为服务对象一致性与恢复STAR，A给基座错配和坏例分流机制，R明确运行失败触发条件。 来源支持/编辑边界：第3章-技术攻克/3.6-模型微调.md L459–464；原文支持部署、性能、监控和迭代；版本绑定、灰度故障与成套回退为编辑交付设计。
- `ch03.finetune.data-contract.001`｜STAR｜revision 2→3，position 43。实际改写与理由：将数据质量形容词转为三类训练前检查STAR，补错误示范如何被模仿及缺失样本导致补造的因果。 来源支持/编辑边界：第3章-技术攻克/3.6-模型微调.md L269–345；原文支持准确/一致/多样/格式/授权；数据契约检查与拒收越权样本为编辑操作化。
- `ch03.finetune.problem-selection.001`｜STAR｜revision 2→3，position 41。实际改写与理由：用双缺口STAR替代固定升级阶梯，A解释知识更新与参数适配的位置，R保留不微调的有效结论。 来源支持/编辑边界：第3章-技术攻克/3.6-模型微调.md L44–63；第3章-技术攻克/3.6-模型微调.md L429–457；原文提出Prompt/RAG/微调；拆知识与行为问题为编辑修正，不保留无条件成本或固定升级顺序。

## m05独立意见返修记录

读取review-a.json中module=5、status=revise的两项；未修改审查报告，review仍为draft。

- `ch03.llm.hallucination-controls.001`：短答/解析/误区改为授权受控环境核对真实最终输入；常规仅留关联标识、版本与必要脱敏片段，快照设访问、期限、删除规则，凭证与无关个人信息不入日志。保留条款对主张的归因目标，脱敏证据不得伪称另一份真实输入。安全记录补充依据为独立报告引用的[OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude)。
- `ch03.interview.m05.refusal-evaluation.001`：题干增加升级负担；核心A、第三必答点、解析与评分均补同层转人工比例、接管等待/处理时间、升级后完成比例及分母。误拒引发积压是假设案例，不是实测；补回旧目标被遗漏的人工工作量，不以降低拒答换越权。

两项作者已修，等待独立复核，不能将此记录当审校通过。

## 模块07：Tokenization（8张）

- `ch03.tokenization.sentencepiece-layer.001`｜编号｜revision 2→3，position 52。实际改写与理由：改为框架/算法/预处理三层解释，补规范化为何影响字节恢复；定义题用编号，不虚构方案STAR。 来源支持/编辑边界：第3章-技术攻克/3.7-Tokenization.md L252–330；正文支持SentencePiece框架和可选算法；规范化边界据官方仓库，订单号例子为编辑假设。
- `ch03.tokenization.subword-tradeoff.001`｜编号｜revision 2→3，position 49。实际改写与理由：重写三种切法的代价因果并补覆盖条件，纠正拆字必丢语义；比较题用统一维度编号。 来源支持/编辑边界：第3章-技术攻克/3.7-Tokenization.md L53–127；正文提供三类切分取舍；纠正字符必丢语义、子词绝无UNK，品牌拆分例子为编辑示意。
- `ch03.interview.m07.unigram-mechanism.001`｜编号｜revision 1→2，position 1702。实际改写与理由：将方向类比换成概率评估和路径选择机制；补同字符串不同序列的示意，按机制编号且不背普适效果排行。 来源支持/编辑边界：第3章-技术攻克/3.7-Tokenization.md L294–316；正文支持概率模型裁减词表；多路径采样据Kudo论文，示意分段非某发布词表实测。
- `ch03.tokenization.wordpiece-boundary.001`｜编号｜revision 2→3，position 51。实际改写与理由：补HF重构的有限事实支撑，核心区分评分、##和编码；明确不把教学公式说成Google原始公开算法。 来源支持/编辑边界：第3章-技术攻克/3.7-Tokenization.md L223–250；正文提供BPE/WordPiece及##；训练评分仅使用HF明确标注的教学重构，编码最长匹配据既有Google BERT台账，不宣称原始训练代码已公开。
- `ch03.tokenization.number-code-diagnosis.001`｜STAR｜revision 2→3，position 54。实际改写与理由：重写成输入—表示—输出逐段诊断STAR，补小数点预清洗与独立计算反例；日志证据限制为授权最小脱敏。 来源支持/编辑边界：第3章-技术攻克/3.7-Tokenization.md L413–477；正文提示数字/缩进表示差异；输入预处理、计算和语法验证为编辑诊断，不固定模型家族切法。
- `ch03.interview.m07.chinese-ambiguity.001`｜STAR｜revision 1→2，position 1701。实际改写与理由：将中文三难点放入具体消歧STAR，A保留技术层次，R按证据不足澄清而非默认动作。 来源支持/编辑边界：第3章-技术攻克/3.7-Tokenization.md L334–388；正文列无空格/歧义/新词及球拍示例；结合库存上下文和澄清为编辑假设，不冒称真实采购事故。
- `ch03.tokenization.language-measurement.001`｜STAR｜revision 2→3，position 53。实际改写与理由：将语言比例纠偏变成有版本和可比语料的测量STAR，补翻译缺条件造成假节约的例子，保留分词效率目标。 来源支持/编辑边界：第3章-技术攻克/3.7-Tokenization.md L332–411；正文支持词表覆盖影响效率；固定20%–50%不采纳，语义可比语料与配额实验为编辑设计。
- `ch03.tokenization.bpe-process.001`｜编号｜revision 2→3，position 50。实际改写与理由：把首次合并、后续统计和使用规则的机制逐步重写，显式教学假设与初始表示边界，保留编号。 来源支持/编辑边界：第3章-技术攻克/3.7-Tokenization.md L131–221；正文支持频率合并；a b三次/a c两次为明确教学假设，避免原文并列频率未说明，不代表真实词表。

## 模块08：Token 详解（6张）

- `ch03.token.long-context-verification.001`｜STAR｜revision 2→3，position 60。实际改写与理由：以付款例外重写STAR，先区分条款未进入与进入未用，再解释替代方法的跨段风险，保留长上下文目标。 来源支持/编辑边界：第3章-技术攻克/3.8-Token-详解.md L214–245；正文提醒窗口容量不等于利用能力；条款位置/干扰受控实验和检索/分段对照为编辑假设。
- `ch03.token.request-monthly-cost.001`｜编号｜revision 2→3，position 58。实际改写与理由：重新逐项展开百万单位换算和次数口径，补咨询/调用分母不同的因果；明确计算题用编号，不用STAR。 来源支持/编辑边界：第3章-技术攻克/3.8-Token-详解.md L247–306；正文支持输入输出分开计价；题设所有用量/人民币价格是假设，独立算式复核，不引用当前报价。
- `ch03.token.context-reservation.001`｜编号｜revision 2→3，position 59。实际改写与理由：用计算→接口口径→信息保护三点重写，补输出截断与早期有效约束的原因；属于预算计算，不强套STAR。 来源支持/编辑边界：第3章-技术攻克/3.8-Token-详解.md L192–245；正文支持窗口限制及压缩策略；8000总容量规则与各项数字为编辑假设，不宣称所有接口共用该规则。
- `ch03.token.optimization-quality.001`｜STAR｜revision 2→3，position 61。实际改写与理由：把局部精简改成成功任务成本STAR，核心解释system位置与发送/缓存不同，R据返工决定恢复。 来源支持/编辑边界：第3章-技术攻克/3.8-Token-详解.md L308–375；正文支持精简/压缩/缓存；纠正system自动节费，成功任务总成本和回退为编辑评估设计。
- `ch03.token.usage-reconciliation.001`｜STAR｜revision 2→3，position 62。实际改写与理由：重写计数差异诊断STAR，增加计数对象与计价分类两层归因，同时限制财务记录为必要脱敏结构。 来源支持/编辑边界：第3章-技术攻克/3.8-Token-详解.md L377–412；正文提供计数工具和估算；800/2000诊断数字是假设，完整请求、用量分类与脱敏对账为编辑补强。
- `ch03.token.unit-vs-character.001`｜编号｜revision 2→3，position 57。实际改写与理由：按单位→计数对象→产品约束重写概念辨析，补同字符不同内容的原因；虽kind为场景判断，核心是概念范围故用编号。 来源支持/编辑边界：第3章-技术攻克/3.8-Token-详解.md L15–65；正文支持Token编码单位；精确字符/Token换算不采纳，完整请求计数与前端限制分开是编辑产品判断。

## 模块09：Prompt Engineering（9张）

- `ch03.prompt.task-contract.001`｜STAR｜revision 2→3，position 65。实际改写与理由：以未定日期如何被填成承诺解释根因，改为三类信息补齐STAR；角色作用有共同样例对照，保留提示契约目标。 来源支持/编辑边界：第3章-技术攻克/3.9-Prompt-Engineering.md L64–200；第3章-技术攻克/3.9-Prompt-Engineering.md L372–415；正文支持具体背景、任务、格式与角色；会议缺失日期和对照评测为编辑假设，不背CO-STAR/RTF品牌优劣。
- `ch03.prompt.json-validation.001`｜STAR｜revision 2→3，position 68。实际改写与理由：把格式故障写成语法/schema/事实的分层STAR，增加0与未知的业务因果，R保持结构和语义分别评分。 来源支持/编辑边界：第3章-技术攻克/3.9-Prompt-Engineering.md L344–368；第3章-技术攻克/3.9-Prompt-Engineering.md L470–495；第3章-技术攻克/3.9-Prompt-Engineering.md L570–588；正文给JSON输出和抽取字段；语法/schema/语义分层、null示意及拒收规则为编辑补强，不绑定供应商接口。
- `ch03.prompt.optimization-stop.001`｜STAR｜revision 2→3，position 71。实际改写与理由：以两类输入状态解释Prompt边界，按责任层选手段的STAR替代“再强化提示”，保留技术定位。 来源支持/编辑边界：第3章-技术攻克/3.9-Prompt-Engineering.md L593–603；第3章-技术攻克/3.9-Prompt-Engineering.md L648–652；正文列实时知识/格式/操作边界；按最终输入归因与收益停止为编辑设计，不套固定升级路径。
- `ch03.prompt.reasoning-tool-choice.001`｜编号｜revision 2→3，position 67。实际改写与理由：按已有信息/外部观测/验证边界重写对比，解释真实工具观察进入下一决策的因果；比较题用编号。 来源支持/编辑边界：第3章-技术攻克/3.9-Prompt-Engineering.md L246–327；正文分别给CoT与ReAct；金额计算/库存工具例子为编辑假设，结果摘要不要求私有推理。
- `ch03.prompt.consistency-limit.001`｜STAR｜revision 2→3，position 72。实际改写与理由：将投票误解转为是否采用策略的STAR，补系统性错误与单次对照，R不背固定收益倍数。 来源支持/编辑边界：第3章-技术攻克/3.9-Prompt-Engineering.md L286–306；正文给多次采样投票；一致比例非正确概率和相关错误机制为编辑修正，不宣称调用总成本固定乘五。
- `ch03.prompt.regression-versioning.001`｜STAR｜revision 2→3，position 69。实际改写与理由：把已知坏例局部收益展开为未见集回归STAR，增加拒答捷径与配置混杂的反例，R给实际回退边界。 来源支持/编辑边界：第3章-技术攻克/3.9-Prompt-Engineering.md L417–444；第3章-技术攻克/3.9-Prompt-Engineering.md L557–588；正文支持Prompt版本/回归/上线；十个坏例为题设假设，冻结未见集与成套回退为编辑设计。
- `ch03.prompt.injection-boundary.001`｜STAR｜revision 2→3，position 70。实际改写与理由：重写为信任边界STAR，具体说明网页身份与数据权限无关，验证观察调用对象和去向，不承诺消除注入。 来源支持/编辑边界：第3章-技术攻克/3.9-Prompt-Engineering.md L329–342；第3章-技术攻克/3.9-Prompt-Engineering.md L605–621；正文支持注入风险及操作限制；第三方网页信任边界和执行侧最小权限沿用台账第一方补充，非零风险承诺。
- `ch03.prompt.few-shot-selection.001`｜STAR｜revision 2→3，position 66。实际改写与理由：保留分类边界目标，STAR先明确任务规则再选正反例，补故障词捷径与成本取舍，不套固定示例数量。 来源支持/编辑边界：第3章-技术攻克/3.9-Prompt-Engineering.md L206–244；第3章-技术攻克/3.9-Prompt-Engineering.md L570–588；正文支持Few-shot与分层评估；故障退货标签边界是假设业务规则，示例数不当普适上限。
- `ch03.interview.m09.message-responsibility.001`｜编号｜revision 1→2，position 1901。实际改写与理由：以稳定规则/请求资料/执行边界三点重写，解释报价硬编码风险；主要问职责辨析故用编号，保留kind与目标。 来源支持/编辑边界：第3章-技术攻克/3.9-Prompt-Engineering.md L329–345；正文区分稳定行为规则与用户请求；纠正system自带保密/缓存，受控模板与资料来源拆分为编辑产品设计。

## 模块10：向量数据库与嵌入模型（12张）

- `ch03.interview.m10.embedding-migration.001`｜STAR｜revision 1→2，position 2004。实际改写与理由：将形状/语义空间差异写入迁移STAR，A说明版本化和变更对账，R补旧链路权限有效，保留兼容性目标。 来源支持/编辑边界：第3章-技术攻克/3.10-向量数据库与嵌入模型.md L54–152；正文给独立编码和表示空间概念；同为768维只是题设，重编码/增量对账/成套切换是沿用编辑推演，不伪称原文固定步骤。
- `ch03.vector.compression-choice.001`｜STAR｜revision 2→3，position 78。实际改写与理由：核心A解释PQ的子向量码本与距离近似，先测资源组成再选压缩，R明确关键漏项回退，避免泛化验收。 来源支持/编辑边界：第3章-技术攻克/3.10-向量数据库与嵌入模型.md L154–179；第3章-技术攻克/3.10-向量数据库与嵌入模型.md L390–416；第3章-技术攻克/3.10-向量数据库与嵌入模型.md L644–653；正文给维度和量化话题；PQ按子向量码本机制据Faiss官方复核，内存组成/回退为编辑方案，不使用固定损失率。
- `ch03.vector.capacity-arithmetic.001`｜编号｜revision 2→3，position 77。实际改写与理由：重新展开字节与百万Token换算，补块数/文件数及持续费用因果；纯计算使用编号，不虚构STAR。 来源支持/编辑边界：第3章-技术攻克/3.10-向量数据库与嵌入模型.md L657–684；正文容量与编码成本是出处；原文乘法错误不沿用，100万/500/768/float32及价格为明确题设假设。
- `ch03.vector.rerank-candidate-ceiling.001`｜STAR｜revision 2→3，position 74。实际改写与理由：重写候选缺失STAR，把双塔与联合逐对计算写进A，解释候选范围上限和扩大K的条件。 来源支持/编辑边界：第3章-技术攻克/3.10-向量数据库与嵌入模型.md L134–152；第3章-技术攻克/3.10-向量数据库与嵌入模型.md L608–630；正文支持双塔和Cross-Encoder职责；Top-50为题设诊断条件，候选证据与复测顺序为编辑补强。
- `ch03.interview.m10.sparse-representation.001`｜编号｜revision 1→2，position 2002。实际改写与理由：按坐标/学习扩展/统计信号三点重写，不把SPLADE当普通稀疏化，补索引坐标不能互换的原因。 来源支持/编辑边界：第3章-技术攻克/3.10-向量数据库与嵌入模型.md L587–606；正文给学习稀疏词项权重；词项扩展及稀疏约束据SPLADE论文，坐标空间/补零反例为编辑解释。
- `ch03.interview.m10.filtered-recall.001`｜STAR｜revision 1→2，position 2003。实际改写与理由：以有限ANN候选过滤机制重写STAR，明确精确对照也同授权范围，R不将性能修复变成放开权限。 来源支持/编辑边界：第3章-技术攻克/3.10-向量数据库与嵌入模型.md L644–653；正文仅给过滤性能话题；ANN扫描后过滤不足据pgvector官方，具体查询执行计划需现场验证，租户算例是假设。
- `ch03.vector.training-objective.001`｜STAR｜revision 2→3，position 73。实际改写与理由：核心保留三类表示的机制和对比学习目的，STAR选型固定切分与输入条件，避免仅写评测达标。 来源支持/编辑边界：第3章-技术攻克/3.10-向量数据库与嵌入模型.md L54–132；第3章-技术攻克/3.10-向量数据库与嵌入模型.md L181–205；第3章-技术攻克/3.10-向量数据库与嵌入模型.md L515–559；正文支持静态/上下文/匹配训练及跨语种；对比实验与查询/文档前缀检查为编辑选型设计，不引用模型排行。
- `ch03.interview.m10.colbert-late-interaction.001`｜编号｜revision 1→2，position 2001。实际改写与理由：逐步解释MaxSim汇总公式，补全局最大丢查询项的原因，保留多向量成本边界；机制题用编号。 来源支持/编辑边界：第3章-技术攻克/3.10-向量数据库与嵌入模型.md L566–585；正文给Token多向量但漏求和；MaxSim逐查询项最大再求和据ColBERT原论文，0.8/0.3算例为假设。
- `ch03.vector.metric-compatibility.001`｜编号｜revision 2→3，position 75。实际改写与理由：按等价条件/模长影响/实际索引三点重写，补数学与近似执行的区别；本题侧重兼容原理，选择编号。 来源支持/编辑边界：第3章-技术攻克/3.10-向量数据库与嵌入模型.md L209–281；正文给余弦/点积/欧氏；双侧单位向量关系由数学推导及既有Faiss台账支持，不沿用固定速度提升。
- `ch03.vector.database-selection.001`｜STAR｜revision 2→3，position 79。实际改写与理由：将选库重写为相同真实负载下STAR，补删除可见和新增同步责任，R保留达标复用的最小方案。 来源支持/编辑边界：第3章-技术攻克/3.10-向量数据库与嵌入模型.md L447–511；正文给传统扩展/专用库及更新一致性；200万向量为题设假设，压测与生命周期总成本为编辑选型。
- `ch03.vector.hybrid-evaluation.001`｜STAR｜revision 2→3，position 80。实际改写与理由：STAR保留RRF机制和三指标定义，解析加带分母的Recall/RR算例，R明确平均分掩盖退化的取舍。 来源支持/编辑边界：第3章-技术攻克/3.10-向量数据库与嵌入模型.md L587–606；第3章-技术攻克/3.10-向量数据库与嵌入模型.md L709–718；正文支持混合/清单指标；RRF及Recall/MRR/NDCG定义沿用既有目标与台账，相关性标注和退化分层为编辑设计。
- `ch03.vector.ann-quality-budget.001`｜STAR｜revision 2→3，position 76。实际改写与理由：核心A补全部原索引机制与参数责任，分精确邻居和相关标注两种基准，STAR避免直接换算法治所有问题。 来源支持/编辑边界：第3章-技术攻克/3.10-向量数据库与嵌入模型.md L313–388；第3章-技术攻克/3.10-向量数据库与嵌入模型.md L418–458；第3章-技术攻克/3.10-向量数据库与嵌入模型.md L502–511；正文提供HNSW/IVF参数与Flat对照；修正底层非保证精确、固定漏失率、增删必重建，近邻/业务双基准为编辑评估。

## 2026-10-08：m07两项定向返修，待主编复审

仅处理当前review-a.json的模块7两项revise，审校报告未修改。

- `ch03.tokenization.wordpiece-boundary.001`｜编号：核心第三点、第三必答点与解析明确BPE编码按已学合并顺序；BERT式WordPiece仅使用最终词表最长优先匹配，不回放合并史。原因是原共同表述“词表与规则”掩盖了两侧编码机制差异。保留HF训练公式仅教学重构、##非原文字符及不每请求重训的限定。依据：[HF WordPiece官方课程的Tokenization algorithm](https://huggingface.co/learn/llm-course/chapter6/6#tokenization-algorithm)及[Google BERT编码实现](https://github.com/google-research/bert/blob/master/tokenization.py)；原源文223–250行、hash与身份字段均保持。
- `ch03.tokenization.bpe-process.001`｜编号：核心第二点、第一必答点与解析改为本例[ab]×3、[a,c]×2，下一相邻对a+c出现2次。ab已是单片段且不跨词，不能虚构它的新邻居。一般长词的合并会改变相邻对，另以明确教学假设[a,b,c]→[ab,c]解释，未把该长序列充作本题输入；保留编码用规则、不重训、合并无语义保证。源文131–221行及hash保持，计数均来自题设。

作者定向自检：两卡字段长度和1–3必答点通过；题设更新后相邻对以标准库Counter独立复算仅{(a,c):2}；回读与写入一致。canonical_key、concept_keys、revision、position、归属、source_refs及其他元数据未变；m07另外6张逐字段不变，模块05/06/08/09/10文件hash不变，review-a.json文件hash不变。全部仍为draft/作者自检，无DB操作，无新目标。

交接主编：请对上述两张当前草稿做定向复审，重点核编码信息差异与合并后序列；作者修复不能代替独立通过，审查报告保持原状态。
