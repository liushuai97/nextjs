const api = {
  // 首页
  meter: {
    // 登录用户信息
    user: "/api/gateway/user/self",
    // 获取SessionId
    session: "/api/gateway/stompqueue",
    // 获取ShellId
    shell: "/api/telnetssh/manage/login-connection-id",
    // 退出登录
    out: "/action/logout"
  },
  // 登陆页
  login: {
    // 系统初始信息
    registration: "/action/registration",
    // Token值
    csrf: "/action/csrf",
    // 登录
    loge: "/action/login",
    // 密钥Key
    pub: "/action/csrf?sign=1",
    // 修改默认密码
    default: "/action/defaultPwd",
    // 重置过期密码
    reset: "/action/resetPwd",
    // 验证码图片
    code: "/action/captchaImage",
    // 重置密码
    rwd: '/api/gateway/editPwd',
    // 发送邮箱验证码
    send: "/api/gateway/emailCode",
    // 邮箱验证登录
    email: "/api/gateway/checkEmailCode",
  }
};

export default api;
