import type { Relation } from 'typeorm';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { LecturerEntity } from './lecturer.entity';
import { PasswordResetEntity } from './passwordReset.entity';

@Entity({ name: 'account' })
export class AccountEntity extends AbstractEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToOne(() => LecturerEntity, (lecturer) => lecturer.account, {
    nullable: true,
  })
  lecturer: Relation<LecturerEntity>;

  @OneToOne(() => PasswordResetEntity, (passwordReset) => passwordReset.account)
  @JoinColumn()
  passwordReset: Relation<PasswordResetEntity>;
}
