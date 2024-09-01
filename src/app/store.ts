import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import userSlice, { UserState } from "../features/userSlice";
import darkModeReducer, { DarkModeState } from "../features/darkmodeSlice";
import chatSlice, { ChatState } from "../features/chatSlice";
import onlineUserSlice, { onlineUser } from "../features/onlineUserSlice";
import typingSlice from "../features/typingSlice";
import translateSlice, { TranslateState } from "../features/translateSlice";
import notificationSlice from "../features/notificationSlice";
import friendsSlice from "../features/friendSlice";
import pageSlice, { PageState } from "../features/pageSlice";
import { FriendRequestsResponse, FriendsData } from "../types/types";

export interface RootState {
  user: UserState;
  darkMode: DarkModeState;
  chat: ChatState;
  onlineUsers: onlineUser[];
  typing: boolean;
  translate: TranslateState;
  notification: FriendRequestsResponse;
  friends: FriendsData;
  page: PageState;
}

// Create a filter to save specific slices
const saveUserAndDarkModeFilter = createFilter("root", [
  "user",
  "darkMode",
  "translate",
]);

// Combine all the reducers into a root reducer
const rootReducer = combineReducers({
  user: userSlice,
  darkMode: darkModeReducer,
  chat: chatSlice,
  onlineUsers: onlineUserSlice,
  typing: typingSlice,
  translate: translateSlice,
  notification: notificationSlice,
  friends: friendsSlice,
  page: pageSlice,
});

// Define the persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "darkMode", "translate"],
  transforms: [saveUserAndDarkModeFilter],
};

// Create a persisted reducer
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persister = persistStore(store);

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;
export type AppState = RootState;
