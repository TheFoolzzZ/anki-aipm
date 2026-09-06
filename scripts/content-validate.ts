import { batchPath, loadBatch, validateLocal } from './content-batch-lib';
console.log(JSON.stringify(validateLocal(loadBatch(batchPath())),null,2));
