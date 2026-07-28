#!/usr/bin/env node
/**
 * Cross-check SM2 interop between sm-crypto (frontend) and a fixture
 * ciphertext shape expected by backend (C1C3C2, optional leading 04).
 */
const { sm2 } = require('sm-crypto');

const keypair = sm2.generateKeyPairHex();
const password = 'SqleLoginPass#123';
const cipherMode = 1; // C1C3C2
const cipher = sm2.doEncrypt(password, keypair.publicKey, cipherMode);
const plain = sm2.doDecrypt(cipher, keypair.privateKey, cipherMode);

if (plain !== password) {
  console.error('sm-crypto roundtrip failed');
  process.exit(1);
}
if (cipher.startsWith('04')) {
  console.error('unexpected leading 04 from sm-crypto doEncrypt');
  process.exit(1);
}
if (!keypair.publicKey.startsWith('04')) {
  console.error('public key should start with 04');
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      public_key: keypair.publicKey,
      private_key: keypair.privateKey,
      encrypted_password: cipher,
      encrypted_password_with_04: `04${cipher}`,
      cipher_len: cipher.length,
    },
    null,
    2
  )
);
