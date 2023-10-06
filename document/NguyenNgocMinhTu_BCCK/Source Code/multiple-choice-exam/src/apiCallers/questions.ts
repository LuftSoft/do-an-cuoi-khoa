import type {
  NewQuestionDto,
  UpdateQuestionWithIdDto,
} from 'backend/dtos/question.dto';
import type { JSSuccess } from 'backend/types/jsend';
import { QUESTION_LIMIT } from 'constants/pagination.constant';
import { API_QUESTIONS_ROUTE } from 'constants/routes.constant';
import type { FullyPopulatedQuestionModel } from 'models/question.model';
import myAxios from 'myAxios';
import type { DialogActionMode } from 'types/common';
import type { PaginatedResponse } from 'types/pagination';
import { getPaginationHeader } from 'utils/pagination.helper';

const BASE_URL = API_QUESTIONS_ROUTE;

export type QuestionDataWithMode = {
  data: UpdateQuestionWithIdDto | NewQuestionDto;
  mode: Omit<DialogActionMode, 'view'>;
};

export type FetchQuestionOtherArgs = {
  subjectIds: string[];
  onlyShowMine?: true;
  showInactive?: true;
};

export const fetchQuestions = async (
  page: number,
  otherArgs: FetchQuestionOtherArgs,
): Promise<PaginatedResponse<FullyPopulatedQuestionModel[]>> => {
  const response = await myAxios.get<JSSuccess<FullyPopulatedQuestionModel[]>>(
    BASE_URL,
    {
      params: {
        page,
        limit: QUESTION_LIMIT,
        ...otherArgs,
      },
    },
  );

  return {
    data: response.data.data,
    metadata: getPaginationHeader(response),
  };
};

export const deleteQuestion = async (questionId: string): Promise<number> => {
  const response = await myAxios.delete<JSSuccess<FullyPopulatedQuestionModel>>(
    `${BASE_URL}/${questionId}`,
  );
  const statusCode = response.status;
  return statusCode;
};

export const fetchQuestionsByContent = async (
  contentKeyword: string,
  otherArgs: FetchQuestionOtherArgs,
): Promise<FullyPopulatedQuestionModel[]> => {
  const response = await myAxios.get<JSSuccess<FullyPopulatedQuestionModel[]>>(
    BASE_URL,
    {
      params: {
        keyword: contentKeyword,
        limit: QUESTION_LIMIT,
        ...otherArgs,
      },
    },
  );

  return response.data.data;
};

export const createQuestion = async (
  questionInputs: NewQuestionDto,
): Promise<FullyPopulatedQuestionModel> => {
  const response = await myAxios.post<JSSuccess<FullyPopulatedQuestionModel>>(
    BASE_URL,
    questionInputs,
  );
  const createdQuestion = response.data.data;
  return createdQuestion;
};

export const updateQuestion = async (
  questionInputs: UpdateQuestionWithIdDto,
): Promise<FullyPopulatedQuestionModel> => {
  const { id, ...inputs } = questionInputs;
  const response = await myAxios.put<JSSuccess<FullyPopulatedQuestionModel>>(
    `${BASE_URL}/${id}`,
    inputs,
  );
  const createdQuestion = response.data.data;
  return createdQuestion;
};

export const createOrUpdateQuestion = async (
  input: QuestionDataWithMode,
): Promise<FullyPopulatedQuestionModel> => {
  const { mode, data } = input;
  if (mode === 'add') return createQuestion(data as NewQuestionDto);
  if (mode === 'edit') return updateQuestion(data as UpdateQuestionWithIdDto);
  throw new Error('invalid mode');
};
