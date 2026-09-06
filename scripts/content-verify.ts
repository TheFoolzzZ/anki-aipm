import assert from 'node:assert/strict';
import { batchHash, batchPath, loadBatch, stableCardId, validateLocal } from './content-batch-lib';
import { database } from './env';
const batch=loadBatch(batchPath()); validateLocal(batch); const expectedHash=batchHash(batch);
const db=database(); const ids=batch.cards.map(x=>stableCardId(x.canonical_key));
const [{data:cards,error:ce},{data:revisions,error:re},{data:ledger,error:le}]=await Promise.all([
  db.from('apm_cards').select('*').in('id',ids),db.from('apm_card_revisions').select('*').in('card_id',ids),db.from('apm_content_batches').select('*').eq('batch_id',batch.batch_id).single(),
]);
if(ce||re||le)throw new Error(`Verify read failed: ${ce?.message||re?.message||le?.message}`);
assert.equal(cards?.length,batch.cards.length); assert.equal(ledger.card_count,batch.cards.length); assert.equal(ledger.content_hash,expectedHash);
for(const expected of batch.cards){
  const card:Record<string,any>|undefined=cards!.find(x=>x.id===stableCardId(expected.canonical_key));
  const revision:Record<string,any>|undefined=revisions!.find(x=>x.card_id===card?.id&&x.revision===expected.revision);
  assert.ok(card&&revision,`${expected.canonical_key}: missing`); assert.equal(card.canonical_key,expected.canonical_key); assert.equal(card.active_revision,expected.revision);
  assert.deepEqual(card.concept_keys,expected.concept_keys); assert.equal(card.position,expected.position);
  for(const field of ['title','kind','prompt','answer_short','pitfalls','explanation','estimated_seconds'] as const)assert.deepEqual(revision[field],expected[field],`${expected.canonical_key}: ${field}`);
  assert.deepEqual(revision.required_points,expected.required_points);
  assert.deepEqual(revision.source_refs.map((ref:Record<string,any>)=>({relative_path:ref.relative_path,content_hash:ref.content_hash,line_start:ref.line_start,line_end:ref.line_end})),expected.source_refs);
}
console.log(JSON.stringify({batchId:batch.batch_id,cards:cards?.length,revisions:batch.cards.length,ledgerHash:ledger.content_hash,expectedHash,passed:true},null,2));
