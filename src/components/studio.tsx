'use client';
import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import { ArrowUpRight, ArrowRight, BookOpen, Layers, Orbit, Check, Search, ArrowLeft, RotateCcw, Volume2, Clock, X, LogOut, Menu, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { studySummary, activeReviews, learningDay, selectNext } from '@/lib/learning';
import { trustedLessonImageUrl } from '@/lib/lesson-images';
import { Breadcrumbs, WorkspaceSidebar, workspaceNav, LessonPagination, navigationContext, InstantLink, useInstantLocation } from '@/components/workspace-navigation';
import { KnowledgeAtlas } from '@/components/knowledge-atlas';
import { ThemePicker } from '@/components/theme-picker';
import { orderedLessons, resolveStudyScope, practiceCards } from '@/lib/navigation';
import {
    getCachedLesson,
    loadLessonCached,
    prefetchLesson as prefetchLessonInCache,
    getCachedCardDetail,
    loadCardDetailCached,
    prefetchCardDetail as prefetchCardInCache,
    getCachedReveal,
    loadRevealCached,
    prefetchReveal as prefetchRevealInCache,
    invalidateReveal,
    readBootstrapSnapshot,
    writeBootstrapSnapshot,
    clearAllClientCaches,
    extractMarkdownHeadings,
    instantNavigate,
    type LessonSourcePayload,
} from '@/lib/client-cache';
import type { Bootstrap, CardMeta, CardDetail, Preview, ReviewEvent, ReviewResult, Settings } from '@/lib/types';

async function api<T>(path: string, body?: unknown, method = 'POST'): Promise<T> {
    const r = await fetch(`/api/${path}`, body ? { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' });
    const d = await r.json();
    if (!r.ok)
        throw Object.assign(new Error(r.status === 401 ? 'UNAUTHENTICATED' : d.error || '请求失败'), { code: d.code, status: r.status });
    return d;
}

const fetchLessonSource = (path: string) => api<LessonSourcePayload>(path);
const fetchCardDetail = (path: string) => api<CardDetail>(path);
const fetchReveal = (cardId: string) => api<{ card: CardDetail; preview: Preview }>('study/reveal', { cardId });

let bootstrapRequest: Promise<Bootstrap> | null = null;
function loadBootstrap() {
    if (!bootstrapRequest)
        bootstrapRequest = api<Bootstrap>('bootstrap').finally(() => { bootstrapRequest = null; });
    return bootstrapRequest;
}

const Context = createContext<{
    data: Bootstrap;
    refresh: () => Promise<Bootstrap>;
    update: (change: (data: Bootstrap) => Bootstrap) => void;
    prefetchLesson: (lessonId?: string | null) => void;
    prefetchCard: (cardId?: string | null) => void;
}>(null!);

function useData() { return useContext(Context); }

function ErrorNote({ error }: { error: string }) {
    return error ? <div role="alert" className="error-note">{error}</div> : null;
}

function Heading({ eyebrow, title, description, children }: {
    eyebrow: string;
    title: string;
    description: string;
    children?: React.ReactNode;
}) {
    return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{children}</div>;
}

function LessonImage({ src, alt }: { src?: string; alt?: string }) {
    const [failed, setFailed] = useState(false);
    const url = trustedLessonImageUrl(src);
    const fallback = typeof src === 'string' && src.startsWith('https://') ? src : null;
    if (!url || failed)
        return fallback ? <a href={fallback} target="_blank" rel="noopener noreferrer">[查看原文图片：{alt || '图片'}]</a> : <span>[原文图片地址不可用]</span>;
    const caption = alt && !/^image\s*\d*$/i.test(alt) ? alt : null;
    return <figure className="lesson-image"><a href={url} target="_blank" rel="noopener noreferrer"><img src={url} alt={alt || '课程原文图片'} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)}/></a>{caption && <figcaption>{caption}</figcaption>}</figure>;
}

export default function Studio() {
    const { pathname, search } = useInstantLocation();
    const route = pathname.split('/').filter(Boolean);
    if (!route.length)
        route.push('today');
    const searchParams = new URLSearchParams(search);
    const searchKey = search;
    const [data, setData] = useState<Bootstrap | null>(null);
    const [error, setError] = useState('');
    const [menu, setMenu] = useState(false);
    const bootstrappedRef = useRef(false);
    const page = route[0];

    const refresh = useCallback(async () => {
        setError('');
        const d = await loadBootstrap();
        bootstrappedRef.current = true;
        setData(d);
        writeBootstrapSnapshot(d);
        return d;
    }, []);

    const update = useCallback((change: (data: Bootstrap) => Bootstrap) => {
        setData(current => {
            if (!current) return current;
            const next = change(current);
            writeBootstrapSnapshot(next);
            return next;
        });
    }, []);

    const prefetchLesson = useCallback((lessonId?: string | null) => {
        prefetchLessonInCache(lessonId, fetchLessonSource);
    }, []);

    const prefetchCard = useCallback((cardId?: string | null) => {
        prefetchCardInCache(cardId, fetchCardDetail);
    }, []);

    const menuButton = useRef<HTMLButtonElement>(null);
    const sidebarRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (page === 'login' || bootstrappedRef.current)
            return;
        if (!data) {
            const snapshot = readBootstrapSnapshot();
            if (snapshot) setData(snapshot);
        }
        refresh().catch(e => {
            if (e.message === 'UNAUTHENTICATED') {
                clearAllClientCaches();
                setData(null);
                instantNavigate('/login', 'replace');
            } else {
                setError(e.message);
            }
        });
    }, [data, page, refresh]);

    useEffect(() => {
        if (!data) return;
        const nextUnread = orderedLessons(data).find(item => !data.activity.some(a => a.lesson_id === item.id));
        if (nextUnread) prefetchLesson(nextUnread.id);
    }, [data, prefetchLesson]);

    useEffect(() => { setMenu(false); }, [pathname, searchKey]);
    useEffect(() => {
        const breakpoint = window.matchMedia('(min-width: 801px)');
        function closeOnDesktop() {
            if (breakpoint.matches) setMenu(false);
        }
        breakpoint.addEventListener('change', closeOnDesktop);
        return () => breakpoint.removeEventListener('change', closeOnDesktop);
    }, []);
    useEffect(() => {
        if (!menu) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        sidebarRef.current?.querySelector<HTMLElement>('button,input,a')?.focus();
        function keyboard(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setMenu(false);
                menuButton.current?.focus();
            }
            if (event.key === 'Tab') {
                const elements = Array.from(sidebarRef.current?.querySelectorAll<HTMLElement>('a,button,input,select') || []).filter(element => element.getClientRects().length && !element.hasAttribute('disabled'));
                const first = elements[0];
                const last = elements[elements.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }
        }
        window.addEventListener('keydown', keyboard);
        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener('keydown', keyboard);
        };
    }, [menu]);

    if (page === 'login')
        return <Login onAuthenticated={() => { bootstrappedRef.current = false; }} />;
    if (!data)
        return <div className="loading-screen"><Brand /><p>{error || '正在打开你的学习空间…'}</p>{error && <button onClick={() => { void refresh().catch(e => setError(e.message)); }} className="button">重新连接</button>}</div>;

    const navigationProps = { data, route, lessonId: searchParams.get('lesson'), cardId: searchParams.get('card'), onPrefetchLesson: prefetchLesson };
    const knowledge = navigationContext(data, route, navigationProps.lessonId, navigationProps.cardId).knowledge;
    return <Context.Provider value={{ data, refresh, update, prefetchLesson, prefetchCard }}><div className={`app-shell ${knowledge ? 'knowledge-space' : ''}`}>
 <a className="skip-link" href="#main-content">跳到主要内容</a>
 <header className="workspace-topbar"><Brand /><nav className="global-navigation" aria-label="全站导航">{workspaceNav.map(item => <InstantLink key={item.path} href={`/${item.path}`} className={(page === item.path || (knowledge && item.path === 'curriculum') || (page === 'study' && !knowledge && item.path === 'today')) ? 'active' : ''} aria-current={(page === item.path || (knowledge && item.path === 'curriculum') || (page === 'study' && !knowledge && item.path === 'today')) ? 'page' : undefined}>{item.label}</InstantLink>)}</nav><div className="workspace-topbar-right"><InstantLink className="header-search" href="/curriculum" aria-label="查找课程"><Search size={17}/><span>查找课程</span></InstantLink><InstantLink className="header-avatar" href="/settings" aria-label="打开学习偏好">{data.user.display_name.slice(0, 1)}</InstantLink></div></header>
 {menu && <button className="sidebar-scrim" aria-label="关闭课程目录" onClick={() => { setMenu(false); menuButton.current?.focus(); }}/>}
 <aside ref={sidebarRef} id="workspace-sidebar" className={`sidebar workspace-sidebar ${menu ? 'open' : ''}`} role={menu ? 'dialog' : undefined} aria-modal={menu ? true : undefined} aria-label="学习导航"><WorkspaceSidebar {...navigationProps} close={() => { setMenu(false); menuButton.current?.focus(); }}/></aside>
 <div className="main-wrap"><div className="context-bar"><button ref={menuButton} className="icon-button mobile-menu" aria-label="打开学习导航" aria-expanded={menu} aria-controls="workspace-sidebar" onClick={() => setMenu(!menu)}><Menu size={20}/></button><Breadcrumbs {...navigationProps}/><span className="context-space-label">你的学习空间</span></div>
 <main id="main-content" key={page === 'study' ? `${pathname}?${searchKey}` : pathname} className={page === 'study' ? 'content study-content' : 'content'}>{page === 'today' ? <Today /> : page === 'curriculum' ? <KnowledgeAtlas data={data} chapterId={route[1]} onPrefetchLesson={prefetchLesson}/> : page === 'cards' ? <Cards /> : page === 'study' ? <Study /> : page === 'progress' ? <Progress /> : page === 'settings' ? <Preferences /> : page === 'lessons' ? <LessonReader id={route[1]}/> : page === 'interview' ? <Interview /> : <div className="empty-state"><h1>这条路径还没有内容</h1><InstantLink className="button" href="/today">回到今日学习</InstantLink></div>}</main><footer className="footer"><span>recall. <span>理解，然后记住。</span></span><InstantLink href="/curriculum">随时选择你的下一课 <ArrowUpRight size={13}/></InstantLink></footer></div></div></Context.Provider>;
}

