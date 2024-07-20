import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  story: {},
  stories: [],
  shouldExit: false,
};

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    setStories: (state, action) => {
      state.stories = action.payload;
    },
    setStory: (state, action) => {
      state.story = action.payload;
    },
    setPreviousStory: (state, action) => {
      const index = state.stories.findIndex(
        (story) => story._id === action.payload
      );
      if (index === 0) {
        return;
      }

      state.story = state.stories[index - 1];
    },
    setNextStory: (state, action) => {
      const index = state.stories.findIndex(
        (story) => story._id === action.payload
      );
      if (index === state.stories.length - 1) {
        state.shouldExit = true;
        return;
      }

      state.story = state.stories[index + 1];
    },
    reset: () => initialState,
  },
});

export const { setStories, setStory, setPreviousStory, setNextStory, reset } =
  storySlice.actions;

export default storySlice.reducer;

export const state = (state) => state.auth;
