import api from "@/api/index";
import request from "@/utils/request";

const queryLanguage = () => {
  let local = localStorage.getItem("persist:root");
  let language = local ? JSON.parse(JSON.parse(local).user).language === "en" ? "en-us" : "zh-cn" : "zh-cn";
  return language;
}

// 重置密码
export const rePassword = (data: { [key: string]: any }) => {
  return request({
    url: api.login.rwd,
    method: "post",
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "application/json;charset=UTF-8",
      "X-XSRF-TOKEN": data.token
    },
    responseType: "json",
    data
  });
}

// 发送邮箱验证码
export const sendEmailCode = (data: { [key: string]: any }) => {
  return request({
    url: api.login.send,
    method: "post",
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "application/json;charset=UTF-8",
      "X-XSRF-TOKEN": data.token
    },
    responseType: "json",
    data
  });
}

// 邮箱验证登录
export const emailSign = (data: { [key: string]: any }) => {
  return request({
    url: api.login.email,
    method: "post",
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "application/json;charset=UTF-8",
      "X-XSRF-TOKEN": data.token
    },
    responseType: "json",
    data
  });
}


// 账户登录
export const userLogin = (data: { [key: string]: any }) => {
  return request({
    url: `${api.login.loge}?_csrf=${data.token}`,
    method: "post",
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "application/json;charset=UTF-8"
    },
    responseType: "json",
    data
  });
};

// 账户首次登录，修改默认密码
export const userFirst = (token: string, data: object) => {
  return request({
    url: `${api.login.default}?_csrf=${token}`,
    method: "post",
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "application/json;charset=UTF-8"
    },
    responseType: "json",
    data
  });
};

// 账户密码过期，重置密码
export const userReset = (token: string, data: object) => {
  return request({
    url: `${api.login.reset}?_csrf=${token}`,
    method: "post",
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "application/json;charset=UTF-8"
    },
    responseType: "json",
    data
  });
};

// 密钥Key
export const queryPub = () => {
  return request({
    url: api.login.pub,
    method: "get",
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "application/json;charset=UTF-8"
    },
    responseType: "json"
  });
};

// 验证码
export const queryCodeImg = (params: { username: string }) => {
  return request({
    url: api.login.code,
    method: "get",
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "image/png; charset=UTF-8"
    },
    responseType: "blob",
    params
  });
};

// 获取Token
export const queryToken = () => {
  return request({
    url: api.login.csrf,
    method: "get",
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "application/json;charset=UTF-8"
    },
    responseType: "json"
  });
};

// 版权信息
export const queryCopyright = () => {
  return request({
    url: api.login.registration,
    method: "get",
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "application/json;charset=UTF-8"
    },
    responseType: "json",
    params: {
      type: 2
    }
  });
};
