import type { NewTestDto, UpdateTestWithIdDto } from 'backend/dtos/test.dto';
import type { Option } from 'backend/enums/question.enum';
import type { JSSuccess } from 'backend/types/jsend';
import { TEST_LIMIT } from 'constants/pagination.constant';
import { API_TESTS_ROUTE } from 'constants/routes.constant';
import type {
  TestWithLecturerAndSubjectModel,
  TestModel,
} from 'models/test.model';
import myAxios from 'myAxios';
import type { DialogActionMode, ExamResult } from 'types/common';
import type { PaginatedResponse } from 'types/pagination';
import { getPaginationHeader } from 'utils/pagination.helper';

const BASE_URL = API_TESTS_ROUTE;

export type FetchTestOtherArgs = {
  subjectIds: string[];
  onlyShowMine?: true;
  showInactive?: true;
};

export type TestDataWithMode = {
  data: UpdateTestWithIdDto | NewTestDto;
  mode: Omit<DialogActionMode, 'view'>;
};

export const fetchTests = async (
  page: number,
  otherArgs?: FetchTestOtherArgs,
): Promise<PaginatedResponse<TestWithLecturerAndSubjectModel[]>> => {
  const response = await myAxios.get<
    JSSuccess<TestWithLecturerAndSubjectModel[]>
  >(BASE_URL, {
    params: {
      page,
      limit: TEST_LIMIT,
      ...otherArgs,
    },
  });

  return {
    data: response.data.data,
    metadata: getPaginationHeader(response),
  };
};

export const deleteTest = async (testId: string): Promise<number> => {
  const response = await myAxios.delete<
    JSSuccess<TestWithLecturerAndSubjectModel>
  >(`${BASE_URL}/${testId}`);
  const statusCode = response.status;
  return statusCode;
};

export const fetchTestsByTitle = async (
  titleKeyword: string,
  otherArgs?: FetchTestOtherArgs,
): Promise<TestWithLecturerAndSubjectModel[]> => {
  const response = await myAxios.get<
    JSSuccess<TestWithLecturerAndSubjectModel[]>
  >(BASE_URL, {
    params: {
      keyword: titleKeyword,
      limit: TEST_LIMIT,
      ...otherArgs,
    },
  });

  return response.data.data;
};

export const createTest = async (
  testInputs: NewTestDto,
): Promise<TestModel> => {
  const response = await myAxios.post<JSSuccess<TestModel>>(
    BASE_URL,
    testInputs,
  );
  const createdTest = response.data.data;
  return createdTest;
};

export const updateTest = async (
  testInputs: UpdateTestWithIdDto,
): Promise<TestModel> => {
  const { id, ...inputs } = testInputs;
  const response = await myAxios.put<JSSuccess<TestModel>>(
    `${BASE_URL}/${id}`,
    inputs,
  );
  const createdTest = response.data.data;
  return createdTest;
};

export const createOrUpdateTest = async (
  input: TestDataWithMode,
): Promise<TestModel> => {
  const { mode, data } = input;
  if (mode === 'add') return createTest(data as NewTestDto);
  if (mode === 'edit') return updateTest(data as UpdateTestWithIdDto);
  throw new Error('invalid mode');
};

export const composeTestQuestions = async (
  testId: string,
): Promise<JSSuccess<undefined>> => {
  const response = await myAxios.put<JSSuccess<undefined>>(
    `${BASE_URL}/${testId}/compose`,
  );
  return response.data;
};

export const fetchSingleTest = async (
  testId: string,
): Promise<TestWithLecturerAndSubjectModel> => {
  const response = await myAxios.get<
    JSSuccess<TestWithLecturerAndSubjectModel>
  >(`${BASE_URL}/${testId}`);
  const test = response.data.data;
  return test;
};

export const gradeMockTest = async (
  testId: string,
  answers: (Option | undefined)[],
): Promise<ExamResult> => {
  const response = await myAxios.post<JSSuccess<ExamResult>>(
    `${BASE_URL}/${testId}/grade`,
    {
      answers,
    },
  );
  const examResult = response.data.data;
  return examResult;
};
