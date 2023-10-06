import crypto from 'crypto-js';
import { addHours } from 'date-fns';
import nodemailer from 'nodemailer';

import { CommonService } from './common.service';

import { AccountEntity } from 'backend/entities/account.entity';
import { PasswordResetEntity } from 'backend/entities/passwordReset.entity';
import { RecordNotFoundError } from 'backend/types/errors/common';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

export class MailService {
  static async sendResetPasswordEmail(email: string) {
    const account = await CommonService.getRecord({
      entity: AccountEntity,
      filter: {
        email,
      },
      relations: ['passwordReset'],
    });

    if (!account) {
      throw new RecordNotFoundError('Account not found');
    }

    const token = crypto.lib.WordArray.random(20).toString(crypto.enc.Hex);
    const expirationDate = addHours(new Date(), 1);

    if (account.passwordReset) {
      await CommonService.updateRecord(
        PasswordResetEntity,
        account.passwordReset.id,
        {
          token,
          expirationDate,
          used: false,
        },
      );
    } else {
      await CommonService.createRecord(PasswordResetEntity, {
        token,
        expirationDate,
        account,
        used: false,
      });
    }

    const mailOptions = {
      from: process.env.MAILER_EMAIL,
      to: account.email,
      subject: 'Giảng viên - Khôi phục mật khẩu',
      text: `Vui lòng nhấp vào đường dẫn này để khôi phục mật khẩu: ${process.env.NEXT_PUBLIC_DOMAIN_URL}/reset-password?token=${token}. Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.`,
    };

    return transporter.sendMail(mailOptions);
  }
}
