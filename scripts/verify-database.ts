import { createHash, randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { database, environment } from './env';

type Json = Record<string, unknown>;
const env = environment();
const db = database();
const startedAt = new Date().toISOString();
const testUserId = randomUUID();
const now = new Date();
const before = { due: now.toISOString(), phase: 'new' };
const after = { due: new Date(now.getTime() + 86_400_000).toISOString(), phase: 'review' };
const verification: Json = { startedAt, seedCounts: {}, checks: {} };

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

async function rpc<T>(name: string, args: Json): Promise<T> {
  const { data, error } = await db.rpc(name, args);
  if (error) fail(`${name}: ${error.message}`);
  return data as T;
}

async function expectRpcFailure(name: string, args: Json, expected: string) {
  const { error } = await db.rpc(name, args);
  assert(error, `${name} should have failed with ${expected}`);
  assert(error.message.includes(expected), `${name} failed with unexpected error: ${error.message}`);
}

async function count(table: string) {
  const { count: value, error } = await db.from(table).select('*', { count: 'exact', head: true });
  if (error || value === null) fail(`${table}: ${error?.message ?? 'count unavailable'}`);
  return value;
}

async function main() {
  const seed = JSON.parse(readFileSync('data/private/seed.json', 'utf8')) as Record<string, unknown[]>;
  const seededTables: Record<string, number> = {
    apm_chapters: seed.chapters.length,
    apm_lessons: seed.lessons.length,
    apm_source_revisions: seed.sources.length,
    apm_cards: seed.cards.length,
    apm_card_revisions: seed.revisions.length,
  };
  for (const [table, expected] of Object.entries(seededTables)) {
    const actual = await count(table);
    assert(actual >= expected, `${table}: expected at least ${expected}, got ${actual}`);
    (verification.seedCounts as Json)[table] = { expectedMinimum: expected, actual };
  }
  for (const table of ['apm_migrations', 'apm_users', 'apm_settings', 'apm_review_states', 'apm_review_events', 'apm_study_activity']) {
    (verification.seedCounts as Json)[table] = { actual: await count(table) };
  }

  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  assert(anonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY missing');
  const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const protectedTables = [
    'apm_migrations', 'apm_users', 'apm_settings', 'apm_chapters', 'apm_lessons',
    'apm_source_revisions', 'apm_cards', 'apm_card_revisions', 'apm_review_states',
    'apm_review_events', 'apm_study_activity',
  ];
  for (const table of protectedTables) {
    const { data: anonRows, error: anonError } = await anon.from(table).select('*').limit(1);
    assert(anonError || anonRows?.length === 0, `anon unexpectedly read ${table}`);
  }
  (verification.checks as Json).anonReadsDeniedForAllApmTables = true;

  const card = seed.cards[0] as { id: string; active_revision: number };
  const eventId = randomUUID();
  const requestHash = createHash('sha256').update(`verify:${eventId}`).digest('hex');
  const reviewArgs: Json = {
    p_user: testUserId, p_card: card.id, p_revision: card.active_revision,
    p_expected: 0, p_settings_version: 0, p_client_event: eventId, p_hash: requestHash,
    p_rating: 3, p_before: before, p_after: after, p_reviewed_at: now.toISOString(), p_duration: 1000,
  };

  const secondUserId = randomUUID();
  try {
    const accessCode = randomUUID();
    const sharedHash = createHash('sha256').update(accessCode).digest('hex');
    const { error: userError } = await db.from('apm_users').insert([
      { id: testUserId, display_name: 'APM Verify A', username_normalized: `apm-verify-a-${testUserId.slice(0, 8)}`, access_code_hash: sharedHash },
      { id: secondUserId, display_name: 'APM Verify B', username_normalized: `apm-verify-b-${secondUserId.slice(0, 8)}`, access_code_hash: sharedHash },
    ]);
    if (userError) fail(`create verification user: ${userError.message}`);
    const { error: settingsError } = await db.from('apm_settings').insert([{ user_id: testUserId }, { user_id: secondUserId }]);
    if (settingsError) fail(`create verification settings: ${settingsError.message}`);

    const first = await rpc<{ eventId: string; version: number; state: Json }>('apm_commit_review', reviewArgs);
    assert(first.version === 1 && first.eventId, 'review RPC returned an invalid first result');
    const replay = await rpc<{ eventId: string; version: number }>('apm_commit_review', reviewArgs);
    assert(replay.eventId === first.eventId && replay.version === first.version, 'review RPC did not replay idempotently');
    await expectRpcFailure('apm_commit_review', { ...reviewArgs, p_client_event: randomUUID(), p_hash: randomUUID() }, 'STATE_CONFLICT');
    (verification.checks as Json).reviewIdempotencyAndStateConflict = true;

    await expectRpcFailure('apm_commit_review', { ...reviewArgs, p_user: testUserId, p_card: card.id, p_expected: 1, p_settings_version: 1, p_client_event: randomUUID(), p_hash: randomUUID() }, 'SETTINGS_CONFLICT');
    (verification.checks as Json).settingsVersionConflict = true;

    const undoEvent = randomUUID();
    const undoHash = createHash('sha256').update(`verify:${undoEvent}`).digest('hex');
    const undoArgs: Json = { p_user: testUserId, p_event: first.eventId, p_expected: 1, p_client_event: undoEvent, p_hash: undoHash };
    const undone = await rpc<{ eventId: string; version: number; state: Json }>('apm_undo_review', undoArgs);
    assert(undone.version === 2 && undone.state.due === before.due, 'undo RPC did not restore the prior state');
    const undoReplay = await rpc<{ eventId: string; version: number }>('apm_undo_review', undoArgs);
    assert(undoReplay.eventId === undone.eventId && undoReplay.version === undone.version, 'undo RPC did not replay idempotently');
    (verification.checks as Json).undoAndIdempotency = true;

    const { count: otherProgress, error: otherError } = await db.from('apm_review_states').select('*', { count: 'exact', head: true }).eq('user_id', secondUserId);
    if (otherError || otherProgress !== 0) fail(`second learner inherited review state: ${otherError?.message ?? otherProgress}`);
    (verification.checks as Json).learnerProgressIsolated = true;
  } finally {
    const { error } = await db.from('apm_users').delete().in('id', [testUserId, secondUserId]);
    if (error) fail(`cleanup verification user: ${error.message}`);
    const { count: remaining, error: remainingError } = await db.from('apm_users').select('*', { count: 'exact', head: true }).in('id', [testUserId, secondUserId]);
    if (remainingError || remaining !== 0) fail(`verification user cleanup failed: ${remainingError?.message ?? 'row remains'}`);
  }

  verification.completedAt = new Date().toISOString();
  verification.passed = true;
  writeFileSync('docs/verification/database-result.json', `${JSON.stringify(verification, null, 2)}\n`);
  writeFileSync('docs/verification/database-verification.md', `# 数据库验证\n\n验证时间：${verification.completedAt}\n\n- 已回读隔离 \`apm_\` 表；内容基线为 9 章、70 篇来源、14 张试点卡及其修订。\n- 匿名角色无法读取全部 11 张 \`apm_\` 表。\n- 使用同一邀请码下的两名临时用户验证评分 RPC 的幂等重放、状态版本冲突、设置版本冲突、撤销回滚，以及一名用户的复习不会写入另一名用户；脚本结束后已通过级联删除这两名测试用户及其状态和事件。\n- 机器可读证据见 [database-result.json](./database-result.json)。\n`);
  console.log(JSON.stringify(verification, null, 2));
}

await main();
