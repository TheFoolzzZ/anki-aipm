# Ch08 m08–m14 独立内容复审 B

2026-10-24更新：**当前38张均pass，revise 0，待复审0**。其中本轮逐卡实质复审9个新hash，29张内容哈希与原审完全一致，保留原分数、reviewer与哈希。当前卡体为STAR 22张、编号16张。2张未发布重复候选已由作者撤下并改为实际key复用，不计当前卡，也没有把原退回结论改成通过。

本轮只写同名review JSON和本说明。作者draft及其review字段未改、未accepted、未发布；没有DB写入。pass是绑定内容哈希的独立编辑结论，不代表新闻已全面核实、实践已运行、UI展示已验证或发布完成。本线程是Ch6/7原作者，未自审其标题；未参与本轮Ch08草稿创作与修改。

## 方法与变动核对

依据question-and-answer-quality-standard.md §6.3/§9，重读9张完整题面、短答案、全部评分、解析、误区、身份和refs，逐段对照原文LF，再查当前蓝图/coverage及408张基线实际题答评分。启动快照确认38当前卡中恰好9张变化，29张未变，撤卡名单恰好2张；写入前再次比对卡体，无新增漂移。

八维顺序为：原生目标/补题理由、题目条件范围、题答评分对齐、解析机制、实例推演、边界反例、事实来源与编辑假设、负担与去重。每维0–2，合计≥14且无0才pass。评分按每卡实质判断；两张仍有较多方法复用，第8维保留1分，非阻断说明留notes，所有当前pass的issues=[]。未做闭卷口答计时，90秒仍为预计。

哈希直接复用scripts/content-batch-lib.ts导出的canonicalJson：完整card只删除review字段后计算UTF-8 SHA256，对象键按项目规则排序、数组顺序保留。不是普通JSON.stringify哈希。任何后续卡体变动均须重新审校；未改29张不因文档同步而换哈希。

| 本轮卡key | 八维分数 | 合计 | verdict |
| --- | --- | ---: | --- |
| ch08.interview.m08.capital-vs-value.001 | 2/2/2/2/2/2/2/2 | 16 | pass |
| ch08.interview.m09.restriction-response.001 | 2/2/2/2/2/2/2/2 | 16 | pass |
| ch08.interview.m12.attribution-boundary.001 | 2/2/2/2/2/2/2/2 | 16 | pass |
| ch08.interview.m13.build-buy-scope.001 | 2/2/2/2/2/2/2/2 | 16 | pass |
| ch08.interview.m14.memory-boundary.001 | 2/2/2/2/2/2/2/2 | 16 | pass |
| ch08.interview.m14.feedback-regression.001 | 2/2/2/2/2/2/2/1 | 15 | pass |
| ch08.interview.m14.approval-contract.001 | 2/2/2/2/2/2/2/2 | 16 | pass |
| ch08.interview.m14.automation-modes.001 | 2/2/2/2/2/2/2/2 | 16 | pass |
| ch08.interview.m14.adoption-evidence.001 | 2/2/2/2/2/2/2/1 | 15 | pass |

## 9张实质复审结论

### ch08.interview.m08.capital-vs-value.001

- 2026-10-24逐卡复审：完整题答、评分、误区和解析均已重读；LF5–21、69–81仍只作议题，融资额、利润趋零及硬件必胜不作事实。
- required_points[0]已接受任意两种可区分、可检验且标假设的解释，不再强制长期期权/资金偏好这组作者分法，修复前次对齐扣分。
- 编号回答将融资动机、客户价值与复制难度分开；样机接管多的反例及复购/有效任务成本/复制代价可推翻壁垒判断，开放结论能稳定自评。

旧hash：`f3a156a3a28df449b57f1469e5ac66af58ee9dc81fa291ef26d15e0d0700de27`
当前hash：`2ec0780af8f00f4b5ceb701253e907e3c4eb602ff241dd20a19b563df6fc59a8`

### ch08.interview.m09.restriction-response.001

