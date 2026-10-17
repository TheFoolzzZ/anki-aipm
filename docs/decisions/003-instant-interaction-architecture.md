# ADR-003 · 零延迟客户端浅路由与分层预取缓存架构

2026-10-17 · 接受。对应 `SPEC-003`（`docs/specs/v0.2-instant-interaction-architecture.md`）。

## 背景与问题

在 `Studio` 已经提升到根布局 `src/app/layout.tsx` 后，用户在实际使用中仍遇到两阶段明显卡顿：
1. 点击模块或课程目录后，需要等待 1~2 秒才会跳转到目标页面；
2. 跳转到课程阅读或卡片练习后，还需要再等待 1~2 秒从远端 Supabase (`ap-south-1`) 拉取数据才能渲染。

## 决策

### 1. 采用原生 `History.prototype.pushState` + `useInstantLocation` 外部状态存储实现 0ms 瞬时路由
- 由于本应用的所有视图均由持久挂载在根布局中的客户端组件 `Studio` 分发渲染，`src/app/[[...slug]]/page.tsx` 仅返回 `null`。
- 在 Next.js 16 中，不仅默认 `next/link` 会发起 RSC 请求，Next.js 还会覆写 `window.history.pushState`，在动态 catch-all 路由 `/[[...slug]]` 下派发 `ACTION_RESTORE` 并等待 RSC Flight 返回后才允许 `usePathname()` 提交。
- 因此在 `src/lib/client-cache.ts` 中直接调用未被覆写的原生 `History.prototype.pushState` / `replaceState` 同步更新浏览器地址栏，并通过轻量外部存储 + `useSyncExternalStore`（`useInstantLocation`）在同一帧通知 `Studio` 切换视图，同时监听 `popstate` 保持浏览器前进/后退一致。`InstantLink` 渲染标准 `<a>`，在 `onMouseEnter`、`onFocus`、`onPointerDown` 触发课程预取，保留 `Cmd/Ctrl+Click` 新开标签页等原生行为。

### 2. 建立客户端内存缓存与多触发源预取层（`src/lib/client-cache.ts`）
- 不引入第三方状态管理重量级依赖，使用轻量级模块内 `Map` 管理三类缓存与 in-flight Promise 去重：
  - `lessonCache`（按 `lessonId` 缓存课程原文 Markdown）；
  - `cardDetailCache`（按 `cardId` 缓存卡片完整答案与解析）；
  - `revealCache`（按 `cardId:stateVersion:settingsVersion` 缓存 `study/reveal` 返回的详情与服务端签名 `Preview` token，设 8 分钟安全有效期，小于服务端 10 分钟签名过期时间，并在评分、撤销、设置更新时主动失效）。
- 预取触发点：
  - **交互意图预取**：目录树、课程列表、面包屑、上下课按钮、答案出处链接的 `onMouseEnter` 与 `onFocus`；
  - **上下文相邻预取**：进入 `LessonReader` 时自动预取上一课与下一课；Bootstrap 完成时自动预取下一篇未读课程；
  - **学习流预取**：`Study` 选定当前卡片时立即后台预取 `study/reveal`，使用户思考期间完成网络往返，按 `Space` 时 `0ms` 展开答案。

### 3. API 路由鉴权与数据读取并行化 + 单例数据库连接
- 保持 `SPEC-001` 的服务端 HMAC 会话校验与激活状态检查不降级：先在内存中同步验签 Cookie 提取 `userId`，若签名无效立即拒绝（0 数据库开销）；签名有效后，通过 `Promise.all([userById(uid), ...])` 将用户激活检查与课程/卡片/复习上下文读取并行发送至 Supabase，消除串行等待。
- `src/lib/db.ts` 复用单例 `SupabaseClient`。

## 后果与边界

- 站内模块切换、已预取/已访问课程阅读与学习页揭示答案均达到近乎 `0ms` 的瞬时响应。
- 首次冷打开未被悬停预取的课程仍需 1 次并行 Supabase 查询（耗时较原先 2 次串行查询减半）。
- 客户端缓存必须在登出、401 会话失效及未来的多用户切换时严格清理或按用户隔离。
