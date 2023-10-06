import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Card,
  FormControlLabel,
  Radio,
  RadioGroup,
  lighten,
  useTheme,
} from '@mui/material';
import { useState, type FC, useMemo, useEffect } from 'react';

import { Option } from 'backend/enums/question.enum';
import { Paragraph, Span } from 'components/abstract/Typography';
import HTMLInjection from 'components/common/HTMLInjection';
import MuiImage from 'components/image/MuiImage';
import FlexBetween from 'components/utils-layout/flex-box/FlexBetween';
import FlexBox from 'components/utils-layout/flex-box/FlexBox';
import type { TestQuestionForExamModel } from 'models/testQuestion.model';
import { shuffleArray } from 'utils/array.helper';

type OptionElement = {
  value: Option;
  label: string;
};

type AnswerInputProps = {
  question: TestQuestionForExamModel;
  chooseAnswer: (order: number, answer: Option) => void;
  isTimeOut: boolean;
  correctOption: Option | undefined;
  shouldResetInput: boolean;
};

const AnswerInput: FC<AnswerInputProps> = ({
  question,
  chooseAnswer,
  isTimeOut,
  correctOption,
  shouldResetInput,
}) => {
  const [currentAnswer, setCurrentAnswer] = useState<Option | undefined>();
  const { palette } = useTheme();

  useEffect(() => {
    if (shouldResetInput) {
      setCurrentAnswer(undefined);
    }
  }, [shouldResetInput]);

  const optionElements = useMemo(
    (): OptionElement[] =>
      shuffleArray([
        { value: Option.A, label: question.optionA },
        { value: Option.B, label: question.optionB },
        { value: Option.C, label: question.optionC },
        { value: Option.D, label: question.optionD },
      ]),
    [question],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedAnswer = (event.target as HTMLInputElement).value as Option;
    setCurrentAnswer(selectedAnswer);
    chooseAnswer(question.order, selectedAnswer);
  };
  return (
    <FlexBox flexDirection='column' gap={1} id={`question-${question.order}`}>
      <Paragraph fontWeight={500}>{`Câu ${question.order}`}</Paragraph>
      <Card
        elevation={1}
        sx={{
          p: 3,
        }}
      >
        <Paragraph fontSize={16}>
          <HTMLInjection htmlText={question.content} />
        </Paragraph>
        <MuiImage
          src={question.imageUrl || ''}
          sx={{
            maxHeight: '300px',
            maxWidth: '600px',
            mb: 1,
          }}
        />
        <RadioGroup
          key={shouldResetInput ? 'reset' : 'not-reset'}
          value={currentAnswer}
          onChange={handleChange}
          sx={{
            gap: 1,
          }}
        >
          {optionElements.map((element, index) => {
            const chooseThisOption = currentAnswer === element.value;
            const chooseWrong =
              chooseThisOption && currentAnswer !== correctOption;
            const isThisOptionCorrect = element.value === correctOption;

            const getColor = (): string | undefined => {
              if (!isTimeOut) return undefined;
              if (isThisOptionCorrect) return palette.success.main;
              if (chooseWrong) return palette.error.main;
            };

            const color = getColor();
            const backgroundLabelColor =
              color !== undefined ? lighten(color, 0.8) : undefined;

            const shouldRetainColor =
              isTimeOut && (chooseThisOption || isThisOptionCorrect);

            const getLabelAdornment = (color: string | undefined) => {
              if (color === undefined) return undefined;

              if (color === palette.success.main) {
                return (
                  <Span color={color}>
                    <CheckRoundedIcon color='inherit' />
                  </Span>
                );
              }

              if (color === palette.error.main) {
                return (
                  <Span color={color}>
                    <CloseRoundedIcon color='inherit' />
                  </Span>
                );
              }
            };

            return (
              <FormControlLabel
                disabled={isTimeOut}
                key={index}
                value={element.value}
                control={<Radio />}
                label={
                  <FlexBetween pr={1}>
                    <Paragraph>{element.label}</Paragraph>
                    {getLabelAdornment(color)}
                  </FlexBetween>
                }
                sx={{
                  backgroundColor: backgroundLabelColor,
                  borderRadius: '8px',
                  '& .MuiFormControlLabel-label': {
                    width: '100%',
                  },
                  '& .MuiRadio-root, & .MuiFormControlLabel-label': {
                    color: shouldRetainColor
                      ? `${palette.grey[700]} !important`
                      : undefined,
                  },
                }}
              />
            );
          })}
        </RadioGroup>
      </Card>
    </FlexBox>
  );
};

export default AnswerInput;
