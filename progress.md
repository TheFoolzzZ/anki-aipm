# 实施日志

## 2026-09-09 · Vercel 环境变量导入文件

- 根据本机私有配置生成仓库根目录 `import.env`，包含部署界面要求的 8 个变量；未在日志或终端输出变量值。
- 为线上生成独立 `APM_SESSION_SECRET`，强制 `APM_DEV_AUTO_LOGIN=false`；文件权限为 `0600`，并已加入 Git 忽略。
- 使用 Node `--env-file` 执行 Vercel 环境门禁，结果通过。

## 2026-09-07 · Lessons 原文图片内嵌

- 根据真实课程页截图定位 `ReactMarkdown` 图片 renderer，将 Cloudinary 原图从文字链接恢复为正文内嵌图片。
- 新增可信 URL 校验和单元测试，并为桌面与移动正文添加响应式图片样式；加载失败或非 Cloudinary HTTPS 地址回退为原链接。

## 2026-09-07 · 交互性能诊断

- 读取当前 Next.js 16.3.4 随包文档，确认 layout 在客户端导航中会复用，`usePathname` 可让持久 Client Component 响应路径变化。
- 建立修改前 API 和真实浏览器计时基线，定位到动态 page 重挂载导致完整 bootstrap 重复执行。
- 统计 bootstrap 各数据段，确认 70 篇课程未使用的 headings 使响应膨胀到约 284KB。
- 已先添加性能架构回归契约；下一步先确认其在旧实现上失败，再实施持久 layout、查询裁剪与并行化。
- 性能回归契约在旧实现上4项全部失败，实施后通过；新增Vercel与Supabase同区域合同。
- 将 Studio 移入持久 root layout，以 `usePathname` 切换页面；连续页面导航不再清空数据或请求 bootstrap。
- bootstrap 去除未渲染的 lesson headings/source_key，并对开发模式初始化请求去重；卡片详情并行读取。
- 学习页直接使用已有卡片队列，显示答案只取当前设置、状态和详情；评分、设置保存、标记已读改为局部更新，避免成功后再次全量刷新（撤销仍以服务端回读校准）。
- 在 Supabase Dashboard 核实 Primary 为 Mumbai `ap-south-1`，`vercel.json` 固定 Functions 到 `bom1`；修改后真实浏览器与开发服务请求日志已复测。
- 最终 `npm run deploy:check` 通过：TypeScript、14项测试和生产构建全部成功；`git diff --check` 无格式错误。

## 2026-09-05

- 已读取用户提供的 Supabase 连接指南，明确复用配置而隔离业务对象的方向。
- 已创建持久任务计划；下一步完成环境盘点与实施 spec，然后开始代码。
- 本轮没有执行远端写入。

## 2026-09-06 · 实施与范围收敛

- 上方9月5日“没有远端写入”为当时状态，现已完成远端迁移与seed。
- 新增11张apm_表和2个RPC，导入9章70篇14样卡；原项目表未改。
- 子Agent完成数据库真实验证，匿名隔离、幂等、版本冲突、撤销均通过；测试用户已清理。
- 完成Next.js主体页面、API与响应式样式；核心7项测试通过，主体写入后typecheck/build通过。
- dev在127.0.0.1:3210启动；Chrome进入登录页。点击本机登录被自动审批审核连接错误adapter_eof中断，没有登录后验收证据。
- 用户最后明确“只需要完成主体结构和目标制定”，据此停止进一步页面操作、扩卡和部署。
- 完成README、operations、无密钥env模板、制卡发布规范、HANDOVER与计划状态同步。
- 后续先验收现有闭环，再建批次发布链，再逐章扩卡；360张和语音均未完成，文档不声称完成。

## 2026-09-06 · 公开仓库准备

- 推送前扫描源代码、配置模板、迁移、测试和文档，未发现特定零售项目的品牌、系统或业务标识。
- 将可能关联特定业务的教学情境改为中性的企业资源查询与高风险操作情境。
- 移除本机用户名、绝对项目路径和知识库绝对路径；内容准备脚本改为强制读取 `KB_SOURCE_PATH`，设计稿用 `kb://` 相对引用。
- `.env.local`、`data/private`、构建产物、依赖和 TypeScript 缓存继续由 `.gitignore` 排除，不进入公开仓库。

## 2026-09-06 · 第1、2章制卡与发布

- 已读取交接、制卡发布规范和当前计划，确认扩卡前必须先建立批次 validate、dry-run、publish、verify 链路。
- 已确认知识库第1章7篇、第2章4篇源文均可读取；本轮目标为20张与25张，共45张新卡。
- 当前阶段：实现增量发布 spec、迁移和工具，同时逐篇提取可独立评分的知识点。
- 新增发布工具后首轮 typecheck 发现 verify 脚本的远端动态结果缺少显式类型；已补充边界类型，不影响数据库或内容。
- 首次运行内容校验时误用了位置参数；脚本契约是 `--batch <file>`，后续命令统一采用显式参数。
- 第2章首次按旧标题定位源文件失败；已改为使用 `data/private/seed.json` 中的真实 `relative_path`，没有改动来源数据。
- 首次远端发布暴露 RPC 局部变量 `card_id` 与表字段同名导致的 PostgreSQL 歧义；三个事务均在写入前回滚。变量改为 `v_card_id` 后重新应用函数并重跑预检。
- 三批本地校验通过：第1章20张、第2章13+12张；全部来源 hash、行范围和章节归属有效。
- Supabase 已应用 `202609060001_content_batches.sql`；第二次发布调用全部成功，远端逐卡内容、修订、来源引用和批次 hash 回读通过。
- 幂等复验通过：已发布批次 dry-run 全部显示 unchanged，重复 publish 不增加卡片或修订。
- 发布后59张卡、59个修订、3个批次；第1章20、第2章25。复习状态和事件发布前后均为0，原14张样卡未被覆盖。
- 已登录本地卡片库显示59张并能打开第1章新卡详情；最终 `typecheck`、8项测试和生产构建全部通过。
- 对当前工作区和全部可达 Git 历史再次扫描特定零售项目标识，无匹配项。

## 2026-09-06 · Vercel发布准备

- 读取现有部署说明、运行时代码与环境变量使用点，并以Vercel官方项目配置、环境、Node版本和CLI文档校准当前要求。
- 新增 `vercel.json`、`.vercelignore` 与 `scripts/check-deployment.mjs`；固定Node 22、npm ci、Next.js preset和受环境门禁的构建命令。
- 更新 `.env.example`，明确Vercel三项必需变量与本地导入/seed变量的边界；任何秘密均未写入仓库。
- 缺变量的 `--vercel` 检查按预期失败；使用真实本机配置且强制 `APM_DEV_AUTO_LOGIN=false` 时通过。
- `npm run deploy:check` 通过：typecheck、9项测试和生产构建全部成功；精确 `npm run vercel-build` 模拟也通过。
- `npm ci` 从锁文件重新安装150个包后再次执行完整deploy check通过；本机配置中的自动登录为true时，Vercel环境门禁按预期拒绝。
- 首次本地健康检查因沙箱无法连接127.0.0.1失败；随后确认端口已有服务，获准在沙箱外请求后返回 `ok=true`、两个迁移就绪。重复启动开发服务因端口占用失败，没有影响现有服务。
- 新增 `docs/deployment/vercel.md`，覆盖Dashboard Git导入、CLI Preview、环境变量、上线验收、生产晋级和回滚；尚未执行外部Vercel创建或发布。
