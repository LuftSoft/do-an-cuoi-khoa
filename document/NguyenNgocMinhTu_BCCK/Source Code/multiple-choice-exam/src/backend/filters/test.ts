import type { DeepPartial } from 'typeorm';

import type { TestEntity } from 'backend/entities/test.entity';

type FilterFunction = (
  query: Record<string, any>,
  lecturerId: string,
) => DeepPartial<TestEntity>;

const filters: FilterFunction[] = [
  (query, lecturerId) =>
    query.showOnlyMine === 'true' ? { lecturer: { id: lecturerId } } : {},
];

export const getTestElementFilter = (
  query: Record<string, any>,
  lecturerId: string,
) => {
  return filters
    .map((filter) => filter(query, lecturerId))
    .reduce((acc, filter) => ({ ...acc, ...filter }), {});
};
