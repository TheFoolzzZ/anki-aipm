# SPEC-002 · 内容批次发布

状态：实施合同，2026-09-06。适用于第1、2章及后续扩卡。

## 1. 目标与边界

建立 `validate → dry-run → publish → verify` 的正式发布链。批次只改变 `apm_cards`、`apm_card_revisions`、`apm_content_batches` 和卡片的活动修订，不读取或写入个人复习状态与事件。

每批10–20张；只接受 `accepted` 批次。卡片具有稳定 `canonical_key`，文字实质变化必须递增 revision。发布失败时整个数据库事务回滚，不留下可学习的半成品。

## 2. 批次契约

批次 JSON 包含 `batch_id`、`status`、`chapter_position` 和 cards。每张卡包含稳定身份、主课程 `lesson_source_key`、概念键、版本、题目、最小答案、1–3个必答点、误区、30–90秒预计耗时、审校结果及至少一个来源引用。

来源引用使用知识库相对路径、SHA-256、起止行。发布前同时验证本地文件 hash 和远端不可变来源修订；上传 payload 将相对引用解析为真实 `source_revision_id`。

## 3. 四步行为

1. `content:validate -- --batch <file>`：校验 schema、accepted 状态、身份唯一、课程归属、来源 hash、行范围和本地 seed 映射。
2. `content:diff -- --batch <file>`：只读远端，输出新增卡、新增修订、无变化或冲突；不存在隐式删除。
3. `content:publish -- --batch <file>`：再次执行完整校验和 dry-run，通过 service-role-only RPC 原子发布；批次 hash 提供幂等。
4. `content:verify -- --batch <file>`：按主键回读所有卡片、活动修订和来源引用，核对字段、数量及批次账本。

## 4. 事务与回退

`apm_publish_card_batch` 对 batch_id 取事务级 advisory lock。同一 batch_id + hash 重放返回原结果；不同 hash 冲突。新卡 revision 必须为1，已有卡的新 revision 必须等于当前活动版本+1。先写不可变修订，全部成功后才切换活动版本并记录批次。

回退通过后续受审校批次切换到新修订或退役卡片实现；不删除历史修订和复习事件。本阶段不提供删除语义。

## 5. 本轮验收

- 第1章7篇均有卡，共20张；第2章4篇均有卡，共25张。
- 三个批次均为 accepted，每张卡完成事实与教学审校。
- 本地 validate、远端 dry-run、事务 publish、远端 verify 全部通过。
- 发布后总活动卡数从14增至59；第1章20、第2章25，原14张及用户学习记录不变。
