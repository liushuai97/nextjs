// 检测字符串是否为Base64
function isBase64(str: string) {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

// 解码base64
// eslint-disable-next-line complexity
export function b64Decode(str: string) {
  if (str && isBase64(str)) {
    let hexOut = false;
    // eslint-disable-next-line no-array-constructor
    let base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
      -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
      -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    // eslint-disable-next-line one-var, one-var-declaration-per-line
    let c1, c2, c3, c4;
    // eslint-disable-next-line one-var, one-var-declaration-per-line
    let i, len, out: any;
    let charCode;

    len = str.length;
    i = 0;
    out = hexOut ? [] : '';
    while (i < len) {
      /* c1 */
      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while (i < len && c1 === -1);
      if (c1 === -1)
        break;

      /* c2 */
      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while (i < len && c2 === -1);
      if (c2 === -1)
        break;

      charCode = (c1 << 2) | ((c2 & 0x30) >> 4);
      hexOut ? out.push(charCode) : out += String.fromCharCode(charCode);

      /* c3 */
      do {
        c3 = str.charCodeAt(i++) & 0xff;
        if (c3 === 61)
          return out;
        c3 = base64DecodeChars[c3];
      } while (i < len && c3 === -1);
      if (c3 === -1)
        break;
      charCode = ((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2);
      hexOut ? out.push(charCode) : out += String.fromCharCode(charCode);

      /* c4 */
      do {
        c4 = str.charCodeAt(i++) & 0xff;
        if (c4 === 61)
          return out;
        c4 = base64DecodeChars[c4];
      } while (i < len && c4 === -1);
      if (c4 === -1)
        break;
      charCode = ((c3 & 0x03) << 6) | c4;
      hexOut ? out.push(charCode) : out += String.fromCharCode(charCode);
    }
    return out;
  } else {
    return str;
  }
}