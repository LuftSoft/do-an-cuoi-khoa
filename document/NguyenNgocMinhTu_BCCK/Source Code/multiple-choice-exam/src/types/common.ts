import type { NextPage } from 'next';
import type { ReactNode } from 'react';

import type { Option } from 'backend/enums/question.enum';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export type Id = {
  id: string;
};

export type GeneralFunction = (...args: any) => any;

export type HandleCloseDialog = (
  event: any,
  reason: 'backdropClick' | 'escapeKeyDown',
) => void;

export type DialogActionMode = 'add' | 'edit' | 'view';
export type ProfileActionMode = 'edit' | 'view';
export type SetModeEnhanced = (mode: DialogActionMode | 'hide') => void;

export type ApiReturnData<T extends GeneralFunction> = Awaited<ReturnType<T>>;

export type ExamResult = {
  totalCorrectAnswer: number;
  grade: number;
  correctOptions: Option[];
};
