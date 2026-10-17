'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Compass, Layers, Search, Settings2, X } from 'lucide-react';
import { orderedLessons, searchLessons } from '@/lib/navigation';
import { studySummary } from '@/lib/learning';
import { ensureInstantHistory, getInstantOverride, getServerInstantLocation, instantNavigate, isPlainLeftClick, subscribeInstantLocation, type InstantLocation } from '@/lib/client-cache';
import type { Bootstrap } from '@/lib/types';

export const workspaceNav = [
  { path: 'today', label: '今日学习' },
  { path: 'curriculum', label: '知识地图' },
  { path: 'cards', label: '记忆卡片' },
  { path: 'progress', label: '成长记录' },
];

export type NavLinkProps = Omit<React.ComponentProps<'a'>, 'href'> & {
  href: string;
  replace?: boolean;
  scroll?: boolean;
  prefetchLessonId?: string;
  onPrefetchLesson?: (lessonId: string) => void;
};

export function useInstantLocation(): InstantLocation {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const override = useSyncExternalStore(subscribeInstantLocation, getInstantOverride, getServerInstantLocation);
  useEffect(() => { ensureInstantHistory(); }, []);
  return override ?? { pathname, search };
}

export function InstantLink({ href, onClick, onMouseEnter, onFocus, onPointerDown, replace = false, scroll = true, prefetchLessonId, onPrefetchLesson, ...rest }: NavLinkProps) {
  const warm = () => {
    if (prefetchLessonId && onPrefetchLesson) onPrefetchLesson(prefetchLessonId);
  };
  return (
    <a
      {...rest}
      href={href}
      onMouseEnter={event => {
        onMouseEnter?.(event);
        warm();
      }}
      onFocus={event => {
        onFocus?.(event);
        warm();
      }}
      onPointerDown={event => {
        onPointerDown?.(event);
        if (event.button === 0) warm();
      }}
      onClick={event => {
        onClick?.(event);
        if (!isPlainLeftClick(event) || !href.startsWith('/') || href.startsWith('//')) return;
        event.preventDefault();
        instantNavigate(href, replace ? 'replace' : 'push', scroll);
      }}
    />
  );
}

export function navigationContext(data: Bootstrap, route: string[], lessonId: string | null, cardId: string | null) {
  const page = route[0];
  const lesson = data.lessons.find(item => item.id === (page === 'lessons' ? route[1] : lessonId || data.cards.find(card => card.id === cardId)?.lesson_id));
  const chapter = data.chapters.find(item => item.id === (page === 'curriculum' ? route[1] : lesson?.chapter_id));
  return { page, lesson, chapter, knowledge: page === 'curriculum' || page === 'lessons' || (page === 'study' && !!(lessonId || cardId)) };
}

type NavigationProps = {
  data: Bootstrap;
  route: string[];
  lessonId: string | null;
  cardId: string | null;
  onPrefetchLesson?: (lessonId: string) => void;
};

export function Breadcrumbs(props: NavigationProps) {
  const { page, chapter, lesson, knowledge } = navigationContext(props.data, props.route, props.lessonId, props.cardId);
  const crumbs: { label: string; href?: string; prefetchLessonId?: string }[] = [];
  if (knowledge) {
    crumbs.push({ label: '知识地图', href: chapter || page !== 'curriculum' ? '/curriculum' : undefined });
    if (chapter) crumbs.push({ label: chapter.title, href: page !== 'curriculum' ? `/curriculum/${chapter.id}` : undefined });
    if (lesson) crumbs.push({ label: lesson.title, href: page === 'study' ? `/lessons/${lesson.id}` : undefined, prefetchLessonId: page === 'study' ? lesson.id : undefined });
    if (page === 'study') crumbs.push({ label: props.lessonId ? '课程练习' : '单卡练习' });
    if (page === 'lessons' && !lesson) crumbs.push({ label: '课程未找到' });
  } else if (page === 'study') {
    crumbs.push({ label: '今日学习', href: '/today' }, { label: '今日复习' });
  } else {
    crumbs.push({ label: workspaceNav.find(item => item.path === page)?.label || (page === 'settings' ? '学习偏好' : '周末练习室') });
  }
  return <nav aria-label="面包屑" className="breadcrumbs"><ol>{crumbs.map((crumb, index) => <li key={index}>{index > 0 && <ChevronRight size={13} aria-hidden="true" />}{crumb.href ? <InstantLink href={crumb.href} prefetchLessonId={crumb.prefetchLessonId} onPrefetchLesson={props.onPrefetchLesson}>{crumb.label}</InstantLink> : <span aria-current={index === crumbs.length - 1 ? 'page' : undefined}>{crumb.label}</span>}</li>)}</ol></nav>;
}

