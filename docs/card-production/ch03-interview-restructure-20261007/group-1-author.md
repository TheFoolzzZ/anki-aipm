# 第三章3.1–3.4逐卡作者记录｜组1

2026-10-07。仅生成草稿，无DB操作；保持实时输入的目标、身份、位置、概念和归属，revision=active_revision+1。同一作者自检不等于独立审校，全部保持draft。

## 3.1（12张）

- `ch03.tech.capacity-latency.001`｜编号；本题考计算/机制/辨析，不强套STAR｜重新区分用户池/在途/处理并发，核心答案补上需求估计与吞吐实测差别，防止容量承诺。 来源：728–785行。编辑边界：600人及行为频率、3秒推演均为假设；源文支持QPS/RT/并发与首Token区别。
- `ch03.tech.observability-response.001`｜STAR｜改为STAR，行动按关联事件→分层归因→责任与止损展开，验收落到有效报告而非状态码。 来源：1127–1186行。编辑边界：报告及保存失败例子为编辑假设；源文支持埋点/日志/监控/告警及脱敏，不采用原文通用告警阈值。
- `ch03.interview.m01.cv-output-contract.001`｜编号；本题考计算/机制/辨析，不强套STAR｜用三组输出—评价—用途对应关系重写，保留视觉任务目标，场景仅用于辨析所以用编号。 来源：425–452行。编辑边界：仓库与复核动作是编辑假设；源文支持分类、检测、分割及评价对象。
- `ch03.tech.feasibility-evidence.001`｜STAR｜改为STAR，将抽取/计算/解释拆成可讨论的任务，再由失败证据决定缩范围与复核方案。 来源：22–58行；1384–1411行。编辑边界：文档分析与采购报告均为编辑假设；沿用源文可行性、经济性、协作和资源限制依据。
- `ch03.tech.api-contract.001`｜编号；本题考计算/机制/辨析，不强套STAR｜重写为三层成功契约，新增受理响应的业务解释与超时查原任务追问，不把接口题泛化成换模型。 来源：605–656行；712–724行。编辑边界：状态示例为编辑设计，不声称现有接口实现；源文支持API字段、认证、限流、超时和JSON契约。
- `ch03.interview.m01.auth-boundary.001`｜编号；本题考计算/机制/辨析，不强套STAR｜编号辨析认证/授权/签名三个边界，保留合同目标并明确长期声明的撤销问题；不是实施方案题。 来源：1046–1081行。编辑边界：沿用既有卡对原文“加密字符串”的纠正；合同ID修改为假设例子，JWT限定签名形式。
- `ch03.interview.m01.container-operations.001`｜编号；本题考计算/机制/辨析，不强套STAR｜按打包/编排/验收逐维解释作用与边界，补长单显存案例，仍是工具比较所以不用STAR。 来源：984–1007行。编辑边界：客户长单故障为假设；复用既有宿主驱动与资源边界纠正，不采纳原文“任何地方效果一样”。
- `ch03.tech.cache-validity.001`｜编号；本题考计算/机制/辨析，不强套STAR｜由复用判定展开副本地位、条件匹配、事件失效因果；本卡问规则边界，不强套STAR。 来源：800–839行；843–872行。编辑边界：岗位/报销与撤权例子为编辑假设；源文支持缓存作用、TTL、一致性，权限补充沿用已有活动卡。
- `ch03.interview.m01.infra-boundaries.001`｜编号；本题考计算/机制/辨析，不强套STAR｜编号逐层比较并加入同一下游等待反例，保留基础设施作用目标，不引导无证扩容。 来源：908–980行。编辑边界：耗时故障情境为假设；源文支持三种职责，保留旧卡对单体单机与微服务必容错的修正。
- `ch03.interview.m01.speech-chain.001`｜STAR｜改为诊断STAR，把两类现象分开证据，补数字字段与阶段计时的行动，R明确预期。 来源：454–486行。编辑边界：两个工单故障及数量例为假设；不沿用源文WER/RTF的通用门槛或固定内部架构。
- `ch03.tech.evaluation-contract.001`｜STAR｜改为上线决策STAR，行动分数据可信、任务指标、真实试点，补平均分掩盖资格承诺的因果例。 来源：1274–1311行；534–539行。编辑边界：离线提升和两类问题为假设；源文支持多指标、离线上线区分、测试隔离与灰度降级。
- `ch03.interview.m01.retrieval-ranking.001`｜STAR｜改为STAR，先资格再召回再排序，保留推荐技术链路并区分合理过滤与信号不足。 来源：488–524行。编辑边界：供应商、合同与新品例为编辑假设；源文支持召回/排序/重排、内容推荐与多种效果指标。

