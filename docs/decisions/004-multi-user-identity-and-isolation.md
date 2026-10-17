# ADR-004 · 邀请码准入与多用户进度隔离架构

2026-10-17 · 拟定（Proposed）。对应 `SPEC-004`（`docs/specs/v0.3-multi-user-progress-tracking.md`）。

## 背景

项目初期（`ADR-001`）为简化单人使用，将 `apm_users.access_code_hash` 设为 `UNIQUE`，用单个访问码直接映射唯一用户。随着项目体验完善，需要支持不同用户通过邀请码进入页面、录入并管理自己的用户名，且各自的学习进度独立保存、页面独立渲染。

## 决策

### 1. 维持独立 `apm_users` 体系，不引入外部重型 Auth，将 `access_code_hash` 解耦为空间邀请码凭证
- 继续遵循 `ADR-001` 不触碰宿主 Supabase 项目全局 Auth 配置的原则。
- 移除 `apm_users.access_code_hash` 的单行 `UNIQUE` 约束，改为在 `apm_users` 上新增 `username_normalized`（`lower(btrim(display_name))`）作为全局唯一标识。
- 邀请码验证通过后，用户凭 `username` 唯一定位或创建自己的 `apm_users` 行，服务端签发的 `apm-session` HMAC Cookie 依然绑定不可变的 `user.id (uuid)`。

### 2. 登录与注册显式分流（防拼写错误产生幽灵空号）
- 如果采用“输入任意不存在的用户名即静默自动创建新账号”，老用户一旦手误输错一个字母，就会进入一个进度全空的全新账号，造成“学习记录丢失”的恐慌。
- 因此采用**显式分流 + 防呆确认**：
  - 登录界面提供「已有用户名继续」与「新用户录入」切换，并在邀请码验证后支持点选已有用户名；
  - 在「已有用户名继续」模式下若输入的用户名不存在，返回 `404 USER_NOT_FOUND`，由界面明确询问“未找到用户『xxx』，是否以该用户名创建新的学习空间？”，用户确认后才执行 `register` 原子建号。

### 3. 事务级用户初始化（`apm_register_user` RPC）
- 由于 `bootstrap()` 和 `apm_commit_review` 均强依赖 `apm_settings` 存在对应 `user_id` 的配置行，新用户创建必须通过数据库函数 `apm_register_user` 在同一事务中完成 `apm_users` 与 `apm_settings` 的插入。

### 4. 客户端缓存按“公共知识层”与“个人进度层”分级隔离
- 70 篇课程原文（`lessonCache`）和 408 张卡片详情（`cardDetailCache`）属于全站只读公共资产，切换用户时保留在内存中，使新用户切换后依然享有 `0ms` 秒开文章的体验。
- `Bootstrap` 快照与包含个人 FSRS 状态的 `revealCache` 属于个人私有资产，必须绑定 `userId` 并在用户切换或登出时立即清理，杜绝跨用户渲染污染。
