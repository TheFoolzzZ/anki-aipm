import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { createClient } from '@supabase/supabase-js';
export function environment() {
  return { ...parseEnv(readFileSync('.env.local', 'utf8')), ...process.env };
}
export function database() {
  const e = environment();
  const url = e.NEXT_PUBLIC_SUPABASE_URL;
  const key = e.SUPABASE_SECRET_KEY || e.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase配置不完整');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
