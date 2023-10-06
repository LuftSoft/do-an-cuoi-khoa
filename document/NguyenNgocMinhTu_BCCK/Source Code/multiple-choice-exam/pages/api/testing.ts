import fs from 'fs';
import path from 'path';

import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { AccountEntity } from 'backend/entities/account.entity';
import { LecturerEntity } from 'backend/entities/lecturer.entity';
import { QuestionEntity } from 'backend/entities/question.entity';
import { SubjectEntity } from 'backend/entities/subject.entity';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { hashPassword } from 'backend/utils/auth.helper';
import { getRepo } from 'backend/utils/database.helper';

const handler = nc<NextApiRequest, NextApiResponse>(DEFAULT_NC_CONFIGS);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function registerAccount() {
  const accountRepo = await getRepo(AccountEntity);
  const lecturerRepo = await getRepo(LecturerEntity);

  const lecturer = lecturerRepo.create({
    id: 'adbd619c-4a44-452f-a8c0-266733e89db0',
    degree: 'Tiến sĩ',
  });

  await lecturerRepo.save(lecturer);

  const account = accountRepo.create({
    email: 'minhtu1392000@gmail.com',
    firstName: 'An',
    lastName: 'Nguyễn Văn',
    password: hashPassword('admin@1234'),
    phone: '0338758008',
    lecturer,
  });

  await accountRepo.save(account);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function insertSubjectsFromFile() {
  const subjectRepository = await getRepo(SubjectEntity);

  const rawData = fs.readFileSync(
    path.resolve(
      __dirname,
      'D:/Study/Internship/Repository/multiple-choice-exam/src/mockData/subjects.json',
    ),
  );
  const subjects = JSON.parse(rawData.toString());

  for (const subject of subjects) {
    const newSubject = subjectRepository.create({
      id: subject.id,
      name: subject.name,
      description: subject.description,
    });
    await subjectRepository.save(newSubject);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function insertQuestionsFromFile() {
  const questionRepository = await getRepo(QuestionEntity);

  // Read the JSON file
  const rawData = fs.readFileSync(
    path.resolve(
      __dirname,
      'D:/Study/Internship/Repository/multiple-choice-exam/src/mockData/questions.json',
    ),
  );
  const questions = JSON.parse(rawData.toString());

  for (const question of questions) {
    const newQuestion = questionRepository.create({
      id: question.id,
      content: question.content,
      optionA: question.option_a,
      optionB: question.option_b,
      optionC: question.option_c,
      optionD: question.option_d,
      correctOption: question.correct_option,
      difficulty: question.difficulty,
      subject: { id: question.subject_id },
      lecturer: { id: question.lecturer_id },
    });

    await questionRepository.save(newQuestion);
  }
}

handler.post(async (req, res) => {
  await registerAccount();
  await insertSubjectsFromFile();
  await insertQuestionsFromFile();

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      test: 'asd',
    },
  });
});

export default handler;
