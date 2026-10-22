import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { batchSchema } from '../scripts/content-batch-lib';
const sample=JSON.parse(readFileSync('content/batches/ch03-quality-m311.json','utf8'));
const batch=(key:string,revision:number)=>({...sample,cards:[{...sample.cards[0],canonical_key:key,revision}]});
test('legacy names are accepted for revisions and reject new legacy identities',()=>{
  for(const key of ['C01','C08','C14'])assert.ok(batchSchema.safeParse(batch(key,2)).success);
  for(const key of ['C00','C15','C1','C01.other'])assert.equal(batchSchema.safeParse(batch(key,2)).success,false);
  assert.equal(batchSchema.safeParse(batch('C01',1)).success,false);
  assert.ok(batchSchema.safeParse(batch('ch03.interview.m11.example.001',1)).success);
});
test('supported chapter keys are allowed only in their own chapter',()=>{
  for(const chapter of [4,5,6,7,8,9]){
    const value={...batch(`ch0${chapter}.interview.m01.example.001`,1),chapter_position:chapter};
    assert.ok(batchSchema.safeParse(value).success);
    assert.equal(batchSchema.safeParse({...value,chapter_position:3}).success,false);
  }
  assert.equal(batchSchema.safeParse({...batch('ch10.interview.m01.example.001',1),chapter_position:9}).success,false);
});
