import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
const env = { ...parseEnv(readFileSync('.env.local', 'utf8')), ...process.env };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Supabase configuration missing');
const res = await fetch(`${url}/rest/v1/`, { headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/openapi+json' }, signal: AbortSignal.timeout(20000) });
if (!res.ok) { console.log(JSON.stringify({ status: res.status, reachable: true })); process.exit(1); }
const api = await res.json();
console.log(JSON.stringify({ reachable: true, tables: Object.keys(api.definitions || {}), functions: Object.keys(api.paths || {}).filter(p => p.startsWith('/rpc/')), managementCredentialPresent: Boolean(env.SUPABASE_ACCESS_TOKEN || env.DATABASE_URL) }, null, 2));
