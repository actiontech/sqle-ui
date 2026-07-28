declare module 'sm-crypto' {
  export const sm2: {
    doEncrypt: (
      msg: string | number[],
      publicKey: string,
      cipherMode?: number
    ) => string;
    doDecrypt: (
      encryptData: string,
      privateKey: string,
      cipherMode?: number,
      options?: { output?: 'string' | 'array' }
    ) => string | number[];
    generateKeyPairHex: (
      random?: string | number | object
    ) => { publicKey: string; privateKey: string };
    verifyPublicKey: (publicKey: string) => boolean;
  };
}
