import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { database, environment } from './env';

const sourceRefSchema = z.object({
  relative_path: z.string().min(3), content_hash: z.string().regex(/^[0-9a-f]{64}$/),
  line_start: z.number().int().positive(), line_end: z.number().int().positive(),
}).refine(x => x.line_end >= x.line_start, 'source line range is reversed');
const cardSchema = z.object({
  canonical_key: z.string().regex(/^(?:ch(01|02|03|04|05|06|07|08|09)\.[a-z0-9.-]+|C(?:0[1-9]|1[0-4]))$/), lesson_source_key: z.string().min(3),
  concept_keys: z.array(z.string().min(3)).min(1), revision: z.number().int().positive(),
  position: z.number().int().positive(), title: z.string().min(3).max(80),
  kind: z.enum(['概念','对比','机制','场景判断','故障诊断']),
  prompt: z.string().min(10).max(300), answer_short: z.string().min(5).max(500),
  required_points: z.array(z.string().min(2)).min(1).max(3), pitfalls: z.string().min(2).max(500),
  explanation: z.string().max(1000).default(''), estimated_seconds: z.number().int().min(30).max(90),
  source_refs: z.array(sourceRefSchema).min(1).max(3),
  review: z.object({status:z.literal('accepted'),reviewer:z.string().min(2),notes:z.array(z.string())}),
}).refine(card => !card.canonical_key.startsWith('C') || card.revision >= 2, 'Legacy seed cards can only be revised');
export const batchSchema = z.object({
  batch_id: z.string().regex(/^[a-z0-9][a-z0-9-]{2,79}$/), status: z.literal('accepted'),
  chapter_position: z.number().int().min(1).max(9), cards: z.array(cardSchema).min(1).max(20),
}).refine(batch => batch.cards.every(card => card.canonical_key.startsWith('C') || Number(card.canonical_key.slice(2,4)) === batch.chapter_position), 'Card key/chapter mismatch');
export type ContentBatch = z.infer<typeof batchSchema>;
type Seed = { chapters:{id:string;position:number}[]; lessons:{id:string;chapter_id:string;source_key:string;title:string}[]; sources:{id:string;lesson_id:string;relative_path:string;content_hash:string}[]; cards:{canonical_key:string;lesson_id:string}[] };