export function WorkspaceSidebar({ data, route, lessonId, cardId, close, onPrefetchLesson }: NavigationProps & { close: () => void }) {
  const { page, chapter, lesson, knowledge } = navigationContext(data, route, lessonId, cardId);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string[]>(chapter ? [chapter.id] : []);
  const activeRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (chapter) setExpanded(current => current.includes(chapter.id) ? current : [...current, chapter.id]);
    setQuery('');
  }, [chapter?.id, lesson?.id, page]);
  useEffect(() => { activeRef.current?.scrollIntoView({ block: 'nearest' }); }, [lesson?.id, expanded]);

  const sortedChapters = useMemo(() => data.chapters.toSorted((a, b) => a.position - b.position), [data.chapters]);
  const chapterTitleById = useMemo(() => new Map(data.chapters.map(c => [c.id, c.title])), [data.chapters]);
  const lessonsByChapter = useMemo(() => {
    const map = new Map<string, ReturnType<typeof orderedLessons>>();
    for (const ch of sortedChapters) {
      map.set(ch.id, orderedLessons(data, ch.id));
    }
    return map;
  }, [data, sortedChapters]);
  const readSet = useMemo(() => new Set(data.activity.map(a => a.lesson_id)), [data.activity]);
  const results = useMemo(() => query.trim() ? searchLessons(data, query) : [], [data, query]);
  const s = useMemo(() => studySummary(data, new Date()), [data]);

  return <>
    <div className="sidebar-heading"><div><span className="sidebar-kicker">AI 产品经理</span><h2>{knowledge ? '课程目录' : page === 'cards' ? '卡片工作台' : page === 'progress' ? '学习足迹' : page === 'settings' ? '我的学习空间' : '今天的计划'}</h2></div><button className="icon-button sidebar-close" aria-label="关闭导航" onClick={close}><X size={20} /></button></div>
    {knowledge ? <>
      <label className="directory-search"><Search size={16} /><input aria-label="搜索课程目录" value={query} onChange={event => setQuery(event.target.value)} placeholder="查找课程或关键词" />{query && <button aria-label="清空课程搜索" onClick={() => setQuery('')}><X size={14} /></button>}</label>
      <InstantLink className={`directory-overview ${page === 'curriculum' && !chapter ? 'selected' : ''}`} href="/curriculum" onClick={close}><Compass size={17} />全部章节<span>{data.chapters.length}</span></InstantLink>
      <nav className="course-tree" aria-label="章节与课程目录">
        {query.trim() ? <><p className="directory-result-count">找到 {results.length} 篇课程</p>{results.map(item => <InstantLink className="directory-result" key={item.id} href={`/lessons/${item.id}`} prefetchLessonId={item.id} onPrefetchLesson={onPrefetchLesson} onClick={close}><small>{chapterTitleById.get(item.chapter_id)}</small><span>{item.title}</span></InstantLink>)}{!results.length && <p className="directory-empty">没有匹配课程，试试其他关键词。</p>}</> : sortedChapters.map(item => {
          const open = expanded.includes(item.id);
          const lessons = lessonsByChapter.get(item.id) || [];
          return <div className={`tree-chapter ${chapter?.id === item.id ? 'current' : ''}`} key={item.id}>
            <div className="tree-chapter-row"><button aria-label={`${open ? '收起' : '展开'}${item.title}`} aria-expanded={open} aria-controls={`chapter-${item.id}`} onClick={() => setExpanded(current => open ? current.filter(id => id !== item.id) : [...current, item.id])}><ChevronRight size={13} className={open ? 'rotated' : ''} /></button><InstantLink href={`/curriculum/${item.id}`} aria-current={page === 'curriculum' && chapter?.id === item.id ? 'page' : undefined} onClick={close}><span className="chapter-index">{String(item.position).padStart(2, '0')}</span><span>{item.title}</span></InstantLink></div>
            {open && <div id={`chapter-${item.id}`} className="tree-lessons">{lessons.map((itemLesson, index) => <InstantLink ref={lesson?.id === itemLesson.id ? activeRef : undefined} key={itemLesson.id} href={`/lessons/${itemLesson.id}`} prefetchLessonId={itemLesson.id} onPrefetchLesson={onPrefetchLesson} aria-current={lesson?.id === itemLesson.id ? 'page' : undefined} onClick={close}><span className="tree-lesson-index">{index + 1}</span><span>{itemLesson.title}</span>{readSet.has(itemLesson.id) && <Check size={12} aria-label="已读" />}</InstantLink>)}</div>}
          </div>;
        })}
      </nav>
      <div className="directory-foot"><BookOpen size={15} /><span>{data.lessons.length} 篇课程，自由选择起点</span></div>
    </> : <div className="workspace-shortcuts">
      <InstantLink className={page === 'today' || page === 'study' ? 'selected' : ''} href="/study" onClick={close}><span className="shortcut-icon"><Layers size={18} /></span><span>今日复习<small>{s.due.length} 张到期 · {s.newCount} 张新卡</small></span><ArrowRight size={16} /></InstantLink>
      <InstantLink href="/curriculum" onClick={close}><span className="shortcut-icon"><Compass size={18} /></span><span>自主选课<small>从感兴趣的主题开始</small></span><ArrowRight size={16} /></InstantLink>
      <div className="sidebar-explainer"><span className="mini-route"><i /><i /><i /></span><h3>理解，然后记住。</h3><p>在知识地图里选择课程，阅读后练习本课卡片。今日复习会按记忆间隔安排下一次回忆。</p></div>
      <InstantLink className="sidebar-text-link" href="/cards" onClick={close}><Search size={15} />查找知识卡片</InstantLink>
    </div>}
    <div className="sidebar-profile"><span className="avatar">{data.user.display_name.slice(0, 1)}</span><span>{data.user.display_name}<small><InstantLink href="/settings" onClick={close}>切换用户 / 管理</InstantLink></small></span><InstantLink href="/settings" aria-label="管理学习者" onClick={close}><Settings2 size={18} /></InstantLink></div>
  </>;
}

