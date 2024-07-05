import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const typingSlice = createSlice({
  name: "typing",
  initialState,
  reducers: {
    setTyping: (state, action) => {
      return action.payload;
    },
  },
});

export const { setTyping } = typingSlice.actions;

export default typingSlice.reducer;
