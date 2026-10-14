import {readFileSync,writeFileSync} from 'node:fs';
import {database} from './env';
import assert from 'node:assert/strict';
const db=database();
const tables=['apm_cards','apm_card_revisions','apm_content_batches','apm_review_states','apm_review_events','apm_study_activity'];
const counts:Record<string,number|null>={};
for(const table of tables){const r=await db.from(table).select('*',{head:true,count:'exact'});if(r.error)throw r.error;counts[table]=r.count;}
const r=await db.from('apm_cards').select('id,canonical_key,active_revision,position,lesson_id,lifecycle').order('canonical_key');if(r.error)throw r.error;
const snapshot={at:new Date().toISOString(),counts,cards:r.data};
const after=process.argv.includes('--after');
const file=`artifacts/ch03-interview/${after?'after':'prepublish'}-20260918-m01-m05.json`;
if(after){
 const before=JSON.parse(readFileSync('artifacts/ch03-interview/prepublish-20260918-m01-m05.json','utf8'));
 const cards=[1,2,3,4,5].flatMap(n=>JSON.parse(readFileSync(`content/batches/ch03-interview-20260917-m0${n}.json`,'utf8')).cards);
 const edited=new Map(cards.map(c=>[c.canonical_key,c]));
 const old=new Map(before.cards.map((c:any)=>[c.canonical_key,c]));
 const fresh=cards.filter(c=>!old.has(c.canonical_key)).length;
 assert.equal(counts.apm_cards,before.counts.apm_cards+fresh);
 assert.equal(counts.apm_card_revisions,before.counts.apm_card_revisions+cards.length);
 assert.equal(counts.apm_content_batches,before.counts.apm_content_batches+5);
 for(const table of tables.slice(3))assert.equal(counts[table],before.counts[table],table);
 for(const prior of before.cards){const now:Record<string,unknown>|undefined=r.data!.find(c=>c.canonical_key===prior.canonical_key);assert.ok(now);if(edited.has(prior.canonical_key)){assert.equal(now.active_revision,edited.get(prior.canonical_key).revision);assert.equal(now.id,prior.id);assert.equal(now.position,prior.position);assert.equal(now.lesson_id,prior.lesson_id);assert.equal(now.lifecycle,prior.lifecycle);}else assert.deepEqual(now,prior);}
 console.log(JSON.stringify({passed:true,revised:cards.length-fresh,added:fresh,counts},null,2));
}
writeFileSync(file,JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({file,counts}));
