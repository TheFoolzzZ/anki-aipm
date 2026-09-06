import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const lockfile = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

expect(packageJson.engines?.node === '22.x', 'package.json must pin engines.node to 22.x');
expect(lockfile.lockfileVersion === 3, 'package-lock.json must use lockfileVersion 3');
expect(vercel.framework === 'nextjs', 'vercel.json must use the Next.js framework preset');
expect(vercel.installCommand === 'npm ci', 'Vercel install command must use npm ci');
expect(vercel.buildCommand === 'npm run vercel-build', 'Vercel build command must run the guarded build');

if (process.argv.includes('--vercel')) {
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'APM_SESSION_SECRET'];
  const placeholders = /replace_with|your-project|example|changeme/i;
  for (const name of required) {
    const value = process.env[name];
    expect(Boolean(value), `${name} is required in this Vercel environment`);
    if (value) expect(!placeholders.test(value), `${name} still contains a placeholder`);
  }
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
      expect(url.protocol === 'https:', 'NEXT_PUBLIC_SUPABASE_URL must use https');
    } catch {
      failures.push('NEXT_PUBLIC_SUPABASE_URL must be a valid URL');
    }
  }
  if (process.env.SUPABASE_SECRET_KEY) expect(process.env.SUPABASE_SECRET_KEY.length >= 20, 'SUPABASE_SECRET_KEY is unexpectedly short');
  if (process.env.APM_SESSION_SECRET) expect(process.env.APM_SESSION_SECRET.length >= 32, 'APM_SESSION_SECRET must be at least 32 characters');
  expect(process.env.APM_DEV_AUTO_LOGIN !== 'true', 'APM_DEV_AUTO_LOGIN must be false or unset on Vercel');
}

if (failures.length) {
  console.error(`Deployment check failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`Deployment check passed (${process.argv.includes('--vercel') ? 'Vercel environment' : 'repository configuration'}).`);
