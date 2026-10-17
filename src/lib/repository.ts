import 'server-only';
import { db } from './db';
import type { Bootstrap, CardDetail, CardMeta, Settings } from './types';
export async function bootstrap(user:{id:string;display_name:string}):Promise<Bootstrap>{
 const client=db();
 const result=await Promise.all([
  client.from('apm_settings').select('*').eq('user_id',user.id).single(),
  client.from('apm_chapters').select('*').order('position'),
  client.from('apm_lessons').select('id,chapter_id,title,position,summary,reading_minutes').order('position'),
  client.from('apm_cards').select('*').eq('lifecycle','active').order('position'),
  client.from('apm_card_revisions').select('card_id,revision,title,kind,prompt,estimated_seconds'),
  client.from('apm_review_states').select('card_id,fsrs,due,version,suspended,last_event_id').eq('user_id',user.id),
  client.from('apm_review_events').select('id,card_id,kind,rating,state_before,state_after,received_at,reviewed_at,duration_ms,undone_event_id').eq('user_id',user.id).order('received_at',{ascending:false}).limit(1000),
  client.from('apm_study_activity').select('lesson_id,completed_at').eq('user_id',user.id),
 ]);
 for(const r of result)if(r.error)throw new Error(`DATABASE_READ_FAILED:${r.error.code}`);
 const [s,ch,l,c,cr,st,e,a]=result;
 const settings=s.data as unknown as Settings;
 const revisionMap=new Map((cr.data||[]).map(r=>[`${r.card_id}:${r.revision}`,r]));
 const cards=(c.data||[]).map(card=>({...card,...revisionMap.get(`${card.id}:${card.active_revision}`)})) as CardMeta[];
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
