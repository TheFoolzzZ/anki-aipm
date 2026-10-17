import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import type { Bootstrap, ReviewEvent, Settings } from './types';
export function learningDay(now:Date,settings:Pick<Settings,'timezone'|'day_start_hour'>){
 const date=formatInTimeZone(now,settings.timezone,'yyyy-MM-dd');
 const hour=Number(formatInTimeZone(now,settings.timezone,'H'));
 const day=hour<settings.day_start_hour?new Date(new Date(`${date}T12:00:00Z`).getTime()-86400000).toISOString().slice(0,10):date;
 return {key:day,start:fromZonedTime(`${day}T${String(settings.day_start_hour).padStart(2,'0')}:00:00`,settings.timezone)};
}
export function activeReviews(events:ReviewEvent[]){
 const undone=new Set(events.filter(e=>e.kind==='undo').map(e=>e.undone_event_id));
 return events.filter(e=>e.kind==='review'&&!undone.has(e.id));
}
export function studySummary(data:Bootstrap,now=new Date(data.now)){
 const start=learningDay(now,data.settings).start.getTime();
 const nowMs=now.getTime();
 const reviews=activeReviews(data.events);
 const today=reviews.filter(e=>new Date(e.received_at).getTime()>=start);
 const newToday=new Set(today.filter(e=>e.state_before.reps===0).map(e=>e.card_id)).size;
 const stateMap=new Map(data.states.map(s=>[s.card_id,s]));
 const available=data.cards.filter(c=>!stateMap.get(c.id)?.suspended);
 const due=available.filter(c=>{const s=stateMap.get(c.id);return s&&s.fsrs.reps>0&&new Date(s.due).getTime()<=nowMs;});
 const unseen=available.filter(c=>!stateMap.get(c.id)?.fsrs.reps);
 const spentMs=today.reduce((n,e)=>n+e.duration_ms,0);
 const remainingMinutes=Math.max(0,data.settings.daily_minutes-spentMs/60000);
 const reviewMinutes=due.length*0.5;
 const newBudget=reviewMinutes>=20?0:Math.max(0,Math.min(data.settings.new_cards_per_day-newToday,Math.floor((remainingMinutes-reviewMinutes)/1.5)));
 const newCount=Math.min(unseen.length,newBudget);
 return {today,reviews,newToday,due,unseen,newCount,spentMs,remainingMinutes,reviewMinutes,learned:data.states.filter(s=>s.fsrs.reps>0).length};
}
export function selectNext(data:Bootstrap,now=new Date(data.now),skip:string[]=[]){
 const summary=studySummary(data,now);
 const skipSet=new Set(skip);
 const stateMap=new Map(data.states.map(s=>[s.card_id,s]));
 const due=summary.due.filter(c=>!skipSet.has(c.id)).sort((a,b)=>new Date(stateMap.get(a.id)!.due).getTime()-new Date(stateMap.get(b.id)!.due).getTime());
 if(due.length)return due[0];
 if(!summary.newCount)return null;
 const cardMap=new Map(data.cards.map(c=>[c.id,c]));
 const chapterPosition=new Map(data.chapters.map(c=>[c.id,c.position]));
 const practicedConcepts=new Set(summary.today.flatMap(e=>cardMap.get(e.card_id)?.concept_keys||[]));
 const candidates=summary.unseen.filter(c=>!skipSet.has(c.id)&&!c.concept_keys.some(k=>practicedConcepts.has(k)));
 const rank=(chapterId:string)=>{const f=data.settings.familiarity[chapterId];return f==='new'?0:f==='experienced'?2:1;};
 candidates.sort((a,b)=>data.settings.route_mode==='chapter'?((chapterPosition.get(a.chapter_id)??0)-(chapterPosition.get(b.chapter_id)??0))||a.position-b.position:rank(a.chapter_id)-rank(b.chapter_id)||a.position-b.position);
 return candidates[0]||null;
}
