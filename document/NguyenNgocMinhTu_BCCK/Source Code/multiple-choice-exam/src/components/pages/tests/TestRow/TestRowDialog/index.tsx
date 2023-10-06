import { type FC } from 'react';

import TestForm from './TestForm';

import DefaultDialog from 'components/common/dialogs/DefaultDialog';
import { useSetRowDialogTitle } from 'hooks/useSetRowDialogTitle';
import type { TestWithLecturerAndSubjectModel } from 'models/test.model';
import type {
  DialogActionMode,
  HandleCloseDialog,
  SetModeEnhanced,
} from 'types/common';

type TestRowDialogProps = {
  handleClose: HandleCloseDialog;
  mode: DialogActionMode;
  setMode: SetModeEnhanced;
  openDialog: boolean;
  test?: TestWithLecturerAndSubjectModel;
  invokeComposeTestQuestions: (testId: string) => void;
  isComposingTestQuestions: boolean;
};
const TestRowDialog: FC<TestRowDialogProps> = ({
  handleClose,
  mode,
  test,
  setMode,
  openDialog,
  invokeComposeTestQuestions,
  isComposingTestQuestions,
}) => {
  const title = useSetRowDialogTitle(mode, 'lịch thi');

  return (
    <DefaultDialog
      maxWidth='sm'
      open={openDialog && mode !== undefined}
      handleClose={handleClose}
      content={
        <TestForm
          mode={mode}
          test={test}
          setMode={setMode}
          invokeComposeTestQuestions={invokeComposeTestQuestions}
          isComposingTestQuestions={isComposingTestQuestions}
        />
      }
      title={title}
    />
  );
};

export default TestRowDialog;
