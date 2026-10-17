import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { database, environment } from './env';
const db=database(), env=environment();
const seed=JSON.parse(readFileSync('data/private/seed.json','utf8'));
const report:Record<string,number>={};
async function upsert(table:string,rows:unknown[],conflict='id'){
 for(let i=0;i<rows.length;i+=20){
  const {error}=await db.from(table).upsert(rows.slice(i,i+20),{onConflict:conflict,ignoreDuplicates:table==='apm_source_revisions'||table==='apm_card_revisions'});
  if(error)throw new Error(`${table}: ${error.code} ${error.message}`);
 }
 report[table]=rows.length;
}
if(!env.APM_OWNER_ID||!env.APM_OWNER_ACCESS_CODE)throw new Error('Owner configuration missing');
await upsert('apm_users',[{id:env.APM_OWNER_ID,display_name:'Klein',username_normalized:'klein',access_code_hash:createHash('sha256').update(env.APM_OWNER_ACCESS_CODE).digest('hex')}]);
const settings=await db.from('apm_settings').upsert({user_id:env.APM_OWNER_ID},{onConflict:'user_id',ignoreDuplicates:true});
if(settings.error)throw settings.error;
await upsert('apm_chapters',seed.chapters);
await upsert('apm_lessons',seed.lessons);
await upsert('apm_source_revisions',seed.sources);
await upsert('apm_cards',seed.cards);
await upsert('apm_card_revisions',seed.revisions,'card_id,revision');
for(const [table,expected] of Object.entries(report)){
 const {count,error}=await db.from(table).select('*',{count:'exact',head:true});
 if(error||count===null||count<expected)throw new Error(`${table}: count verification failed`);
 report[table]=count;
}
writeFileSync('docs/verification/seed-result.json',JSON.stringify({timestamp:new Date().toISOString(),tables:report},null,2)+'\n');
console.log(JSON.stringify({seeded:true,tables:report},null,2));
