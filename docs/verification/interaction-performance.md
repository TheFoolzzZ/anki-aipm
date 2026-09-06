# 交互性能诊断与修复验证

日期：2026-09-07。环境：Next.js 16.3.4 开发服务，Mac 本机浏览器，远程 Supabase Primary `ap-south-1`（Mumbai）。

## 修改前

| 探针 | 结果 |
| --- | --- |
| `/api/health` | 约 0.50 秒 |
| `/api/bootstrap` 三次热请求 | 2.56、1.86、1.95 秒 |
| 单卡详情 | 2.25 秒 |
| bootstrap 响应 | 283,883 bytes；lessons 约 250KB |
| 页面切换 | 动态 page 重挂载，重新显示整页 loading 并再次请求 bootstrap |

## 根因

1. `Studio` 数据壳挂在动态 catch-all page 下，route 变化会重挂载；初始化 effect 同时依赖 page，因而每次导航重新读取完整数据。
2. 本地到 Mumbai Supabase 的单次查询存在约 0.5 秒以上且有明显尾延迟；重复查询把网络成本放大。
3. bootstrap 对 lessons 使用 `select('*')`，传输了 UI 不使用的大量 headings。
4. 卡片详情串行读取 card 和 active revision；显示答案先读取完整 bootstrap，再读取详情。
5. React 开发模式会重复执行初始化 effect；旧实现会形成两条并行 bootstrap。

## 修改后

| 探针 | 结果 |
| --- | --- |
| bootstrap 响应 | 75,694 bytes，缩小约 73% |
| 单卡详情两次 | 1.17、0.98 秒；独立读取已并行 |
| 初次浏览器初始化 | 仅 1 条 bootstrap；开发模式重复 effect 被 in-flight 去重 |
| `/today` → `/curriculum` → `/cards` | route 响应 41ms、12ms；无新增 bootstrap |
| 进入 `/study?card=...` | route 响应 29ms；客户端直接使用已有数据，不再调用 `/api/study` |
| 显示答案 | 不再调用完整 bootstrap；只读取设置、该卡状态和详情 |

远程数据库查询仍有网络波动，实测单次显示答案曾为 4.2 秒；这是本机到 Mumbai 的真实公网尾延迟，不再由全站导航放大。Vercel 新项目默认 Function 区域为 `iad1`，而当前数据库在 Mumbai；仓库已固定 `bom1`，部署后函数到数据库应为同区域。最终云端绝对耗时仍须以 Preview Function 日志验证，不能由本地结果冒充。

最终验证：`npm run deploy:check` 通过，包含 TypeScript、14项测试和 Next.js 生产构建；`git diff --check` 通过。