- 2026-10-24逐卡复审：完整STAR及LF37、59–65、82核对；题面已改为合规前提下尽量维持核心服务，并明确必要时降级或暂停，不再暗示保证零中断。
- 先核通知/状态/错误码和地区任务范围，再停高风险动作、采用已授权且已评测的备选/规则/人工；一次拒绝不等监管禁令，换地区账号绕限被明确排除。
- 摘要与退款不同风险的编辑例支持按任务处理；脱敏回放、用户告知、备用不安全停用及恢复前复测与三条评分一致，没有真实切换成果。

旧hash：`67406613be642b8c4342a10cd151edff6dd7bf3e0597ba17be96b8145b53b9a6`
当前hash：`86f75f5ae3f8f6c26cd01d61b2c3be4b2683e0f46bfddd39237338e4530f5659`

### ch08.interview.m12.attribution-boundary.001

- 2026-10-24逐卡复审：LF5–14、18–26中的首例/无人干预断言只作为辨析线索，答案明确区分可观察行为、研究归因和人类角色/目标来源等未知。
- 原先超出题面的防御方案必答已删除；当前两条required_points只评观察与归因证据、自动化不推出自主意图。防御已移入明确“不计评分”的可选追问，自评也不强迫回答它。
- 机器速度仍可由脚本或人工配置驱动的反例解释证据局限；不据此否认报告已观察动作，也不伪造全球首例或零人类目标，不提供攻击步骤，前次对齐0分已解决。

旧hash：`7cc2b22acb9fb6883c6a48e440b1043b37833b7479c7b8b73ba9079e4455c942`
当前hash：`69e6e85f86fb30753ace7b6306cc77473c59f78fe38269d25d0bdbe8d058a373`

### ch08.interview.m13.build-buy-scope.001

- 2026-10-24逐卡复审：题面与三条评分已收窄到从零训练、微调、自部署的权重来源、改动对象与维护责任，不再要求整套采购ROI、组织试点或路由流程。
- 从零训练学习权重仍可依赖外部架构/算力/数据；微调基于获准基座更新参数或适配器并承担回归兼容；自部署改变推理运行及运维范围，不能证明训练了权重。三条按共同维度对齐，原权重托管后再训适配器的例子可用于辨界。
- 与ch03.llm.deployment-tradeoff.001及本线程Ch7供给选型草稿的全成本决策已分开；当前独立目标是声明范围与责任辨析。LF21–31、68–76、93仅提供自研议题，机制为显式编辑补充，不推断微软内部路线或必然降本。

旧hash：`f98972f653f9f7f0d841be587f9d88318cb841e4b8b45384ef7ab86674d599d9`
当前hash：`be1f9fdc5fd4a69b1075d551cf082f59fc4134abc12a0b8691a2750122a2892a`

### ch08.interview.m14.memory-boundary.001

- 2026-10-24逐卡复审：LF154–168、100–102、515–516对照后，题面明确首次周报导入无关履历/家人信息且有其他Bot，补足了本课初始输入与共享范围条件。
- 完整STAR只给必要角色口径偏好，标来源时效，排除凭据/无关隐私；先查读取者、跨Bot共享、保存及导出删除，未知不先灌入。以虚构标记测试实际可见性及删除后检索，不拿真实隐私做探针。
- 实例已由联系人过期改为不必要家人住址/就医信息和共享文件/会话可见性；相对ch03.agent.memory-freshness.001，独立评分增量落在首次导入前最小化与共享边界，跨会话纠错删除及关键现状回查仍保留，不假定厂商入口已存在。

旧hash：`68b0a9402b1f8e815704ec02b71459cd7a8f62bb4f5fd37a3ace1431ae8c25f7`
当前hash：`9ed21de9c1fa1b32bdeed6d782f99c3fc93af00622c06bf12fa3518b53fed7c9`

### ch08.interview.m14.feedback-regression.001

- 2026-10-24逐卡复审：LF291–297、315–326、546–550只支持反馈与本地化议题；假设发票场景、权重训练未证实及无实绩边界均保留。
- 三条required_points现专门核含税/未税定义、缺失不得猜数、新会话留出和旧正确单据的来源核对、修正后退化与人工处理；训练位置已降为可选追问，不再额外强制回答。
- “总取最大金额”会错在退款/多税率的反例能解释局部修正为何不足；STAR有明确验证/失败处理，未上传真实未授权票据。
- 非阻断复用提示（第8维1分）：留出与旧样例回归方法仍与ch03.prompt.regression-versioning.001及ch03.interview.m05.icl-vs-training.001有较多共用。当前以中文财务字段真值和缺失/退化作独立评分可以保留，不再扩成通用训练机制卡。

