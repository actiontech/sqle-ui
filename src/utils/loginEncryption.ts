import { sm2 } from 'sm-crypto';

// Must stay aligned with backend loginencryption.CipherModeC1C3C2.
const SM2_CIPHER_MODE_C1C3C2 = 1;

export type LoginEncryptionInfo = {
  enable?: boolean;
  algorithm?: string;
  cipher_mode?: string;
  public_key?: string;
  key_id?: string;
};

export type EncryptedLoginCredentials = {
  encrypted_password: string;
  key_id: string;
};

export class LoginEncryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginEncryptionError';
  }
}

export const encryptLoginPassword = (
  password: string,
  encryption: LoginEncryptionInfo
): EncryptedLoginCredentials => {
  if (!encryption?.enable) {
    throw new LoginEncryptionError('login encryption is disabled');
  }
  if (!encryption.public_key) {
    throw new LoginEncryptionError('login public key is missing');
  }
  if (!encryption.key_id) {
    throw new LoginEncryptionError('login key id is missing');
  }
  if (!sm2.verifyPublicKey(encryption.public_key)) {
    throw new LoginEncryptionError('login public key is invalid');
  }

  try {
    const encryptedPassword = sm2.doEncrypt(
      password,
      encryption.public_key,
      SM2_CIPHER_MODE_C1C3C2
    );
    if (!encryptedPassword) {
      throw new LoginEncryptionError('encrypt password failed');
    }
    return {
      encrypted_password: encryptedPassword,
      key_id: encryption.key_id,
    };
  } catch (error) {
    if (error instanceof LoginEncryptionError) {
      throw error;
    }
    throw new LoginEncryptionError('encrypt password failed');
  }
};
