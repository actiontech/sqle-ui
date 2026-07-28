import { encryptLoginPassword, LoginEncryptionInfo } from './loginEncryption';

describe('loginEncryption', () => {
  const encryption: LoginEncryptionInfo = {
    enable: true,
    algorithm: 'SM2',
    cipher_mode: 'C1C3C2',
    // uncompressed SM2 public key generated for unit test
    public_key:
      '04f5a1d2c3b4a5968778695a4b3c2d1e0f1a2b3c4d5e6f708192a3b4c5d6e7f8090a1b2c3d4e5f60718293a4b5c6d7e8f90112131415161718191a1b1c1d1e1f20',
    key_id: 'test-key',
  };

  test('should throw when encryption disabled', () => {
    expect(() =>
      encryptLoginPassword('pwd', { enable: false, public_key: '04ab', key_id: 'k' })
    ).toThrow('login encryption is disabled');
  });

  test('should throw when public key missing', () => {
    expect(() =>
      encryptLoginPassword('pwd', { enable: true, key_id: 'k' })
    ).toThrow('login public key is missing');
  });

  test('should encrypt password and never return plaintext', () => {
    // Use a known-valid keypair from sm-crypto generate for deterministic shape check.
    // If key is invalid, sm2.doEncrypt may still produce output or throw; we only assert
    // that successful path never echoes plaintext.
    const { sm2 } = require('sm-crypto');
    const keypair = sm2.generateKeyPairHex();
    const result = encryptLoginPassword('secret-password', {
      enable: true,
      public_key: keypair.publicKey,
      key_id: 'kid-1',
    });
    expect(result.key_id).toBe('kid-1');
    expect(result.encrypted_password).toBeTruthy();
    expect(result.encrypted_password).not.toContain('secret-password');
    expect(result.encrypted_password).not.toEqual('secret-password');
  });

  test('should reject invalid public key gracefully', () => {
    expect(() => encryptLoginPassword('pwd', encryption)).toThrow(
      'login public key is invalid'
    );
  });
});
