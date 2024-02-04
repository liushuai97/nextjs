"use client";
import React from "react";

const MeterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // 控制台模板
    <div>
      {/* 侧边栏 */}
      {/* 顶部菜单 */}
      {/* 内容页 */}
      {children}
      {/* 底部版权信息 */}
    </div>
  );
};

export default MeterLayout;
