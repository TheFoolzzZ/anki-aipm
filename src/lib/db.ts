import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = '';

export function db(): SupabaseClient {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)throw new Error('DATABASE_NOT_CONFIGURED');
 const configKey=`${url}:${key}`;
 if(!cachedClient||cachedConfigKey!==configKey){
  cachedClient=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>fetch(input,{...init,cache:'no-store',signal:AbortSignal.timeout(20000)})}});
  cachedConfigKey=configKey;
 }
 return cachedClient;
}