export function stableCardId(key:string){
  const h=createHash('sha256').update(`recall-studio:card:${key}`).digest('hex');
  return `${h.slice(0,8)}-${h.slice(8,12)}-5${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;
}
export function canonicalJson(value:unknown):string{
  if(Array.isArray(value))return `[${value.map(canonicalJson).join(',')}]`;
  if(value&&typeof value==='object')return `{${Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${JSON.stringify(k)}:${canonicalJson(v)}`).join(',')}}`;
  return JSON.stringify(value);
}
export function batchHash(batch:ContentBatch){return createHash('sha256').update(canonicalJson(batch)).digest('hex');}
export function batchPath(){
  const i=process.argv.indexOf('--batch'); const path=i>=0?process.argv[i+1]:undefined;
  if(!path)throw new Error('Usage: --batch <file>'); return path;
}
export function loadBatch(path:string):ContentBatch{
  const batch=batchSchema.parse(JSON.parse(readFileSync(path,'utf8')));
  const keys=batch.cards.map(x=>x.canonical_key); if(new Set(keys).size!==keys.length)throw new Error('Duplicate canonical_key');
  const positions=batch.cards.map(x=>x.position); if(new Set(positions).size!==positions.length)throw new Error('Duplicate position');
  return batch;
}
export function validateLocal(batch:ContentBatch){
  const env=environment(); if(!env.KB_SOURCE_PATH)throw new Error('KB_SOURCE_PATH is required');
  const seed=JSON.parse(readFileSync('data/private/seed.json','utf8')) as Seed;
  const chapter=seed.chapters.find(x=>x.position===batch.chapter_position); if(!chapter)throw new Error('Chapter missing from seed');
  for(const card of batch.cards){
    const lesson=seed.lessons.find(x=>x.source_key===card.lesson_source_key); if(!lesson||lesson.chapter_id!==chapter.id)throw new Error(`${card.canonical_key}: lesson/chapter mismatch`);
    if(card.canonical_key.startsWith('C')&&!seed.cards.some(x=>x.canonical_key===card.canonical_key&&x.lesson_id===lesson.id))throw new Error(`${card.canonical_key}: legacy card/lesson missing from seed`);
    for(const ref of card.source_refs){
      const source=seed.sources.find(x=>x.relative_path===ref.relative_path&&x.content_hash===ref.content_hash);
      if(!source)throw new Error(`${card.canonical_key}: source/hash missing from seed`);
      const body=readFileSync(join(env.KB_SOURCE_PATH,ref.relative_path),'utf8');
      const hash=createHash('sha256').update(body).digest('hex'); if(hash!==ref.content_hash)throw new Error(`${card.canonical_key}: source hash drift`);
      const lines=body.split('\n').length; if(ref.line_end>lines)throw new Error(`${card.canonical_key}: source line out of range`);
    }
  }
  return {batchId:batch.batch_id,chapter:batch.chapter_position,cards:batch.cards.length,contentHash:batchHash(batch)};
}
export async function remotePlan(batch:ContentBatch){
  const client=database(); const hash=batchHash(batch);
  const keys=batch.cards.map(x=>x.canonical_key);
  const lessonKeys=[...new Set(batch.cards.map(x=>x.lesson_source_key))];
  const sourcePaths=[...new Set(batch.cards.flatMap(x=>x.source_refs.map(ref=>ref.relative_path)))];
  const [{data:existing,error:cardError},{data:lessons,error:lessonError},{data:sources,error:sourceError},{data:ledger,error:ledgerError}]=await Promise.all([
    client.from('apm_cards').select('id,canonical_key,active_revision,lesson_id,chapter_id').in('canonical_key',keys),
    client.from('apm_lessons').select('id,chapter_id,source_key,title').in('source_key',lessonKeys),
    client.from('apm_source_revisions').select('id,lesson_id,relative_path,content_hash').in('relative_path',sourcePaths),
    client.from('apm_content_batches').select('batch_id,content_hash').eq('batch_id',batch.batch_id).maybeSingle(),
  ]);
  if(cardError||lessonError||sourceError||ledgerError)throw new Error(`Remote preflight failed: ${cardError?.message||lessonError?.message||sourceError?.message||ledgerError?.message}`);
  if(ledger&&ledger.content_hash!==hash)throw new Error(`${batch.batch_id}: remote batch id has a different content hash`);
  const payload=[]; const additions:string[]=[]; const revisions:string[]=[]; const unchanged:string[]=[];
  for(const card of batch.cards){
    const lesson=lessons?.find(x=>x.source_key===card.lesson_source_key);
    if(!lesson)throw new Error(`${card.canonical_key}: lesson missing from remote database`);
    const current=existing?.find(x=>x.canonical_key===card.canonical_key);
    if(current){
      if(current.id!==stableCardId(card.canonical_key)||current.lesson_id!==lesson.id)throw new Error(`${card.canonical_key}: remote identity conflict`);
      if(ledger&&card.revision===current.active_revision)unchanged.push(card.canonical_key);
      else if(card.revision===current.active_revision+1)revisions.push(card.canonical_key);
      else throw new Error(`${card.canonical_key}: expected revision ${ledger?current.active_revision:current.active_revision+1}`);
    }else{if(card.canonical_key.startsWith('C'))throw new Error(`${card.canonical_key}: legacy card missing from remote database`);if(card.revision!==1)throw new Error(`${card.canonical_key}: new card must start at revision 1`); additions.push(card.canonical_key);}
    const source_refs=card.source_refs.map(ref=>{const source=sources?.find(x=>x.relative_path===ref.relative_path&&x.content_hash===ref.content_hash);if(!source)throw new Error(`${card.canonical_key}: source/hash missing from remote database`);if(source.lesson_id!==lesson.id)throw new Error(`${card.canonical_key}: source/lesson mismatch in remote database`);return {...ref,source_revision_id:source.id,lesson_id:source.lesson_id,title:lesson.title};});
    const {review: _review,lesson_source_key: _lessonSourceKey,...content}=card;
    payload.push({...content,card_id:stableCardId(card.canonical_key),lesson_id:lesson.id,chapter_id:lesson.chapter_id,source_refs});
  }
  if(ledger&&(additions.length||revisions.length))throw new Error(`${batch.batch_id}: published ledger and card state disagree`);
  return {hash,payload,additions,revisions,unchanged,published:Boolean(ledger)};
}
