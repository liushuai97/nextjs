import { combineReducers } from 'redux';
import { userReducer } from "@/store/user/userDataSlice";

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
