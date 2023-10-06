import type { Relation } from 'typeorm';
import { Entity, Column, OneToMany } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { QuestionEntity } from './question.entity';
import { TestEntity } from './test.entity';

@Entity({ name: 'subject' })
export class SubjectEntity extends AbstractEntity {
  @Column({
    unique: true,
  })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => QuestionEntity, (question) => question.subject)
  questions: Relation<QuestionEntity>[];

  @OneToMany(() => TestEntity, (test) => test.subject)
  tests: Relation<TestEntity>[];

  canDelete?: boolean;
}
