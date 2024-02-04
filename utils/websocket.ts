import SockJs from "sockjs-client";
import Stomp from "stompjs";
import _ from "lodash";

let Holder: {
  [key: string]: any
} = {
  client: null,
  userQueueSubscription: null,
  dgQueueSubscription: null,
  userQueueListeners: [],
  dgQueueListeners: [],
  logOld: null
};

export default {
  // 建立连接
  connect() {
    const socket = new SockJs("/stomp");
    socket.onclose = this.$onClose;
    // 获取STOMP子协议的客户端对象
    const client = Stomp.over(socket);
    Holder.client = client;
    // 拦截输出的一大堆垃圾信息
    Holder.logOld = client.debug;
    Holder.client.debug = null;
    // 定义客户端的认证信息,按需求配置
    const header = {};
    return new Promise<void>((resolve, reject) => {
      // 向服务器发起websocket连接
      client.connect(header, () => {
        resolve();
      }, (msg) => {
        reject(msg);
      });
    });
  },
  // 1s后重连
  $onClose() {
    setTimeout(() => {
      this.connect();
    }, 1000);
  },
  // 关闭连接
  disconnect() {
    if (Holder.userQueueSubscription) {
      Holder.userQueueSubscription.unsubscribe();
    }
    if (Holder.dgQueueSubscription) {
      Holder.dgQueueSubscription.unsubscribe();
    }
    Holder.client.disconnect(() => { });
  },
  // 订阅用户消息
  subscribeUserMessage(sessionId: any) {
    // 订阅服务端提供的某个topic
    Holder.userQueueSubscription = Holder.client.subscribe("/amq/queue/stomp-userqueue-" + sessionId, (message: any) => {
      // msg.body存放的是服务端发送给我们的信息
      const body = JSON.parse(message.body);
      Holder.userQueueListeners.forEach((it: any) => {
        if (it.topic === "*") {
          it.callback(body);
        } else if (typeof it.topic === "string" && it.topic === body.topic) {
          it.callback(body);
        } else if (_.indexOf(it.topic, body.topic) !== -1) {
          it.callback(body);
        }
      });
    });
  },
  // 订阅管理域消息
  subscribeDomainMessage(sessionId: any) {
    // 订阅服务端提供的某个topic
    Holder.dgQueueSubscription = Holder.client.subscribe("/amq/queue/stomp-dgqueue-" + sessionId, (message: any) => {
      // msg.body存放的是服务端发送给我们的信息
      const body = JSON.parse(message.body);
      Holder.dgQueueListeners.forEach((it: any) => {
        if (it.topic === "*") {
          it.callback(body);
        } else if (typeof it.topic === "string" && it.topic === body.topic) {
          it.callback(body);
        } else if (_.indexOf(it.topic, body.topic) !== -1) {
          it.callback(body);
        }
      });
    });
  },
  // 注册Domain消息的监听器
  registerDgQueueListener(topic: any, callback: any) {
    Holder.dgQueueListeners.push({
      topic: topic,
      callback: callback
    });
  },
  // 删除Domain消息的监听器
  unregisterDgQueueListener(callback: any) {
    _.remove(Holder.dgQueueListeners, { callback: callback });
  },
  // 注册用户消息的监听器
  registerUserQueueListener(topic: any, callback: any) {
    Holder.userQueueListeners.push({
      topic: topic,
      callback: callback
    });
  },
  // 删除用户消息的监听器
  unregisterUserQueueListener(callback: any) {
    _.remove(Holder.userQueueListeners, { callback: callback });
  }
};
