import { Chip } from '@mui/material';
import type { FC } from 'react';

import { Difficulty } from 'backend/enums/question.enum';
import type { DifficultyLabel } from 'constants/question.constants';

type DifficultyChipProps = {
  difficulty: Difficulty;
};

const DifficultyChip: FC<DifficultyChipProps> = ({ difficulty }) => {
  let color: 'success' | 'warning' | 'error';
  let label: DifficultyLabel;
  switch (difficulty) {
    case Difficulty.EASY:
      label = 'Dễ';
      color = 'success';
      break;

    case Difficulty.NORMAL:
      label = 'Trung bình';
      color = 'warning';
      break;

    default:
      label = 'Khó';
      color = 'error';
      break;
  }

  return (
    <Chip
      color={color}
      label={label}
      sx={{
        fontWeight: 500,
        width: '95px',
      }}
    />
  );
};

export default DifficultyChip;
