// notificationsSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Action to add a new notification
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    // set notification
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    // Action to remove a notification by its ID
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload
      );
    },
    // Action to clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
    },
    reset: () => initialState,
  },
});

// Export actions
export const {
  addNotification,
  removeNotification,
  clearNotifications,
  setNotifications,
  reset,
} = notificationsSlice.actions;

// Export selectors
export const selectNotifications = (state) => state.notifications.notifications;

// Export the reducer
export default notificationsSlice.reducer;
