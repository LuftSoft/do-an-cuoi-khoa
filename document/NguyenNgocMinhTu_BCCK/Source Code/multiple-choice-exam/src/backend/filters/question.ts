import type { DeepPartial } from 'typeorm';

import type { QuestionEntity } from 'backend/entities/question.entity';

type FilterFunction = (
  query: Record<string, any>,
  lecturerId: string,
) => DeepPartial<QuestionEntity>;

const filters: FilterFunction[] = [
  (query, lecturerId) =>
    query.showOnlyMine === 'true' ? { lecturer: { id: lecturerId } } : {},
  (query) => (query.showInactive === 'true' ? {} : { active: true }),
];

export const getQuestionElementFilter = (
  query: Record<string, any>,
  lecturerId: string,
) => {
  return filters
    .map((filter) => filter(query, lecturerId))
    .reduce((acc, filter) => ({ ...acc, ...filter }), {});
};
