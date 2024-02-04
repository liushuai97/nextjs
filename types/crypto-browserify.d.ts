declare module "crypto-browserify" {
  export const constants: {
    "DH_CHECK_P_NOT_SAFE_PRIME": number,
    "DH_CHECK_P_NOT_PRIME": number,
    "DH_UNABLE_TO_CHECK_GENERATOR": number,
    "DH_NOT_SUITABLE_GENERATOR": number,
    "NPN_ENABLED": number,
    "ALPN_ENABLED": number,
    "RSA_PKCS1_PADDING": number,
    "RSA_SSLV23_PADDING": number,
    "RSA_NO_PADDING": number,
    "RSA_PKCS1_OAEP_PADDING": number,
    "RSA_X931_PADDING": number,
    "RSA_PKCS1_PSS_PADDING": number,
    "POINT_CONVERSION_COMPRESSED": number,
    "POINT_CONVERSION_UNCOMPRESSED": number,
    "POINT_CONVERSION_HYBRID": number
  };
  export function publicDecrypt(any, any): any;
  export function privateDecrypt(any, any): any;
  export function createDecipher(any, any): any;
  export const publicEncrypt: any;
  export const privateEncrypt: any;
  export function createCipher(any, any): any;
  export function createHash(any): any;
  export function createHmac(any, any): any;
};
