import type {
  NewSubjectDto,
  UpdateSubjectWithIdDto,
} from 'backend/dtos/subject.dto';
import type { JSSuccess } from 'backend/types/jsend';
import { SUBJECT_LIMIT } from 'constants/pagination.constant';
import { API_SUBJECTS_ROUTE } from 'constants/routes.constant';
import type { SubjectDropdownModel, SubjectModel } from 'models/subject.model';
import myAxios from 'myAxios';
import type { DialogActionMode } from 'types/common';
import type { PaginatedResponse } from 'types/pagination';
import { getPaginationHeader } from 'utils/pagination.helper';

const BASE_URL = API_SUBJECTS_ROUTE;

export type FetchSubjectOtherArgs = {
  showInactive?: true;
};

export type SubjectDataWithMode = {
  data: UpdateSubjectWithIdDto | NewSubjectDto;
  mode: Omit<DialogActionMode, 'view'>;
};

export const fetchSubjects = async (
  page: number,
  otherArgs: FetchSubjectOtherArgs,
): Promise<PaginatedResponse<SubjectModel[]>> => {
  const response = await myAxios.get<JSSuccess<SubjectModel[]>>(BASE_URL, {
    params: {
      page,
      limit: SUBJECT_LIMIT,
      ...otherArgs,
    },
  });

  return {
    data: response.data.data,
    metadata: getPaginationHeader(response),
  };
};

export const fetchSubjectsByName = async (
  nameKeyword: string,
  otherArgs: FetchSubjectOtherArgs,
): Promise<SubjectModel[]> => {
  const response = await myAxios.get<JSSuccess<SubjectModel[]>>(BASE_URL, {
    params: {
      keyword: nameKeyword,
      limit: SUBJECT_LIMIT,
      ...otherArgs,
    },
  });

  return response.data.data;
};

export const fetchSubjectDropdowns = async (): Promise<
  SubjectDropdownModel[]
> => {
  const response = await myAxios.get<JSSuccess<SubjectDropdownModel[]>>(
    `${BASE_URL}/dropdowns`,
  );

  return response.data.data;
};

export const createSubject = async (
  subjectInputs: NewSubjectDto,
): Promise<SubjectModel> => {
  const response = await myAxios.post<JSSuccess<SubjectModel>>(
    BASE_URL,
    subjectInputs,
  );
  const createdSubject = response.data.data;
  return createdSubject;
};

export const updateSubject = async (
  subjectInputs: UpdateSubjectWithIdDto,
): Promise<SubjectModel> => {
  const { id, ...inputs } = subjectInputs;
  const response = await myAxios.put<JSSuccess<SubjectModel>>(
    `${BASE_URL}/${id}`,
    inputs,
  );
  const createdSubject = response.data.data;
  return createdSubject;
};

export const deleteSubject = async (subjectId: string): Promise<number> => {
  const response = await myAxios.delete<JSSuccess<SubjectModel>>(
    `${BASE_URL}/${subjectId}`,
  );
  const statusCode = response.status;
  return statusCode;
};

export const createOrUpdateSubject = async (
  input: SubjectDataWithMode,
): Promise<SubjectModel> => {
  const { mode, data } = input;
  if (mode === 'add') return createSubject(data as NewSubjectDto);
  if (mode === 'edit') return updateSubject(data as UpdateSubjectWithIdDto);
  throw new Error('invalid mode');
};
