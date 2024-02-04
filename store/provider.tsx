"use client";
// 在 next 中服务组件无法访问状态和 redux，所以将其设置为客户端组件
import makeStore from "./index";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

type ProvidersProps = {
  children: React.ReactNode
};

const { store, persistor } = makeStore()

// 封装组件
export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