旧hash：`84055b29113fa47341c4031361ccc3feed824429b2cff38ab2bfdbade4b65037`
当前hash：`04209c27df4f9ebadbf6e4649a192f27f752fbc7e4bfb1bb935569836a1a91e4`

### ch08.interview.m14.approval-contract.001

- 2026-10-24逐卡复审：LF347–362、534–535的审批宣传未作充分安全保证；题面、STAR、例子和评分已共同落在Bot A/企业账号甲的批准被Bot B/账号乙复用。
- 金额未变也不构成继承授权，执行身份/账号/任务/版本均须绑定并由执行侧核验；可信授权规则允许的交接须按新状态核准，非简单地禁止一切合法协作。
- 有权人核对象金额依据、影响恢复，低风险有界预授权与高风险状态变更重审分开；假交易查跨身份复用、过期重复拒绝和合法一次执行。相对旧的改金额/审批等待卡，新增共享浏览器身份混用与换Bot绕过边界已由独立评分承载。

旧hash：`9123034e1a86b7385c09924d4f2c66ce967159d2b94105279031c44e0ffa368b`
当前hash：`46dfefe73f7d61fef941e47ff8d87fc3754b59d13e54a9989fba8072c717b3f2`

### ch08.interview.m14.automation-modes.001

- 2026-10-24逐卡复审：LF406–428、537–538的三类形态按共同维度说明，题面、required_points和自评都明确每类仅需触发方式、一个关键失败及对应验收，不要求背全失败清单。
- 哨兵事件/有界定时对应检出通知与源/游标风险，流水线依赖交接对应版本责任及重复传播风险，夜批有限窗口对应范围时限与配额会话风险；这些是可供选择的失败/验收，不把同类全例强加评分。
- 500条只完成300条是编辑假设；共同授权、预算、状态及可停边界没有被缩短答案时删去。云端不等免费/无故障，关客户端不等服务端停止；本轮未做90秒口答实测，预计秒数不冒充实测。

旧hash：`a5c7240b25a12f986491656e143b466cf08b0fba44d9f21cd6e92ff9a8992d05`
当前hash：`7f993ba7e1dba0763eb509711c7cc9c650bc99f3359fc65206525bd9d41d70c5`

### ch08.interview.m14.adoption-evidence.001

- 2026-10-24逐卡复审：LF60–78、511–553、470–476旧教程中的价格/试用/中文/人数/早用复利均只作线索，不变成当前厂商事实。
- 评分和自评已统一为规则可用性、任务价值、退出/扩编三类证据；本地化只选相关例子，不逐项背价格地区配额或强加完整采购流程。未核项保留未知、允许不采购，与题面四种采用理由的审辨对齐。
- 中文流畅但币种/时区错的例子把演示与业务正确分开；同授权脱敏任务看合格任务成本，并以可携带性、退出代价和边际收益决定范围，没有承诺早用复利。
- 非阻断复用提示（第8维1分）：证据组织仍与ch03.interview.m24.platform-proof.001有较多共用；当前课内增量是本地化字段真值、团队扩编边际收益和旧教程复利承诺辨析，保持该范围即可，不再复制完整平台选型题。

旧hash：`2fdf3779ea1597cba2833321984b46b76cb8cf17771f3285d9e9b464a25ccf71`
当前hash：`8021af1e0b1691587bbd8376fdaca37af244d3f1bac9f09bcb0927f1998245be`

## 撤卡与实际复用

旧审40张为37pass/3revise。此次归因卡在新hash下通过，2张重复候选撤下后当前共38张。旧候选的最后一次内容哈希仅作历史定位：

| 撤下key | 历史hash | 当前去向 |
| --- | --- | --- |
| ch08.interview.m11.open-weight-boundary.001 | 70cd0bd0190fbd73166d535d25e71e7c2dd7734d534a3780d80e0b1cbc4cc626 | 三张现行卡及M1/P1 |
| ch08.interview.m12.untrusted-input.001 | 0510146f3067529a34ec24b9e715fccadee10c4bf3fc919697f3d6209b308bcd | 现行Ch03工具结果信任卡及M1/P1 |

