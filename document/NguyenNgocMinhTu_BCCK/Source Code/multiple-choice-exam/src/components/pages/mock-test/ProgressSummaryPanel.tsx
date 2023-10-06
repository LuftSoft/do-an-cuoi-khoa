import { Button, lighten, useTheme } from '@mui/material';
import type { FC } from 'react';

import type { Option } from 'backend/enums/question.enum';
import { Paragraph } from 'components/abstract/Typography';
import FlexBox from 'components/utils-layout/flex-box/FlexBox';
type ProgressSummaryPanelProps = {
  userAnswers: (Option | undefined)[];
  isTimeOut: boolean;
  correctOptions: Option[] | undefined;
};

const ProgressSummaryPanel: FC<ProgressSummaryPanelProps> = ({
  userAnswers,
  isTimeOut,
  correctOptions,
}) => {
  const { palette } = useTheme();
  const getBackgroundColor = (
    answer: Option | undefined,
    correctOption: Option | undefined,
  ) => {
    if (!isTimeOut) {
      if (answer === undefined) return palette.grey[600];
      return palette.primary.main;
    }

    const isTheAnswerCorrect = answer === correctOption;

    if (isTheAnswerCorrect) return palette.success.main;
    return palette.error.main;
  };
  return (
    <FlexBox
      flexWrap='wrap'
      gap={1.5}
      width='100%'
      flexGrow={1}
      justifyContent='center'
      alignItems='center'
      px={1.5}
      py={1.5}
      sx={{
        overflowY: 'auto',
      }}
    >
      {userAnswers.map((answer, index) => {
        return (
          <Button
            onClick={(event) => {
              event.preventDefault();
              const target = document.querySelector(`#question-${index + 1}`);
              target?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
            key={index}
            color='primary'
            variant='contained'
            sx={{
              backgroundColor: getBackgroundColor(
                answer,
                correctOptions?.[index],
              ),
              '&:hover': {
                backgroundColor: lighten(
                  getBackgroundColor(answer, correctOptions?.[index]),
                  0.1,
                ),
              },
              width: '40px',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '10px',
            }}
          >
            <Paragraph color='white'>{index + 1}</Paragraph>
          </Button>
        );
      })}
    </FlexBox>
  );
};

export default ProgressSummaryPanel;
