import { batchPath, loadBatch, remotePlan, validateLocal } from './content-batch-lib';
import { database } from './env';
const batch=loadBatch(batchPath()); validateLocal(batch); const plan=await remotePlan(batch);
const {data,error}=await database().rpc('apm_publish_card_batch',{p_batch_id:batch.batch_id,p_content_hash:plan.hash,p_chapter_position:batch.chapter_position,p_cards:plan.payload});
if(error)throw new Error(`Publish failed: ${error.message}`); console.log(JSON.stringify(data,null,2));
