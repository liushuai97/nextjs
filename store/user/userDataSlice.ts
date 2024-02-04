import { createSlice } from "@reduxjs/toolkit";

// 定义接口
interface UserState {
  info: {} | null,
  jwt: string | null,
  language: string
};

// 继承接口类型
const initialState: UserState = {
  info: null,
  jwt: null,
  language: "zh"
};

export const userSlice = createSlice({
  // 名称
  name: "user",
  // 初始化State
  initialState,
  // 同步方法，支持修改
  reducers: {
    setInfo: (state, action) => {
      state.info = action.payload;
    },
    setJwt: (state, action) => {
      state.jwt = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload
    },
    logOut: () => {
      return initialState
    }
  }
});

// 解构出来 actionCreater 函数
export const { setInfo, setJwt, setLanguage, logOut } = userSlice.actions;

// 获取 reducer 函数并导出
export const userReducer = userSlice.reducer;
