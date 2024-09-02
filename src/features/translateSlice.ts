import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TranslateState {
  language: string;
}

const initialState: TranslateState = {
  language: "en",
};

const translateSlice = createSlice({
  name: "translate",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = translateSlice.actions;

export default translateSlice.reducer;