m11的O1及E-open-weight-boundary已用真实keys，附完整reuse_evidence，其题面、answer_short、required_points和基线目录SHA256均逐项与当前baseline-active-catalog.json相符：

- ch03.interview.m05.license-evidence.001：具体版本、来源、许可/使用条件及商用修改托管分发的准入证据；不等开放即免费或完全自主。
- ch07.interview.m03.bottleneck.001：多模型可能共享上游、风险相关，需验证替代容量和任务效果；不证明特定厂商独立。
- ch07.interview.m01.data-loop.001：反馈获权且有质量、治理后有效改进、任务价值与回流验证；使用量不自动形成飞轮。

m12的O1、R2及E-untrusted-input已复用ch03.agent.tool-result-trust.001：外部内容不构成授权，执行侧同时限制读取与发送，检验实际跨工具数据流并有正常任务对照。附件替代网页没有新机制，因此不另增同义卡。原候选、原文行段和分流理由仍登记；跨课复用没有将当前Ch08 card refs改成其他lesson的来源。

## m12-R2逐行覆盖边界

本次同时核对coverage的scope_breakdown及蓝图M1/逐行说明，结论一致：

| 原文行 | 目标 | 当前承载 | 不作完成的范围 |
| --- | --- | --- | --- |
| LF32 | 模型输出有害内容怎么办 | 延期，actual_card_keys=[] | 未界定输出对象、伤害类型及内容安全验收；权限门禁不替代治理 |
| LF33 | 数据隐私怎么保护 | 部分承载：execution-policy及ch03.agent.tool-result-trust.001 | 只含授权任务最小读取与跨工具外发；一般采集、训练用途、长期保存删除等完整治理未承载 |
| LF34 | 模型幻觉怎么解决 | 延期，actual_card_keys=[] | 归因辨析、输入信任不等事实忠实评测与幻觉治理 |

M1已补同样边界，不能用其泛安全表述宣称三项目标完整覆盖。R2仍是一条原生登记，其scope_breakdown不新增原生分母。七课共46条原生登记；登记100%不等题卡、实践、学习或发布覆盖100%。这些明确未承载/延期项不妨碍当前范围已合格卡的内容pass，也不会因本次pass变成已完成。

## 蓝图、来源与剩余风险

- 当前七课蓝图的题面、核心答案、解析和逐卡hash已与draft同步；coverage的38个当前card_content_hashes也匹配。m13补题理由已改为三条路线来源/改变/维护责任；m14首次输入、财务字段、共享账号、比较负担及采用证据的独立评分范围能在当前卡体定位。
- 当前refs仍属各自lesson，实际原文文件SHA256与source-index/ref一致，LF行段有效。原文新闻、量化收益及作者意见只作线索；9张中的情境、机制或数字已明确编辑标识。本次未重新联网核验动态厂商信息，不据旧教程宣布价格、准入、记忆管理入口或内部路由能力。
- 共享电脑/文件/浏览器不构成权限隔离；当前审批身份和账号绑定、必要的数据最小化、停止/接管、去重及纠错删除验证没有因缩题删掉。所有实验与假交易均为设计，实际执行仍未完成。
- feedback-regression与adoption-evidence的通用回归/采购证据方法仍与Ch3复用，已在JSON notes说明；当前财务真值及扩编边际收益等课内范围不再额外强迫通用机制背诵。

## 当前38张哈希索引

同名JSON的cards仅包含当前38张。29张保留原审，不把它们描述为本轮重新全文审读；逐卡原notes保留，非阻断建议均在notes，issues=[]。

