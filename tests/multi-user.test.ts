import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  clearAllClientCaches,
  clearUserSessionCaches,
  getCachedLesson,
  getCachedReveal,
  loadLessonCached,
  loadRevealCached,
  readBootstrapSnapshot,
  writeBootstrapSnapshot,
} from '../src/lib/client-cache';
import { normalizeUsername, usernameKey, validateUsername } from '../src/lib/username';
import type { Bootstrap, CardDetail, Preview } from '../src/lib/types';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('usernames keep display case, normalize case and spaces, and reject unsafe names', () => {
  assert.equal(normalizeUsername('  Klein   Wang  '), 'Klein Wang');
  assert.equal(usernameKey('  Klein   Wang  '), 'klein wang');
  assert.equal(validateUsername('AI-产品_01'), 'AI-产品_01');
  assert.throws(() => validateUsername('A'), /INVALID_USERNAME/);
  assert.throws(() => validateUsername('a'.repeat(25)), /INVALID_USERNAME/);
  assert.throws(() => validateUsername('bad name!'), /INVALID_USERNAME/);
  assert.throws(() => validateUsername('line\nbreak'), /INVALID_USERNAME/);
});

test('migration removes the single-user invite constraint and registers learners atomically', () => {
  const sql = read('supabase/migrations/202610170001_multi_user_profiles.sql');
  const route = read('src/app/api/[...path]/route.ts');
  assert.match(sql, /drop constraint if exists apm_users_access_code_hash_key/);
  assert.match(sql, /create unique index if not exists apm_users_username_idx/);
  assert.match(sql, /create or replace function public\.apm_register_user/);
  assert.match(sql, /insert into public\.apm_settings\(user_id\)/);
  assert.match(sql, /revoke all on function public\.apm_register_user\(text, text\) from public, anon, authenticated/);
  assert.match(sql, /'202610170001'/);
  assert.match(sql, /username_normalized = id::text/);
  assert.doesNotMatch(sql, /learner-/);
  const repository = read('src/lib/repository.ts');
  assert.match(repository, /eq\('user_id',user\.id\)/);
  assert.match(repository, /eq\('user_id',userId\)/);
  assert.match(route, /auth\/verify-code/);
  assert.match(route, /users\/switch/);
  assert.match(route, /mode:z\.enum\(\['login','register','auto'\]\)/);
});

test('private reveal and bootstrap caches are scoped by user while shared lesson text stays', async () => {
  clearAllClientCaches();
  await loadLessonCached('lesson-1', async () => ({ id: 'rev', body_markdown: 'shared', content_hash: 'h' }));
  const card = { id: 'card-1', title: 'Card' } as CardDetail;
  const preview = { token: 'token-a', options: [] } as Preview;
  await loadRevealCached('user-a', 'card-1', 1, 1, async () => ({ card, preview }));
  await loadRevealCached('user-b', 'card-1', 1, 1, async () => ({ card, preview: { ...preview, token: 'token-b' } }));
  assert.equal(getCachedReveal('user-a', 'card-1', 1, 1)?.preview.token, 'token-a');
  assert.equal(getCachedReveal('user-b', 'card-1', 1, 1)?.preview.token, 'token-b');

  const store = new Map<string, string>();
  const previous = globalThis.window;
  globalThis.window = {
    sessionStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => { store.set(key, value); },
      removeItem: (key: string) => { store.delete(key); },
    },
  } as unknown as Window & typeof globalThis;
  try {
    writeBootstrapSnapshot({ user: { id: 'user-a', display_name: 'Klein' }, chapters: [], lessons: [] } as unknown as Bootstrap);
    assert.equal(readBootstrapSnapshot()?.user.display_name, 'Klein');
    store.set('recall.bootstrap.v1', JSON.stringify({ user: { id: 'user-a', display_name: 'Legacy' }, chapters: [], lessons: [] }));
    assert.equal(readBootstrapSnapshot(), null);
    clearUserSessionCaches();
    assert.equal(readBootstrapSnapshot(), null);
    assert.equal(getCachedReveal('user-a', 'card-1', 1, 1), null);
    assert.equal(getCachedLesson('lesson-1')?.body_markdown, 'shared');
  } finally {
    globalThis.window = previous;
    clearAllClientCaches();
  }
});
