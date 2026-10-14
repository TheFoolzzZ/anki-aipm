# 第27–30课独立内容复核

2026-10-02。范围：4.1/4.2/4.3/5.1四个已保存批次，共14张；只审不改、不发布。按质量标准§5–9复核题答、3项必答、解释、例子、边界与可选追问；核对manifest及四份原文所有卡片引用段落和SHA-256，并检索3.1–3.26既有批次的邻近目标。未运行求职插件或编码工具，90秒为内容负担判断，未做学习者计时实测。

结论：14张关键事实与题答对齐通过；无发布内容硬阻塞。两项非阻塞改进为C12与3.8的已有复习目标重叠、投递卡pitfalls措辞过绝对；关系台账存在笼统关联。作者自检的accepted不构成发布或真实学习效果证明。

| 卡（canonical_key） | 结论 | 具体通过理由 / 问题 |
| --- | --- | --- |
| ch04.interview.m01.executable-loop.001 | 通过 | 三点分别覆盖行为验收、反馈/回归、风险/版本；10秒暂停例子能暴露“隐藏动画即修好”。与3.12 reflection-evidence及3.9回归共享原则，但新增事件状态与相关差异审查。和reproduction卡同情境，分别考结束条件/反馈输入，可保留。 |
| ch04.interview.m01.prototype-evidence.001 | 通过 | 区分三步交互完成、真实摘要与生产链路；模拟结果和样本边界明确，刷新丢任务例子解释持久化缺口。购买意愿追问可选；不要求90秒设计完整生产系统。 |
| ch04.interview.m01.reproduction-feedback.001 | 通过 | 三点覆盖前置状态/操作/差异、证据/范围、原步骤与邻近路径复测；没有把CSS或事件绑定猜测当事实。软件复现输入区别3.9输出契约/版本比较，核心可在90秒答出。 |
| ch04.interview.m02.three-surface-contract.001 | 通过 | 三端职责、身份/数据/结果契约、跨工程验证与问题对应；标明职责为编辑设计而非原案例源码事实。档案A/新配置读回例子完整，技术栈追问不加必答负担。 |
| ch04.interview.m02.page-context.001 | 通过 | Chrome第一方支持DOM读写、消息协作、默认隔离world和注入边界；没有把JS变量隔离说成DOM隔离。输入框/下拉框例子解释映射必要性，权限依具体注入方式核对而非固定要求任意站点权限。 |
| ch04.interview.m02.fill-versus-submit.001 | 通过，措辞建议 | DOM赋值→页面接受/校验→提交确认链路和用户提交控制逐点对齐，受控输入失败例子相关；未知状态复用3.12而非再造幂等卡。pitfalls“不把…截图当服务端保存证据”可改为“不把仅填写后的截图当保存证明”：可信业务回执的截图可以承载证据，不能一概排除。 |
| ch04.interview.m03.task-fit.001 | 通过 | 类别重叠、同仓库任务验证、环境/导出成本分别评分；数据库检查例子解释新项目Demo不足。与3.24 platform-proof有方法重叠，新增编码仓库上下文/跨文件/diff的验证对象，非同义目标。 |
| ch04.interview.m03.provider-cost.001 | 通过 | 开源许可≠模型/基础设施/维护免费、可切模型≠迁移免费，两处错误有独立回答；800+200=1000为显式假设。OpenCode第一方支持提供商/本地模型，未冒充当前月费或质量承诺。 |
| ch04.interview.m03.data-flow.001 | 通过 | 索引/推理/执行/回传、训练/保存/传输、方案证据三点对齐。Cursor第一方明确工具执行本地、agent loop云端、结果回传；例子未扩张为所有工具共同拓扑，无“本地即不出域”误导。 |
| C12 | 通过，已有重叠需记录 | 4000×2/百万+1000×8/百万=0.016元正确，完整请求与usage边界明确；重试/历史例子不重复算同一输入。3.8 request-monthly-cost已覆盖相同单次公式与账单边界，因此本卡不是新增能力；本轮为既有C12 revision 2，兼容修订可以保留，后续若去重应统一学习目标而非继续新增算术卡。 |
| ch05.interview.m01.concurrency-billing.001 | 通过 | 10万×20×0.01=20000元，题设已含重试不二次加；把时间分布与Token用量/独立容量合同分开。第三必答虽是边界但紧扣“为何不能乘系数”，不是额外母题负担。 |
| ch05.interview.m01.paid-cohort.001 | 通过 | 1000×9.9=9900，扣API为−10100；MAU平均0.2元不能替代付费收入分母。扣API后的贡献、整体利润和分群尾部界定明确，假设业务非真实财务；三个判断90秒合理。 |
| ch05.interview.m01.cache-economics.001 | 通过 | 未缓存/写/读/输出及前缀/长度/有效期/频率共同影响收益，usage验证与问题对齐。Claude第一方支持写读区别与前缀失效；未宣称所有供应商都有同一写入收费，假设低频失效例子解释经济性。区别3.25评测结果缓存身份与3.11答案缓存权限。 |
| ch05.interview.m01.batch-deadline.001 | 通过 | 响应时限、逐请求结果/过期/取回、完整成本三点对应正面；Claude第一方支持异步和custom_id/expired。998/1000=99.8%完成率正确，提交/批次结束不等于全成功；区别3.24通用调度，追问不要求背服务固定时限或折扣。 |

## 复核依据与阻塞

四份原文hash与manifest/card refs一致；14卡均有3项必答、解析、相关情境、pitfalls及明确可选追问/自评。核心回忆无需背卡背全文。编辑情境/补充有标识，厂商旧排名、价格与固定节省比例未进入必答。无凭证访问、批次修改或发布。

第一方公开核对：[Chrome content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts)、[Cursor Self-Hosted Machines](https://cursor.com/help/ai-features/self-hosted-machines)、[OpenCode providers](https://opencode.ai/docs/providers/)、[Claude prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)、[Claude batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)。均于本次复核读取；只核对卡上实际使用的机制，未替所有时效产品能力背书。

硬阻塞：无。非阻塞：C12记录为旧卡修订而非新增覆盖；投递pitfalls区分普通截图与可信回执证据；关系台账中page-context→ambiguous-tool-result、data-flow/task-fit→C12理由均为笼统“通用先修/拓展”，内容并未证明这些具体关系，建议删去或改为确有学习依赖的目标。未做真实插件、账单、学习者计时验证，不将本审阅当这些运行验收。
