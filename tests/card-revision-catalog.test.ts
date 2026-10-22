import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { cardRevisionCatalog } from '../src/lib/card-revision-catalog';

test('revision catalog retains active metadata beyond 1000 historical revisions',async()=>{
 const rows=Array.from({length:1191},(_,i)=>({card_id:`card-${String(i).padStart(4,'0')}`,revision:1,title:`题目${i}`,kind:'concept',prompt:`问题${i}`,estimated_seconds:60}));
 const offsets:number[]=[];
 const client=createClient('https://example.supabase.co','test-key',{global:{fetch:async(input)=>{
  const url=new URL(String(input));
  assert.equal(url.searchParams.get('order'),'card_id.asc,revision.asc');
  const offset=Number(url.searchParams.get('offset')||0),limit=Number(url.searchParams.get('limit')||1000);
  offsets.push(offset);
  return new Response(JSON.stringify(rows.slice(offset,offset+Math.min(limit,1000))),{status:200,headers:{'Content-Type':'application/json'}});
 }}});
 const result=await cardRevisionCatalog(client);
 assert.equal(result.error,null);assert.equal(result.data?.length,1191);
 assert.equal(result.data?.at(-1)?.title,'题目1190');
 assert.deepEqual(offsets,[0,500,1000]);
});

test('a later page failure never exposes a partially loaded revision catalog',async()=>{
 const client=createClient('https://example.supabase.co','test-key',{global:{fetch:async(input)=>{
  const offset=Number(new URL(String(input)).searchParams.get('offset')||0);
  return offset===0
   ?new Response(JSON.stringify(Array.from({length:500},(_,i)=>({card_id:`card-${i}`,revision:1}))),{status:200,headers:{'Content-Type':'application/json'}})
   :new Response(JSON.stringify({code:'42501',message:'read failed'}),{status:403,headers:{'Content-Type':'application/json'}});
 }}});
 const result=await cardRevisionCatalog(client);
 assert.equal(result.data,null);assert.equal(result.error?.code,'42501');
});
