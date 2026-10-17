import type { Bootstrap, CardDetail, Preview } from './types';

export type LessonSourcePayload = {
  id: string;
  body_markdown: string;
  content_hash: string;
};

export type RevealPayload = {
  card: CardDetail;
  preview: Preview;
  fetchedAt: number;
};

const lessonCache = new Map<string, LessonSourcePayload>();
const lessonInFlight = new Map<string, Promise<LessonSourcePayload>>();

const cardDetailCache = new Map<string, CardDetail>();
const cardDetailInFlight = new Map<string, Promise<CardDetail>>();

const revealCache = new Map<string, RevealPayload>();
const revealInFlight = new Map<string, Promise<RevealPayload>>();

const BOOTSTRAP_STORAGE_KEY = 'recall.bootstrap.v1';
const REVEAL_MAX_AGE_MS = 8 * 60 * 1000;

export function getCachedLesson(lessonId: string): LessonSourcePayload | null {
  return lessonCache.get(lessonId) || null;
}

export function loadLessonCached(
  lessonId: string,
  fetcher: (path: string) => Promise<LessonSourcePayload>,
): Promise<LessonSourcePayload> {
  const cached = lessonCache.get(lessonId);
  if (cached) return Promise.resolve(cached);
  const existing = lessonInFlight.get(lessonId);
  if (existing) return existing;
  const req = fetcher(`lessons/${lessonId}`)
    .then(result => {
      lessonCache.set(lessonId, result);
      return result;
    })
    .finally(() => {
      lessonInFlight.delete(lessonId);
    });
  lessonInFlight.set(lessonId, req);
  return req;
}

export function prefetchLesson(
  lessonId: string | undefined | null,
  fetcher: (path: string) => Promise<LessonSourcePayload>,
): void {
  if (!lessonId || lessonCache.has(lessonId) || lessonInFlight.has(lessonId)) return;
  void loadLessonCached(lessonId, fetcher).catch(() => {});
}

export function getCachedCardDetail(cardId: string): CardDetail | null {
  return cardDetailCache.get(cardId) || null;
}

export function loadCardDetailCached(
  cardId: string,
  fetcher: (path: string) => Promise<CardDetail>,
): Promise<CardDetail> {
  const cached = cardDetailCache.get(cardId);
  if (cached) return Promise.resolve(cached);
  const existing = cardDetailInFlight.get(cardId);
  if (existing) return existing;
  const req = fetcher(`cards/${cardId}`)
    .then(result => {
      cardDetailCache.set(cardId, result);
      return result;
    })
    .finally(() => {
      cardDetailInFlight.delete(cardId);
    });
  cardDetailInFlight.set(cardId, req);
  return req;
}

export function prefetchCardDetail(
  cardId: string | undefined | null,
  fetcher: (path: string) => Promise<CardDetail>,
): void {
  if (!cardId || cardDetailCache.has(cardId) || cardDetailInFlight.has(cardId)) return;
  void loadCardDetailCached(cardId, fetcher).catch(() => {});
}

function revealKey(cardId: string, stateVersion: number, settingsVersion: number) {
  return `${cardId}:${stateVersion}:${settingsVersion}`;
}

export function getCachedReveal(
  cardId: string,
  stateVersion: number,
  settingsVersion: number,
  now = Date.now(),
): RevealPayload | null {
  const key = revealKey(cardId, stateVersion, settingsVersion);
  const cached = revealCache.get(key);
  if (!cached) return null;
  if (now - cached.fetchedAt > REVEAL_MAX_AGE_MS) {
    revealCache.delete(key);
    return null;
  }
  return cached;
}

export function invalidateReveal(cardId?: string): void {
  if (!cardId) {
    revealCache.clear();
    revealInFlight.clear();
    return;
  }
  for (const key of revealCache.keys()) {
    if (key.startsWith(`${cardId}:`)) revealCache.delete(key);
  }
  for (const key of revealInFlight.keys()) {
    if (key.startsWith(`${cardId}:`)) revealInFlight.delete(key);
  }
}

export function loadRevealCached(
  cardId: string,
  stateVersion: number,
  settingsVersion: number,
  fetcher: (cardId: string) => Promise<{ card: CardDetail; preview: Preview }>,
): Promise<RevealPayload> {
  const fresh = getCachedReveal(cardId, stateVersion, settingsVersion);
  if (fresh) return Promise.resolve(fresh);
  const key = revealKey(cardId, stateVersion, settingsVersion);
  const existing = revealInFlight.get(key);
  if (existing) return existing;
  const req = fetcher(cardId)
    .then(result => {
      const payload: RevealPayload = {
        card: result.card,
        preview: result.preview,
        fetchedAt: Date.now(),
      };
      cardDetailCache.set(cardId, result.card);
      revealCache.set(key, payload);
      return payload;
    })
    .finally(() => {
      revealInFlight.delete(key);
    });
  revealInFlight.set(key, req);
  return req;
}

