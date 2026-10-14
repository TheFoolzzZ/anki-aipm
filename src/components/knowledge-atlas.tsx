'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Check, Clock, Compass, Layers, Search, X } from 'lucide-react';
import { orderedLessons, searchLessons } from '@/lib/navigation';
import type { Bootstrap, Lesson } from '@/lib/types';

export function KnowledgeRoute({ data }: { data: Bootstrap }) {
  const chapters = data.chapters.toSorted((a, b) => a.position - b.position);
  return <div className="knowledge-route"><div className="route-caption"><span><span className="status-dot" />从认知到实践</span><span>选择一个章节开始</span></div><div className="route-nodes">{chapters.map((chapter, index) => <Link key={chapter.id} href={`/curriculum/${chapter.id}`} className={`route-node route-tone-${index % 3}`}><span className="route-node-dot">{chapter.position.toString().padStart(2, '0')}</span><span className="route-node-name">{chapter.title}</span><ArrowUpRight size={13} /></Link>)}</div><div className="route-bottom"><span>每一段理解，都有来处。</span><Compass size={20} /></div></div>;
}

export function LessonRows({ data, lessons }: { data: Bootstrap; lessons: Lesson[] }) {
  return <div className="course-rows">{lessons.map(lesson => {
    const chapter = data.chapters.find(item => item.id === lesson.chapter_id);
    const read = data.activity.some(activity => activity.lesson_id === lesson.id);
    const cardCount = data.cards.filter(card => card.lesson_id === lesson.id).length;
    return <Link className="course-row" key={lesson.id} href={`/lessons/${lesson.id}`}><span className="course-position">{chapter?.position}.{lesson.position}</span><div className="course-row-copy"><span className="course-row-chapter">{chapter?.title}</span><h3>{lesson.title}</h3><p>{lesson.summary}</p></div><div className="course-row-meta"><span><Clock size={13} />{lesson.reading_minutes} 分钟</span><span><Layers size={13} />{cardCount ? `${cardCount} 张卡片` : '暂无卡片'}</span>{read && <span className="read-badge"><Check size={12} />已读</span>}</div><ArrowUpRight size={19} className="course-row-arrow" /></Link>;
  })}</div>;
}

const weeks = [
  ['建立 AI 产品认知', '职业方向、全局视野'], ['理解大模型', '模型能力、训练与推理'],
  ['Prompt 与上下文', '任务拆解、约束和结构化输出'], ['Embedding 与检索', '向量、分块与召回'],
  ['搭建 RAG 判断框架', '检索链路与质量诊断'], ['Agent 的基本结构', '工具、记忆与任务执行'],
  ['工作流与多 Agent', '协作边界、可靠性与成本'], ['评测与可观测性', '数据集、指标与线上监控'],
  ['技术选型与成本', '微调、延迟、预算与安全'], ['需求与场景判断', '从用户问题到产品假设'],
  ['产品方案与交付', 'MVP、交互与验收'], ['数据驱动迭代', '实验、指标与产品闭环'],
  ['商业化与增长', '价值、定价与分发'], ['项目复盘', '提炼判断与实践证据'],
  ['行业理解', '案例与可迁移的经验'], ['综合回顾', '知识整合与薄弱点复习'],
];

