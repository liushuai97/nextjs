import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"
import rootReducer from "./store";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
  blacklist: []
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    })
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

export default makeStore;
