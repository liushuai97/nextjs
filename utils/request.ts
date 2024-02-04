// 导入axios和所需的类型
import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// 默认配置
const service: AxiosInstance = axios.create({
  // 设置API的基本URL，默认为根路径
  baseURL: "/"
});

// 请求拦截器，对请求配置进行一些处理或设置
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，对响应结果进行处理或判断
service.interceptors.response.use(
  (response: any) => {
    if (response.status === 200) {
      return response.data;
    }
    // 如果响应状态不是200，则返回一个拒绝的Promise
    return Promise.reject();
  },
  (error: any) => {
    switch (error.response?.status) {
      case 401:
        if (error.response.data?.redirect === '/login.html') {
          window.location.href = window.location.protocol + "//" + window.location.host + `/${window.location.href.indexOf('en') > -1 ? "en" : "zh"}/login`;
        }
        break
    }
    return Promise.reject(error);
  }
);

export default service;
