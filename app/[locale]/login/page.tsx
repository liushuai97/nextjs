"use client";
import React, { useEffect, useState } from "react";
// Redux
import { useDispatch } from "react-redux";
import { setLanguage } from "@/store/user/userDataSlice";
// Tabs
import { Tabs, Popover } from "antd";
// Tabs类型
import type { TabsProps } from "antd";
// i18n
import { useTranslation } from "react-i18next";
// 路由
import { usePathname, useRouter } from "next/navigation";
// 图片
import Image from "next/image";
// 接口
import { queryCopyright } from "@/api/login";
// 样式
import styles from "@/styles/login.module.scss";
// 背景图
import loginBg from "@/public/images/login-bg.jpg";
// 组件
import User from "@/components/client/login/User";
import Email from "@/components/client/login/Email";
import Phone from "@/components/client/login/Phone";
import Cookies from "js-cookie";

// 登录
const Login = () => {
  // Redux方法
  const dispatch = useDispatch();
  // 初始信息
  const [sysInit, setSysInit] = useState({
    "zh-cn": {
      companyName: "",
      company: "",
      logo: "",
    },
    "en-us": {
      companyName: "",
      company: "",
      logo: "",
    },
    isHasImage: true,
    isSmsOrEmail: false
  });
  const fetchSys = async () => {
    const response: any = await queryCopyright();
    setSysInit(response);
  };
  useEffect(() => {
    fetchSys();
  }, []);
  // 中/英文
  const { t, i18n } = useTranslation("login");
  // 当前语言
  const currentLocale = i18n.language;
  document.title = sysInit[currentLocale === "zh" ? "zh-cn" : "en-us"].companyName;
  // 说明
  const ck = currentLocale === "zh" ? (<div className="text">
    <p>Cookie是放置在设备上的小文本文件，本系统使用</p>
    <p>Cookie存储在临时内存中，并在Web浏览器关闭时</p>
    <p>删除。只有允许使用Cookie才可以帮助您有效地浏</p>
    <p>览本系统。</p>
  </div>) : (<div className="text">
    <p>Cookie is a small text file placed on the device. </p>
    <p>This system uses Cookie to store in temporary </p>
    <p>memory and delete it when the Web browser</p>
    <p>closes. Only allowing Cookie can help you browse </p>
    <p>the system effectively.</p>
  </div>);
  const browser = currentLocale === "zh" ? (<div className="text">
    <p>Chrome70及以后版本</p>
    <p>Firefox70及以后版本</p>
    <p>Edge70及以后版本</p>
  </div>) : (<div className="text">
    <p>Chrome70 and later</p>
    <p>Firefox70 and later</p>
    <p>Edge70 and later</p>
  </div>);
  // 路由
  const router = useRouter();
  // 当前路由参数
  const currentPathname = usePathname();
  // 语言切换
  const handleChangeLanguage = () => {
    let newLocale: string = "zh";
    if (currentLocale === "zh") {
      dispatch(setLanguage("en"));
      newLocale = "en";
    } else {
      dispatch(setLanguage("zh"));
      newLocale = "zh";
    }
    Cookies.set("NEXT_LOCALE", newLocale === "en" ? "en-us" : "zh-cn");
    router.push(currentPathname.replace(`/${currentLocale}`, `/${newLocale}`));
    router.refresh();
  };
  // 登录方式  用户名 || 邮箱 || 短信
  const items: TabsProps["items"] = [{
    key: "user",
    label: t("user"),
    children: <User isHasImage={sysInit.isHasImage} />
  }, {
    key: "email",
    label: t("email"),
    children: <Email />
  }, {
    key: "phone",
    label: t("phone"),
    children: <Phone />
  }];
  return (
    <>
      {/* 语言切换 */}
      <span className={styles.language} onClick={handleChangeLanguage}>{t("language")}</span>
      {/* 登录 */}
      <div className={styles.login}>
        {/* 图片 */}
        <div className={styles.loginImg}>
          {loginBg && <Image alt="login-bg" src={loginBg} />}
        </div>
        {/* 表单 */}
        <div className={styles.loginFrom}>
          <div className={sysInit && sysInit.isSmsOrEmail ? styles.tabBox : styles.formBox}>
            {(sysInit && sysInit["zh-cn"].logo) && <Image alt="logo" src={currentLocale === "zh" ? sysInit["zh-cn"].logo : sysInit["en-us"].logo} width={150} height={46.5} />}
            {sysInit && sysInit.isSmsOrEmail ? <Tabs defaultActiveKey="1" items={items} /> : <User isHasImage={sysInit.isHasImage} />}
            <div className={styles.footer}>
              {currentLocale === "zh" ? <><span>使用本系统，需要允许使用<Popover placement="bottom" content={ck} title={""} rootClassName={styles.text}><i> Cookie</i></Popover></span></> : <><span><Popover placement="bottom" content={ck} title={""} rootClassName={styles.text}><i>Cookie</i></Popover> need to be allowed to use this system</span></>}
              <span><Popover placement="right" content={browser} title={""} rootClassName={styles.text}><i>{t("web")}</i></Popover></span>
            </div>
            <p className={styles.copyright}>{currentLocale === "zh" ? sysInit["zh-cn"].company : sysInit["en-us"].company}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
