import type { Relation } from 'typeorm';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { LecturerEntity } from './lecturer.entity';
import { SubjectEntity } from './subject.entity';
import { TestQuestionEntity } from './testQuestion.entity';

import type { Option } from 'backend/enums/question.enum';
import { Difficulty } from 'backend/enums/question.enum';
import {
  OptionTransformer,
  StringEncryptionTransformer,
} from 'backend/transformers/question.transformer';

@Entity({ name: 'question' })
export class QuestionEntity extends AbstractEntity {
  @Column({
    transformer: new StringEncryptionTransformer(),
  })
  content: string;

  @Column({
    transformer: new StringEncryptionTransformer(),
  })
  optionA: string;

  @Column({
    transformer: new StringEncryptionTransformer(),
  })
  optionB: string;

  @Column({
    transformer: new StringEncryptionTransformer(),
  })
  optionC: string;

  @Column({
    transformer: new StringEncryptionTransformer(),
  })
  optionD: string;

  @Column({
    nullable: true,
    transformer: new StringEncryptionTransformer(),
  })
  imageUrl: string;

  @Column({ type: 'varchar', transformer: new OptionTransformer() })
  correctOption: Option;

  @Column({
    type: 'enum',
    enum: Difficulty,
  })
  difficulty: Relation<Difficulty>;

  @ManyToOne(() => SubjectEntity, (subject) => subject.questions)
  subject: Relation<SubjectEntity>;

  @ManyToOne(() => LecturerEntity, (lecturer) => lecturer.questions)
  lecturer: Relation<LecturerEntity>;

  @OneToMany(() => TestQuestionEntity, (testQuestion) => testQuestion.question)
  testQuestions: Relation<TestQuestionEntity>[];

  canDelete?: boolean;
}
