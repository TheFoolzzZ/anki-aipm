import type { SupabaseClient } from '@supabase/supabase-js';

/** Historical revisions grow on every content release, beyond the API row limit. */
export async function cardRevisionCatalog(client: SupabaseClient) {
 const rows: {card_id:string;revision:number;title:string;kind:string;prompt:string;estimated_seconds:number}[]=[];
 const pageSize=500;
 for(let offset=0;;offset+=pageSize){
  const result=await client.from('apm_card_revisions')
   .select('card_id,revision,title,kind,prompt,estimated_seconds')
   .order('card_id').order('revision').range(offset,offset+pageSize-1);
  if(result.error)return {data:null,error:result.error};
  rows.push(...result.data);
  if(result.data.length<pageSize)return {data:rows,error:null};
 }
}
