import { type FC } from 'react';

import QuestionForm from './QuestionForm';

import DefaultDialog from 'components/common/dialogs/DefaultDialog';
import { useSetRowDialogTitle } from 'hooks/useSetRowDialogTitle';
import type { FullyPopulatedQuestionModel } from 'models/question.model';
import type {
  DialogActionMode,
  HandleCloseDialog,
  SetModeEnhanced,
} from 'types/common';

type QuestionRowDialogProps = {
  handleClose: HandleCloseDialog;
  mode: DialogActionMode;
  setMode: SetModeEnhanced;
  openDialog: boolean;
  question?: FullyPopulatedQuestionModel;
};
const QuestionRowDialog: FC<QuestionRowDialogProps> = ({
  handleClose,
  mode,
  question,
  setMode,
  openDialog,
}) => {
  const title = useSetRowDialogTitle(mode, 'câu hỏi');

  return (
    <DefaultDialog
      maxWidth='md'
      open={openDialog && mode !== undefined}
      handleClose={handleClose}
      content={
        <QuestionForm mode={mode} question={question} setMode={setMode} />
      }
      title={title}
    />
  );
};

export default QuestionRowDialog;
