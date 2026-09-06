import { batchPath, loadBatch, remotePlan, validateLocal } from './content-batch-lib';
const batch=loadBatch(batchPath()); const local=validateLocal(batch); const plan=await remotePlan(batch);
console.log(JSON.stringify({...local,published:plan.published,additions:plan.additions,revisions:plan.revisions,unchanged:plan.unchanged},null,2));
