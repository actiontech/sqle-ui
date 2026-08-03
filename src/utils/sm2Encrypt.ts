import { sm2 } from 'sm-crypto';

/** sm-crypto: 1 = C1C3C2（与后端 gmsm 一致） */
const CIPHER_MODE_C1C3C2 = 1;

/**
 * 用 SM2 公钥对明文（用户名或口令）做 C1C3C2 加密，返回 hex（无前导 04；服务端会补齐）。
 * publicKeyHex 为未压缩点 hex；sm-crypto 要求带前导 04。
 */
export function sm2EncryptPassword(
  plaintext: string,
  publicKeyHex: string
): string {
  let key = (publicKeyHex || '').trim();
  if (!key) {
    throw new Error('empty sm2 public key');
  }
  if (!/^04/i.test(key)) {
    key = `04${key}`;
  }
  return sm2.doEncrypt(plaintext, key, CIPHER_MODE_C1C3C2);
}
