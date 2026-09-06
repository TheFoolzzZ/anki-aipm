import { createEmptyCard, fsrs, type CardInput } from 'ts-fsrs';
import type { SavedCard, Settings } from './types';
export const SCHEDULER_VERSION='ts-fsrs@5.4.2/FSRS-6';
export function intervalLabel(due:string,now:Date){
 const minutes=Math.max(1,Math.round((new Date(due).getTime()-now.getTime())/60000));
 if(minutes<60)return `${minutes} 分钟`;
 if(minutes<1440)return `${Math.round(minutes/60)} 小时`;
 const days=Math.round(minutes/1440);return days<30?`${days} 天`:`${Math.round(days/30)} 个月`;
}
export function previewSchedule(current:SavedCard|null,settings:Pick<Settings,'retention'>,now:Date){
 const before:SavedCard=current||JSON.parse(JSON.stringify(createEmptyCard(now)));
 const scheduler=fsrs({request_retention:Number(settings.retention),enable_fuzz:false,enable_short_term:true,learning_steps:['1m','10m'],relearning_steps:['10m']});
 const outcomes=scheduler.repeat(before as CardInput,now);
 const candidates:Record<number,SavedCard>={};
 for(const rating of [1,2,3,4] as const)candidates[rating]=JSON.parse(JSON.stringify(outcomes[rating].card));
 return {before,candidates,options:[1,2,3,4].map(rating=>({rating,due:candidates[rating].due,interval:intervalLabel(candidates[rating].due,now)}))};
}
