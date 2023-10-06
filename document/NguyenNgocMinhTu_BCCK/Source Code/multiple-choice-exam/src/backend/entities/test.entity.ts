import type { Relation } from 'typeorm';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { LecturerEntity } from './lecturer.entity';
import { SubjectEntity } from './subject.entity';
import { TestQuestionEntity } from './testQuestion.entity';

@Entity({ name: 'test' })
export class TestEntity extends AbstractEntity {
  @Column()
  numberOfQuestions: number;

  @Column()
  durationMinutes: number;

  @Column()
  testDate: Date;

  @Column()
  title: string;

  @Column()
  easyPortion: number;

  @Column()
  normalPortion: number;

  @Column()
  hardPortion: number;

  @ManyToOne(() => LecturerEntity, (lecturer) => lecturer.tests)
  lecturer: Relation<LecturerEntity>;

  @ManyToOne(() => SubjectEntity, (subject) => subject.tests)
  subject: Relation<SubjectEntity>;

  @OneToMany(() => TestQuestionEntity, (testQuestion) => testQuestion.test, {
    cascade: ['remove'],
  })
  testQuestions: Relation<TestQuestionEntity>[];

  areTestQuestionsValid?: boolean;
}
