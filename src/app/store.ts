import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import userSlice from "../features/userSlice";
import darkModeReducer from "../features/darkmodeSlice";
import chatSlice from "../features/chatSlice";
import onlineUserSlice from "../features/onlineUserSlice";
import typingSlice from "../features/typingSlice";
import translateSlice from "../features/translateSlice";

const saveUserAndDarkModeFilter = createFilter("root", [
  "user",
  "darkMode",
  "translate",
]);

const rootReducer = combineReducers({
  user: userSlice,
  darkMode: darkModeReducer,
  chat: chatSlice,
  onlineUsers: onlineUserSlice,
  typing: typingSlice,
  translate: translateSlice,
});

// persisting the user and darkMode state in the local storage
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "darkMode", "translate"],
  transforms: [saveUserAndDarkModeFilter],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persister = persistStore(store);