export function KnowledgeAtlas({ data, chapterId }: { data: Bootstrap; chapterId?: string }) {
  const [view, setView] = useState('chapters');
  const [query, setQuery] = useState('');
  const chapter = data.chapters.find(item => item.id === chapterId);
  if (chapterId && !chapter) return <div className="empty-state"><Compass size={32} /><h1>没有找到这个章节</h1><Link href="/curriculum" className="button primary">返回知识地图</Link></div>;
  const lessons = searchLessons(data, query, chapter?.id);
  const allLessons = orderedLessons(data, chapter?.id);
  const read = allLessons.filter(lesson => data.activity.some(activity => activity.lesson_id === lesson.id)).length;
  return <>
    {chapter ? <section className="chapter-intro"><div className="chapter-monogram">{String(chapter.position).padStart(2, '0')}</div><div><span className="chapter-annotation">章节 / {chapter.position}</span><h1>{chapter.title}</h1><p>{chapter.description}</p><div className="chapter-intro-meta"><span>{allLessons.length} 篇课程</span><span>{data.cards.filter(card => card.chapter_id === chapter.id).length} 张卡片</span><span>{read} 篇已读</span></div></div>{allLessons[0] && <Link className="button primary" href={`/lessons/${allLessons.find(lesson => !data.activity.some(activity => activity.lesson_id === lesson.id))?.id || allLessons[0].id}`}>{read === allLessons.length ? '重新阅读' : read ? '继续阅读' : '开始阅读'}<ArrowRight size={17} /></Link>}</section> : <section className="atlas-hero"><div className="atlas-copy"><span className="atlas-label"><Compass size={17} />知识地图</span><h1>把知识连成<br />你的判断力。</h1><p>从 AI 的基本原理，到产品的真实决策。<br />选择你的起点，让每一次学习有所归属。</p><div className="atlas-stats"><span><strong>{data.chapters.length}</strong>个章节</span><span><strong>{data.lessons.length}</strong>篇课程</span><span><strong>{data.cards.length}</strong>张记忆卡片</span></div></div><KnowledgeRoute data={data} /></section>}
    <div className="atlas-toolbar"><div className="atlas-tabs" role="group" aria-label="课程浏览方式">{(chapter ? [['lessons', '本章课程']] : [['chapters', '按章节探索'], ['lessons', '全部课程'], ['weeks', '16 周路线']]).map(([key, label]) => <button key={key} aria-pressed={chapter ? true : view === key} className={(chapter || view === key) ? 'selected' : ''} onClick={() => setView(key)}>{label}</button>)}</div><label className="atlas-search"><Search size={16} /><input aria-label="搜索课程" placeholder={chapter ? '搜索本章课程' : '想学习什么？'} value={query} onChange={event => setQuery(event.target.value)} />{query && <button aria-label="清空搜索" onClick={() => setQuery('')}><X size={14} /></button>}</label></div>
    {query.trim() || chapter || view === 'lessons' ? <><div className="results-heading"><span>{query.trim() ? `“${query.trim()}”的课程` : chapter ? '按课程顺序阅读，也可以直接选择' : '直接找到你想学的课程'}</span><span>{lessons.length} 篇</span></div><LessonRows data={data} lessons={lessons} />{!lessons.length && <div className="empty-state"><Search size={28} /><h3>{query ? '没有找到匹配课程' : '这里还没有课程'}</h3><p>{query ? '换一个关键词，或清空搜索查看全部课程。' : '选择其他章节继续探索。'}</p>{query && <button className="button ghost" onClick={() => setQuery('')}>清空搜索</button>}</div>}</> : view === 'chapters' ? <div className="atlas-chapters">{data.chapters.toSorted((a, b) => a.position - b.position).map((item, index) => {
      const chapterLessons = orderedLessons(data, item.id);
      const chapterRead = chapterLessons.filter(lesson => data.activity.some(activity => activity.lesson_id === lesson.id)).length;
      return <Link className={`atlas-chapter atlas-tone-${index % 3}`} href={`/curriculum/${item.id}`} key={item.id}><div className="atlas-chapter-top"><span className="atlas-chapter-number">{String(item.position).padStart(2, '0')}</span><span className="atlas-chapter-line"><i /><i /><i /></span><ArrowUpRight size={19} /></div><h2>{item.title}</h2><p>{item.description}</p><div className="atlas-chapter-footer"><span><BookOpen size={14} />{chapterLessons.length} 篇课程</span><span>{chapterRead} 篇已读</span></div><div className="atlas-read-track" aria-label={`${chapterRead} / ${chapterLessons.length} 篇已读`}><i style={{ width: `${chapterLessons.length ? chapterRead / chapterLessons.length * 100 : 0}%` }} /></div></Link>;
    })}</div> : <div className="learning-week-list"><p className="info-note">这是一条可参考的主题路线。你可以随时通过左侧课程目录选择内容；今日复习按记忆间隔安排，不等同于课程翻页。</p>{weeks.map(([title, description], index) => <div className="learning-week" key={title}><span>第 {index + 1} 周</span><div><h3>{title}</h3><p>{description}</p></div><span>{data.settings.daily_minutes} 分钟 / 日</span></div>)}</div>}
    <div className="atlas-help"><BookOpen size={17} /><p><strong>选课阅读，按课练习，按时复习。</strong> 左侧目录随时换课；课程练习只覆盖本课；今日复习安排全库到期卡片。</p></div>
  </>;
}