## 3.2（18张）

- `ch03.interview.m02.label-governance.001`｜STAR｜改为STAR，拆意图识别与承接动作，行动补指南→双标→裁决→复标，避免机械投票。 来源：367–415行。编辑边界：冲突工单为假设；源文支持标签质量、指南和抽检，不采用固定分歧比例。
- `ch03.ml.fit-diagnosis.001`｜STAR｜改为排查STAR，先重放管道再做泛化比较，并在核心答案保留欠拟合不同方向。 来源：670–743行；745–810行。编辑边界：特征为空为假设；源文支持拟合表现与改进手段，固定百分比诊断不采纳。
- `ch03.interview.m02.bias-variance.001`｜编号；辨析/机制/计算目标，不强套STAR｜定义后补各自实验对象和控制条件，以旺季/深树对照解释，不照抄泛泛的加复杂度建议。 来源：745–810行。编辑边界：旺季与深树为假设；源文定义可复用，误差分解及单调权衡作限定。
- `ch03.interview.m02.algorithm-mechanisms.001`｜编号；辨析/机制/计算目标，不强套STAR｜用相同输出/预测机制维度比较四法；补读决策树正文，修正旧引用遗漏树机制的范围。 来源：943–1033行；1085–1140行；1210–1280行。编辑边界：订单特征为假设；树补引同一源文1210–1280行，其余机制沿用正文。
- `ch03.interview.m02.group-bias.001`｜STAR｜改为STAR，先样本与坏例再数据偏差，避免直接认定歧视；R按关键群体风险验收。 来源：1983–1995行。编辑边界：小客户缩写及表单为假设；源文支持采样、标注、历史和反馈偏差，不推断法定合规。
- `ch03.interview.m02.cold-start.001`｜STAR｜改为STAR并分新客户/新品行动，补退出条件与有效反馈，保留冷启动目标。 来源：1997–2010行。编辑边界：配送、资质及采购动作是编辑假设；源文支持热门/问卷/属性/内容/探索。
- `ch03.ml.problem-contract.001`｜STAR｜改为需求STAR，样本/特征/标签/动作按时间展开，防止以接单组替业务意图。 来源：304–361行；81–96行。编辑边界：工单与排班例为假设；源文支持术语、问题定义、成功标准和约束。
- `ch03.interview.m02.feature-experiment.001`｜STAR｜改为假设检验STAR，新增未上报与未操作区分，实验明确同基线消融而非重要性排名。 来源：445–474行；1966–1981行。编辑边界：7天和物流信号为假设；源文特征工程支持候选构造，补同源泄漏证据1966–1981。
- `ch03.interview.m02.regularization.001`｜编号；辨析/机制/计算目标，不强套STAR｜按惩罚/效果/验证三层重写；修正旧引用起点不含L1定义，改同源1035–1078。 来源：1035–1078行。编辑边界：相关订单量例为假设；源文支持惩罚与欠拟合，不采用逐参数缩小或组合必优的保证。
- `ch03.interview.m02.model-selection.001`｜STAR｜改为选型STAR，列公平调优和错误成本证据，防止把原文算法偏好当强制排行。 来源：1879–1959行。编辑边界：订单任务为假设；源文支持场景约束与先简单后复杂，不背固定数据量分界。
- `ch03.ml.evaluation-split.001`｜编号；辨析/机制/计算目标，不强套STAR｜核心编号解释间接泄漏因果，加入修复后的测试地位与部署划分，保持评估机制目标。 来源：486–496行；839–854行；1966–1981行。编辑边界：试模型与客户例为假设；源文支持划分/交叉验证/泄漏，对只能用一次作语义限定。
- `ch03.interview.m02.regression-metrics.001`｜编号；辨析/机制/计算目标，不强套STAR｜编号讲分母机制→替代指标→动作损失，补明确单位，保持回归评估而非泛泛上线题。 来源：604–618行。编辑边界：销量数值为假设；零值/R²边界沿用既有修正，源文提供指标与业务对齐依据。
- `ch03.ml.release-recovery.001`｜STAR｜改为发布STAR，策略选择对齐问题，A包含失败演练与成套版本，R保留在途恢复。 来源：621–664行；2109–2121行。编辑边界：工单上线为假设；源文上线和迭代依据可复用，不采用固定流量/漂移必重训。
- `ch03.ml.confusion-cost.001`｜编号；辨析/机制/计算目标，不强套STAR｜重新写明各格推导与所有分母，再用全判普通反例解释业务取舍，计算题使用编号。 来源：556–602行；2034–2038行。编辑边界：100/20/25/15均为题设假设；公式和不平衡依据来自源文。
- `ch03.ml.leakage-prevention.001`｜STAR｜改为修复STAR，按字段时间表→隔离预处理→重新评估执行，区分时间泄漏和统计泄漏。 来源：1966–1981行；486–496行。编辑边界：7天任务为假设；同源泄漏与划分证据充分，旧成绩不得继续作为验收。
- `ch03.ml.learning-signals.001`｜编号；辨析/机制/计算目标，不强套STAR｜编号围绕信号/输出/边界重写，核心保留每类可迁移例子与组合，不复制泛化方案模板。 来源：127–177行；215–300行。编辑边界：业务例子为假设候选，不代表已部署或有效；源文支持范式和奖励/探索，成本及应用比例不引用。
- `ch03.interview.m02.explanation-limit.001`｜编号；辨析/机制/计算目标，不强套STAR｜用逆向因果说明错误，再给解释的核查与用途；本题是推论辨析，用编号而非造项目STAR。 来源：2019–2032行。编辑边界：催单例为假设；源文支持SHAP/LIME/解释用途，因果边界沿用既有活动卡。
- `ch03.ml.ensemble-tradeoff.001`｜编号；辨析/机制/计算目标，不强套STAR｜编号重写随机性与整体损失两种机制，补共享盲区反例，保留技术比较目标。 来源：1282–1368行；1832–1875行。编辑边界：缩写场景为假设；源文支持森林/提升/集成代价，纠正整体残差及免费午餐表述。

