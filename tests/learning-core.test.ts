import assert from 'node:assert/strict';
import test from 'node:test';
import { sign, verify } from '../src/lib/crypto';
import { activeReviews, learningDay, selectNext, studySummary } from '../src/lib/learning';
import { previewSchedule } from '../src/lib/scheduler';
import type { Bootstrap, CardMeta, SavedCard, Settings } from '../src/lib/types';

const now = new Date('2026-09-06T00:00:00.000Z');
const ids = {
  user: '00000000-0000-4000-8000-000000000001',
  chapter: '00000000-0000-4000-8000-000000000010',
  lesson: '00000000-0000-4000-8000-000000000020',
  otherChapter: '00000000-0000-4000-8000-000000000011',
  otherLesson: '00000000-0000-4000-8000-000000000021',
};

function card(id: string, conceptKeys: string[], position = 1, chapterId = ids.chapter): CardMeta {
  return { id, canonical_key: id, lesson_id: chapterId === ids.chapter ? ids.lesson : ids.otherLesson,
    chapter_id: chapterId, concept_keys: conceptKeys, position, active_revision: 1,
    title: id, kind: 'basic', prompt: id, estimated_seconds: 45 };
}

function fsrs(reps = 0, due = now.toISOString()): SavedCard {
  return { due, stability: 0, difficulty: 0, elapsed_days: 0, scheduled_days: 0,
    reps, lapses: 0, state: 0, learning_steps: 0 };
}

function settings(overrides: Partial<Settings> = {}): Settings {
  return { daily_minutes: 30, new_cards_per_day: 4, retention: 0.9, timezone: 'Asia/Shanghai',
    day_start_hour: 4, route_mode: 'guided', familiarity: {}, version: 0, ...overrides };
}

function bootstrap(overrides: Partial<Bootstrap> = {}): Bootstrap {
  return { user: { id: ids.user, display_name: 'test' }, settings: settings(),
    chapters: [
      { id: ids.chapter, position: 1, title: 'one', subtitle: '', description: '', color: '', target_cards: 1, icon: '' },
      { id: ids.otherChapter, position: 2, title: 'two', subtitle: '', description: '', color: '', target_cards: 1, icon: '' },
    ], lessons: [], cards: [], states: [], events: [], activity: [], now: now.toISOString(), historyLimited: false, ...overrides };
}

test('FSRS preview keeps the four rating meanings and produces monotonic first-card intervals', () => {
  const preview = previewSchedule(null, { retention: 0.9 }, now);
  assert.deepEqual(preview.options.map((option) => option.rating), [1, 2, 3, 4]);
  assert.deepEqual(Object.keys(preview.candidates), ['1', '2', '3', '4']);
  assert.deepEqual(preview.before, fsrs());
  const dueTimes = [1, 2, 3, 4].map((rating) => new Date(preview.candidates[rating].due).getTime());
  assert.ok(dueTimes[0] < dueTimes[1] && dueTimes[1] < dueTimes[2] && dueTimes[2] < dueTimes[3]);
  for (const rating of [1, 2, 3, 4]) assert.equal(preview.candidates[rating].reps, 1);
});

test('learning-day boundary follows the learner timezone and configured start hour', () => {
  const cfg = { timezone: 'Asia/Shanghai', day_start_hour: 4 };
  const before = learningDay(new Date('2026-09-05T19:59:59.000Z'), cfg);
  const at = learningDay(new Date('2026-09-05T20:00:00.000Z'), cfg);
  assert.equal(before.key, '2026-09-05');
  assert.equal(before.start.toISOString(), '2026-09-04T20:00:00.000Z');
  assert.equal(at.key, '2026-09-06');
  assert.equal(at.start.toISOString(), '2026-09-05T20:00:00.000Z');
});

test('undo removes the original review from active statistics and restores new-card budget', () => {
  const cardId = '00000000-0000-4000-8000-000000000101';
  const review = { id: '00000000-0000-4000-8000-000000000201', card_id: cardId, kind: 'review' as const,
    rating: 3, state_before: fsrs(), state_after: fsrs(1), received_at: '2026-09-05T21:00:00.000Z',
    reviewed_at: '2026-09-05T21:00:00.000Z', duration_ms: 60000, undone_event_id: null };
  const undo = { ...review, id: '00000000-0000-4000-8000-000000000202', kind: 'undo' as const,
    rating: null, undone_event_id: review.id };
  const data = bootstrap({ cards: [card(cardId, ['concept-a'])], events: [review, undo] });
  assert.deepEqual(activeReviews(data.events), []);
  const summary = studySummary(data, now);
  assert.equal(summary.newToday, 0);
  assert.equal(summary.spentMs, 0);
  assert.equal(summary.newCount, 1);
});

test('new-card queue observes daily budget and spaces sibling concepts for the learning day', () => {
  const sibling = card('00000000-0000-4000-8000-000000000111', ['concept-a'], 1);
  const distinct = card('00000000-0000-4000-8000-000000000112', ['concept-b'], 2);
  const practiced = { id: '00000000-0000-4000-8000-000000000211', card_id: '00000000-0000-4000-8000-000000000113', kind: 'review' as const,
    rating: 3, state_before: fsrs(), state_after: fsrs(1), received_at: '2026-09-05T21:00:00.000Z',
    reviewed_at: '2026-09-05T21:00:00.000Z', duration_ms: 0, undone_event_id: null };
  const data = bootstrap({ cards: [card(practiced.card_id, ['concept-a'], 0), sibling, distinct], events: [practiced],
    settings: settings({ new_cards_per_day: 1 }) });
  assert.equal(studySummary(data, now).newCount, 0, 'the first new review consumed today\'s one-card allowance');
  const withBudget = { ...data, settings: settings({ new_cards_per_day: 2 }) };
  assert.equal(studySummary(withBudget, now).newCount, 1);
  assert.equal(selectNext(withBudget, now)?.id, distinct.id, 'a sibling concept is deferred until another day');
});

test('signed preview data is purpose-bound, expires, and rejects any tampering', () => {
  const key = 'a secure test key that is safely longer than thirty-two bytes';
  const payload = { cardId: ids.lesson, expires: Date.now() + 60_000 };
  const token = sign(payload, 'review', key);
  assert.deepEqual(verify<typeof payload>(token, 'review', key), payload);
  assert.equal(verify(token, 'session', key), null);
  const [body, signature] = token.split('.');
  assert.equal(verify(`${body}.${signature.slice(0, -1)}A`, 'review', key), null);
  assert.equal(verify(sign({ ...payload, expires: Date.now() - 1 }, 'review', key), 'review', key), null);
});
