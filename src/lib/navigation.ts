import type { Bootstrap, CardMeta, Lesson } from './types';

export function orderedLessons(data: Pick<Bootstrap, 'chapters' | 'lessons'>, chapterId?: string): Lesson[] {
  const positions = new Map(data.chapters.map(chapter => [chapter.id, chapter.position]));
  return data.lessons.filter(lesson => !chapterId || lesson.chapter_id === chapterId).toSorted((a, b) =>
    (positions.get(a.chapter_id) ?? 0) - (positions.get(b.chapter_id) ?? 0) || a.position - b.position || a.id.localeCompare(b.id));
}

export type StudyScope = { kind: 'daily' } | { kind: 'lesson'; lessonId: string } | { kind: 'card'; cardId: string } | { kind: 'invalid' };

export function resolveStudyScope(data: Bootstrap, lessonId: string | null, cardId: string | null): StudyScope {
  if (lessonId !== null && cardId !== null) return { kind: 'invalid' };
  if (lessonId !== null) return data.lessons.some(lesson => lesson.id === lessonId) ? { kind: 'lesson', lessonId } : { kind: 'invalid' };
  if (cardId !== null) return data.cards.some(card => card.id === cardId) ? { kind: 'card', cardId } : { kind: 'invalid' };
  return { kind: 'daily' };
}

export function practiceCards(data: Bootstrap, scope: StudyScope): CardMeta[] {
  if (scope.kind === 'daily' || scope.kind === 'invalid') return [];
  const suspended = new Set(data.states.filter(state => state.suspended).map(state => state.card_id));
  return data.cards.filter(card => !suspended.has(card.id) &&
    (scope.kind === 'lesson' ? card.lesson_id === scope.lessonId : card.id === scope.cardId))
    .toSorted((a, b) => a.position - b.position || a.id.localeCompare(b.id));
}

export function searchLessons(data: Pick<Bootstrap, 'chapters' | 'lessons'>, query: string, chapterId?: string) {
  const term = query.trim().toLocaleLowerCase();
  return orderedLessons(data, chapterId).filter(lesson => `${lesson.title} ${lesson.summary} ${data.chapters.find(chapter => chapter.id === lesson.chapter_id)?.title ?? ''}`.toLocaleLowerCase().includes(term));
}