export function LessonPagination({ data, lessonId, onPrefetchLesson }: { data: Bootstrap; lessonId: string; onPrefetchLesson?: (lessonId: string) => void }) {
  const lessons = useMemo(() => orderedLessons(data), [data]);
  const index = lessons.findIndex(lesson => lesson.id === lessonId);
  if (index < 0) return null;
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  return <nav aria-label="课程翻页" className="lesson-pagination">
    {previous ? <InstantLink href={`/lessons/${previous.id}`} prefetchLessonId={previous.id} onPrefetchLesson={onPrefetchLesson}><ArrowLeft size={19} /><span><small>上一课{previous.chapter_id !== lessons[index].chapter_id ? ' · 上一章节' : ''}</small><strong>{previous.title}</strong></span></InstantLink> : <div className="pagination-boundary">这是第一课</div>}
    {next ? <InstantLink href={`/lessons/${next.id}`} prefetchLessonId={next.id} onPrefetchLesson={onPrefetchLesson}><span><small>下一课{next.chapter_id !== lessons[index].chapter_id ? ' · 下一章节' : ''}</small><strong>{next.title}</strong></span><ArrowRight size={19} /></InstantLink> : <InstantLink href="/curriculum"><span><small>已到最后一课</small><strong>返回知识地图</strong></span><Compass size={19} /></InstantLink>}
  </nav>;
}
