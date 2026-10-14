import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { batchSchema, canonicalJson, validateLocal } from './content-batch-lib';

const directory = 'artifacts/ch03-interview-restructure-20261007';
const sourceIndex = JSON.parse(readFileSync(join(directory, 'source-index.json'), 'utf8'));
const before = JSON.parse(readFileSync(join(directory, 'before.json'), 'utf8'));
const final = process.argv.includes('--final');
const reviewed = final ? ['a', 'b'].flatMap(group => {
  const report = JSON.parse(readFileSync(`docs/card-production/ch03-interview-restructure-20261007/review-${group}.json`, 'utf8'));
  assert.deepEqual(report.pending_modules, [], `Review ${group}: incomplete`);
  return report.cards;
}) : [];
const results: { module: number; cards: number; star: number; numbered: number; batch_path: string }[] = [];
const keys = new Set<string>();
for (const module of sourceIndex) {
  const name = `m${String(module.position).padStart(2, '0')}`;
  const path = final ? `content/batches/ch03-interview-star-20261007-${name}.json` : join(directory, 'drafts', `${name}.json`);
  const input = JSON.parse(readFileSync(path, 'utf8'));
  // Draft validation reuses the production schema in memory; it never marks the file reviewed or published.
  const batch = batchSchema.parse(final ? input : { ...input, status: 'accepted', cards: input.cards.map((card: any) => ({ ...card, review: { ...card.review, status: 'accepted' } })) });
  const prior = before.chapterCards.filter((card: any) => card.lesson_id === module.id);
  assert.deepEqual(batch.cards.map(card => card.canonical_key).toSorted(), prior.map((card: any) => card.canonical_key).toSorted(), `${name}: missing/extra cards`);
  assert.equal(batch.batch_id, `ch03-interview-star-20261007-${name}`);
  assert.equal(batch.chapter_position, 3);
  validateLocal(batch);
  let star = 0;
  for (const card of batch.cards) {
    const old = prior.find((candidate: any) => candidate.canonical_key === card.canonical_key);
    assert.equal(card.revision, old.active_revision + 1, `${card.canonical_key}: revision`);
    assert.equal(card.position, old.position, `${card.canonical_key}: position`);
    assert.deepEqual(card.concept_keys, old.concept_keys, `${card.canonical_key}: concepts`);
    assert.equal(card.lesson_source_key, module.source_key, `${card.canonical_key}: lesson`);
    assert.ok(!keys.has(card.canonical_key), `${card.canonical_key}: duplicate`);
    keys.add(card.canonical_key);
    assert.notEqual(card.answer_short, old.answer_short, `${card.canonical_key}: unchanged core answer`);
    assert.notEqual(card.explanation, old.explanation, `${card.canonical_key}: unchanged explanation`);
    const isStar = ['S', 'T', 'A', 'R'].every(label => new RegExp(`(?:^|\\n)${label}[｜|:：（]`).test(card.answer_short));
    const numbered = card.answer_short.match(/(?:^|\n)(?:[一二三四五六七八九十]+[、．.]|\d+[.、．)])/g);
    assert.ok(isStar || (numbered?.length ?? 0) >= 2, `${card.canonical_key}: missing structured answer`);
    if (isStar) star++;
    assert.ok(card.explanation.includes('追问'), `${card.canonical_key}: missing interview follow-up`);
    assert.ok(card.review.notes.length > 0 && card.review.notes.some(note => note.trim().length >= 10), `${card.canonical_key}: missing editorial reasoning`);
    if (final) {
      const audit = reviewed.filter((item: any) => item.canonical_key === card.canonical_key);
      assert.equal(audit.length, 1, `${card.canonical_key}: missing/duplicate review`);
      assert.equal(audit[0].status, 'pass', `${card.canonical_key}: not approved`);
      const { review: _review, ...content } = card;
      assert.equal(audit[0].reviewed_content_hash, createHash('sha256').update(canonicalJson(content)).digest('hex'), `${card.canonical_key}: content changed since review`);
    }
  }
  results.push({ module: module.position, cards: batch.cards.length, star, numbered: batch.cards.length - star, batch_path: path });
}
assert.equal(keys.size, before.chapterCards.length);
const report = { passed: true, stage: final ? 'reviewed' : 'draft', modules: results.length, cards: keys.size, star: results.reduce((sum, result) => sum + result.star, 0), numbered: results.reduce((sum, result) => sum + result.numbered, 0), results };
writeFileSync(join(directory, final ? 'final-check.json' : 'draft-check.json'), JSON.stringify(report, null, 2) + '\n');
if (final) writeFileSync(join(directory, 'manifest.json'), JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(report));
