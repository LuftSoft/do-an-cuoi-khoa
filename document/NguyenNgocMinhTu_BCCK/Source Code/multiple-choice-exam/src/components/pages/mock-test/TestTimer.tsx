import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import type { FC } from 'react';

import { H2 } from 'components/abstract/Typography';

type TestTimerProps = {
  durationInMinutes: number;
  handleTimeOut: () => void;
  shouldResetTimer: boolean;
  shouldPauseTimer: boolean;
};

const TestTimer: FC<TestTimerProps> = ({
  durationInMinutes,
  handleTimeOut,
  shouldResetTimer,
  shouldPauseTimer,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(durationInMinutes * 60);

  useEffect(() => {
    if (shouldResetTimer) {
      setTimeRemaining(durationInMinutes * 60);
    }
  }, [durationInMinutes, shouldResetTimer]);

  useEffect(() => {
    // Pause the timer if shouldPauseTimer is true
    if (shouldPauseTimer) return;

    const timerId = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          handleTimeOut();
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clear the timer if component is unmounted or shouldPauseTimer changes
    return () => clearInterval(timerId);
  }, [handleTimeOut, shouldPauseTimer]);

  const minutes = Math.floor(timeRemaining / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timeRemaining % 60).toString().padStart(2, '0');

  return (
    <Card
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        py: 0.5,
        borderRadius: 0,
      }}
    >
      <AccessTimeRoundedIcon fontSize='medium' />
      <H2 fontWeight={500}>{`${minutes}:${seconds}`}</H2>
    </Card>
  );
};

export default TestTimer;
