'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ChevronRight, Compass, Layers, Search, Settings2, X } from 'lucide-react';
import { orderedLessons, searchLessons } from '@/lib/navigation';
import { studySummary } from '@/lib/learning';
import type { Bootstrap } from '@/lib/types';

export const workspaceNav = [
  { path: 'today', label: '今日学习' },
  { path: 'curriculum', label: '知识地图' },
  { path: 'cards', label: '记忆卡片' },
  { path: 'progress', label: '成长记录' },
];

export function navigationContext(data: Bootstrap, route: string[], lessonId: string | null, cardId: string | null) {
  const page = route[0];
  const lesson = data.lessons.find(item => item.id === (page === 'lessons' ? route[1] : lessonId || data.cards.find(card => card.id === cardId)?.lesson_id));
  const chapter = data.chapters.find(item => item.id === (page === 'curriculum' ? route[1] : lesson?.chapter_id));
  return { page, lesson, chapter, knowledge: page === 'curriculum' || page === 'lessons' || (page === 'study' && !!(lessonId || cardId)) };
}

type NavigationProps = { data: Bootstrap; route: string[]; lessonId: string | null; cardId: string | null };

export function Breadcrumbs(props: NavigationProps) {
  const { page, chapter, lesson, knowledge } = navigationContext(props.data, props.route, props.lessonId, props.cardId);
  const crumbs: { label: string; href?: string }[] = [];
  if (knowledge) {
    crumbs.push({ label: '知识地图', href: chapter || page !== 'curriculum' ? '/curriculum' : undefined });
    if (chapter) crumbs.push({ label: chapter.title, href: page !== 'curriculum' ? `/curriculum/${chapter.id}` : undefined });
    if (lesson) crumbs.push({ label: lesson.title, href: page === 'study' ? `/lessons/${lesson.id}` : undefined });
    if (page === 'study') crumbs.push({ label: props.lessonId ? '课程练习' : '单卡练习' });
    if (page === 'lessons' && !lesson) crumbs.push({ label: '课程未找到' });
  } else if (page === 'study') {
    crumbs.push({ label: '今日学习', href: '/today' }, { label: '今日复习' });
  } else {
    crumbs.push({ label: workspaceNav.find(item => item.path === page)?.label || (page === 'settings' ? '学习偏好' : '周末练习室') });
  }
  return <nav aria-label="面包屑" className="breadcrumbs"><ol>{crumbs.map((crumb, index) => <li key={index}>{index > 0 && <ChevronRight size={13} aria-hidden="true" />}{crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current={index === crumbs.length - 1 ? 'page' : undefined}>{crumb.label}</span>}</li>)}</ol></nav>;
}

