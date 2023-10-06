import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

export type GetActivationLabel = (input: {
  active: boolean;
  canDelete: boolean;
}) => {
  activationLabel: string;
  icon: JSX.Element | undefined;
};

export const getActivationLabel: GetActivationLabel = ({
  active,
  canDelete,
}) => {
  let activationLabel = '';
  let icon: JSX.Element | undefined = undefined;
  if (canDelete && active) {
    activationLabel = 'Xoá';
    icon = <DeleteForeverRoundedIcon />;
  } else if (!canDelete && active) {
    activationLabel = 'Vô hiệu hoá';
    icon = <DeleteForeverRoundedIcon />;
  } else if (!active) {
    activationLabel = 'Kích hoạt';
    icon = <ToggleOnIcon />;
  }

  return {
    activationLabel,
    icon,
  };
};