## 3.3（16张）

- `ch03.dl.convolution-bias.001`｜编号；机制/比较/计算目标不强套STAR｜编号解释参数为何省、计算为何仍增，补下采样证据丢失例，保留CNN机制目标。 来源：533–583行。编辑边界：划痕例为假设；源文局部与复用可用，平移不变和空间丢失作限定。
- `ch03.dl.generative-mechanisms.001`｜编号；机制/比较/计算目标不强套STAR｜逐族解释训练信号与采样路径，补模式覆盖和商品事实例，不照抄旧质量排行。 来源：842–929行；950–978行。编辑边界：商品样图例为假设；源文支持三机制，潜在先验与去噪限定沿用原卡。
- `ch03.dl.gradient-diagnosis.001`｜STAR｜改为诊断STAR，先冻结/数据/数值再梯度证据，行动区分路径和幅度措施。 来源：307–317行；343–393行。编辑边界：停滞/NaN与坏批次例为假设；源文支持梯度及措施，不采用权重单阈值定因。
- `ch03.interview.m03.residual-path.001`｜编号；机制/比较/计算目标不强套STAR｜用公式逐段解释修正、梯度与执行三层，保留维度契约，避免电梯类比遮蔽机制。 来源：419–443行。编辑边界：质检例为假设；源文支持捷径，公式与维度沿用已有卡的编辑细化。
- `ch03.interview.m03.training-budget.001`｜编号；机制/比较/计算目标不强套STAR｜计算题按单位→总投入→日历展开，新增试跑校准对象，不将旧结论拆行冒充改写。 来源：1054–1095行。编辑边界：全部费用/次数为假设，源文只支持数据/算力/时间/部署协作维度。
- `ch03.dl.training-inference.001`｜编号；机制/比较/计算目标不强套STAR｜编号拆四职责并解释数值信号与用户纠正区别，保留训练/推理目标及端到端延迟边界。 来源：161–261行；263–280行。编辑边界：划痕纠正为假设；源文四步依据复用，不沿用用户延迟等于前向计算。
- `ch03.interview.m03.augmentation-contract.001`｜STAR｜改为STAR，行动明确先划分、检查缺陷、真实分层对照，因果解释增强噪声如何产生。 来源：485–521行。编辑边界：包装/受潮例为假设；源文支持增强与语义限制，来源分组是沿用原卡编辑边界。
- `ch03.dl.activation-nonlinearity.001`｜编号；机制/比较/计算目标不强套STAR｜用仿射展开给可检查推演，核心区分表达集合和训练优化，不依赖旧投票类比。 来源：97–158行。编辑边界：缺陷关系为假设；源文支持非线性必要性，纠正偏置等于二元门槛及Softmax专用。
- `ch03.dl.recurrent-memory.001`｜编号；机制/比较/计算目标不强套STAR｜编号沿递推→门控→依赖间隔展开，把无限记忆纠正留在核心答案。 来源：621–699行。编辑边界：设备告警例为假设；源文RNN/LSTM职责复用，永不衰减及固定架构速度排名不引用。
- `ch03.interview.m03.dropout-modes.001`｜编号；机制/比较/计算目标不强套STAR｜编号讲掩码机制及补偿时机，明确实现限定；第一方Dropout文档已复核。 来源：446–483行。编辑边界：发票例为假设；PyTorch官方资料见本文核验链接，source_refs保留课程快照，不伪称实现细节由课程支持。
- `ch03.interview.m03.loss-business.001`｜STAR｜改为STAR，A先讲交叉熵为何可与业务错位，再讨论采样/权重/阈值及容量，保留损失技术目标。 来源：194–223行。编辑边界：质检例为假设；课程支持损失目标，分层/阈值为沿用旧卡细化。
- `ch03.interview.m03.optimizer-tradeoff.001`｜编号；机制/比较/计算目标不强套STAR｜按更新信号/衰减/比较证据重写，第一方Adam与AdamW论文复核解耦，删除排名式承诺。 来源：263–280行。编辑边界：实验A/B例为假设；论文链接在本文，课程提供优化器概览，解耦明确属外部编辑核验。
- `ch03.dl.hierarchical-representation.001`｜编号；机制/比较/计算目标不强套STAR｜编号明确学习表示受目标塑造，并用背景捷径建立因果，保留深度学习定义而非选型泛化。 来源：15–89行；585–597行。编辑边界：暗背景与相机为假设；课程层级例可复用但不当固定规律。
- `ch03.interview.m03.batchnorm-deployment.001`｜STAR｜改为诊断STAR，保留BN变换与统计机制，固定输入查状态/配置后归因；官方文档已复核。 来源：395–417行。编辑边界：质检波动为假设；具体PyTorch配置在本文核验链接，不声称课程含该参数。
- `ch03.interview.m03.monitoring-evidence.001`｜STAR｜改为STAR，先行/后验时间顺序明确，补最小化标识而非留全图诊断，保留延迟标签机制。 来源：1090–1095行。编辑边界：换相机、一周及运输例为假设；课程只列坏例/错误分析，延迟与归因沿用已有目标细化。
- `ch03.dl.selection-validation.001`｜STAR｜改为选型STAR，核心保留迁移/域差异、实际硬件和解释复核，纠正固定样本量门槛。 来源：64–89行；485–521行；997–1095行。编辑边界：质检与材质例为假设；迁移收益不承诺，课程选型/增强/协作依据复用。

