import { type FC } from 'react';

import SubjectForm from './SubjectForm';

import DefaultDialog from 'components/common/dialogs/DefaultDialog';
import { useSetRowDialogTitle } from 'hooks/useSetRowDialogTitle';
import type { SubjectModel } from 'models/subject.model';
import type {
  DialogActionMode,
  HandleCloseDialog,
  SetModeEnhanced,
} from 'types/common';

type SubjectRowDialogProps = {
  handleClose: HandleCloseDialog;
  mode: DialogActionMode;
  setMode: SetModeEnhanced;
  infoDialogVisible: boolean;
  subject?: SubjectModel;
};
const SubjectRowDialog: FC<SubjectRowDialogProps> = ({
  handleClose,
  mode,
  subject,
  setMode,
  infoDialogVisible,
}) => {
  const title = useSetRowDialogTitle(mode, 'môn học');

  return (
    <DefaultDialog
      open={infoDialogVisible && mode !== undefined}
      handleClose={handleClose}
      content={<SubjectForm mode={mode} subject={subject} setMode={setMode} />}
      title={title}
    />
  );
};

export default SubjectRowDialog;
