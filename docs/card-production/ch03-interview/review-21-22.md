# 3.21 / 3.22 独立内容审校

审校日期：2026-10-02。范围：M21 7卡、M22 10卡，批次JSON、生产Markdown、coverage台账及《题卡内容与答案质量标准》。仅内容审校，未修改批次、未发布、未运行框架/浏览器业务流。结论：17卡内容通过，无发布前内容阻塞；源码hash与行号真实性仍由主编对原始教材核验，本报告未取得原始教材全文，不把登记自报当全文独立查漏证据。

表中短名均对应 `ch03.interview.mXX.<短名>.001`。每卡八维均无0，保守判定≥14/16；不照抄作者自评16分。共同评分口径明确：三项required_points必答，解析实例与面试追问可选，不要求逐字背诵；未将可选实例暗设成必答。

| 卡 | 结论 | 具体理由与边界 |
| --- | --- | --- |
| m21.graph-execution | 通过 | State/Node/Edge责任和缺件回路一一对应正面；说明普通代码节点、编译不验证业务规则，避免画图即运行。 |
| m21.state-reducer | 通过 | 两种列表结果、未更新risk保留及并行合并均可评分；明确并发普通字段可冲突，不把reducer当事务/自动去重；空列表追问只作扩展。[Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api)支持该机制。 |
| m21.conditional-routing | 通过 | 模型标签、校验状态、路由与支付批准分开；未知值有兜底，题目所问低风险直付被明确否定；未把confidence当校准概率。 |
| m21.interrupt-resume | 通过 | 根因指向恢复时重跑中断节点，thread/checkpointer与人工输入明确；拆通知仍保留幂等和落盘窗口，不误承诺exactly-once。[Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)支持节点重跑。 |
| m21.graph-evolution | 通过 | 在途节点身份、字段改名/类型和业务版本兼容分开；旧检查点恢复验收及回退有具体动作。没有声称所有拓扑变更都不兼容；与第一方迁移章节一致。 |
| m21.workflow-coexistence | 通过 | 给出既有BPM与AI资料处理分工、成本及验证依据；避免厂商必选、不强依赖LangChain。[Overview](https://docs.langchain.com/oss/python/langgraph/overview)支持独立使用。 |
| m21.node-boundaries | 通过 | 依输入输出及独立失败/重试划界，解释大节点重试危害和过细成本；不机械按模型调用拆、不以拆分保证单次执行。 |
| m22.event-semantic-layer | 通过 | 传输与事件语义两层准确，SSE能送JSON；实现互操作不承诺低延迟或业务成功。[Overview](https://docs.ag-ui.com/introduction)支持协议定位。 |
| m22.thread-run-lifecycle | 通过 | 多run属于同thread，起止与会话/业务事实分开；迟到run实例有判错依据。中断outcome明确为草案，不当稳定字段必背。 |
| m22.text-event-assembly | 通过 | 按messageId独立组装Start/Content/End，交错消息实例能暴露误解；消息结束不作run终态，去重另需实现。[Events](https://docs.ag-ui.com/concepts/events)支持基础事件。 |
| m22.tool-event-completion | 通过 | 参数流完成与执行结果区分是本卡独立目标；toolCallId关联结果，失败/未知如实显示，不以END替代CRM落库。[Tools](https://docs.ag-ui.com/concepts/tools)明确组装后可执行并回传结果。 |
| m22.state-snapshot-delta | 通过 | 快照替换、JSON Patch顺序应用、漏补丁恢复基线均准确；数组错位例子有效，补放未冒充协议自动功能。[State](https://docs.ag-ui.com/concepts/state)支持该机制。 |
| m22.shared-state-authority | 通过 | 同步与双写冲突/批准分开，给出字段责任或版本规则；最终内容校验属于题中错误收件人场景必需边界，不是无关加码。 |
| m22.confirmation-contract | 通过 | 不把原文INTERRUPT固定名称当通用标准；客户端工具、回复关联、后台等待各有责任；[Events](https://docs.ag-ui.com/concepts/events)仍将扩展中断生命周期列Draft，具体SDK支持未冒充实测。 |
| m22.generative-ui-contract | 通过 | 事件传递、组件格式/渲染、动作授权分别约定；Schema/允许组件及降级有实例，合法组件也不豁免业务校验。 |
| m22.event-visibility | 通过 | 三层可见性与下一步行动相连；失败不隐藏，进度不作真实全部思维/可靠性证据，300ms/2秒未作通用SLA。 |
| m22.event-render-diagnosis | 通过 | 发出→接收→处理→渲染证据链与复测对齐；区分错run、缺终态、补丁失败；重放不重发业务副作用，模拟不冒充真实UI验收。thread/run关联可由应用上下文完成，未要求每种事件自身都含两个字段。 |

## 原题分流

coverage内M21有56条（22原生勾选+34正文目标），M22有43条（22原生勾选+21正文目标）；逐条都有分流决定与理由，均至少映射卡或实践，没有空决定/空去向。完整流程图、Hello World、监控/灰度/A-B、团队讲解留在母题或实践，实践完成数为0，登记覆盖不冒充发布覆盖。原文INTERRUPT断言经纠错进入确认卡；专门草案字段延期到具体版本核验，确认能力没有随字段一起丢弃。六面落地/评估/经济性由母题与实践承接合理，不强塞每张短卡。

## M24最终6卡的简短疑点

本次读取版本已为6卡。concept-layers、llm-shapes、hybrid-placement未见关键事实阻塞。human-resume与M21 interrupt-resume虽有联系，评分目标是批准版本改变后的重新审核，不能再以节点重跑作为新独立产能；failure-policy仍包含既有未知写结果目标，需以原题综合异常分流而非新机制解释留卡理由。platform-proof的Dify Human Input时效事实应保留主编的第一方核对来源；本报告未独立核对Dify，不追加平台能力保证。以上为范围/追溯提醒，不构成M21/M22阻塞。

## 核对限制

第一方文档可支持语义事实，不证明目标SDK/部署真实可用；草案标识以本次在线页面为准。未测试中断、迁移、补放或UI性能，未宣称任何真实实践通过。未读取凭证。
