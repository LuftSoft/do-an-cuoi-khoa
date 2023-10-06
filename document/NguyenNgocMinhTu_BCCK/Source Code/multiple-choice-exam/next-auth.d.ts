import type { AccountEntity } from 'backend/entities/account.entity';

declare module 'next-auth' {
  interface Session {
    user: Omit<AccountEntity, 'password' | 'createdAt' | 'updatedAt'> & {
      // make it optional so that we can delete it while retaining the auto suggestion at the session callback
      password?: string;
      createdAt?: Date;
      updatedAt?: Date;
    };
  }

  interface User extends AccountEntity {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    exp?: number;
  }
}
