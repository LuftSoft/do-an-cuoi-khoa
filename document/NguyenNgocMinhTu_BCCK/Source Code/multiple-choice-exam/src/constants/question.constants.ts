import { z } from 'zod';

import { Difficulty } from 'backend/enums/question.enum';

export type DifficultyLabel = 'Dễ' | 'Trung bình' | 'Khó';

export const DifficultyOptionSchema = z.object({
  label: z.enum(['Dễ', 'Trung bình', 'Khó']),
  value: z.nativeEnum(Difficulty),
});

export type DifficultyOption = {
  label: DifficultyLabel;
  value: Difficulty;
};

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    label: 'Dễ',
    value: Difficulty.EASY,
  },
  {
    label: 'Trung bình',
    value: Difficulty.NORMAL,
  },
  {
    label: 'Khó',
    value: Difficulty.HARD,
  },
];
