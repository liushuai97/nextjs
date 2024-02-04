let Buffer = require("buffer").Buffer;
import axios from "axios";
import crypto from "crypto-browserify";
import Cookies from "js-cookie";
import makeStore from "@/store/index";

const { store } = makeStore()

let pubKey = "";

const getCsrf = () => {
  return store.getState().user.jwt || "";
};

function getPubKey() {
  if (pubKey) {
    return pubKey;
  }
  return axios.get("/action/key/pub").then(result => {
    pubKey = "-----BEGIN PUBLIC KEY-----\n" + JSON.stringify(result.data).substring(1, JSON.stringify(result.data).length - 1) + "\n-----END PUBLIC KEY-----";
    return pubKey;
  });
}

const CryptoUtil = {
  getKey: getPubKey,
  getCsrf: getCsrf,
  decrypt: (text: string, key: string) => {
    if (key && key.startsWith("-----")) {
      // 不对称加密，要求 key 是 pem 格式的公钥或私钥
      const ko = { key: key, padding: crypto.constants.RSA_PKCS1_PADDING };
      const func = key.indexOf("PUBLIC") > 0 ? crypto.publicDecrypt : crypto.privateDecrypt;
      const decrypt = func(ko, Buffer.from(text, "base64"));
      return decrypt.toString();
    } else {
      // 对称加密
      const decipher = crypto.createDecipher("aes-128-ecb", key || getCsrf());
      decipher.update(text, "base64");
      return decipher.final("utf8");
    }
  },
  encrypt: (text: string, key: string) => {
    if (key && key.startsWith("-----")) {
      // 不对称加密，要求 key 是 pem 格式的公钥或私钥
      const ko = { key: key, padding: crypto.constants.RSA_PKCS1_PADDING };
      const func = key.indexOf("PUBLIC") > 0 ? crypto.publicEncrypt : crypto.privateEncrypt;
      const encrypt = func(ko, Buffer.from(text));
      return encrypt.toString("base64");
    } else {
      // 对称加密
      const cipher = crypto.createCipher("aes-128-ecb", key || getCsrf());
      cipher.update(text);
      return cipher.final("base64");
    }
  },
  hash: (text: string | undefined, algorithm?: string) => {
    const hash = crypto.createHash(algorithm || "sha256");
    hash.update(text);
    return hash.digest("base64");
  },
  hmac: (text: string, secret: string, algorithm?: string) => {
    const hmac = crypto.createHmac(algorithm || "sha1", secret);
    hmac.update(text);
    return hmac.digest("base64");
  }
};

export default CryptoUtil;
