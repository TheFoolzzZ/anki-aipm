import assert from 'node:assert/strict';
import test from 'node:test';
import { orderedLessons, practiceCards, resolveStudyScope, searchLessons } from '../src/lib/navigation';
import type { Bootstrap, CardMeta } from '../src/lib/types';

const makeCard = (id: string, lessonId: string, position: number): CardMeta => ({
  id, lesson_id: lessonId, chapter_id: lessonId === 'first' ? 'a' : 'b', position,
  canonical_key: id, concept_keys: ['shared-concept'], active_revision: 1,
  title: id, kind: 'basic', prompt: id, estimated_seconds: 45,
});
const data: Bootstrap = {
  user: { id: 'learner', display_name: '学习者' }, now: '2026-10-03T00:00:00Z', historyLimited: false,
  settings: { daily_minutes: 30, new_cards_per_day: 0, retention: .9, timezone: 'Asia/Shanghai', day_start_hour: 4, route_mode: 'guided', familiarity: {}, version: 1 },
  chapters: [
    { id: 'b', position: 2, title: 'Agent 技术', subtitle: '', description: '', color: '', target_cards: 0, icon: '' },
    { id: 'a', position: 1, title: 'AI 基础', subtitle: '', description: '', color: '', target_cards: 0, icon: '' },
  ],
  lessons: [
    { id: 'third', chapter_id: 'b', position: 1, title: '工具调用', summary: 'Agent 的能力边界', reading_minutes: 10 },
    { id: 'second', chapter_id: 'a', position: 2, title: '模型原理', summary: '大模型的边界', reading_minutes: 10 },
    { id: 'first', chapter_id: 'a', position: 1, title: 'AI 产品认知', summary: '建立认知', reading_minutes: 10 },
    { id: 'empty', chapter_id: 'b', position: 2, title: '无卡课程', summary: '', reading_minutes: 5 },
  ],
  cards: [makeCard('other-course', 'third', 1), makeCard('second-card', 'first', 2), makeCard('suspended', 'first', 0), makeCard('first-card', 'first', 1)],
  states: [{ card_id: 'suspended', suspended: true, version: 1, last_event_id: null, due: '2026-10-03T00:00:00Z', fsrs: { due: '2026-10-03T00:00:00Z', stability: 1, difficulty: 1, elapsed_days: 0, scheduled_days: 1, reps: 1, lapses: 0, state: 2, learning_steps: 0 } }],
  events: [], activity: [],
};

test('course navigation follows chapter then lesson order, including a chapter boundary, without mutating input', () => {
  const snapshot = structuredClone(data.lessons);
  assert.deepEqual(orderedLessons(data).map(lesson => lesson.id), ['first', 'second', 'third', 'empty']);
  assert.deepEqual(orderedLessons(data, 'a').map(lesson => lesson.id), ['first', 'second']);
  assert.deepEqual(data.lessons, snapshot);
});

test('practice scope distinguishes daily, single card, and course; rejects invalid or conflicting choices', () => {
  assert.deepEqual(resolveStudyScope(data, null, null), { kind: 'daily' });
  assert.deepEqual(resolveStudyScope(data, 'first', null), { kind: 'lesson', lessonId: 'first' });
  assert.deepEqual(resolveStudyScope(data, null, 'first-card'), { kind: 'card', cardId: 'first-card' });
  for (const [lesson, card] of [['missing', null], [null, 'missing'], ['first', 'first-card'], ['', null], [null, ''], ['', '']]) {
    assert.deepEqual(resolveStudyScope(data, lesson, card), { kind: 'invalid' });
  }
});

test('course practice stays in its course, excludes suspended cards, and is independent of daily budget and shared concepts', () => {
  assert.deepEqual(practiceCards(data, { kind: 'lesson', lessonId: 'first' }).map(card => card.id), ['first-card', 'second-card']);
  assert.deepEqual(practiceCards(data, { kind: 'lesson', lessonId: 'empty' }), []);
  assert.deepEqual(practiceCards(data, { kind: 'invalid' }), []);
});

test('a single-card practice cannot flow into another card; a paused card cannot be practiced', () => {
  assert.deepEqual(practiceCards(data, { kind: 'card', cardId: 'first-card' }).map(card => card.id), ['first-card']);
  assert.deepEqual(practiceCards(data, { kind: 'card', cardId: 'suspended' }), []);
});

test('course search trims input, matches case-insensitive chapter/title/summary, and respects chapter scope', () => {
  assert.deepEqual(searchLessons(data, '  agent  ').map(lesson => lesson.id), ['third', 'empty']);
  assert.deepEqual(searchLessons(data, '模型', 'a').map(lesson => lesson.id), ['second']);
  assert.deepEqual(searchLessons(data, '模型', 'b'), []);
  assert.deepEqual(searchLessons(data, '不存在'), []);
});
