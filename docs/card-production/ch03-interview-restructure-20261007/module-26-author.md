# 3.26 主编补写记录

2026-10-08：续接配额中断后的缺失模块，11张旧卡逐题重构，全部保持draft，等待独立审校。来源为source-index及m26-existing快照；没有改变来源文件或已有发布JSON。

读源覆盖原引用的类型、身份、读写、关系、动作、治理、抽取、草稿状态及租户段落。原文自建设计与官方概念分开：对象不必只作缓存，函数不等于动作类型，固定两图/权重/数量门槛/医疗规则不推广。

2026-10-08官方核对：[Ontology语义与动态元素](https://www.palantir.com/docs/foundry/ontology/overview)、[Action Type定义](https://www.palantir.com/docs/foundry/action-types/overview)、[Function用途](https://www.palantir.com/docs/foundry/functions/overview)。接口字段和部署权限需项目实现验证；卡片不硬编码当前SDK写法。角色协作、反例、成本与验收属于编辑推演，均不表示真实经历或已获结果。

|卡片|结构|具体改写与来源|
|---|---|---|
|ch03.interview.m26.ontology-layer.001|编号|逐题重写ontology-layer：依据原学习目标补齐因果、假设示例、执行边界与面试追问；适用设计诊断采用STAR，概念比较用编号。；L5–9，L98–141，L761–772|
|ch03.interview.m26.projection-authority.001|STAR|逐题重写projection-authority：依据原学习目标补齐因果、假设示例、执行边界与面试追问；适用设计诊断采用STAR，概念比较用编号。；L298–319，L374–384，L698–710|
|ch03.interview.m26.object-data-permissions.001|STAR|逐题重写object-data-permissions：依据原学习目标补齐因果、假设示例、执行边界与面试追问；适用设计诊断采用STAR，概念比较用编号。；L474–480，L2444–2568|
|ch03.interview.m26.reference-operational.001|编号|逐题重写reference-operational：依据原学习目标补齐因果、假设示例、执行边界与面试追问；适用设计诊断采用STAR，概念比较用编号。；L785–811，L856–888，L1744–1822|
|ch03.interview.m26.link-semantics.001|编号|逐题重写link-semantics：依据原学习目标补齐因果、假设示例、执行边界与面试追问；适用设计诊断采用STAR，概念比较用编号。；L123–127，L499–539，L1028–1061|
|ch03.interview.m26.object-identity.001|STAR|逐题重写object-identity：依据原学习目标补齐因果、假设示例、执行边界与面试追问；适用设计诊断采用STAR，概念比较用编号。；L115–157，L286–308，L2512–2568|
|ch03.interview.m26.action-function.001|编号|逐题重写action-function：依据原学习目标补齐因果、假设示例、执行边界与面试追问；适用设计诊断采用STAR，概念比较用编号。；L128–135，L323–363，L813–856|
|ch03.interview.m26.intent-granularity.001|STAR|逐题重写intent-granularity：依据原学习目标补齐因果、假设示例、执行边界与面试追问；适用设计诊断采用STAR，概念比较用编号。；L159–171，L398–410，L712–720|
|ch03.interview.m26.fde-delivery.001|STAR|逐题重写fde-delivery：依据原学习目标补齐因果、假设示例、执行边界与面试追问；适用设计诊断采用STAR，概念比较用编号。；L3–9，L79–94|
|ch03.interview.m26.extracted-rule-boundary.001|STAR|逐题重写extracted-rule-boundary：依据原学习目标补齐因果、假设示例、执行边界与面试追问；适用设计诊断采用STAR，概念比较用编号。；L826–836，L1545–1625，L1965–2060|
|ch03.interview.m26.draft-state-provenance.001|STAR|逐题重写draft-state-provenance：依据原学习目标补齐因果、假设示例、执行边界与面试追问；适用设计诊断采用STAR，概念比较用编号。；L2248–2319，L2409–2442|

契约检查：11卡身份、归属、position、concept_keys保留，revision+1，字段长度及来源hash/行号通过；7张STAR、4张编号。机械检查不替代独立内容审校、真实场景测试或学习效果。