export function prefetchReveal(
  cardId: string | undefined | null,
  stateVersion: number,
  settingsVersion: number,
  fetcher: (cardId: string) => Promise<{ card: CardDetail; preview: Preview }>,
): void {
  if (!cardId) return;
  if (getCachedReveal(cardId, stateVersion, settingsVersion)) return;
  const key = revealKey(cardId, stateVersion, settingsVersion);
  if (revealInFlight.has(key)) return;
  void loadRevealCached(cardId, stateVersion, settingsVersion, fetcher).catch(() => {});
}

export function readBootstrapSnapshot(): Bootstrap | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(BOOTSTRAP_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Bootstrap;
    if (!parsed || !parsed.user?.id || !Array.isArray(parsed.chapters) || !Array.isArray(parsed.lessons)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeBootstrapSnapshot(data: Bootstrap | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!data) {
      window.sessionStorage.removeItem(BOOTSTRAP_STORAGE_KEY);
      return;
    }
    window.sessionStorage.setItem(BOOTSTRAP_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota or privacy mode errors
  }
}

export function clearAllClientCaches(): void {
  lessonCache.clear();
  lessonInFlight.clear();
  cardDetailCache.clear();
  cardDetailInFlight.clear();
  revealCache.clear();
  revealInFlight.clear();
  writeBootstrapSnapshot(null);
}

const headingsCache = new Map<string, { id: string; title: string }[]>();

export function extractMarkdownHeadings(markdown: string, cacheKey?: string): { id: string; title: string }[] {
  if (!markdown) return [];
  if (cacheKey) {
    const cached = headingsCache.get(cacheKey);
    if (cached) return cached;
  }
  const headings: { id: string; title: string }[] = [];
  let fenced = false;
  const lines = markdown.split('\n');
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (!fenced) {
      const match = /^##\s+(.+?)\s*#*\s*$/.exec(line);
      if (match) {
        headings.push({ id: `section-${index + 1}`, title: match[1].replace(/[*_`]/g, '') });
      }
    }
  }
  if (cacheKey) headingsCache.set(cacheKey, headings);
  return headings;
}

export function isPlainLeftClick(event: {
  button?: number;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  defaultPrevented?: boolean;
}): boolean {
  return (
    !event.defaultPrevented &&
    (event.button === undefined || event.button === 0) &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

export type InstantLocation = { pathname: string; search: string };

let instantLocation: InstantLocation | null = null;
const instantLocationListeners = new Set<() => void>();
let instantPopstateBound = false;

export function getInstantOverride(): InstantLocation | null {
  return instantLocation;
}

export function getServerInstantLocation(): InstantLocation | null {
  return null;
}

export function subscribeInstantLocation(listener: () => void) {
  instantLocationListeners.add(listener);
  return () => {
    instantLocationListeners.delete(listener);
  };
}

function publishInstantLocation(next: InstantLocation) {
  instantLocation = next;
  for (const listener of instantLocationListeners) listener();
}

export function resetInstantNavigationForTests() {
  instantLocation = null;
  instantLocationListeners.clear();
  instantPopstateBound = false;
}

function readWindowLocation(): InstantLocation {
  const search = window.location.search;
  return { pathname: window.location.pathname, search: search.startsWith('?') ? search.slice(1) : search };
}

export function ensureInstantHistory() {
  if (instantPopstateBound || typeof window === 'undefined') return;
  instantPopstateBound = true;
  window.addEventListener('popstate', () => {
    publishInstantLocation(readWindowLocation());
  });
}

function nativeHistoryMethod(method: 'pushState' | 'replaceState') {
  const prototype = typeof History !== 'undefined' ? History.prototype : undefined;
  const fromPrototype = prototype?.[method];
  if (typeof fromPrototype === 'function') return fromPrototype;
  return window.history[method];
}

// Next.js 16 assigns its own window.history.pushState, and that patch dispatches
// ACTION_RESTORE for the dynamic catch-all. The restore waits on an RSC flight
// before usePathname commits, which is the click delay. History.prototype stays
// native, so the shell can switch on the same frame and keep the URL in sync.
export function instantNavigate(href: string, mode: 'push' | 'replace' = 'push', scroll = true) {
  if (typeof window === 'undefined' || !href.startsWith('/') || href.startsWith('//')) return;
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return;
  }
  if (url.origin !== window.location.origin) return;
  const next: InstantLocation = {
    pathname: url.pathname,
    search: url.search.startsWith('?') ? url.search.slice(1) : url.search,
  };
  const current = readWindowLocation();
  if (current.pathname === next.pathname && current.search === next.search && window.location.hash === url.hash) return;
  const nextHref = `${next.pathname}${next.search ? `?${next.search}` : ''}${url.hash}`;
  nativeHistoryMethod(mode === 'replace' ? 'replaceState' : 'pushState').call(window.history, null, '', nextHref);
  publishInstantLocation(next);
  ensureInstantHistory();
  if (scroll && !url.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
}
