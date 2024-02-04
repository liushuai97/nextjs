"use client";
import React, { useState, FunctionComponent } from "react";
import { setJwt, setLanguage } from "@/store/user/userDataSlice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { Button, Form, Input, Space, message, ConfigProvider, Modal } from "antd";
import { LockOutlined, UserOutlined, CreditCardOutlined, EditFilled } from "@ant-design/icons";
// i18n
import { useTranslation } from "react-i18next";
// 样式
import styles from "@/styles/login.module.scss";
// 接口
import { queryCodeImg, queryToken, userLogin, queryPub, sendEmailCode, emailSign, rePassword } from "@/api/login"
// 加密
import crypto from "@/utils/crypto";
// 路由
import { useRouter } from "next/navigation";
// Base64解码
import { b64Decode } from '@/utils/shortcut';
import Cookies from "js-cookie";

type Props = {
  isHasImage?: boolean
};

const User: FunctionComponent<Props> = (props) => {
  // 是否显示图形验证码
  const { isHasImage } = props;
  // 是否进入重置密码流程
  const [reset, setReset] = useState(false);
  // 中/英文
  const { t, i18n } = useTranslation("login");
  // 当前语言
  const currentLocale = i18n.language;
  // Redux方法
  const dispatch = useDispatch();
  // 路由
  const router = useRouter();
  // 表单
  const [form] = Form.useForm();
  // 全局提示
  const [messageApi, contextHolder] = message.useMessage();
  // 基础类型
  type LoginType = {
    username?: string;
    password?: string;
    newPwd?: string;
    conPwd?: string;
    code?: string;
  };
  // 获取验证码
  const [codeImg, setCodeImg] = useState("");
  const fetchImage = async (name: string) => {
    try {
      const response: any = await queryCodeImg({ username: name });
      const blob = new Blob([response], { type: "image/png" });
      let url = window.URL.createObjectURL(blob);
      setCodeImg(url);
    } catch (err: any) {
      // 报错信息
      if (err.config.responseType === "blob") {
        const data = err.response.data;
        const reader = new FileReader();
        reader.readAsText(data);
        reader.onload = (evt: any) => {
          const msg = JSON.parse(evt.target.result);
          messageApi.open({
            type: "error",
            content: msg
          });
        };
      }
    }
  };
  const handleCode = () => {
    const username = form.getFieldValue("username");
    if (username) {
      fetchImage(username);
    } else {
      messageApi.open({ type: "error", content: t("placeName") });
    }
  };
  // 邮箱
  const [signEmail, setSignEmail] = useState("");
  // 获取Token
  const [token, setToken] = useState("");
  // 获取密钥Key，pub
  const [pub, setPub] = useState("");
  const fetchPub = async () => {
    const { pub, token }: any = await queryPub();
    setPub(pub);
    setToken(token);
  };
  // 重置密码
  const fetchRePwd = async (data: { [key: string]: any }) => {
    try {
      const response: any = await rePassword(data);
      if (response) {
        let { status, errorMsg } = response;
        if (status === "1") {
          messageApi.open({
            type: "error",
            content: errorMsg
          });
        } else {
          messageApi.open({
            type: "success",
            content: t("success")
          });
          setReset(false);
          fetchImage(data.username);
        }
      }
    } catch (err: any) {
      messageApi.open({
        type: "error",
        content: err.response.data,
      });
    }
  };
  // 是否显示对话框
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 对话框标题
  const [modalTitle, setModalTitle] = useState('');
  // 邮箱验证码 -> Value
  const [emailCode, setEmailCode] = useState('');
  // 发送邮箱验证码
  const fetchSendEmail = async (data: { [key: string]: any }) => {
    try {
      const response: any = await sendEmailCode({ ...data });
      if (response) {
        let { status, errorMsg } = response;
        if (status === "1") {
          messageApi.open({
            type: "error",
            content: errorMsg
          });
        } else {
          setIsModalOpen(true);
          setEmailCode("");
          setModalTitle(`${t("emailSendTo")}${data.email}`)
          messageApi.open({
            type: "success",
            content: t("emailSuccess")
          });
        }
      }
    } catch (err: any) {
      messageApi.open({
        type: "error",
        content: err.response.data,
      });
    }
  };
  // 邮箱登录验证
  const fetchEmailSign = async (data: { [key: string]: any }) => {
    try {
      const response: any = await emailSign(data);
      if (response) {
        let { status, errorMsg } = response;
        if (status === "1") {
          fetchImage(data.username)
          messageApi.open({
            type: "error",
            content: errorMsg
          });
        }
        if (status === "0") {
          // 正常登录
          dispatch(setLanguage(currentLocale));
          Cookies.set("NEXT_LOCALE", currentLocale === "en" ? "en-us" : "zh-cn");
          const { token }: any = await queryToken();
          dispatch(setJwt(token));
          router.push(`/${currentLocale}`);
        }
      }
    } catch (err: any) {
      messageApi.open({
        type: "error",
        content: err.response.data,
      });
    }
  };
  // 登录
  const fetchLogin = async (data: { [key: string]: any }) => {
    try {
      const response: any = await userLogin(data);
      if (response) {
        let { status, errorMsg } = response;
        if (status === "1") {
          fetchImage(data.username);
          messageApi.open({
            type: "error",
            content: errorMsg,
          });
        } else {
          let { email, verityEmail, redirect } = response;
          if (verityEmail) {
            setSignEmail(b64Decode(verityEmail))
            // 邮箱验证码登录流程 -> 发送邮件验证码
            const { token }: any = await queryToken();
            fetchSendEmail({ ...data, token, email: b64Decode(verityEmail) })
          }
          if (email) {
            if (email === 'null') {
              // 首次登录、密码过期 -> 重置密码流程
              setReset(true);
              fetchImage(data.username);
              fetchPub();
            }
            if (email && email !== 'null') {
              // 首次登录，密码过期 -> 邮箱验证码重置密码流程
              setSignEmail(b64Decode(email))
              setReset(true);
              fetchImage(data.username);
              fetchPub();
            }
          }
          if (!email && !verityEmail && redirect === '/') {
            // 正常登录
            dispatch(setLanguage(currentLocale));
            Cookies.set("NEXT_LOCALE", currentLocale === "en" ? "en-us" : "zh-cn");
            const { token }: any = await queryToken();
            dispatch(setJwt(token));
            router.push(`/${currentLocale}`);
          }
        }
      }
    } catch (err: any) {
      messageApi.open({
        type: "error",
        content: err.response.data,
      });
    }
  };
  const [signBody, setSignBody] = useState({})
  // 表单提交
  const handleSubmit = async (values: LoginType) => {
    const { token }: any = await queryToken();
    if (reset) {
      if (values.newPwd === values.conPwd) {
        let data: { [key: string]: any } = {
          oldPassword: crypto.encrypt(crypto.hash(values.password), "-----BEGIN PUBLIC KEY-----\n" + JSON.stringify(pub).substring(1, JSON.stringify(pub).length - 1) + "\n-----END PUBLIC KEY-----"),
          username: values.username,
          captcha: values.code,
          newPassword: crypto.encrypt(crypto.hash(values.newPwd), "-----BEGIN PUBLIC KEY-----\n" + JSON.stringify(pub).substring(1, JSON.stringify(pub).length - 1) + "\n-----END PUBLIC KEY-----")
        }
        if (signEmail) {
          // 发送邮件验证码，重置密码
          fetchSendEmail({ ...data, email: signEmail, token });
          setSignBody(data);
        } else {
          // 重置密码
          fetchRePwd({ ...data, token });
        }
      } else {
        messageApi.open({
          type: "error",
          content: t("placeNewCon"),
        });
      }
    } else {
      let time = new Date().getTime();
      let data: { [key: string]: string | number | undefined } = {
        time: time,
        type: "WEB",
        username: values.username,
        password: crypto.hmac(time + crypto.hash(values.password), token),
        captcha: undefined,
        locale: currentLocale === "en" ? "en_US" : "zh_CN",
        "remember-me": "off"
      };
      setSignBody(data);
      if (isHasImage) {
        if (codeImg) {
          fetchLogin({ ...data, captcha: values.code, token });
        } else {
          messageApi.open({ type: "error", content: t("placeQuery") });
        }
      } else {
        fetchLogin({ ...data, token });
      }
    }
  };

  // 邮件验证码确认提交
  const handleModelSubmit = async () => {
    if (emailCode) {
      setIsModalOpen(false);
      // 重置密码
      if (reset) {
        fetchRePwd({ ...signBody, token, emailCode });
      } else {
        const { token }: any = await queryToken();
        // 验证码登录
        fetchEmailSign({ ...signBody, token, emailCode });
      }
    } else {
      messageApi.open({
        type: "error",
        content: t("emailCodeNull"),
      });
    }
  };

  return (
    <div>
      <ConfigProvider>
        <Modal
          title={modalTitle}
          open={isModalOpen}
          mask={true}
          maskClosable={false}
          keyboard={false}
          closeIcon={false}
          footer={null}
        >
          <div className={styles.emailModal}>
            <Input
              placeholder={t("placeEmailCode")}
              prefix={<EditFilled />}
              maxLength={6}
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
            />
            <Button type="primary" onClick={handleModelSubmit}>{t('confirm')}</Button>
          </div>
        </Modal>
      </ConfigProvider>
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        onFinish={handleSubmit}
      >
        <Form.Item<LoginType>
          name="username"
          rules={[{ required: true, message: t("placeName") }]}
        >
          <Input prefix={<UserOutlined />} placeholder={t("name")} disabled={reset} />
        </Form.Item>
        <Form.Item<LoginType>
          name="password"
          rules={[{ required: true, message: t("placePwd") }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder={t("pwd")}
          />
        </Form.Item>
        {reset && <><Form.Item<LoginType>
          name="newPwd"
          rules={[{ required: true, message: t("placeNewPwd") }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder={t("newPwd")}
          />
        </Form.Item>
          <Form.Item<LoginType>
            name="conPwd"
            rules={[{ required: true, message: t("placeConPwd") }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder={t("conPwd")}
            />
          </Form.Item>
          <Form.Item<LoginType>
            name="code"
            rules={[{ required: true, message: t("placeCode") }]}
          >
            <Space.Compact style={{ width: "100%" }}>
              <Input
                placeholder={t("code")}
                prefix={<CreditCardOutlined />}
                maxLength={6}
              />
              {!codeImg && <Button style={{ height: "42px" }} onClick={handleCode}>{t("queryCode")}</Button>}
              {codeImg && <Image src={codeImg} width={120} height={40} alt="codeImage" className={styles.codeImg} onClick={handleCode} />}
            </Space.Compact>
          </Form.Item>
        </>
        }
        {isHasImage && !reset && <Form.Item<LoginType>
          name="code"
          rules={[{ required: true, message: t("placeCode") }]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder={t("code")}
              prefix={<CreditCardOutlined />}
              maxLength={6}
            />
            {!codeImg && <Button style={{ height: "42px" }} onClick={handleCode}>{t("queryCode")}</Button>}
            {codeImg && <Image src={codeImg} width={120} height={40} alt="codeImage" className={styles.codeImg} onClick={handleCode} />}
          </Space.Compact>
        </Form.Item>}
        {contextHolder}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%", height: "42px" }}>
            {t("submit")}
          </Button>
        </Form.Item>
      </Form>
    </div >
  )
};

export default User;
