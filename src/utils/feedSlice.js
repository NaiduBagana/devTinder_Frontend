import { createSlice } from "@reduxjs/toolkit";

const feedStore = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeFeed: (state) => {
      return null;
    },
    removeUserFromFeed: (state, action) => {
      // Remove specific user by ID
      return state?.filter((user) => user._id !== action.payload) || null;
    },
  },
});

export const { addFeed, removeFeed, removeUserFromFeed } = feedStore.actions;
export default feedStore.reducer;
