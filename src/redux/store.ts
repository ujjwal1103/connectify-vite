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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(messageApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
