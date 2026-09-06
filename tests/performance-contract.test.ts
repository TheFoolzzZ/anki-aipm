import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('the data shell is mounted in the persistent root layout', () => {
  const layout = read('src/app/layout.tsx');
  const page = read('src/app/[[...slug]]/page.tsx');
  const studio = read('src/components/studio.tsx');

  assert.match(layout, /<Studio\s*\/>/);
  assert.doesNotMatch(page, /<Studio/);
  assert.match(studio, /usePathname\(\)/);
  assert.match(studio, /bootstrapRequest/);
});

test('bootstrap only transfers lesson fields rendered by the client', () => {
  const repository = read('src/lib/repository.ts');
  assert.match(repository, /from\('apm_lessons'\)\.select\('id,chapter_id,title,position,summary,reading_minutes'\)/);
  assert.doesNotMatch(repository, /from\('apm_lessons'\)\.select\('\*'\)/);
});

test('card detail reads card and revisions concurrently', () => {
  const repository = read('src/lib/repository.ts');
  const detail = repository.slice(repository.indexOf('export async function cardDetail'));
  assert.match(detail, /Promise\.all\(/);
});

test('revealing an answer does not reload the whole learning database', () => {
  const route = read('src/app/api/[...path]/route.ts');
  const reveal = route.slice(route.indexOf("if(path==='study/reveal'"), route.indexOf("if(path==='reviews'"));
  assert.doesNotMatch(reveal, /bootstrap\(/);
});

test('Vercel functions run next to the Mumbai Supabase primary', () => {
  const config = JSON.parse(read('vercel.json')) as {regions?: string[]};
  assert.deepEqual(config.regions, ['bom1']);
});
