import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { sign, verify, sha256 } from '@/lib/crypto';
import { isSameOrigin } from '@/lib/request-origin';
import { bootstrap, cardDetail, lessonSource, reviewContext } from '@/lib/repository';
import { selectNext } from '@/lib/learning';
import { previewSchedule } from '@/lib/scheduler';
import type { SavedCard } from '@/lib/types';
export const dynamic='force-dynamic';
export const runtime='nodejs';
const cookieName='apm-session';
const uuid=z.string().uuid();
type Session={userId:string;expires:number};
type PreviewToken={userId:string;cardId:string;revision:number;version:number;settingsVersion:number;before:SavedCard;candidates:Record<number,SavedCard>;at:string;expires:number};
function json(value:unknown,status=200){return NextResponse.json(value,{status,headers:{'Cache-Control':'no-store'}});}
function errorResponse(error:unknown){
 const message=error instanceof Error?error.message:'UNKNOWN';
 if(error instanceof z.ZodError)return json({error:'输入内容不符合要求，请检查后重试。',code:'INVALID_INPUT'},422);
 if(message==='INVALID_INPUT')return json({error:'输入内容不符合要求，请检查后重试。',code:message},422);
 if(message.includes('CONFLICT'))return json({error:'学习进度或设置已更新，请刷新后继续。',code:message},409);
 if(message==='UNAUTHENTICATED')return json({error:'请先进入你的学习空间。',code:message},401);
 if(message==='FORBIDDEN')return json({error:'此请求不被允许。',code:message},403);
 if(message.includes('NOT_FOUND'))return json({error:'没有找到这项内容。',code:message},404);
 if(message==='PREVIEW_EXPIRED')return json({error:'复习预览已过期，请重新显示答案。',code:message},422);
 console.error('[Recall API]',message.replace(/[^A-Za-z0-9_:.-]/g,'').slice(0,100));
 return json({error:'暂时无法连接学习数据，请稍后重试。',code:'SERVICE_UNAVAILABLE'},503);
}
function sameOrigin(req:NextRequest){
 if(!isSameOrigin(req.headers.get('origin'),req.url,req.headers.get('host'),process.env.NODE_ENV==='development'))throw new Error('FORBIDDEN');
}
async function body(req:NextRequest){
 const text=await req.text();if(text.length>32000)throw new Error('FORBIDDEN');
 try{return JSON.parse(text);}catch{throw new Error('INVALID_INPUT');}
}
function sessionUserId(req:NextRequest):string{
 const session=verify<Session>(req.cookies.get(cookieName)?.value||'','session');
 if(!session||!uuid.safeParse(session.userId).success)throw new Error('UNAUTHENTICATED');
 return session.userId;
}
async function userById(userId:string){
 const r=await db().from('apm_users').select('id,display_name').eq('id',userId).eq('active',true).single();
 if(r.error||!r.data)throw new Error('UNAUTHENTICATED');return r.data;
}
async function handle(req:NextRequest,{params}:{params:Promise<{path:string[]}>}){
 try {
  const path=(await params).path.join('/');
  if(req.method!=='GET')sameOrigin(req);
  if(path==='health'){
   const required=['202609050001','202609060001'];
   const r=await db().from('apm_migrations').select('version').in('version',required);
   const applied=new Set((r.data||[]).map(row=>row.version));
   const schemaReady=!r.error&&required.every(version=>applied.has(version));
   return json({ok:schemaReady,storage:'supabase',schemaReady,requiredMigrations:required.length},schemaReady?200:503);
  }
  if(path==='auth'&&req.method==='POST'){
   const input=z.object({code:z.string().max(256).optional(),local:z.boolean().optional()}).parse(await body(req));
   const local=input.local&&process.env.NODE_ENV==='development'&&process.env.APM_DEV_AUTO_LOGIN==='true'&&['127.0.0.1','localhost'].includes(req.nextUrl.hostname);
   let query=db().from('apm_users').select('id,display_name').eq('id',process.env.APM_OWNER_ID||'');
   if(!local){const code=input.code?.trim();if(!code)return json({error:'请输入学习访问码。'},401);query=db().from('apm_users').select('id,display_name').eq('active',true).eq('access_code_hash',sha256(code));}
   else query=query.eq('active',true);
   const r=await query.single();
   if(r.error||!r.data)return json({error:'访问码无效，或学习空间尚未初始化。'},401);
   const res=json({user:r.data});res.cookies.set(cookieName,sign({userId:r.data.id,expires:Date.now()+7*86400000},'session'),{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:7*86400});return res;
  }
  if(path==='auth/local'&&req.method==='GET')return json({enabled:process.env.NODE_ENV==='development'&&process.env.APM_DEV_AUTO_LOGIN==='true'&&['127.0.0.1','localhost'].includes(req.nextUrl.hostname)});
  if(path==='auth/logout'&&req.method==='POST'){const res=json({ok:true});res.cookies.delete(cookieName);return res;}
  const uid=sessionUserId(req);
  if(path.startsWith('cards/')&&req.method==='GET'){
   const cardId=uuid.parse(path.split('/')[1]);
   const [,detail]=await Promise.all([userById(uid),cardDetail(cardId)]);
   return json(detail);
  }
  if(path.startsWith('lessons/')&&req.method==='GET'){
   const lessonId=uuid.parse(path.split('/')[1]);
   const [,source]=await Promise.all([userById(uid),lessonSource(lessonId)]);
   return json(source);
  }
  if(path==='study/reveal'&&req.method==='POST'){
   const input=z.object({cardId:uuid}).parse(await body(req));
   const [current,context]=await Promise.all([userById(uid),reviewContext(uid,input.cardId)]);
   if(context.state?.suspended)throw new Error('STATE_CONFLICT');
   const now=new Date();const schedule=previewSchedule(context.state?.fsrs||null,context.settings,now);
   const payload:PreviewToken={userId:current.id,cardId:context.detail.id,revision:context.detail.active_revision,version:context.state?.version||0,settingsVersion:context.settings.version,before:schedule.before,candidates:schedule.candidates,at:now.toISOString(),expires:now.getTime()+600000};
   return json({card:context.detail,preview:{token:sign(payload,'review'),options:schedule.options}});
  }
  const current=await userById(uid);
  if(path==='bootstrap'&&req.method==='GET')return json(await bootstrap(current));
  if(path==='study'&&req.method==='GET'){
   const data=await bootstrap(current);const requested=req.nextUrl.searchParams.get('card');
   const selected=requested?data.cards.find(c=>c.id===uuid.parse(requested)):selectNext(data,new Date());
   if(!selected)return json({card:null,complete:true});
   return json({card:selected,state:data.states.find(s=>s.card_id===selected.id)||null,settingsVersion:data.settings.version});
  }
  if(path==='reviews'&&req.method==='POST'){
   const input=z.object({rating:z.number().int().min(1).max(4),token:z.string().max(24000),clientEventId:uuid,durationMs:z.number().int().min(0).max(1800000)}).parse(await body(req));
   const p=verify<PreviewToken>(input.token,'review');if(!p)throw new Error('PREVIEW_EXPIRED');if(p.userId!==current.id)throw new Error('FORBIDDEN');
   const r=await db().rpc('apm_commit_review',{p_user:current.id,p_card:p.cardId,p_revision:p.revision,p_expected:p.version,p_settings_version:p.settingsVersion,p_client_event:input.clientEventId,p_hash:sha256(`${input.token}:${input.rating}`),p_rating:input.rating,p_before:p.before,p_after:p.candidates[input.rating],p_reviewed_at:p.at,p_duration:input.durationMs});
   if(r.error)throw new Error(r.error.message);return json({...r.data,before:p.before,rating:input.rating,reviewedAt:p.at,receivedAt:new Date().toISOString(),durationMs:input.durationMs});
  }
  if(path==='reviews/undo'&&req.method==='POST'){
   const input=z.object({eventId:uuid,version:z.number().int().min(1),clientEventId:uuid}).parse(await body(req));
   const r=await db().rpc('apm_undo_review',{p_user:current.id,p_event:input.eventId,p_expected:input.version,p_client_event:input.clientEventId,p_hash:sha256(`${input.eventId}:${input.version}`)});
   if(r.error)throw new Error(r.error.message);return json(r.data);
  }
  if(path==='activity'&&req.method==='POST'){
   const input=z.object({lessonId:uuid}).parse(await body(req));const r=await db().from('apm_study_activity').upsert({user_id:current.id,lesson_id:input.lessonId,completed_at:new Date().toISOString()},{onConflict:'user_id,lesson_id'});
   if(r.error)throw new Error('ACTIVITY_FAILED');return json({ok:true});
  }
  if(path==='settings'&&req.method==='PATCH'){
   const input=z.object({daily_minutes:z.number().int().min(10).max(120),new_cards_per_day:z.number().int().min(0).max(30),retention:z.number().min(.8).max(.97),timezone:z.string().max(80),route_mode:z.enum(['guided','chapter']),familiarity:z.record(z.string().uuid(),z.enum(['new','familiar','experienced'])),version:z.number().int().min(0)}).parse(await body(req));
   try{new Intl.DateTimeFormat('zh',{timeZone:input.timezone}).format();}catch{return json({error:'请选择有效的时区。'},422);}
   const {version,...values}=input;
   const r=await db().from('apm_settings').update({...values,version:version+1,updated_at:new Date().toISOString()}).eq('user_id',current.id).eq('version',version).select('*').single();
   if(r.error)throw new Error('SETTINGS_CONFLICT');return json(r.data);
  }
  return json({error:'没有这个接口。'},404);
 }catch(error){return errorResponse(error);}
}
export {handle as GET,handle as POST,handle as PATCH};
