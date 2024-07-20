import { createSlice } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

const initialState = {
  suggestedusers: [],
  loading: true,
};

const suggetionSlice = createSlice({
  name: "suggestion",
  initialState,
  reducers: {
    setSuggetions: (state, action) => {
      state.loading = false;
      state.suggestedusers = action.payload;
    },
    reset: () => initialState,
  },
});

export const useSuggetionsSlice = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state[suggetionSlice.name]);
  const { actions } = suggetionSlice;
  const setSuggetions = useCallback((suggetions: any[]) => {
    dispatch(actions.setSuggetions(suggetions));
  }, []);

  return { ...state, setSuggetions };
};

export default suggetionSlice;
