import "@/styles/globals.css";
import React from "react";
import { Providers } from "@/store/provider";
import StyledComponentsRegistry from "@/components/AntdRegistry";
// 自定义主题
import { ConfigProvider } from "antd";
import theme from "@/theme/themeConfig";

import { dir } from "i18next";
import i18nConfig from "@/locales/i18n";
import TranslationsProvider from "@/components/TranslationsProvider";
import initTranslations from "@/locales";

import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";

// 静态生成路由
export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
};

export default async function LocalLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { t, options } = await initTranslations(locale);

  const antdLocale = locale === "zh" ? zhCN : enUS;

  return (
    <html lang={locale} dir={dir(locale)}>
      <body>
        <TranslationsProvider namespaces={options.ns as string[]} locale={locale}>
          {/* 首屏样式按需抽离并植入到 HTML 中，以避免页面闪动 */}
          <StyledComponentsRegistry>
            {/* 注入Redux公共状态管理 */}
            <Providers>
              {/* antd自定义主题 */}
              <ConfigProvider theme={theme} locale={antdLocale}>
                {children}
              </ConfigProvider>
            </Providers>
          </StyledComponentsRegistry>
        </TranslationsProvider>
      </body>
    </html >
  );
};