export function WorkspaceSidebar({ data, route, lessonId, cardId, close }: NavigationProps & { close: () => void }) {
  const { page, chapter, lesson, knowledge } = navigationContext(data, route, lessonId, cardId);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string[]>(chapter ? [chapter.id] : []);
  const activeRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (chapter) setExpanded(current => current.includes(chapter.id) ? current : [...current, chapter.id]);
    setQuery('');
  }, [chapter?.id, lesson?.id, page]);
  useEffect(() => { activeRef.current?.scrollIntoView({ block: 'nearest' }); }, [lesson?.id, expanded]);
  const results = searchLessons(data, query);
  const s = studySummary(data, new Date());
  return <>
    <div className="sidebar-heading"><div><span className="sidebar-kicker">AI 产品经理</span><h2>{knowledge ? '课程目录' : page === 'cards' ? '卡片工作台' : page === 'progress' ? '学习足迹' : page === 'settings' ? '我的学习空间' : '今天的计划'}</h2></div><button className="icon-button sidebar-close" aria-label="关闭导航" onClick={close}><X size={20} /></button></div>
    {knowledge ? <>
      <label className="directory-search"><Search size={16} /><input aria-label="搜索课程目录" value={query} onChange={event => setQuery(event.target.value)} placeholder="查找课程或关键词" />{query && <button aria-label="清空课程搜索" onClick={() => setQuery('')}><X size={14} /></button>}</label>
      <Link className={`directory-overview ${page === 'curriculum' && !chapter ? 'selected' : ''}`} href="/curriculum" onClick={close}><Compass size={17} />全部章节<span>{data.chapters.length}</span></Link>
      <nav className="course-tree" aria-label="章节与课程目录">
        {query.trim() ? <><p className="directory-result-count">找到 {results.length} 篇课程</p>{results.map(item => <Link className="directory-result" key={item.id} href={`/lessons/${item.id}`} onClick={close}><small>{data.chapters.find(c => c.id === item.chapter_id)?.title}</small><span>{item.title}</span></Link>)}{!results.length && <p className="directory-empty">没有匹配课程，试试其他关键词。</p>}</> : data.chapters.toSorted((a, b) => a.position - b.position).map(item => {
          const open = expanded.includes(item.id);
          const lessons = orderedLessons(data, item.id);
          return <div className={`tree-chapter ${chapter?.id === item.id ? 'current' : ''}`} key={item.id}>
            <div className="tree-chapter-row"><button aria-label={`${open ? '收起' : '展开'}${item.title}`} aria-expanded={open} aria-controls={`chapter-${item.id}`} onClick={() => setExpanded(current => open ? current.filter(id => id !== item.id) : [...current, item.id])}><ChevronRight size={13} className={open ? 'rotated' : ''} /></button><Link href={`/curriculum/${item.id}`} aria-current={page === 'curriculum' && chapter?.id === item.id ? 'page' : undefined} onClick={close}><span className="chapter-index">{String(item.position).padStart(2, '0')}</span><span>{item.title}</span></Link></div>
            {open && <div id={`chapter-${item.id}`} className="tree-lessons">{lessons.map((itemLesson, index) => <Link ref={lesson?.id === itemLesson.id ? activeRef : undefined} key={itemLesson.id} href={`/lessons/${itemLesson.id}`} aria-current={lesson?.id === itemLesson.id ? 'page' : undefined} onClick={close}><span className="tree-lesson-index">{index + 1}</span><span>{itemLesson.title}</span>{data.activity.some(activity => activity.lesson_id === itemLesson.id) && <Check size={12} aria-label="已读" />}</Link>)}</div>}
          </div>;
        })}
      </nav>
      <div className="directory-foot"><BookOpen size={15} /><span>{data.lessons.length} 篇课程，自由选择起点</span></div>
    </> : <div className="workspace-shortcuts">
      <Link className={page === 'today' || page === 'study' ? 'selected' : ''} href="/study" onClick={close}><span className="shortcut-icon"><Layers size={18} /></span><span>今日复习<small>{s.due.length} 张到期 · {s.newCount} 张新卡</small></span><ArrowRight size={16} /></Link>
      <Link href="/curriculum" onClick={close}><span className="shortcut-icon"><Compass size={18} /></span><span>自主选课<small>从感兴趣的主题开始</small></span><ArrowRight size={16} /></Link>
      <div className="sidebar-explainer"><span className="mini-route"><i /><i /><i /></span><h3>理解，然后记住。</h3><p>在知识地图里选择课程，阅读后练习本课卡片。今日复习会按记忆间隔安排下一次回忆。</p></div>
      <Link className="sidebar-text-link" href="/cards" onClick={close}><Search size={15} />查找知识卡片</Link>
    </div>}
    <div className="sidebar-profile"><span className="avatar">{data.user.display_name.slice(0, 1)}</span><span>{data.user.display_name}<small>个人学习空间</small></span><Link href="/settings" aria-label="学习偏好" onClick={close}><Settings2 size={18} /></Link></div>
  </>;
}

export function LessonPagination({ data, lessonId }: { data: Bootstrap; lessonId: string }) {
  const lessons = orderedLessons(data);
  const index = lessons.findIndex(lesson => lesson.id === lessonId);
  if (index < 0) return null;
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  return <nav aria-label="课程翻页" className="lesson-pagination">
    {previous ? <Link href={`/lessons/${previous.id}`}><ArrowLeft size={19} /><span><small>上一课{previous.chapter_id !== lessons[index].chapter_id ? ' · 上一章节' : ''}</small><strong>{previous.title}</strong></span></Link> : <div className="pagination-boundary">这是第一课</div>}
    {next ? <Link href={`/lessons/${next.id}`}><span><small>下一课{next.chapter_id !== lessons[index].chapter_id ? ' · 下一章节' : ''}</small><strong>{next.title}</strong></span><ArrowRight size={19} /></Link> : <Link href="/curriculum"><span><small>已到最后一课</small><strong>返回知识地图</strong></span><Compass size={19} /></Link>}
  </nav>;
}
