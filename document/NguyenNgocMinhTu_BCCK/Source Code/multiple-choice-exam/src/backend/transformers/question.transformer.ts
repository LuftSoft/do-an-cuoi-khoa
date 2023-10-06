import crypto from 'crypto-js';
import type { ValueTransformer } from 'typeorm';

import { Option } from 'backend/enums/question.enum';

export class OptionTransformer implements ValueTransformer {
  // Upon insertion.
  to(value: Option): string {
    const secretKey = process.env.CRYPTOJS_SECRET;
    return crypto.AES.encrypt(value.toString(), secretKey).toString();
  }
  // Upon extraction.
  from(value: string): Option {
    const secretKey = process.env.CRYPTOJS_SECRET;
    return Option[
      crypto.AES.decrypt(value, secretKey).toString(crypto.enc.Utf8)
    ];
  }
}

export class StringEncryptionTransformer implements ValueTransformer {
  // Upon insertion.
  to(value: string | null): string | null {
    if (value === null) return null;

    const secretKey = process.env.CRYPTOJS_SECRET;
    return crypto.AES.encrypt(value, secretKey).toString();
  }

  // Upon extraction.
  from(value: string | null): string | null {
    if (value === null) return null;

    const secretKey = process.env.CRYPTOJS_SECRET;
    return crypto.AES.decrypt(value, secretKey).toString(crypto.enc.Utf8);
  }
}