| canonical_key | 本轮处理 | 总分 | content_hash |
| --- | --- | ---: | --- |
| ch08.interview.m08.capital-vs-value.001 | 本轮复审 | 16 | 2ec0780af8f00f4b5ceb701253e907e3c4eb602ff241dd20a19b563df6fc59a8 |
| ch08.interview.m08.task-entry.001 | 原审哈希保留 | 16 | 7cc1010b070cdb57dd341f26085868d0fa74d1be5c49e0bf78a8ac82524a5032 |
| ch08.interview.m08.form-factor.001 | 原审哈希保留 | 16 | 966beca7a11e6f469fe25f3edac98cbf044bcd1453c162dd3fc03d4cfa95a093 |
| ch08.interview.m08.effective-task-cost.001 | 原审哈希保留 | 16 | 0510bb9be7b2faf2ebd0b2666648c74e8739f53b41905edc553c4c0fee88a2b6 |
| ch08.interview.m08.physical-safety.001 | 原审哈希保留 | 16 | 977c56e3a65b798e0b087f285cab331ffd1db9e35118ea0ce58f7001cb4b5f89 |
| ch08.interview.m09.restriction-response.001 | 本轮复审 | 16 | 86f75f5ae3f8f6c26cd01d61b2c3be4b2683e0f46bfddd39237338e4530f5659 |
| ch08.interview.m09.fallback-compatibility.001 | 原审哈希保留 | 16 | 03f67ae40a1514010829d8956964d282725aa4397040ea2c6f078495c386d8ba |
| ch08.interview.m09.staged-release.001 | 原审哈希保留 | 16 | 02e1a5e7053406fca0345ee7666df0dbe12a71a99b1e619abd4f5257d264493f |
| ch08.interview.m09.tiering-evidence.001 | 原审哈希保留 | 16 | dcfc7b3d06d9c8284fa9c2c88ea51e48ca1c13ea2c0463fc517879ee504d9ca4 |
| ch08.interview.m10.first-use-case.001 | 原审哈希保留 | 16 | 6d3c365b59041d4d3446a304bcc9b725bd9ec3710b61b933475bbe48f4667672 |
| ch08.interview.m10.wearability-tradeoff.001 | 原审哈希保留 | 16 | 7e14521ccfa9136aa1fceb47d29a9bf7c422fc98e35bf9ee58b9b55437608694 |
| ch08.interview.m10.bystander-privacy.001 | 原审哈希保留 | 16 | f223a8af8253157b968d5b908adfeb8c0db385158658e88c90cc79ba0ee60639 |
| ch08.interview.m10.incremental-value-test.001 | 原审哈希保留 | 16 | f8b56daaa30181162b44f6d546f1b253a0c0fdc3b8e55a7f4482bcf297b21a79 |
| ch08.interview.m11.narrative-evidence.001 | 原审哈希保留 | 16 | 8bab0d4318adb0f0235dfe14970a4650ff0af91ff85c46ac94594ecebad5b467 |
| ch08.interview.m11.dependency-register.001 | 原审哈希保留 | 16 | 0253f2a66f9bb2c66b27fbd328b0f17420845bab352f2f1bb96889f116a590a3 |
| ch08.interview.m11.exit-route.001 | 原审哈希保留 | 16 | c930ad20538fd3b0ab27169d45bed162242d34a23355c88bd1d73a4612f19be4 |
| ch08.interview.m12.attribution-boundary.001 | 本轮复审 | 16 | 69e6e85f86fb30753ace7b6306cc77473c59f78fe38269d25d0bdbe8d058a373 |
| ch08.interview.m12.execution-policy.001 | 原审哈希保留 | 16 | 7b1c1ef04c28bff8ce2fa02f8fee68a0abd805c5ded3211cb8910a89eb7df0c4 |
| ch08.interview.m12.runtime-stop.001 | 原审哈希保留 | 16 | 78cab266181206f25ed6373c877796405b3cf5c174f12ff97f1af24c6e25b46f |
| ch08.interview.m12.recovery-acceptance.001 | 原审哈希保留 | 16 | 7c6dec7803ce3233d213545b878d48f056082984b5ddf3e9c453c25e250c426c |
| ch08.interview.m13.build-buy-scope.001 | 本轮复审 | 16 | be1f9fdc5fd4a69b1075d551cf082f59fc4134abc12a0b8691a2750122a2892a |
| ch08.interview.m13.lifecycle-roi.001 | 原审哈希保留 | 16 | 726f4a8d06ef397a15fb69e6c5b31529dee402370102590e66e8442c169cc742 |
| ch08.interview.m13.mixed-routing.001 | 原审哈希保留 | 16 | 9cc11a1449837f506cc487c19eecb6a3a269f4ffd381a5d487bc9006220d3d40 |
| ch08.interview.m13.capability-gates.001 | 原审哈希保留 | 16 | 381972158df774546259c627be5f69762719c2bd147f8a784cb9d5e0b321316e |
| ch08.interview.m14.task-contract.001 | 原审哈希保留 | 16 | c28e36480028b3402a50b7701e41743d77f895bb08ffa64ff7cfefc5a6ffb182 |
| ch08.interview.m14.memory-boundary.001 | 本轮复审 | 16 | 9ed21de9c1fa1b32bdeed6d782f99c3fc93af00622c06bf12fa3518b53fed7c9 |
| ch08.interview.m14.team-routing.001 | 原审哈希保留 | 16 | 110347acc7b744aa843bffcbae58d6806861a5735460d2752e4e4b5fea30e715 |
| ch08.interview.m14.handoff-state.001 | 原审哈希保留 | 16 | e6d213cd401fe7fc3ad87728353f33d4d8d380358d505d069b4179a11de4187d |
| ch08.interview.m14.routine-generalization.001 | 原审哈希保留 | 16 | 95d053fb6166f476b046b4da1d748e3e5c1a522614d980a36727ecf4abe4de4a |
| ch08.interview.m14.feedback-regression.001 | 本轮复审 | 15 | 04209c27df4f9ebadbf6e4649a192f27f752fbc7e4bfb1bb935569836a1a91e4 |
| ch08.interview.m14.identity-isolation.001 | 原审哈希保留 | 16 | 2aa421106688d12629c035678b139fd6f8c0db1d3953cfa2aa8d09cec198f898 |
| ch08.interview.m14.tool-selection.001 | 原审哈希保留 | 16 | 5cd5fa6a4bab63b9e01c751ae0f262aab35b78aef6c4c49cb3829b75527830fd |
| ch08.interview.m14.approval-contract.001 | 本轮复审 | 16 | 46dfefe73f7d61fef941e47ff8d87fc3754b59d13e54a9989fba8072c717b3f2 |
| ch08.interview.m14.task-cost-diagnosis.001 | 原审哈希保留 | 16 | cfce92163cae0013ec89a8e563a48a6bac545b86df255c6e65a7ac12a4d49901 |
| ch08.interview.m14.release-evidence.001 | 原审哈希保留 | 16 | 7543933171280b5d7463aff271818bb14b90f3da54482dbbd9c8746de81792a3 |
| ch08.interview.m14.automation-modes.001 | 本轮复审 | 16 | 7f993ba7e1dba0763eb509711c7cc9c650bc99f3359fc65206525bd9d41d70c5 |
| ch08.interview.m14.unattended-quality.001 | 原审哈希保留 | 16 | 201673ebb20677d71874ceb6845ef7be3a4029191d5dd5624db3709176618ba8 |
| ch08.interview.m14.adoption-evidence.001 | 本轮复审 | 15 | 8021af1e0b1691587bbd8376fdaca37af244d3f1bac9f09bcb0927f1998245be |

## 写入前draft文件快照

| 模块 | 当前卡数 | 完整draft字节SHA256 |
| --- | ---: | --- |
| ch08-m08 | 5 | 5129830ffdfc0bd054fc6f1bdac82af1732db5e2caae9fe27a94e53b9a522807 |
| ch08-m09 | 4 | fede2ffc7e8db2453bc926532cca500df69ec11ee6c01feda9fabd10d12d77ee |
| ch08-m10 | 4 | d4e77fff7b2fb04bacc1c2b9a44afb1cb19822bb8cb5018146fd1e6b1c447117 |
| ch08-m11 | 3 | 64e127530c735119fd564b4e3a67efecdaf88bc92d54ff7f8971c635895da95b |
| ch08-m12 | 4 | 50b7168e7a8de3c248cf5b4e41e9a4173b749cca0b3d321ac58bb8ef23e3fc5c |
| ch08-m13 | 4 | 5b71ea0a6e7470ee7410294b65374a13400c826e10483ddad604aed340df06c7 |
| ch08-m14 | 14 | 16078378490a53e1d3806c7889fe830807d6a1385fe06714810177c59c455f4e |
