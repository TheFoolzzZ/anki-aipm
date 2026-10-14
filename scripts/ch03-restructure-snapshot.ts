import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { database, environment } from './env';
import { canonicalJson } from './content-batch-lib';

const output = 'artifacts/ch03-interview-restructure-20261007';
mkdirSync(output, { recursive: true });
const after = process.argv.includes('--after');
const db = database();
const hash = (value: unknown) => createHash('sha256').update(typeof value === 'string' ? value : canonicalJson(value)).digest('hex');
async function all(table: string) {
  const rows: Record<string, any>[] = [];
  for (let offset = 0; ; offset += 500) {
    let query = db.from(table).select('*').order(table === 'apm_content_batches' ? 'batch_id' : table === 'apm_card_revisions' ? 'card_id' : table === 'apm_review_states' ? 'card_id' : table === 'apm_study_activity' ? 'lesson_id' : 'id');
    if (table === 'apm_card_revisions') query = query.order('revision');
    if (table === 'apm_review_states' || table === 'apm_study_activity') query = query.order('user_id');
    const result = await query.range(offset, offset + 499).abortSignal(AbortSignal.timeout(30_000));
    if (result.error) throw new Error(`${table}: ${result.error.message}`);
    rows.push(...result.data);
    if (result.data.length < 500) return rows;
  }
}
const tables = ['apm_cards', 'apm_card_revisions', 'apm_content_batches', 'apm_review_states', 'apm_review_events', 'apm_study_activity'];
const results = await Promise.all(tables.map(all));
const counts = Object.fromEntries(results.map((rows, i) => [tables[i], rows.length]));
const learningHashes = Object.fromEntries(results.slice(3).map((rows, i) => [tables[i + 3], hash(rows.toSorted((a, b) => canonicalJson(a).localeCompare(canonicalJson(b))))]));
const seed = JSON.parse(readFileSync('data/private/seed.json', 'utf8'));
const chapter = seed.chapters.find((item: any) => item.position === 3);
const modules = seed.lessons.filter((lesson: any) => lesson.chapter_id === chapter.id).toSorted((a: any, b: any) => a.position - b.position).map((lesson: any) => {
  const source = seed.sources.find((item: any) => item.lesson_id === lesson.id);
  const absolutePath = join(environment().KB_SOURCE_PATH!, source.relative_path);
  const body = readFileSync(absolutePath, 'utf8');
  assert.equal(hash(body), source.content_hash, `Source changed: ${source.relative_path}`);
  return { position: lesson.position, id: lesson.id, title: lesson.title, source_key: lesson.source_key, absolute_path: absolutePath, content_hash: source.content_hash, line_count: body.split('\n').length };
});
assert.equal(modules.length, 26);
const cards = results[0];
const revisions = results[1];
const chapterCards: Record<string, any>[] = cards.filter(card => card.chapter_id === chapter.id && card.lifecycle === 'active').map(card => {
  const revision = revisions.find(item => item.card_id === card.id && item.revision === card.active_revision);
  assert.ok(revision, `${card.canonical_key}: missing active revision`);
  return { ...card, ...revision, id: card.id };
});
const cardMetadata = cards.map(({ id, canonical_key, active_revision, position, chapter_id, lesson_id, concept_keys, lifecycle }) => ({ id, canonical_key, active_revision, position, chapter_id, lesson_id, concept_keys, lifecycle }));
const snapshot = { at: new Date().toISOString(), counts, learningHashes, cards: cardMetadata, chapterCards };
if (after) {
  const before = JSON.parse(readFileSync(join(output, 'before.json'), 'utf8'));
  const manifest = JSON.parse(readFileSync(join(output, 'manifest.json'), 'utf8'));
  const proposed = manifest.flatMap((item: any) => JSON.parse(readFileSync(item.batch_path, 'utf8')).cards);
  const edited = new Map(proposed.map((card: any) => [card.canonical_key, card]));
  assert.equal(counts.apm_cards, before.counts.apm_cards);
  assert.equal(counts.apm_card_revisions, before.counts.apm_card_revisions + proposed.length);
  assert.equal(counts.apm_content_batches, before.counts.apm_content_batches + manifest.length);
  assert.deepEqual(learningHashes, before.learningHashes, 'Learning records changed');
  for (const prior of before.cards) {
    const current = cardMetadata.find(item => item.id === prior.id);
    assert.ok(current);
    const update = edited.get(prior.canonical_key) as any;
    assert.deepEqual(current, { ...prior, active_revision: update ? update.revision : prior.active_revision });
  }
}
writeFileSync(join(output, after ? 'after.json' : 'before.json'), JSON.stringify(snapshot, null, 2) + '\n', { flag: 'wx' });
if (!after) {
  writeFileSync(join(output, 'source-index.json'), JSON.stringify(modules, null, 2) + '\n', { flag: 'wx' });
  for (const module of modules) {
    const existing = chapterCards.filter(card => card.lesson_id === module.id);
    writeFileSync(join(output, `m${String(module.position).padStart(2, '0')}-existing.json`), JSON.stringify(existing, null, 2) + '\n', { flag: 'wx' });
  }
}
console.log(JSON.stringify({ snapshot: join(output, after ? 'after.json' : 'before.json'), counts, chapterCards: chapterCards.length, modules: modules.map((module: any) => ({ position: module.position, title: module.title, cards: chapterCards.filter(card => card.lesson_id === module.id).length })), passed: true }, null, 2));
