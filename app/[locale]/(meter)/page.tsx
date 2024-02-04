"use client";
import { useEffect, useState } from "react";
// Redux
import { useDispatch } from "react-redux";
import { setInfo, logOut } from "@/store/user/userDataSlice";
// i18n
import { useTranslation } from "react-i18next";
// 路由
import { useRouter } from "next/navigation";
// 接口
import { queryUserInfo, querySessionId, queryShellId, loginOut } from "@/api/meter";
// WebSocket
import webSocket from "@/utils/websocket";
import Cookies from "js-cookie";
import { message } from "antd";

// 首页
const Home = () => {
  // 全局提示
  const [messageApi, contextHolder] = message.useMessage();
  // 中/英文
  const { t, i18n } = useTranslation("login");
  // 当前语言
  const currentLocale = i18n.language;
  // 路由
  const router = useRouter();
  // Redux方法
  const dispatch = useDispatch();
  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const response = await queryUserInfo();
      dispatch(setInfo(response));
    } catch (err: any) {
    }
  };
  // WebSocket返回消息
  const socketBack = ({ payload }: { payload: { [key: string]: any } }) => {
    if (payload.type !== 'online') {
      // 强制退出
      handleLoginOut();
    }
  };
  // 订阅WebSocket消息
  const initWebSocket = async () => {
    await webSocket.connect();
    const sessionId = await querySessionId();
    await Promise.all([
      webSocket.subscribeUserMessage(sessionId),
      webSocket.subscribeDomainMessage(sessionId),
      webSocket.registerDgQueueListener('uap.system.nodes', socketBack)
    ]);
  };
  useEffect(() => {
    fetchUserInfo();
    initWebSocket();
  }, []);

  useEffect(() => {
    return () => {
      webSocket.unregisterUserQueueListener(socketBack);
      webSocket.unregisterDgQueueListener(socketBack)
    }
  }, []);
  // 退出登录
  const fetchLoginOut = async () => {
    try {
      const response = await loginOut();
    } catch (err: any) {
    }
  };
  const handleLoginOut = () => {
    fetchLoginOut();
    dispatch(logOut());
    Cookies.remove("NEXT_LOCALE");
    sessionStorage.clear();
    localStorage.clear();
    router.push(`/${currentLocale}/login`);
    webSocket.disconnect()
  };
  // shell链接
  const [passObj, setPassObj] = useState({});
  // shell sessionId
  const fetchShell = async () => {
    try {
      let data = {
        neId: 18,
        loginType: 'telnet',
        hostname: '62.101.60.1',
        port: 50023,
        enPasswordPrompt: 'Password:',
        enableCommand: 'enable 18',
        enablePassword: 'Zxr10_IPTN',
        enablePrompt: '#',
        loginPrompt: 'Username:',
        passwordPrompt: 'Password:',
        userPrompt: '>',
        username: 'zte',
        password: 'zte',
        sshAlgorithmsSuitType: 'HIGH'
      };
      const response: any = await queryShellId(data);
      if (response) {
        setPassObj({
          type: 'reconnect',
          flag: 'first',
          connectionId: response.id,
          hostname: '62.101.61.1',
          port: response.websocketPort,
          websocketHost: window.location.host,
          scheme: window.location.origin.startsWith('https') ? 'wss' : 'ws'
        });
      }
    } catch (err: any) {
      messageApi.open({
        type: "error",
        content: err.response.data,
      });
    }
  };

  const handleShell = () => {
    fetchShell();
    console.log(passObj);
  };

  return (
    <div>
      <button onClick={handleLoginOut}>退出登录</button>
      <button onClick={handleShell}>Shell终端</button>
      {contextHolder}
    </div >
  );
};

export default Home;
