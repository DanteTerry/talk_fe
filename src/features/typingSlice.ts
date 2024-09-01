import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TypingState = boolean;

const initialState: TypingState = false;

const typingSlice = createSlice({
  name: "typing",
  initialState,
  reducers: {
    setTyping: (_, action: PayloadAction<TypingState>) => {
      return action.payload;
    },
  },
});

// Export the action creators
export const { setTyping } = typingSlice.actions;

// Export the reducer
export default typingSlice.reducer;
