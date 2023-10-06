import { LoadingButton } from '@mui/lab';
import { Card, Divider, Grid, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';
import { useState, type ReactElement, useEffect, useCallback } from 'react';
import { validate as uuidValidate } from 'uuid';

import { gradeMockTest } from 'apiCallers/tests';
import type { Option } from 'backend/enums/question.enum';
import { TestService } from 'backend/services/test.service';
import SEO from 'components/abstract/SEO';
import { Paragraph, Span } from 'components/abstract/Typography';
import ConfirmDialog from 'components/common/dialogs/ConfirmDialog';
import DefaultDialog from 'components/common/dialogs/DefaultDialog';
import PageLayout from 'components/layout';
import AnswerInput from 'components/pages/mock-test/AnswerInput';
import MockTestTag from 'components/pages/mock-test/MockTestTag';
import ProgressSummaryPanel from 'components/pages/mock-test/ProgressSummaryPanel';
import TestTimer from 'components/pages/mock-test/TestTimer';
import FlexBox from 'components/utils-layout/flex-box/FlexBox';
import FlexRowCenter from 'components/utils-layout/flex-box/FlexRowCenter';
import { useIsClient } from 'hooks/useIsClient';
import type { TestForExamModel } from 'models/test.model';
import type { ExamResult, NextPageWithLayout } from 'types/common';
import { getDefaultOnApiError } from 'utils/error.helper';
import { serialize } from 'utils/string.helper';

type TestPageProps = { test: TestForExamModel };
const TestsPage: NextPageWithLayout<TestPageProps> = ({ test }) => {
  const isClient = useIsClient();
  const theme = useTheme();
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [resultDialogVisible, setResultDialogVisible] = useState(false);

  const [isTimeOut, setIsTimeOut] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);
  const [shouldPauseTimer, setShouldPauseTimer] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult>();
  const [missingAnswers, setMissingAnswers] = useState<number[]>([]);
  const [answers, setAnswers] = useState<(Option | undefined)[]>(
    new Array(test.testQuestions.length).fill(undefined),
  );

  const resetStates = () => {
    setAnswers(new Array(test.testQuestions.length).fill(undefined));
    setMissingAnswers([]);
    setExamResult(undefined);
    setIsTimeOut(false);
  };

  const { mutate: invokeGradeMockTest, isLoading: isGradingMockTest } =
    useMutation<ExamResult, unknown, (Option | undefined)[]>({
      mutationFn: (answers) => gradeMockTest(test.id, answers),
      onSuccess: (examResultResponse) => {
        setExamResult(examResultResponse);
        setResultDialogVisible(true);
        setIsTimeOut(true);
      },
      onError: getDefaultOnApiError({
        operationName: 'chấm điểm',
      }),
    });

  const handleSubmissionButtonClicked = () => {
    if (isTimeOut) {
      setShouldReset(true);
      setShouldPauseTimer(false);
      resetStates();
      return;
    }

    const currentMissingAnswers = answers
      .map((answer, index) => (answer === undefined ? index + 1 : null))
      .filter(Boolean) as number[];

    setMissingAnswers(currentMissingAnswers);
    setConfirmDialogVisible(true);
  };

  const handleSubmittingAnswers = useCallback(() => {
    setShouldReset(false);
    setShouldPauseTimer(true);
    invokeGradeMockTest(answers);
    setConfirmDialogVisible(false);
  }, [answers, invokeGradeMockTest]);

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  const chooseAnswer = (order: number, answer: Option) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((userAnswer, index) =>
        order === index + 1 ? answer : userAnswer,
      ),
    );
  };

  const confirmDialogMessage =
    missingAnswers.length === 0 ? (
      <Paragraph>Bạn vẫn còn thời gian, xác nhận nộp bài sớm?</Paragraph>
    ) : (
      <Paragraph>
        Bạn vẫn còn câu{' '}
        <Span fontWeight={500} color={theme.palette.primary.main}>
          {missingAnswers.join(', ')}
        </Span>{' '}
        chưa chọn đáp án, xác nhận nộp bài sớm?
      </Paragraph>
    );

  return (
    <>
      <SEO title='Môn học' />
      <Box py={4}>
        <Grid
          container
          spacing={6}
          sx={{
            position: 'relative',
            alignItems: 'start',
          }}
        >
          <Grid item xs={9}>
            <FlexBox flexDirection='column' gap={6}>
              {isClient &&
                test.testQuestions.map((question) => (
                  <AnswerInput
                    shouldResetInput={shouldReset}
                    key={question.id}
                    question={question}
                    chooseAnswer={chooseAnswer}
                    isTimeOut={isTimeOut}
                    correctOption={
                      examResult?.correctOptions[question.order - 1]
                    }
                  />
                ))}
            </FlexBox>
          </Grid>

          <Grid
            item
            xs={3}
            sx={{
              position: 'sticky',
              top: 0,
            }}
          >
            <LoadingButton
              loading={isGradingMockTest}
              color='primary'
              loadingPosition='center'
              variant='contained'
              fullWidth
              sx={{
                mb: 2,
                boxShadow: 3,
              }}
              onClick={handleSubmissionButtonClicked}
            >
              {isTimeOut ? 'Thử lại' : 'Nộp bài'}
            </LoadingButton>
            <Card
              elevation={3}
              sx={{
                maxHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <TestTimer
                // durationInMinutes={0.1}
                durationInMinutes={test.durationMinutes}
                shouldResetTimer={shouldReset}
                shouldPauseTimer={shouldPauseTimer}
                handleTimeOut={handleSubmittingAnswers}
              />
              <Divider />

              <ProgressSummaryPanel
                userAnswers={answers}
                correctOptions={examResult?.correctOptions}
                isTimeOut={isTimeOut}
              />
            </Card>

            <FlexRowCenter mt={2}>
              <MockTestTag />
            </FlexRowCenter>
          </Grid>
        </Grid>
      </Box>
      <ConfirmDialog
        color='info'
        open={confirmDialogVisible}
        handleClose={() => setConfirmDialogVisible(false)}
        handleConfirm={handleSubmittingAnswers}
        title='Xác nhận'
        content={confirmDialogMessage}
      />
      <DefaultDialog
        title='Kết quả'
        content={
          <>
            <Paragraph>
              Bài thi kết thúc, sau đây là kết quả bài làm của bạn.
            </Paragraph>
            <Paragraph ml={2}>
              {'- Số câu đúng: '}
              <Span
                fontWeight={500}
                color={theme.palette.primary.main}
              >{`${examResult?.totalCorrectAnswer}/${test.testQuestions.length}`}</Span>
            </Paragraph>
            <Paragraph ml={2}>
              {'- Tổng điểm: '}
              <Span fontWeight={500} color={theme.palette.primary.main}>
                {examResult?.grade}
              </Span>
            </Paragraph>
          </>
        }
        open={resultDialogVisible}
        action={{
          confirmText: 'Xác nhận',
          handleConfirm: () => setResultDialogVisible(false),
        }}
        handleClose={() => setResultDialogVisible(false)}
      />
    </>
  );
};

TestsPage.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export const getServerSideProps: GetServerSideProps<TestPageProps> = async (
  context,
) => {
  try {
    const testId = context.query.id as string;

    const isIdValid = uuidValidate(testId);
    if (!isIdValid)
      return {
        notFound: true,
      };

    const canPerformMockTest = await TestService.getCanPerformMockTest(testId);

    if (canPerformMockTest) {
      const fullyPopulatedTest = await TestService.getTestForExam(testId);
      return {
        props: {
          test: serialize(fullyPopulatedTest),
        },
      };
    }

    return {
      notFound: true,
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default TestsPage;
