import {readFileSync,writeFileSync} from 'node:fs';
import {database} from './env';
import assert from 'node:assert/strict';
const arg=(name:string,fallback:string)=>{const i=process.argv.indexOf(name);return i<0?fallback:process.argv[i+1];};
const first=Number(arg('--first','6')),last=Number(arg('--last','10'));
assert.ok(Number.isInteger(first)&&Number.isInteger(last)&&first>=1&&last>=first&&last<=26);
const date=arg('--date','20261001'),batchDate=arg('--batch-date','20260922');
assert.match(date,/^\d{8}$/);assert.match(batchDate,/^\d{8}$/);
const manifest=arg('--manifest','');
const batches:string[]=manifest?JSON.parse(readFileSync(manifest,'utf8')).map((s:any)=>s.batch_path):Array.from({length:last-first+1},(_,i)=>`content/batches/ch03-interview-${batchDate}-m${String(first+i).padStart(2,'0')}.json`);
assert.ok(batches.length);assert.equal(new Set(batches).size,batches.length);
const suffix=arg('--snapshot-id',`${date}-m${String(first).padStart(2,'0')}-m${String(last).padStart(2,'0')}`);
assert.match(suffix,/^[a-z0-9-]+$/);
const db=database();
const tables=['apm_cards','apm_card_revisions','apm_content_batches','apm_review_states','apm_review_events','apm_study_activity'];
const counts:Record<string,number|null>={};
const signal=AbortSignal.timeout(30_000);
const results=await Promise.allSettled(tables.map(async table=>{const result=await db.from(table).select('*',{head:true,count:'exact'}).abortSignal(signal);if(result.error)throw new Error(`${table}: ${result.error.message}`);return result.count;}));
const failures=results.filter(result=>result.status==='rejected');if(failures.length)throw new Error(failures.map(result=>String(result.reason)).join('\n'));
results.forEach((result,i)=>{if(result.status==='fulfilled')counts[tables[i]]=result.value;});
const r=await db.from('apm_cards').select('id,canonical_key,active_revision,position,lesson_id,lifecycle').order('canonical_key').abortSignal(AbortSignal.timeout(30_000));if(r.error)throw r.error;
const snapshot={at:new Date().toISOString(),counts,cards:r.data};
const after=process.argv.includes('--after');
const file=`artifacts/ch03-interview/${after?'after':'prepublish'}-${suffix}.json`;
if(after){
 const before=JSON.parse(readFileSync(`artifacts/ch03-interview/prepublish-${suffix}.json`,'utf8'));
 const cards=batches.flatMap(file=>JSON.parse(readFileSync(file,'utf8')).cards);
 const edited=new Map(cards.map(c=>[c.canonical_key,c]));
 const old=new Map(before.cards.map((c:any)=>[c.canonical_key,c]));
 const fresh=cards.filter(c=>!old.has(c.canonical_key)).length;
 assert.equal(counts.apm_cards,before.counts.apm_cards+fresh);
 assert.equal(counts.apm_card_revisions,before.counts.apm_card_revisions+cards.length);
 assert.equal(counts.apm_content_batches,before.counts.apm_content_batches+batches.length);
 for(const table of tables.slice(3))assert.equal(counts[table],before.counts[table],table);
 for(const prior of before.cards){const now:Record<string,unknown>|undefined=r.data!.find(c=>c.canonical_key===prior.canonical_key);assert.ok(now);if(edited.has(prior.canonical_key)){assert.equal(now.active_revision,edited.get(prior.canonical_key).revision);assert.equal(now.id,prior.id);assert.equal(now.position,prior.position);assert.equal(now.lesson_id,prior.lesson_id);assert.equal(now.lifecycle,prior.lifecycle);}else assert.deepEqual(now,prior);}
 console.log(JSON.stringify({passed:true,revised:cards.length-fresh,added:fresh,counts},null,2));
}
writeFileSync(file,JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({file,counts}));