function Brand() { return <InstantLink href="/today" className="brand"><span className="brand-mark"><i /><i /><i /></span><span>recall<span className="brand-period">.</span></span></InstantLink>; }

function Login({ onAuthenticated }: { onAuthenticated?: () => void }) {
    const [local, setLocal] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    useEffect(() => {
        api<{ enabled: boolean }>('auth/local').then(x => setLocal(x.enabled)).catch(() => { });
    }, []);
    async function enter(isLocal = false) {
        setBusy(true);
        setError('');
        try {
            await api('auth', isLocal ? { local: true } : { code });
            clearAllClientCaches();
            onAuthenticated?.();
            instantNavigate('/today', 'replace');
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setBusy(false);
        }
    }
    return <div className="login"><div className="login-art"><Brand /><div className="login-copy"><span className="eyebrow">A place for what stays.</span><h1>把理解，<br />变成你的<span>第二直觉。</span></h1><p>从第一次想起，到真正掌握。<br />每天留一点时间给未来的自己。</p></div><MemorySculpture /><span className="login-foot">AI PM Learning Studio · 2026</span></div><div className="login-form"><span className="eyebrow">Welcome back</span><h2>进入你的学习空间</h2><p>课程、记忆与成长，都从这里继续。</p><form onSubmit={e => { e.preventDefault(); void enter(); }}><label htmlFor="access-code">学习访问码</label><input id="access-code" type="password" autoComplete="current-password" value={code} onChange={e => setCode(e.target.value)} placeholder="输入你的专属访问码" required/><button disabled={busy} className="button primary">{busy ? '正在连接…' : '进入学习空间'}<ArrowRight size={17}/></button></form>{local && <button disabled={busy} onClick={() => enter(true)} className="button ghost">打开本机学习空间 <ArrowUpRight size={16}/></button>}<ErrorNote error={error}/><small>你的学习记录会保存在专属空间中。</small></div></div>;
}

