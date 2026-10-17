import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  clearAllClientCaches,
  extractMarkdownHeadings,
  getCachedCardDetail,
  getCachedLesson,
  getCachedReveal,
  getInstantOverride,
  instantNavigate,
  invalidateReveal,
  isPlainLeftClick,
  loadCardDetailCached,
  loadLessonCached,
  loadRevealCached,
  prefetchLesson,
  prefetchReveal,
  resetInstantNavigationForTests,
} from '../src/lib/client-cache';
import type { CardDetail, Preview } from '../src/lib/types';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('the data shell is mounted in the persistent root layout', () => {
  const layout = read('src/app/layout.tsx');
  const page = read('src/app/[[...slug]]/page.tsx');
  const studio = read('src/components/studio.tsx');

  assert.match(layout, /<Studio\s*\/>/);
  assert.doesNotMatch(page, /<Studio/);
  assert.match(studio, /useInstantLocation\(\)/);
  assert.match(studio, /bootstrapRequest/);
  assert.doesNotMatch(studio, /router\.(push|replace)\(/);
});

test('bootstrap only transfers lesson fields rendered by the client and indexes card revisions with a Map', () => {
  const repository = read('src/lib/repository.ts');
  assert.match(repository, /from\('apm_lessons'\)\.select\('id,chapter_id,title,position,summary,reading_minutes'\)/);
  assert.doesNotMatch(repository, /from\('apm_lessons'\)\.select\('\*'\)/);
  assert.match(repository, /new Map\(\(cr\.data\|\|\[\]\)\.map/);
});

test('card detail reads card and revisions concurrently', () => {
  const repository = read('src/lib/repository.ts');
  const detail = repository.slice(repository.indexOf('export async function cardDetail'));
  assert.match(detail, /Promise\.all\(/);
});

test('revealing an answer does not reload the whole learning database and runs user verification in parallel', () => {
  const route = read('src/app/api/[...path]/route.ts');
  const reveal = route.slice(route.indexOf("if(path==='study/reveal'"), route.indexOf("const current=await userById(uid)"));
  assert.doesNotMatch(reveal, /bootstrap\(/);
  assert.match(reveal, /Promise\.all\(\[userById\(uid\),reviewContext\(uid,input\.cardId\)\]\)/);
});

test('lesson and card detail routes verify session user and query database in parallel', () => {
  const route = read('src/app/api/[...path]/route.ts');
  assert.match(route, /Promise\.all\(\[userById\(uid\),lessonSource\(lessonId\)\]\)/);
  assert.match(route, /Promise\.all\(\[userById\(uid\),cardDetail\(cardId\)\]\)/);
});

test('database client reuses a cached singleton instance', () => {
  const dbSource = read('src/lib/db.ts');
  assert.match(dbSource, /let cachedClient/);
});

test('workspace navigation switches views without Next.js patched history.pushState', () => {
  const nav = read('src/components/workspace-navigation.tsx');
  const cache = read('src/lib/client-cache.ts');
  assert.match(nav, /export function InstantLink/);
  assert.match(nav, /instantNavigate/);
  assert.match(nav, /useInstantLocation/);
  assert.doesNotMatch(nav, /from 'next\/link'/);
  assert.doesNotMatch(nav, /window\.history\.pushState/);
  assert.match(cache, /History\.prototype/);
});

test('instant navigation commits the next view without calling Next.js patched history methods', () => {
  resetInstantNavigationForTests();
  const previousWindow = globalThis.window;
  const previousHistory = globalThis.History;
  const pushed: string[] = [];
  const replaced: string[] = [];
  const historyEvents: { pop: ((event: Event) => void) | null } = { pop: null };
  class History {
    pushState(_data: unknown, _title: string, url?: string | null) {
      pushed.push(String(url));
      const next = new URL(String(url), 'http://127.0.0.1:3210');
      window.location.pathname = next.pathname;
      window.location.search = next.search;
      window.location.hash = next.hash;
    }
    replaceState(_data: unknown, _title: string, url?: string | null) {
      replaced.push(String(url));
      const next = new URL(String(url), 'http://127.0.0.1:3210');
      window.location.pathname = next.pathname;
      window.location.search = next.search;
      window.location.hash = next.hash;
    }
  }
  const location = {
    href: 'http://127.0.0.1:3210/today',
    origin: 'http://127.0.0.1:3210',
    pathname: '/today',
    search: '',
    hash: '',
  };
  globalThis.History = History as unknown as typeof globalThis.History;
  globalThis.window = {
    location,
    history: {
      pushState() { throw new Error('patched pushState'); },
      replaceState() { throw new Error('patched replaceState'); },
    },
    addEventListener(_type: string, listener: (event: Event) => void) { historyEvents.pop = listener; },
    scrollTo() {},
  } as unknown as Window & typeof globalThis;
  try {
    instantNavigate('/curriculum');
    assert.deepEqual(pushed, ['/curriculum']);
    assert.deepEqual(replaced, []);
    assert.deepEqual(getInstantOverride(), { pathname: '/curriculum', search: '' });

    instantNavigate('/study?lesson=lesson-1');
    assert.deepEqual(pushed[1], '/study?lesson=lesson-1');
    assert.deepEqual(getInstantOverride(), { pathname: '/study', search: 'lesson=lesson-1' });

    instantNavigate('https://evil.example/steal');
    assert.equal(pushed.length, 2);
    assert.equal(getInstantOverride()?.pathname, '/study');

    instantNavigate('/today', 'replace');
    assert.deepEqual(replaced, ['/today']);
    assert.equal(getInstantOverride()?.pathname, '/today');

    window.location.pathname = '/cards';
    window.location.search = '';
    historyEvents.pop?.(new Event('popstate'));
    assert.deepEqual(getInstantOverride(), { pathname: '/cards', search: '' });
  } finally {
    resetInstantNavigationForTests();
    globalThis.window = previousWindow;
    globalThis.History = previousHistory;
  }
});

test('client cache deduplicates in-flight lesson, card, and reveal requests and serves warm hits synchronously', async () => {
  clearAllClientCaches();
  let lessonCalls = 0;
  const fetcher = async (path: string) => {
    lessonCalls += 1;
    await new Promise(r => setTimeout(r, 10));
    return { id: 'rev-1', body_markdown: `# Title\n## Section One\nBody for ${path}`, content_hash: 'abc' };
  };

  const [a, b] = await Promise.all([
    loadLessonCached('lesson-1', fetcher),
    loadLessonCached('lesson-1', fetcher),
  ]);
  assert.equal(lessonCalls, 1);
  assert.equal(a.body_markdown, b.body_markdown);
  assert.equal(getCachedLesson('lesson-1')?.id, 'rev-1');

  prefetchLesson('lesson-1', fetcher);
  assert.equal(lessonCalls, 1, 'prefetch is a no-op when already cached');

  let cardCalls = 0;
  const sampleCard: CardDetail = {
    id: 'card-1', canonical_key: 'ch01.m01.001', lesson_id: 'lesson-1', chapter_id: 'ch-1',
    concept_keys: ['c1'], position: 1, active_revision: 1, title: 'Card', kind: 'basic',
    prompt: 'Prompt?', estimated_seconds: 45, answer_short: 'Short', required_points: ['p1'],
    pitfalls: '', explanation: '', source_refs: [],
  };
  await Promise.all([
    loadCardDetailCached('card-1', async () => { cardCalls += 1; return sampleCard; }),
    loadCardDetailCached('card-1', async () => { cardCalls += 1; return sampleCard; }),
  ]);
  assert.equal(cardCalls, 1);
  assert.equal(getCachedCardDetail('card-1')?.title, 'Card');

  let revealCalls = 0;
  const samplePreview: Preview = { token: 'signed-token', options: [{ rating: 3, due: '2026-10-18T00:00:00Z', interval: '1 天' }] };
  prefetchReveal('card-1', 2, 1, async () => {
    revealCalls += 1;
    return { card: sampleCard, preview: samplePreview };
  });
  const revealed = await loadRevealCached('card-1', 2, 1, async () => {
    revealCalls += 1;
    return { card: sampleCard, preview: samplePreview };
  });
  assert.equal(revealCalls, 1);
  assert.equal(revealed.preview.token, 'signed-token');
  assert.equal(getCachedReveal('card-1', 2, 1)?.preview.token, 'signed-token');
  assert.equal(getCachedReveal('card-1', 3, 1), null, 'version change invalidates stale reveal key');

  invalidateReveal('card-1');
  assert.equal(getCachedReveal('card-1', 2, 1), null);
});

test('markdown heading extraction ignores fenced code blocks and caches by lesson id', () => {
  const md = [
    '# H1 Ignored',
    '## 第一节 **核心概念**',
    '```markdown',
    '## 代码块内的假标题',
    '```',
    '## 第二节 `架构升级` ###',
  ].join('\n');
  const headings = extractMarkdownHeadings(md, 'lesson-toc-test');
  assert.deepEqual(headings, [
    { id: 'section-2', title: '第一节 核心概念' },
    { id: 'section-6', title: '第二节 架构升级' },
  ]);
  assert.equal(extractMarkdownHeadings('## Other', 'lesson-toc-test'), headings, 'returns memoized array for same cache key');
});

test('isPlainLeftClick only intercepts standard primary clicks without modifier keys', () => {
  assert.equal(isPlainLeftClick({ button: 0 }), true);
  assert.equal(isPlainLeftClick({ button: 1 }), false);
  assert.equal(isPlainLeftClick({ button: 0, metaKey: true }), false);
  assert.equal(isPlainLeftClick({ button: 0, ctrlKey: true }), false);
  assert.equal(isPlainLeftClick({ button: 0, shiftKey: true }), false);
  assert.equal(isPlainLeftClick({ button: 0, altKey: true }), false);
  assert.equal(isPlainLeftClick({ button: 0, defaultPrevented: true }), false);
});

test('Vercel functions run next to the Mumbai Supabase primary', () => {
  const config = JSON.parse(read('vercel.json')) as {regions?: string[]};
  assert.deepEqual(config.regions, ['bom1']);
});
