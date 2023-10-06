import { AccountEntity } from 'backend/entities/account.entity';
import {
  IncorrectOldPasswordError,
  SamePasswordsError,
} from 'backend/types/errors/profile';
import { hashPassword } from 'backend/utils/auth.helper';
import { getRepo } from 'backend/utils/database.helper';

type ValidatePasswordsInputs = {
  oldPassword: string;
  newPassword: string;
  userId: string;
};

export class AccountService {
  public static async checkCredentials(
    emailOrId: {
      email?: string;
      id?: string;
    },
    password: string,
  ): Promise<AccountEntity | null> {
    const { email, id } = emailOrId;
    const hashedPassword = hashPassword(password);

    const accountRepo = await getRepo(AccountEntity);

    let identifierFilter: typeof emailOrId | undefined = undefined;

    if (email) identifierFilter = { email: email.toLowerCase() };
    if (id) identifierFilter = { id };

    if (!identifierFilter) return null;

    const user = await accountRepo.findOne(
      {
        ...identifierFilter,
        password: hashedPassword,
      },
      { relations: ['lecturer'] },
    );

    if (!user) return null;

    return user;
  }

  public static async validatePasswords({
    newPassword,
    oldPassword,
    userId,
  }: ValidatePasswordsInputs) {
    const isOldPasswordCorrect = !!(await this.checkCredentials(
      { id: userId },
      oldPassword,
    ));

    if (!isOldPasswordCorrect) {
      throw new IncorrectOldPasswordError('Incorrect old password');
    }

    const oldHashedPassword = hashPassword(oldPassword);
    const newHashedPassword = hashPassword(newPassword);

    if (oldHashedPassword === newHashedPassword) {
      throw new SamePasswordsError(
        'New password must be different from old password',
      );
    }
  }
}
