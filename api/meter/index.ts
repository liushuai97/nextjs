import api from "@/api/index";
import request from "@/utils/request";

const queryLanguage = () => {
  let local = localStorage.getItem("persist:root");
  let language = local ? JSON.parse(JSON.parse(local).user).language === "en" ? "en-us" : "zh-cn" : "zh-cn";
  return language;
}

const queryJwt = () => {
  let local = localStorage.getItem("persist:root");
  let jwt = local ? JSON.parse(JSON.parse(local).user).jwt : undefined;
  return jwt;
}

// 获取登录用户信息
export const queryUserInfo = () => {
  return request({
    url: api.meter.user,
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "application/json;charset=UTF-8"
    },
    responseType: "json"
  });
};

// 获取SessionID
export const querySessionId = () => {
  return request({
    url: api.meter.session,
    method: "get",
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "application/json;charset=UTF-8"
    },
    responseType: "json"
  });
};

// 退出登录
export const loginOut = () => {
  return request({
    url: api.meter.out,
    method: "get",
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "application/json;charset=UTF-8"
    },
    responseType: "json"
  });
};

// 获取Shell SessionID
export const queryShellId = (data: object) => {
  return request({
    url: api.meter.shell,
    method: "post",
    headers: {
      "Accept-Language": queryLanguage(),
      "Content-Type": "application/json;charset=UTF-8",
      "X-XSRF-TOKEN": queryJwt()
    },
    responseType: "json",
    data
  });
};
