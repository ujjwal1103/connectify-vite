import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface NotificationSliceState {
  notifications: any[];
}

const initialState: NotificationSliceState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },

    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },

    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload
      );
    },

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
export const selectNotifications = (state: RootState) =>
  state.notifications.notifications;

// Export the reducer
export default notificationsSlice.reducer;
