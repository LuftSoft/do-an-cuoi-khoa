import type { Relation } from 'typeorm';
import { Entity, ManyToOne, JoinColumn, Column, RelationId } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { QuestionEntity } from './question.entity';
import { TestEntity } from './test.entity';

@Entity({ name: 'test_question' })
export class TestQuestionEntity extends AbstractEntity {
  @Column()
  order: number;

  @ManyToOne(() => TestEntity, (test) => test.testQuestions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'test_id' })
  test: Relation<TestEntity>;

  @ManyToOne(() => QuestionEntity, (question) => question.testQuestions)
  @JoinColumn({ name: 'question_id' })
  question: Relation<QuestionEntity>;

  @RelationId((testQuestion: TestQuestionEntity) => testQuestion.question)
  questionId: string;
}
