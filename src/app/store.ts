import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import userSlice from "../features/userSlice";

const saveUserOnlyFilter = createFilter("user", ["user"]);
const rootReducer = combineReducers({
  user: userSlice,
});

//persisting the user state in the local storage
const persistConfig = {
  key: "user",
  storage,
  whitelist: ["user"],
  transform: [saveUserOnlyFilter],
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

export const persistor = persistStore(store);
