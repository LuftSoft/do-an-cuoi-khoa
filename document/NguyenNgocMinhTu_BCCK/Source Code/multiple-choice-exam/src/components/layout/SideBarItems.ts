import type { SvgIconProps } from '@mui/material';

import DuoToneIcons from 'components/icons';

export type SideBarItem = {
  type: 'navigator' | 'logout' | 'header';
  label?: string;
  icon?: (props: SvgIconProps) => JSX.Element;
  path?: string;
};

export const SIDE_BAR_ITEMS: SideBarItem[] = [
  // { type: 'header', label: 'Quản lý' },
  {
    type: 'navigator',
    label: 'Môn học',
    icon: DuoToneIcons.Pages,
    path: '/subjects',
  },
  {
    type: 'navigator',
    label: 'Câu hỏi',
    icon: DuoToneIcons.TableList,
    path: '/questions',
  },
  {
    type: 'navigator',
    label: 'Lịch thi',
    icon: DuoToneIcons.Calender,
    path: '/tests',
  },
  // {
  //   type: 'logout',
  //   path: '/logout',
  //   label: 'Đăng xuất',
  //   icon: DuoToneIcons.Session,
  // },
];
