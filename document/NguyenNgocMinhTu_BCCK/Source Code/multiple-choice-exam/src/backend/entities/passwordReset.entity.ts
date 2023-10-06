import type { Relation } from 'typeorm';
import { Entity, Column, OneToOne } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { AccountEntity } from './account.entity';

@Entity({ name: 'password_reset' })
export class PasswordResetEntity extends AbstractEntity {
  @Column({
    default: false,
  })
  used: boolean;

  @Column()
  token: string;

  @Column()
  expirationDate: Date;

  @OneToOne(() => AccountEntity, (account) => account.passwordReset)
  account: Relation<AccountEntity>;
}