function MemorySculpture() { return <div className="memory-sculpture" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="sculpture-glow"/><div className="float-card back"><span>Understand.</span><div className="line-art"/></div><div className="float-card middle"><span>Connect.</span><div className="constellation"><i /><i /><i /><i /><i /></div></div><div className="float-card front"><div className="sculpture-card-top"><span>Knowledge, retained.</span><Sparkles size={16}/></div><div className="fold-art"><i /><i /><i /></div><span className="card-thought">每一次想起，<br />都离直觉更近一点。</span><div className="sculpture-card-bottom"><span>AI × Product × You</span><ArrowUpRight size={20}/></div></div><span className="orbit-point p1"/><span className="orbit-point p2"/></div>; }

function Today() {
    const { data, prefetchLesson } = useData();
    const s = useMemo(() => studySummary(data, new Date()), [data]);
    const readSet = useMemo(() => new Set(data.activity.map(activity => activity.lesson_id)), [data.activity]);
    const nextLesson = useMemo(() => orderedLessons(data).find(lesson => !readSet.has(lesson.id)), [data, readSet]);
    const chapter = data.chapters.find(item => item.id === nextLesson?.chapter_id);
    return <>
 <div className="today-welcome"><span>{new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long', timeZone: data.settings.timezone }).format(new Date())}</span><span>每天留 {data.settings.daily_minutes} 分钟，给未来的自己。</span></div>
 <section className="today-hero"><div><span className="atlas-label"><Orbit size={17}/>今日学习</span><h1>让理解留下来。</h1><p>选一门课程建立理解，<br />用一次回忆，让它成为自己的知识。</p><div className="today-hero-actions"><InstantLink className="button primary" href="/study">开始今日复习 <ArrowRight size={18}/></InstantLink><InstantLink className="button ghost" href="/curriculum">自主选择课程 <BookOpen size={17}/></InstantLink></div><span className="today-hero-note">到期卡片优先，新卡按你的每日预算安排。</span></div><div className="recall-diagram" aria-hidden="true"><svg viewBox="0 0 380 290" fill="none"><path d="M40 206C110 206 88 77 184 77S243 206 344 206" stroke="currentColor" strokeWidth="1.5"/><path d="M40 224C129 224 92 113 184 113S250 224 344 224" stroke="currentColor" strokeOpacity=".22"/><circle cx="184" cy="96" r="55" stroke="currentColor" strokeOpacity=".2"/><circle cx="184" cy="96" r="77" stroke="currentColor" strokeOpacity=".1"/><circle cx="40" cy="206" r="7" fill="currentColor"/><circle cx="184" cy="77" r="7" fill="currentColor"/><circle cx="344" cy="206" r="7" fill="currentColor"/><text x="40" y="251" textAnchor="middle">理解</text><text x="184" y="31" textAnchor="middle">回忆</text><text x="344" y="251" textAnchor="middle">记住</text><path d="m178 97 5 5 10-12" stroke="currentColor" strokeWidth="2"/></svg><span>Learning is a return journey.</span></div></section>
 <div className="today-metrics"><div><span>到期复习</span><strong>{s.due.length}<small>张</small></strong><p>今天需要重新想起的知识</p></div><div><span>可安排新卡</span><strong>{s.newCount}<small>张</small></strong><p>按剩余时间与新卡额度估算</p></div><div><span>今日已回忆</span><strong>{s.today.length}<small>次</small></strong><p>包含主动选择的额外练习</p></div><InstantLink href="/progress">查看学习足迹 <ArrowUpRight size={17}/></InstantLink></div>
 <div className="section-heading"><h2>选择下一步</h2><InstantLink href="/curriculum">全部课程 <ArrowRight size={16}/></InstantLink></div><div className="today-next-grid"><div className="continue-course"><span className="pill">{nextLesson ? '下一篇未读课程' : '课程阅读'}</span>{nextLesson ? <><span className="continue-course-chapter">{chapter?.title}</span><h3>{nextLesson.title}</h3><p>{nextLesson.summary}</p><InstantLink className="button ghost" href={`/lessons/${nextLesson.id}`} prefetchLessonId={nextLesson.id} onPrefetchLesson={prefetchLesson}>打开课程 <ArrowUpRight size={17}/></InstantLink><span className="continue-course-time"><Clock size={13}/>{nextLesson.reading_minutes} 分钟阅读</span></> : <><h3>{data.lessons.length ? '所有课程都已标记读完' : '从一个主题开始'}</h3><p>按自己的兴趣选择课程，随时回来重新理解。</p><InstantLink className="button ghost" href="/curriculum">浏览课程 <ArrowRight size={16}/></InstantLink></>}</div><div className="today-explore"><div><span className="atlas-label"><BookOpen size={16}/>自主学习</span><h3>不必按顺序，<br />也能找到方向。</h3><p>课程目录一直在身边。选择章节，阅读课程，再练习本课卡片。</p><InstantLink href="/curriculum">展开知识地图 <ArrowRight size={16}/></InstantLink></div><div className="mini-knowledge-rings" aria-hidden="true"><i /><i /><i /><span /></div></div></div>
 <div className="library-note"><Layers size={17}/><span>{data.chapters.length} 个章节 / {data.lessons.length} 篇课程 / {data.cards.length} 张记忆卡片</span><InstantLink href="/cards">查找卡片 <ArrowUpRight size={14}/></InstantLink></div>
 </>;
}

function Cards() {
    const { data, prefetchCard } = useData();
    const [search, setSearch] = useState('');
    const [chapter, setChapter] = useState('all');
    const [selected, setSelected] = useState<string | null>(null);
    const chapterTitleById = useMemo(() => new Map(data.chapters.map(c => [c.id, c.title])), [data.chapters]);
    const stateByCardId = useMemo(() => new Map(data.states.map(s => [s.card_id, s])), [data.states]);
    const cards = useMemo(() => {
        const q = search.toLowerCase();
        return data.cards.filter(c => (chapter === 'all' || c.chapter_id === chapter) && (!q || `${c.title}${c.prompt}`.toLowerCase().includes(q)));
    }, [data.cards, chapter, search]);

    return <><Heading eyebrow="Small cards. Deep understanding." title="把知识，收进记忆。" description={`${data.cards.length} 张记忆卡片。查找问题，查看答案，或选择一张主动练习。`}/><div className="filter-bar"><label className="search-field"><Search size={18}/><input aria-label="搜索卡片" placeholder="搜索概念、问题或关键词…" value={search} onChange={e => setSearch(e.target.value)}/></label><select aria-label="按章节筛选" value={chapter} onChange={e => setChapter(e.target.value)}><option value="all">所有章节</option>{data.chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select><span className="muted">{cards.length} 张卡片</span></div><div className="card-grid">{cards.map(c => { const s = stateByCardId.get(c.id); return <button className="library-card" key={c.id} onMouseEnter={() => prefetchCard(c.id)} onFocus={() => prefetchCard(c.id)} onClick={() => setSelected(c.id)}><div className="panel-top"><span>{chapterTitleById.get(c.chapter_id)}</span><span className={`pill ${s?.fsrs.reps ? 'learned' : ''}`}>{s?.fsrs.reps ? '已学习' : '待探索'}</span></div><h3>{c.title}</h3><p>{c.prompt}</p><div className="panel-bottom"><span>{c.canonical_key} · 主动回忆</span><ArrowUpRight size={18}/></div></button>; })}</div>{!cards.length && <div className="empty-state"><Layers size={30}/><h3>这里还没有匹配的卡片</h3><p>试试其他关键词，或前往章节阅读原始课程。</p><InstantLink href="/curriculum" className="button ghost">浏览课程</InstantLink></div>}{selected && <CardDialog id={selected} close={() => setSelected(null)}/>}</>;
}

function Answer({ card }: { card: CardDetail }) {
    const { prefetchLesson } = useData();
    return <div className="answer"><span className="eyebrow">把答案和你的回忆对照</span><h3>核心答案</h3><p className="answer-short">{card.answer_short}</p><h4>回答要点</h4><ul>{card.required_points.map((p, i) => <li key={i}><Check size={15}/><span>{p}</span></li>)}</ul>{card.explanation?.trim() && <section className="answer-explanation"><h4>展开解析</h4><p className="explanation-hint">帮助理解，不要求逐字背诵。评分以回答要点为准。</p><div>{card.explanation}</div></section>}{card.pitfalls && <div className="pitfall"><span>容易混淆的地方</span><p>{card.pitfalls}</p></div>}<div className="sources"><span>回到知识出处</span>{card.source_refs.map((s, i) => <InstantLink href={`/lessons/${s.lesson_id}`} prefetchLessonId={s.lesson_id} onPrefetchLesson={prefetchLesson} key={i}><BookOpen size={14}/>{s.title}<ArrowUpRight size={13}/></InstantLink>)}</div></div>;
}

function CardDialog({ id, close }: { id: string; close: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [card, setCard] = useState<CardDetail | null>(() => getCachedCardDetail(id));
    const [error, setError] = useState('');
    useEffect(() => {
        dialog.current?.showModal();
        const cached = getCachedCardDetail(id);
        if (cached) {
            setCard(cached);
            return;
        }
        loadCardDetailCached(id, fetchCardDetail).then(setCard).catch(e => setError(e.message));
    }, [id]);
    return <dialog ref={dialog} className="card-dialog" aria-label="记忆卡片详情" onCancel={close} onClick={e => { if (e.target === dialog.current) close(); }}><button className="icon-button close-dialog" aria-label="关闭卡片" onClick={close}><X size={21}/></button>{card ? <><span className="eyebrow">{card.canonical_key} · Card preview</span><h2>{card.title}</h2><p className="dialog-question">{card.prompt}</p><Answer card={card}/><InstantLink className="button primary" href={`/study?card=${id}`}>练习这张卡片 <ArrowRight size={17}/></InstantLink></> : <p>{error || '正在打开卡片…'}</p>}</dialog>;
}

function Study() {
    const { data, refresh, update, prefetchLesson } = useData();
    const { search } = useInstantLocation();
    const searchParams = new URLSearchParams(search);
    const scope = resolveStudyScope(data, searchParams.get('lesson'), searchParams.get('card'));
    const [practiceIds] = useState(() => practiceCards(data, scope).map(item => item.id));
    const daily = scope.kind === 'daily';
    const visited = useRef<string[]>([]);
    const lesson = scope.kind === 'lesson' ? data.lessons.find(item => item.id === scope.lessonId) : scope.kind === 'card' ? data.lessons.find(item => item.id === data.cards.find(card => card.id === scope.cardId)?.lesson_id) : undefined;
    const returnPath = daily ? '/today' : lesson ? `/lessons/${lesson.id}` : '/curriculum';
    const mode = daily ? '今日复习' : scope.kind === 'lesson' ? '课程练习' : '单卡练习';
    const [card, setCard] = useState<CardMeta | null>(null);
    const [detail, setDetail] = useState<CardDetail | null>(null);
    const [preview, setPreview] = useState<Preview | null>(null);
    const [previewStale, setPreviewStale] = useState(false);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [draft, setDraft] = useState('');
    const [last, setLast] = useState<ReviewResult | null>(null);
    const [completed, setCompleted] = useState(0);
    const start = useRef(Date.now());
    const pending = useRef<{
        rating: number;
        clientEventId: string;
        durationMs: number;
        uncertain?: boolean;
    } | null>(null);

    const load = useCallback((source: Bootstrap, id?: string) => {
        setLoading(true);
        setDetail(null);
        setPreview(null);
        setPreviewStale(false);
        setDraft('');
        pending.current = null;
        const selectedId = id || practiceIds.find(item => !visited.current.includes(item));
        const nextCard = daily && !id ? selectNext(source, new Date()) : source.cards.find(item => item.id === selectedId) || null;
        setCard(nextCard);
        start.current = Date.now();
        setLoading(false);
        if (nextCard) {
            const stateVersion = source.states.find(s => s.card_id === nextCard.id)?.version || 0;
            prefetchRevealInCache(nextCard.id, stateVersion, source.settings.version, fetchReveal);
        }
    }, [daily, practiceIds]);

    useEffect(() => { load(data); }, [load]);

    async function reveal() {
        if (!card || busy) return;
        const stateVersion = data.states.find(s => s.card_id === card.id)?.version || 0;
        const cached = getCachedReveal(card.id, stateVersion, data.settings.version);
        if (cached && !previewStale) {
            setDetail(cached.card);
            setPreview(cached.preview);
            setPreviewStale(false);
            setError('');
            return;
        }
        setBusy(true);
        setError('');
        try {
            if (previewStale) invalidateReveal(card.id);
            const result = await loadRevealCached(card.id, stateVersion, data.settings.version, fetchReveal);
            setDetail(result.card);
            setPreview(result.preview);
            setPreviewStale(false);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setBusy(false);
        }
    }

    async function rate(rating: number) {
        if (!preview || previewStale || busy) return;
        setBusy(true);
        setError('');
        pending.current = pending.current || { rating, clientEventId: crypto.randomUUID(), durationMs: Math.min(1800000, Date.now() - start.current) };
        try {
            const result = await api<ReviewResult>('reviews', { rating: pending.current.rating, clientEventId: pending.current.clientEventId, durationMs: pending.current.durationMs, token: preview.token });
            invalidateReveal(result.cardId);
            const event: ReviewEvent = { id: result.eventId, card_id: result.cardId, kind: 'review', rating: result.rating, state_before: result.before, state_after: result.state, received_at: result.receivedAt, reviewed_at: result.reviewedAt, duration_ms: result.durationMs, undone_event_id: null };
            const state = { card_id: result.cardId, fsrs: result.state, due: result.state.due, version: result.version, suspended: false, last_event_id: result.eventId };
            const next = { ...data, states: [...data.states.filter(item => item.card_id !== result.cardId), state], events: [event, ...data.events.filter(item => item.id !== event.id)] };
            update(() => next);
            setLast(result);
            if (!daily)
                visited.current = [...visited.current, result.cardId];
            setCompleted(value => value + 1);
            load(next);
        } catch (e) {
            const failure = e as Error & { code?: string };
            if (failure.code === 'PREVIEW_EXPIRED' && !pending.current?.uncertain) {
                if (card) invalidateReveal(card.id);
                pending.current = null;
                setPreviewStale(true);
            } else if (pending.current) {
                pending.current.uncertain = true;
            }
            setError(failure.message);
        } finally {
            setBusy(false);
        }
    }

    async function undo() {
        if (!last || busy) return;
        setBusy(true);
        setError('');
        try {
            await api('reviews/undo', { eventId: last.eventId, version: last.version, clientEventId: crypto.randomUUID() });
            invalidateReveal(last.cardId);
            const next = await refresh();
            visited.current = visited.current.filter(id => id !== last.cardId);
            load(next, last.cardId);
            setLast(null);
            setCompleted(value => Math.max(0, value - 1));
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setBusy(false);
        }
    }

    useEffect(() => {
        function keyboard(event: KeyboardEvent) {
            if (event.repeat || (event.target as HTMLElement).closest('input,textarea,button,a,select'))
                return;
            if (event.code === 'Space' && !detail && !loading) {
                event.preventDefault();
                void reveal();
            }
            if (detail && ['1', '2', '3', '4'].includes(event.key)) {
                event.preventDefault();
                void rate(Number(event.key));
            }
        }
        window.addEventListener('keydown', keyboard);
        return () => window.removeEventListener('keydown', keyboard);
    });

    const labels = ['完全记不清', '模糊记得', '记得', '很熟练'];
    if (scope.kind === 'invalid')
        return <div className="empty-state"><h1>无法开始这次练习</h1><p>课程或卡片不存在，或者选择了冲突的练习范围。</p><InstantLink href="/curriculum" className="button primary">重新选择课程</InstantLink></div>;
    return <>
 <div className="study-top"><InstantLink className="back-link" href={returnPath}><ArrowLeft size={16}/>{daily ? '返回今日学习' : '返回课程'}</InstantLink><button className="button text-button" disabled={!last || busy} onClick={undo}><RotateCcw size={15}/>撤销上一张</button></div>
 <div className="study-mode-heading"><div><span className="pill">{mode}</span><h1>{daily ? '把记忆再唤醒。' : lesson?.title || '专注这一张卡片'}</h1><p>{daily ? '到期复习优先，新卡根据每日预算安排。' : '自主练习会更新复习计划与今日统计，可超出今日新卡预算。'}</p></div><div className="session-counter" role="status"><strong>{completed}{!daily && <small> / {practiceIds.length}</small>}</strong><span>{daily ? '本次已完成回忆' : '张已练习'}</span></div></div>
 {!daily && practiceIds.length > 0 && <div className="session-track" role="progressbar" aria-label="本课练习进度" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={practiceIds.length}><i style={{ width: `${completed / practiceIds.length * 100}%` }}/></div>}
 <ErrorNote error={error}/>
 {loading ? <div className="empty-state">正在准备下一次回忆…</div> : !card ? <div className="session-complete"><div className="completion-orbit"><Check size={36}/></div><h1>{daily ? '这一轮，先到这里。' : practiceIds.length ? '本次练习完成。' : '这里暂无可练习的卡片。'}</h1><p>{daily ? '当前没有可安排的卡片，你也可以自主选择课程继续学习。' : practiceIds.length ? '本次评分已保存。回到课程继续阅读，或另选一课。' : (scope.kind === 'card' ? '这张卡片已暂停。你可以先阅读课程。' : '本课尚无卡片，或卡片已暂停。你可以先阅读原文。')}</p><InstantLink href={returnPath} className="button primary">{daily ? '返回今日学习' : '返回本课'}<ArrowRight size={17}/></InstantLink><InstantLink href="/curriculum" className="button ghost">选择其他课程</InstantLink>{daily && <button className="button ghost" onClick={() => load(data)}>检查到期复习</button>}{!daily && lesson && <LessonPagination data={data} lessonId={lesson.id} onPrefetchLesson={prefetchLesson}/>}</div> : <>
 <div className="study-label"><InstantLink href={`/lessons/${card.lesson_id}`} prefetchLessonId={card.lesson_id} onPrefetchLesson={prefetchLesson}><BookOpen size={14}/>{data.lessons.find(item => item.id === card.lesson_id)?.title}</InstantLink><span>{daily ? '按记忆间隔安排' : scope.kind === 'lesson' ? `本课第 ${completed + 1} / ${practiceIds.length} 张` : '单卡主动练习'}</span></div>
 <article className={`study-paper ${detail ? 'revealed' : ''}`}><div className="paper-top"><span>{detail ? '对照答案，再判断回忆质量。' : '先回忆，再打开答案。'}</span><Layers size={17}/></div><h2>{card.prompt}</h2>{!detail ? <><p className="recall-hint">试着用自己的话回答。想不起来，也是一种有效练习。</p><textarea aria-label="写下你的回忆" value={draft} onChange={event => setDraft(event.target.value)} placeholder="写下你的回忆（可选，不会保存）"/><div className="reveal-row"><span>准备好了，就对照答案。</span><button className="button dark" disabled={busy} onClick={reveal}>{busy ? '正在展开…' : '显示答案'}<span className="keycap">Space</span></button></div></> : <Answer card={detail}/>}</article>
 {detail && preview && <div className="rating-area"><p>这一次，你记得有多清楚？<span>「模糊记得」指独立答对但费力；答错请选「完全记不清」。</span></p><div className="rating-buttons">{preview.options.map((option, index) => <button disabled={busy || previewStale} key={option.rating} className={`rating rating-${index}`} onClick={() => rate(option.rating)}><span><kbd>{option.rating}</kbd>{labels[index]}</span><small>{option.interval}后复习</small></button>)}</div>{error && <div className="preview-recovery"><span>{pending.current ? '再次评分会重试同一条记录。' : '可重新载入评分选项。'}</span>{!pending.current && <button className="button ghost" disabled={busy} onClick={reveal}>重新载入评分选项</button>}</div>}</div>}
 </>}
 {!daily && <p className="session-footnote">刷新或离开会重置本轮位置，已经保存的复习记录会保留。</p>}
 </>;
}

function LessonReader({ id }: { id: string }) {
    const { data, update, prefetchLesson } = useData();
    const lesson = data.lessons.find(item => item.id === id);
    const chapter = data.chapters.find(item => item.id === lesson?.chapter_id);
    const cachedInitial = getCachedLesson(id);
    const [body, setBody] = useState(() => cachedInitial?.body_markdown || '');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const [loading, setLoading] = useState(() => !cachedInitial);

    useEffect(() => {
        let active = true;
        const cached = getCachedLesson(id);
        if (cached) {
            setBody(cached.body_markdown);
            setError('');
            setLoading(false);
        } else {
            setBody('');
            setError('');
            setLoading(true);
            loadLessonCached(id, fetchLessonSource)
                .then(result => {
                    if (active) setBody(result.body_markdown);
                })
                .catch(e => {
                    if (active) setError(e.message);
                })
                .finally(() => {
                    if (active) setLoading(false);
                });
        }
        const all = orderedLessons(data);
        const idx = all.findIndex(item => item.id === id);
        if (idx >= 0) {
            if (all[idx + 1]) prefetchLesson(all[idx + 1].id);
            if (all[idx - 1]) prefetchLesson(all[idx - 1].id);
        }
        return () => { active = false; };
    }, [id, data, prefetchLesson]);

    const cards = useMemo(() => data.cards.filter(card => card.lesson_id === id), [data.cards, id]);
    const available = useMemo(() => practiceCards(data, { kind: 'lesson', lessonId: id }), [data, id]);
    const done = useMemo(() => data.activity.some(activity => activity.lesson_id === id), [data.activity, id]);
    const headings = useMemo(() => extractMarkdownHeadings(body, id), [body, id]);

    if (!lesson)
        return <div className="empty-state"><h1>没有找到这篇课程</h1><InstantLink href="/curriculum" className="button primary">返回知识地图</InstantLink></div>;

    async function complete() {
        setBusy(true);
        setError('');
        try {
            await api('activity', { lessonId: id });
            update(current => ({ ...current, activity: [...current.activity.filter(item => item.lesson_id !== id), { lesson_id: id, completed_at: new Date().toISOString() }] }));
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setBusy(false);
        }
    }

    return <><div className="reader-heading"><div><span className="atlas-label"><BookOpen size={16}/>{chapter?.title}</span><h1>{lesson.title}</h1><div className="reader-metadata"><span><Clock size={14}/>{lesson.reading_minutes} 分钟阅读</span><span><Layers size={14}/>{cards.length} 张卡片</span>{done && <span className="read-badge"><Check size={13}/>已读</span>}</div></div>{available.length > 0 && <InstantLink href={`/study?lesson=${id}`} className="button primary">练习本课 <ArrowRight size={17}/></InstantLink>}</div>
 <LessonPagination data={data} lessonId={id} onPrefetchLesson={prefetchLesson}/>
 <div className="reading-layout"><article className="reading-article"><p className="source-disclaimer">知识库原文 · 时效性信息请结合当前情况判断。</p><ErrorNote error={error}/>{loading ? <p className="reader-loading">正在打开课程原文…</p> : body ? <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={{ h1: ({node,children,...props}) => <h2 {...props}>{children}</h2>, h2: ({ node, children, ...props }) => <h2 id={`section-${node?.position?.start.line}`} {...props}>{children}</h2>, a: ({ node, ...props }) => <a {...props} target={props.href?.startsWith('#') ? undefined : '_blank'} rel="noopener noreferrer"/>, img: props => <LessonImage src={typeof props.src === 'string' ? props.src : undefined} alt={props.alt}/> }}>{body}</ReactMarkdown></div> : !error && <p>这篇课程暂时没有正文。</p>}{error && !body && <button className="button ghost" onClick={() => { setError(''); setLoading(true); loadLessonCached(id, fetchLessonSource).then(result => setBody(result.body_markdown)).catch(e => setError(e.message)).finally(() => setLoading(false)); }}>重新加载原文</button>}<div className="reading-complete-row"><span>{done ? '你已经标记读完，可以随时重读。' : '读完后，留下你的阅读标记。'}</span><button disabled={busy || done} className="button ghost" onClick={complete}>{done ? <><Check size={16}/>已标记读完</> : busy ? '保存中…' : '标记为已读'}</button></div><LessonPagination data={data} lessonId={id} onPrefetchLesson={prefetchLesson}/></article>
 <aside className="reading-aside">{headings.length > 0 && <nav className="article-toc" aria-label="本页目录"><h2>本页内容</h2>{headings.map(heading => <a key={heading.id} href={`#${heading.id}`}>{heading.title}</a>)}</nav>}<div className="lesson-practice-panel"><span className="atlas-label"><Layers size={16}/>从理解到记忆</span><h3>读完，试着回忆。</h3><p>练习本课卡片，检查自己能否用自己的话说清楚。</p>{available.length ? <InstantLink className="button primary" href={`/study?lesson=${id}`}>练习本课 {available.length} 张卡片<ArrowRight size={15}/></InstantLink> : <span className="muted">本课暂无可练习卡片。</span>}<button disabled={busy || done} className="button ghost" onClick={complete}>{done ? <><Check size={15}/>已标记读完</> : busy ? '保存中…' : '标记为已读'}</button></div><div className="related-cards"><h4>本课卡片</h4>{cards.map(card => <InstantLink href={`/study?card=${card.id}`} key={card.id}><span>{card.title}<small>单卡练习</small></span><ArrowUpRight size={14}/></InstantLink>)}</div></aside></div>
 </>;
}

function Progress() {
    const { data } = useData();
    const s = useMemo(() => studySummary(data, new Date()), [data]);
    const reviews = useMemo(() => activeReviews(data.events), [data.events]);
    const days = useMemo(() => {
        const countsByDay = new Map<string, number>();
        for (const e of reviews) {
            const k = learningDay(new Date(e.received_at), data.settings).key;
            countsByDay.set(k, (countsByDay.get(k) ?? 0) + 1);
        }
        return Array.from({ length: 35 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - 34 + i);
            const key = learningDay(d, data.settings).key;
            return { key, count: countsByDay.get(key) ?? 0 };
        });
    }, [reviews, data.settings]);
    const eligible = useMemo(() => reviews.filter(e => e.state_before.last_review && new Date(e.reviewed_at).getTime() - new Date(e.state_before.last_review).getTime() >= 86400000), [reviews]);
    const retention = eligible.length ? Math.round(eligible.filter(e => (e.rating || 0) > 1).length / eligible.length * 100) : null;
    const learnedCardIds = useMemo(() => new Set(data.states.filter(st => st.fsrs.reps > 0).map(st => st.card_id)), [data.states]);

    return <><Heading eyebrow="Evidence of becoming" title="微小积累，自有回响。" description="让真实的学习痕迹，告诉你走了多远。"/><div className="progress-metrics"><div><span>已学习卡片</span><strong>{s.learned}<small> / {data.cards.length}</small></strong><p>从第一次回忆开始</p></div><div><span>已读课程</span><strong>{data.activity.length}<small> / {data.lessons.length}</small></strong><p>为判断力建立底座</p></div><div><span>跨日回忆成功率</span><strong>{retention === null ? '—' : `${retention}%`}</strong><p>{eligible.length ? `基于 ${eligible.length} 次跨日复习` : '完成跨日复习后显示'}</p></div></div><section className="activity-panel"><div className="section-heading"><div><span className="eyebrow">Your rhythm</span><h2>过去五周的学习节奏</h2></div><span className="muted">每一格，都是一天</span></div><div className="heatmap">{days.map(d => <div key={d.key} tabIndex={0} title={`${d.key} · ${d.count} 次回忆`} aria-label={`${d.key}，${d.count} 次回忆`} className={`heat heat-${Math.min(3, d.count)}`}><span>{d.key.slice(8)}</span>{d.count > 0 && <small>{d.count}</small>}</div>)}</div><div className="heatmap-legend"><span>{days[0].key}</span><span>少 <i /><i /><i /> 多</span><span>{days[34].key}</span></div></section><section className="chapter-progress"><div className="section-heading"><h2>每一章，都在生长</h2><InstantLink href="/curriculum">回到课程 <ArrowRight size={16}/></InstantLink></div>{data.chapters.map(c => { const cards = data.cards.filter(x => x.chapter_id === c.id); const learned = cards.filter(x => learnedCardIds.has(x.id)).length; return <div className="progress-row" key={c.id}><span>{String(c.position).padStart(2, '0')}</span><InstantLink href={`/curriculum/${c.id}`}>{c.title}</InstantLink><div className="thin-progress"><i style={{ width: `${cards.length ? learned / cards.length * 100 : 0}%` }}/></div><small>{cards.length ? `${learned} / ${cards.length} 张已学习` : '卡片待制'}</small></div>; })}</section>{data.historyLimited && <p className="info-note">活动与成功率基于最近 1,000 条记录。</p>}</>;
}

function Preferences() {
    const { data, update } = useData();
    const [form, setForm] = useState<Settings>({ ...data.settings });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);
    async function save(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError('');
        setMessage('');
        try {
            const saved = await api<Settings>('settings', { daily_minutes: form.daily_minutes, new_cards_per_day: form.new_cards_per_day, retention: form.retention, timezone: form.timezone, route_mode: form.route_mode, familiarity: form.familiarity, version: form.version }, 'PATCH');
            const settings = { ...saved, retention: Number(saved.retention) };
            invalidateReveal();
            update(current => ({ ...current, settings }));
            setForm(settings);
            setMessage('学习偏好已保存，下一次复习将使用新设置。');
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setBusy(false);
        }
    }
    return <><Heading eyebrow="Find your own pace" title="按自己的节奏生长。" description="好的计划，应该适合你的生活。"/><div className="settings-form"><ThemePicker/><form onSubmit={save}><section><div><h2>每天一点，持续发生</h2><p>到期复习优先。复习量增加时，系统会自动减少新卡。</p></div><div className="form-grid"><label>每日学习预算<div className="input-unit"><input type="number" min="10" max="120" value={form.daily_minutes} onChange={e => setForm({ ...form, daily_minutes: Number(e.target.value) })}/><span>分钟</span></div></label><label>每天最多新卡<div className="input-unit"><input type="number" min="0" max="30" value={form.new_cards_per_day} onChange={e => setForm({ ...form, new_cards_per_day: Number(e.target.value) })}/><span>张</span></div></label><label>期望记忆保留率<select value={form.retention} onChange={e => setForm({ ...form, retention: Number(e.target.value) })}>{[.8, .85, .9, .95, .97].map(x => <option value={x} key={x}>{x * 100}%{x === .9 ? ' · 推荐' : ''}</option>)}</select><small>越高通常需要越频繁地复习。</small></label><label>学习时区<select value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })}>{['Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Tokyo', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'UTC'].map(x => <option key={x}>{x}</option>)}</select><small>每天凌晨 4 点开始新的学习日。</small></label></div></section><section><h2>从哪里开始</h2><div className="route-options">{[['guided', '优先不熟悉的知识', '根据你对章节的熟悉程度安排新卡。'], ['chapter', '按章节顺序推进', '从已有卡片中，按照课程顺序学习。']].map(([v, t, d]) => <label className={form.route_mode === v ? 'chosen' : ''} key={v}><input type="radio" name="route" checked={form.route_mode === v} onChange={() => setForm({ ...form, route_mode: v as Settings['route_mode'] })}/><span><b>{t}</b><small>{d}</small></span></label>)}</div><div className="familiarity-list">{data.chapters.map(c => <label key={c.id}><span>{c.title}</span><select value={form.familiarity[c.id] || 'familiar'} onChange={e => setForm({ ...form, familiarity: { ...form.familiarity, [c.id]: e.target.value } })}><option value="new">刚刚接触</option><option value="familiar">了解一些</option><option value="experienced">比较熟悉</option></select></label>)}</div></section><ErrorNote error={error}/>{message && <p role="status" className="success-note"><Check size={17}/>{message}</p>}<div className="settings-actions"><button disabled={busy} className="button primary">{busy ? '保存中…' : '保存学习偏好'}<Check size={17}/></button><button type="button" className="button ghost" onClick={async () => { await api('auth/logout', {}); clearAllClientCaches(); instantNavigate('/login', 'replace'); }}><LogOut size={16}/>退出学习空间</button></div></form></div></>;
}

function Interview() { return <div className="interview-page"><div className="voice-orbit"><Volume2 size={46}/><span /><span /></div><span className="eyebrow">The weekend room</span><h1>让理解，<br />成为说得清的能力。</h1><p>周末练习室将在下一阶段开放。<br />未来，你可以围绕本周所学，完成一场真实的语音模拟面试。</p><span className="pill">规划中 · 尚未开放</span><InstantLink className="button primary" href="/cards">先用卡片练习表达 <ArrowUpRight size={17}/></InstantLink></div>; }