## 3.4（11张）

- `ch03.interview.m04.decoder-tradeoff.001`｜编号；原目标是机制/技术比较，不强套STAR｜三点解释统一的具体位置及产品代价；补同源下一Token段，避免原引用只覆盖应用列表。 来源：571–577行；601–622行。编辑边界：客服例为假设；补571–577行训练目标，源文主流/涌现/双向理解排名不当事实。
- `ch03.interview.m04.multimodal-input.001`｜编号；原目标是机制/技术比较，不强套STAR｜编号沿图像序列→图文对齐→任务证据，补可见性与责任边界；机制题不造落地STAR。 来源：740–773行。编辑边界：货损和冲突文字为假设；ViT论文复核Patch/映射/位置，同源与第一方链接分开。
- `ch03.transformer.position.001`｜编号；原目标是机制/技术比较，不强套STAR｜核心补RoPE作用于Q/K与相对点积，解析按证据移位检查，不背上下文版本排行。 来源：306–372行。编辑边界：合同与附件为假设；RoFormer论文复核，源文位置概述支持，其无限外推表述作限定。
- `ch03.interview.m04.moe-resources.001`｜编号；原目标是机制/技术比较，不强套STAR｜编号拆选择性计算、权重驻留、负载路径；源引缩到FFN/MoE段并以Switch论文核验。 来源：481–503行。编辑边界：供应商及CPU调入为假设；课程支持MoE和通信，第一方详据见本文，无闭源推断。
- `ch03.transformer.architecture-families.001`｜编号；原目标是机制/技术比较，不强套STAR｜按信息流/目标/输出逐类重写，补T5片段目标及Decoder-only无独立编码源，保持经典模型范围。 来源：95–115行；509–577行；624–680行。编辑边界：工单例为假设；课程对应经典训练目标充分，家族所有成员不作同构保证。
- `ch03.interview.m04.compression-choice.001`｜编号；原目标是机制/技术比较，不强套STAR｜技术比较按作用位置展开，新增算子为何不能从零值推加速，沿用资源/质量双约束。 来源：890–903行。编辑边界：文件减半及错判为假设；同源压缩概述可用，非结构剪枝边界沿用已发表编辑细化。
- `ch03.transformer.attention-cost.001`｜编号；原目标是机制/技术比较，不强套STAR｜编号明确理论计算项与实际IO两层，纠正源文“算法不变”措辞，第一方FlashAttention已核验。 来源：684–710行。编辑边界：4000/8000为假设长度；论文支持精确分块与IO，课程固定倍数/必须采用不写入。
- `ch03.transformer.multihead.001`｜编号；原目标是机制/技术比较，不强套STAR｜重写投影子空间与组合的实际链路，用固定宽度说明头数取舍；追问改为可检验的冗余消融。 来源：249–302行。编辑边界：工单主体例为假设；原论文多头/固定维度核对，MQA只保留边界不设额外背诵。
- `ch03.transformer.qkv-aggregation.001`｜编号；原目标是机制/技术比较，不强套STAR｜用给定归一化权重说明多源汇聚，明确数字假设与统计前提，保留QKV链路而非类比答题。 来源：143–245行。编辑边界：0.6/0.4是编辑假设；原论文复核缩放与投影，课程错误演算不引用。
- `ch03.transformer.parallel-boundary.001`｜编号；原目标是机制/技术比较，不强套STAR｜编号按训练与生成已知信息解释差别，补缓存作用与内存代价，保留与RNN比较。 来源：19–66行；571–622行。编辑边界：客服长摘要为假设；课程因果生成与并行证据复用，KV沿用既有卡补充。
- `ch03.transformer.block-roles.001`｜编号；原目标是机制/技术比较，不强套STAR｜逐组件补真实作用与非保证边界，特别澄清共享FFN和残差执行，避免原文拟人类比。 来源：376–438行；442–479行。编辑边界：深层费用说法为假设反例；原论文FFN共享、残差核验，LayerNorm沿用现有技术修正。

