import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "en",
};

const translateSlice = createSlice({
  name: "translate",
  initialState: initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = translateSlice.actions;

export default translateSlice.reducer;
