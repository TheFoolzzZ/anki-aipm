export function isSameOrigin(origin: string | null, requestUrl: string, host: string | null, development: boolean): boolean {
  if (!origin || origin === 'null') return false;
  try {
    const target = new URL(requestUrl);
    const source = new URL(origin);
    if (origin !== source.origin) return false;
    if (source.origin === target.origin) return true;
    // Next development normalizes loopback URLs; retain the browser's actual Host.
    const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);
    return development && loopback.has(target.hostname) && loopback.has(source.hostname)
      && source.protocol === target.protocol && source.port === target.port && source.host === host;
  } catch {
    return false;
  }
}
