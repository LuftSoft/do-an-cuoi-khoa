import type { Relation } from 'typeorm';
import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { AccountEntity } from './account.entity';
import { QuestionEntity } from './question.entity';
import { TestEntity } from './test.entity';

@Entity({ name: 'lecturer' })
export class LecturerEntity extends AbstractEntity {
  @Column()
  degree: string;

  @OneToOne(() => AccountEntity, (account) => account.lecturer)
  @JoinColumn()
  account: Relation<AccountEntity>;

  @OneToMany(() => TestEntity, (test) => test.lecturer)
  tests: Relation<TestEntity>[];

  @OneToMany(() => QuestionEntity, (question) => question.lecturer)
  questions: Relation<QuestionEntity>[];
}