## 独立审查反馈处理

- 首次与最新核对`review-a.json`：module=1共有12张，全部pass，revise=0；没有属于m01的具体需修项，因此不制造无依据改动，未触及审查文件或其他组。
- `ch03.interview.m02.explanation-limit.001`：最新报告标revise，指出原卡的“复核和申诉”被缩成只有复核。已在正面明确纠错范围，第三核心点及第三必答点恢复人工复核与申诉/纠错；解析补事实更正→责任人核实际输入/模型版本与依据→重判或撤销的例子，追问及评分同步要求。属于恢复既有动作保障，不增加目标。作者自检已对齐，仍为draft，等待独立复审，未代标pass或accepted。

## 第一方核验与来源边界

核对日：2026-10-07。以下为编辑核验链接，不新增来源表、不为网页伪造content_hash，source_refs仍只对应source-index的不可变课程快照。每卡的具体假设和原文纠正已在逐卡条目与review.notes中标出。

| 目标卡 | 核验资料 | 支持结论与限制 |
| --- | --- | --- |
| m03.dropout-modes | [PyTorch Dropout](https://docs.pytorch.org/docs/2.14/generated/torch.nn.Dropout.html) | 训练随机置零且按1/(1-p)缩放，eval恒等；限定该实现，不把课程另一补偿约定直接套入。 |
| m03.batchnorm-deployment | [PyTorch BatchNorm2d](https://docs.pytorch.org/docs/2.14/generated/torch.nn.BatchNorm2d.html) | 默认跟踪运行统计供eval；track_running_stats=False则eval也用批统计；可学习缩放/平移。 |
| m03.optimizer-tradeoff | [Adam论文](https://arxiv.org/abs/1412.6980)、[AdamW论文](https://arxiv.org/abs/1711.05101) | 一二阶统计的自适应更新及解耦权重衰减；论文实验不代表通用优化器排名。 |
| m04.attention-cost | [FlashAttention论文](https://arxiv.org/abs/2205.14135) | IO感知分块和精确注意力，不把稠密配对算术复杂度变线性；不复用固定加速倍数。 |
| m04.qkv-aggregation / multihead / block-roles / parallel-boundary | [Attention Is All You Need，§3](https://arxiv.org/html/1706.03762v7) | QKV投影/缩放/掩码，多头组合，FFN同层各位置共享，残差连接及因果自回归；课程细化不推至所有架构。 |
| m04.moe-resources | [Switch Transformers，§2](https://arxiv.org/html/2101.03961v3) | 按Token路由、专家输出组合、容量与通信；特定设计单专家不设为所有MoE规则。 |
| m04.multimodal-input | [ViT论文](https://arxiv.org/abs/2010.11929) | 图像Patch表示序列；实际货损质量/图文融合另验证，不拿图像可编码证明业务能力。 |
| m04.position | [RoFormer论文](https://arxiv.org/abs/2104.09864) | 旋转绝对位置并使注意力包含相对关系；不是无限长度可靠性保证。 |

## 快照与机械自检

- 3.1：`第3章-技术攻克/3.1-AI-产品技术理解要求.md`；SHA-256=`13d2be94cafa126ed9804194d57b5035abc64de9d0de8825f8813a88e81c4011`，本次读取实际内容与索引相符。
- 3.2：`第3章-技术攻克/3.2-机器学习.md`；SHA-256=`c1bc39734842d2a1e41c4fafc9aab1eea78189222eb2f799a911fe1a6d67d5d9`，本次读取实际内容与索引相符。
- 3.3：`第3章-技术攻克/3.3-深度学习.md`；SHA-256=`4e5c963fc95f9f7c8700d9e6f33ed56f6b543df607ec843adbb127b68f7446b9`，本次读取实际内容与索引相符。
- 3.4：`第3章-技术攻克/3.4-Transformer.md`；SHA-256=`8af10abfd69973f335f51729a0feab425c96cca1a4cf80e2e5106ee3daad3a52`，本次读取实际内容与索引相符。

交付为m01=12、m02=18、m03=16、m04=11，共57张；20张紧凑STAR，37张编号。逐张人工撰写新prompt、answer_short、required_points、explanation与pitfalls；没有读取旧必答点自动生成答案的转换。Python仅封装手写内容、复制受保护身份/来源字段及自检。

逐卡核对：正面每个显式要求在核心答案和必答/评分有落点；非必答追问仍给参考答案；结果仅为预期/验证。m02解释卡已额外恢复既有申诉保障。草稿只含指定16字段，source_refs仅4字段；身份键/概念/position/课程source_key均对应实时输入，revision=active_revision+1；所有源hash/行号、字符上限、枚举与30–90秒范围通过。m02算法卡补同源树机制1210–1280；正则卡改1035–1078以含L1；特征卡补同源泄漏；m04统一接口补571–577，MoE缩到481–503。没有新目标或来源表。

下面是可重复的只读标准库检查，需在仓库根目录运行；它不连接DB，也不读取环境文件。它验证结构和身份，不代表独立内容审校：

```python
import hashlib, json
from pathlib import Path
root = Path('artifacts/ch03-interview-restructure-20261007')
sources = json.loads((root / 'source-index.json').read_text())
fields = set('canonical_key lesson_source_key concept_keys revision position title kind prompt answer_short required_points pitfalls explanation estimated_seconds source_refs review'.split())
seen = set()
for n, expected in enumerate((12, 18, 16, 11), 1):
    source = sources[n - 1]
    raw = Path(source['absolute_path']).read_bytes()
    assert hashlib.sha256(raw).hexdigest() == source['content_hash']
    old = json.loads((root / f'm{n:02}-existing.json').read_text())
    old_by_key = {c['canonical_key']: c for c in old}
    draft = json.loads((root / 'drafts' / f'm{n:02}.json').read_text())
    assert set(draft) == {'batch_id', 'status', 'chapter_position', 'cards'}
    assert draft['batch_id'] == f'ch03-interview-star-20261007-m{n:02}'
    assert draft['status'] == 'draft' and draft['chapter_position'] == 3
    assert len(draft['cards']) == len(old) == expected
    assert {c['canonical_key'] for c in draft['cards']} == set(old_by_key)
    for c in draft['cards']:
        key = c['canonical_key']
        assert key not in seen and set(c) == fields
        seen.add(key)
        previous = old_by_key[key]
        assert previous['lesson_id'] == source['id']
        assert c['lesson_source_key'] == source['source_key']
        assert all(c[k] == previous[k] for k in ('canonical_key', 'position', 'concept_keys'))
        assert c['revision'] == previous['active_revision'] + 1
        for k, limit in [('title',80),('prompt',300),('answer_short',500),('explanation',1000),('pitfalls',500)]:
            assert 0 < len(c[k]) <= limit, (key, k)
        assert 1 <= len(c['required_points']) <= 3 and all(c['required_points'])
        assert 30 <= c['estimated_seconds'] <= 90
        assert c['kind'] in ('概念','对比','机制','场景判断','故障诊断')
        assert c['review']['status'] == 'draft' and c['review']['reviewer'] == '作者自检'
        assert c['review']['notes']
        assert all(c[k] != previous[k] for k in ('prompt','answer_short','required_points','explanation','pitfalls'))
        assert c['answer_short'].startswith(('一、','S｜'))
        assert all(s in c['explanation'] for s in ('【面试追问】','参考答案','评分'))
        assert c['source_refs']
        for r in c['source_refs']:
            assert set(r) == {'relative_path','content_hash','line_start','line_end'}
            assert r['relative_path'] == source['source_key'] and r['content_hash'] == source['content_hash']
            assert 1 <= r['line_start'] <= r['line_end'] <= len(raw.decode().splitlines())
assert len(seen) == 57
print('PASS: 57 cards, protected identities, revisions, source hashes/ranges, field limits')
```

## 未决与未完成边界

- 作者范围57张已全部完成，无缺卡或待核事实阻塞；无市场价格、厂商排行、虚构经历或已实现成果。
- 独立审校仍由审校者/主编完成；m02解释卡修复等待复审，本作者不替其更改审查结论。m03/m04完成后尚需独立内容审校，不以机械检查替代。
- 发布、DB回读与浏览器展示验证不在本作者授权内，本次未执行。全部status/review.status均保持draft，未自行标accepted。
