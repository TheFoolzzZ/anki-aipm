import 'server-only';
import { db } from './db';
import { cardRevisionCatalog } from './card-revision-catalog';
import { usernameKey, validateUsername } from './username';
import type { Bootstrap, CardDetail, CardMeta, LearnerSummary, Settings } from './types';
export async function bootstrap(user:{id:string;display_name:string}):Promise<Bootstrap>{
 const client=db();
 const result=await Promise.all([
  client.from('apm_settings').select('*').eq('user_id',user.id).single(),
  client.from('apm_chapters').select('*').order('position'),
  client.from('apm_lessons').select('id,chapter_id,title,position,summary,reading_minutes').order('position'),
  client.from('apm_cards').select('*').eq('lifecycle','active').order('position'),
  cardRevisionCatalog(client),
  client.from('apm_review_states').select('card_id,fsrs,due,version,suspended,last_event_id').eq('user_id',user.id),
  client.from('apm_review_events').select('id,card_id,kind,rating,state_before,state_after,received_at,reviewed_at,duration_ms,undone_event_id').eq('user_id',user.id).order('received_at',{ascending:false}).limit(1000),
  client.from('apm_study_activity').select('lesson_id,completed_at').eq('user_id',user.id),
 ]);
 for(const r of result)if(r.error)throw new Error(`DATABASE_READ_FAILED:${r.error.code}`);
 const [s,ch,l,c,cr,st,e,a]=result;
 const settings=s.data as unknown as Settings;
 const revisionMap=new Map((cr.data||[]).map(r=>[`${r.card_id}:${r.revision}`,r]));
 const cards=(c.data||[]).map(card=>{
  const revision=revisionMap.get(`${card.id}:${card.active_revision}`);
  if(!revision)throw new Error('DATABASE_CARD_REVISION_MISSING');
  return {...card,...revision};
 }) as CardMeta[];
 return {user,settings:{...settings,retention:Number(settings.retention)},chapters:ch.data as Bootstrap['chapters'],lessons:l.data as Bootstrap['lessons'],cards,states:st.data as Bootstrap['states'],events:e.data as Bootstrap['events'],activity:a.data as Bootstrap['activity'],now:new Date().toISOString(),historyLimited:e.data?.length===1000};
}
export async function cardDetail(id:string):Promise<CardDetail>{
 const client=db();
 const [card,revisions]=await Promise.all([
  client.from('apm_cards').select('*').eq('id',id).eq('lifecycle','active').single(),
  client.from('apm_card_revisions').select('*').eq('card_id',id),
 ]);
 if(card.error||revisions.error)throw new Error('CARD_NOT_FOUND');
 const revision=revisions.data?.find(item=>item.revision===card.data.active_revision);
 if(!revision)throw new Error('CARD_NOT_FOUND');
 return {...card.data,...revision};
}
export async function lessonSource(lessonId:string){
 const r=await db().from('apm_source_revisions').select('id,body_markdown,content_hash').eq('lesson_id',lessonId).order('imported_at',{ascending:false}).limit(1).single();
 if(r.error||!r.data)throw new Error('LESSON_NOT_FOUND');
 return r.data;
}
export async function reviewContext(userId:string,cardId:string){
 const client=db();
 const [settings,state,detail]=await Promise.all([
  client.from('apm_settings').select('*').eq('user_id',userId).single(),
  client.from('apm_review_states').select('card_id,fsrs,due,version,suspended,last_event_id').eq('user_id',userId).eq('card_id',cardId).maybeSingle(),
  cardDetail(cardId),
 ]);
 if(settings.error||state.error)throw new Error('DATABASE_READ_FAILED');
 const value=settings.data as unknown as Settings;
 return {settings:{...value,retention:Number(value.retention)},state:state.data,detail};
}
function learnerError(error:{message?:string;code?:string}|null){
 const message=error?.message||'';
 if(message.includes('USERNAME_TAKEN')||error?.code==='23505')throw new Error('USERNAME_TAKEN');
 if(message.includes('INVALID_USERNAME'))throw new Error('INVALID_USERNAME');
 throw new Error(message||'DATABASE_WRITE_FAILED');
}
export async function listLearners(accessCodeHash:string):Promise<LearnerSummary[]>{
 const r=await db().from('apm_users').select('id,display_name,created_at,last_active_at').eq('active',true).eq('access_code_hash',accessCodeHash).order('last_active_at',{ascending:false});
 if(r.error)throw new Error('DATABASE_READ_FAILED');
 return (r.data||[]) as LearnerSummary[];
}
export async function findLearnerByUsername(username:string){
 const clean=validateUsername(username);
 const r=await db().from('apm_users').select('id,display_name').eq('username_normalized',usernameKey(clean)).eq('active',true).maybeSingle();
 if(r.error)throw new Error('DATABASE_READ_FAILED');
 return r.data;
}
export async function touchLearner(userId:string){
 await db().from('apm_users').update({last_active_at:new Date().toISOString()}).eq('id',userId);
}
export async function registerLearner(displayName:string,accessCodeHash:string){
 const clean=validateUsername(displayName);
 const r=await db().rpc('apm_register_user',{p_display_name:clean,p_access_code_hash:accessCodeHash});
 if(r.error||!r.data)learnerError(r.error);
 const row=Array.isArray(r.data)?r.data[0]:r.data;
 return {id:row.id as string,display_name:row.display_name as string};
}
export async function renameLearner(userId:string,displayName:string){
 const clean=validateUsername(displayName);
 const norm=usernameKey(clean);
 const taken=await db().from('apm_users').select('id').eq('username_normalized',norm).neq('id',userId).maybeSingle();
 if(taken.error)throw new Error('DATABASE_READ_FAILED');
 if(taken.data)throw new Error('USERNAME_TAKEN');
 const r=await db().from('apm_users').update({display_name:clean,username_normalized:norm}).eq('id',userId).eq('active',true).select('id,display_name').single();
 if(r.error||!r.data)learnerError(r.error);
 return r.data;
}
export async function learnerInviteHash(userId:string){
 const r=await db().from('apm_users').select('access_code_hash').eq('id',userId).eq('active',true).single();
 if(r.error||!r.data)throw new Error('UNAUTHENTICATED');
 return r.data.access_code_hash as string;
}
