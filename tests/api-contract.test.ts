import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('..', import.meta.url);
async function source(path: string) { return readFile(new URL(path, root), 'utf8'); }

test('review RPC contract has server-only execution, idempotency conflict detection, and latest-event undo guard', async () => {
  const sql = await source('supabase/migrations/202609050001_learning_core.sql');
  assert.match(sql, /if old\.request_hash <> p_hash then raise exception 'IDEMPOTENCY_CONFLICT'/);
  assert.match(sql, /if s\.last_event_id<>e\.id or s\.version<>p_expected then raise exception 'STATE_CONFLICT'/);
  assert.match(sql, /revoke all on function public\.apm_commit_review[\s\S]*?from public,anon,authenticated/);
  assert.match(sql, /grant execute on function public\.apm_commit_review[\s\S]*?to service_role/);
  assert.match(sql, /revoke all on function public\.apm_undo_review[\s\S]*?from public,anon,authenticated/);
});

test('route rejects malformed JSON as client input and sends only signed candidate state to the commit RPC', async () => {
  const route = await source('src/app/api/[...path]/route.ts');
  assert.match(route, /catch\{throw new Error\('INVALID_INPUT'\);\}/);
  assert.match(route, /if\(message==='INVALID_INPUT'\).*422/);
  assert.match(route, /p_after:p\.candidates\[input\.rating\]/);
  assert.doesNotMatch(route, /p_after:input\./);
  assert.match(route, /p_expected:p\.version/);
  assert.match(route, /p_settings_version:p\.settingsVersion/);
});
