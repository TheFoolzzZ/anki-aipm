# 核心算法与 API 审查

审查日期：2026-09-06。范围是 `src/lib`、统一 API 路由和学习核心迁移；不包含 UI、远端部署或 seed 数据正确性。

## 已验证

运行 `npm test`（`node --import tsx --test tests/*.test.ts`）覆盖并通过以下可重复检查：

- `ts-fsrs@5.4.2/FSRS-6` 为新卡生成 Again/Hard/Good/Easy 四个候选状态，首轮候选到期时间严格递增，且每个候选把 `reps` 推进一次。
- Asia/Shanghai、每日 04:00 的学习日边界：03:59:59 仍归前一学习日，04:00:00 切换至新学习日；返回的 UTC 起点正确。
- 被撤销的 review 不计入活跃复习、新卡数或耗时，因而不会错误耗尽当日新卡预算。
- 新卡额度受当日首评数限制；当天已出现的概念会排除其 sibling card，队列选择其他概念。
- HMAC 评分预览 token 绑定 purpose，任意篡改、错误 purpose 与过期 token 都被拒绝。
- SQL 契约静态检查确认评分/撤销 RPC 只授予 `service_role`，同一幂等键而不同哈希报 `IDEMPOTENCY_CONFLICT`，撤销要求目标仍是该卡最后事件且版本一致。
- API 路由只把已验签 token 的 `p.candidates[input.rating]` 传给 `apm_commit_review`，并传递状态/设置版本；畸形 JSON 现在返回 `422 INVALID_INPUT`，不再误报为服务不可用的 503。

另已运行 `npm run typecheck` 与 `npm run build`；二者均通过。生产构建识别到动态 `/api/[...path]` 路由。

## 修复

`src/app/api/[...path]/route.ts` 将 `JSON.parse` 失败转换为 `INVALID_INPUT`，由统一错误处理返回 422。这是输入错误，客户端可修正并重试，不应被包装成上游数据服务故障。

## 残余边界

- 本次没有连接远端 Supabase，因此未实证 RLS、RPC 事务锁、真实幂等重放和撤销的数据库运行结果；这些仍需在已迁移数据库上执行 `npm run db:verify` 与浏览器流程验证。
- 测试验证的是固定依赖版本下的调度输出关系，不把具体 FSRS 间隔天数当成跨版本稳定契约。
- `historyLimited` 为真时，当前内存统计只基于最近 1000 条事件；长期高频学习者的历史统计是否需要独立聚合查询，尚未在本轮范围内实现。
