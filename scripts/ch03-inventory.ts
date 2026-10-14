import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { database, environment } from './env';
const out = 'artifacts/ch03-interview';
mkdirSync(out, {recursive:true});
const env = environment();
const seed = JSON.parse(readFileSync('data/private/seed.json','utf8'));
const chapter = seed.chapters.find((x:any)=>x.position===3);
const hash = (x:unknown)=>createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const modules = seed.lessons.filter((l:any)=>l.chapter_id===chapter.id).sort((a:any,b:any)=>a.position-b.position).map((lesson:any)=>{
  const source=seed.sources.find((s:any)=>s.lesson_id===lesson.id);
  const path=join(env.KB_SOURCE_PATH!,source.relative_path);
  const body=readFileSync(path,'utf8');
  if(hash(body)!==source.content_hash)throw new Error(`SOURCE_DRIFT:${source.relative_path}`);
  const lines=body.split('\n');
  return {module:`3.${lesson.position}`,position:lesson.position,id:lesson.id,title:lesson.title,source_key:lesson.source_key,relative_path:source.relative_path,absolute_path:path,content_hash:source.content_hash,line_count:lines.length,headings:lines.flatMap((text:string,i:number)=>/^#{1,6}\s/.test(text)?[{line:i+1,text}]:[]),checklist:lines.flatMap((text:string,i:number)=>/^\s*[-*]\s+\[[ xX]\]/.test(text)?[{line:i+1,text}]:[])};
});
const db=database();
async function all(table:string,select='*'){
  const rows:any[]=[];
  for(let offset=0;;offset+=500){let query=db.from(table).select(select).order(table==='apm_content_batches'?'batch_id':table==='apm_card_revisions'?'card_id':'id');if(table==='apm_card_revisions')query=query.order('revision');const r=await query.range(offset,offset+499);if(r.error)throw new Error(`${table}:${r.error.message}`);rows.push(...r.data);if(r.data.length<500)break;}
  return rows;
}
const [cards,revisions,batches]=await Promise.all([all('apm_cards'),all('apm_card_revisions'),all('apm_content_batches')]);
const lessonIds=modules.map((x:any)=>x.id);
const active=cards.filter(c=>lessonIds.includes(c.lesson_id)&&c.lifecycle==='active').map(c=>({...c,...revisions.find(r=>r.card_id===c.id&&r.revision===c.active_revision),id:c.id}));
const reviewCounts:Record<string,number|null>={};
for(const table of ['apm_review_states','apm_review_events']){const r=await db.from(table).select('*',{count:'exact',head:true});if(r.error)throw r.error;reviewCounts[table]=r.count;}
const snapshot={at:new Date().toISOString(),counts:{cards:cards.length,revisions:revisions.length,batches:batches.length,...reviewCounts},cards:cards.map(({id,canonical_key,active_revision,position,chapter_id,lesson_id,concept_keys,lifecycle})=>({id,canonical_key,active_revision,position,chapter_id,lesson_id,concept_keys,lifecycle})),chapterCards:active};
writeFileSync(join(out,'source-index.json'),JSON.stringify(modules,null,2)+'\n');
const filename=process.argv.includes('--after')?'after.json':'before.json';
// A baseline is immutable within a run; explicit --after creates a separate snapshot.
writeFileSync(join(out,filename),JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({snapshot:join(out,filename),counts:snapshot.counts,moduleCount:modules.length,checklistCount:modules.reduce((n:number,x:any)=>n+x.checklist.length,0),chapterCards:active.length,modules:modules.map((m:any)=>({module:m.module,title:m.title,checklist:m.checklist.length,cards:active.filter(c=>c.lesson_id===m.id).length}))},null,2));
