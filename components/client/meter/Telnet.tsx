import React, { useEffect, useState, FunctionComponent } from "react";
import { Terminal } from "xterm";
import { WebLinksAddon } from "xterm-addon-web-links";
import { FitAddon } from "xterm-addon-fit";

import "xterm/css/xterm.css";

type Props = {
  shell: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    connectionId?: string;
    flag?: string;
    hostname?: string;
    scheme?: string;
    type?: string;
    websocketHost?: string;
  }
}

const WebTerminal: FunctionComponent<Props> = ({ shell }) => {
  const { host, port, username, password } = shell
  const [webTerminal, setWebTerminal] = useState<Terminal | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // 新增监听事件
    if (webTerminal && ws) {
      // 监听
      // webTerminal.onKey(e => {
      //   const { key } = e;
      //   ws.send(key);
      // });
      // ws监听
      ws.onmessage = e => {
        if (webTerminal) {
          if (typeof e.data === 'string') {
            webTerminal.write(e.data);
            console.log(e);
          } else {
            console.error('格式错误');
          }
        }
      };
    }
  }, [webTerminal, ws]);


  useEffect(() => {
    // 初始化终端
    const ele = document.getElementById('terminal');
    while (ele && ele.hasChildNodes()) { //当table下还存在子节点时 循环继续
      //这里是为了参数输错的情况下，从新改正参数，点击连接，新建一个新的窗口
      ele && ele.firstChild && ele.removeChild(ele.firstChild);
    }
    if (ele) {
      // 初始化
      const terminal = new Terminal({
        cursorBlink: true,
        cols: 175,
        rows: 40,
      });
      // 辅助
      const fitAddon = new FitAddon();
      terminal.loadAddon(new WebLinksAddon());
      terminal.loadAddon(fitAddon);

      terminal.open(ele);

      // terminal.onKey(e => {
      //   console.log(e)
      //   // terminal.write(e.key);
      //   if (e.key == '\r') {
      //     //   terminal.write('\nroot\x1b[33m$\x1b[0m');
      //   } else if (e.key == '\x7F') {
      //     terminal.write('\b \b');
      //   }
      //   terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
      //   fitAddon.fit();
      //   terminal.focus();
      // });
      terminal.onData(function (data) {
        console.log(data)
        // if (self.socket) {
        //   self.socket.send(JSON.stringify({ 'data': data }));
        // }
      });
      terminal.open(ele);
      terminal.write('连接中....');
      setWebTerminal(terminal);
    }
    // 初始化ws连接
    if (ws) ws.close();
    const resp = {
      responseJSON: {
        id: shell.connectionId,
        status: '200'
      },
      status: 200,
      statusText: 'ok',
      websocketHost: shell.websocketHost,
      scheme: shell.scheme
    };
    const msg = resp.responseJSON;
    const socket = new WebSocket('ws://' + resp.websocketHost + '/telnetssh/' + msg.id);
    console.log(socket);
    socket.onopen = () => {//和服务端建立socket连接
      let message = {
        host: host,
        port: port,
        username: username,
        password: password
      };
      socket.send(JSON.stringify(message));
    };
    setWs(socket);
  }, [host, port, username, password]);

  return <div id="terminal" />;
};

export default WebTerminal;
