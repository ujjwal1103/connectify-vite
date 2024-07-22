import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./services/postSlice";
import feedSlice from "./services/feedSlice";
import notificationsReducer from "./services/notificationSlice";
import chatReducer from "./services/chatSlice";
import storyReducer from "./services/storySlice";
import profileReducer from "./services/profileSlice";
import { messageApi } from "./services/messageApi";
import savedPostSlice from "./services/savedPostSlice";
import suggetionSlice from "./services/suggetionSlice";
import modalStateSlice from "./services/modalStateSlice";

export const store = configureStore({
  reducer: {
    post: postReducer,
    [feedSlice.reducerPath]: feedSlice.reducer,
    [savedPostSlice.reducerPath]: savedPostSlice.reducer,
    notifications: notificationsReducer,
    [suggetionSlice.name]: suggetionSlice.reducer,
    chat: chatReducer,
    story: storyReducer,
    profile: profileReducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [modalStateSlice.name]: modalStateSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(messageApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
