import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { setPage } = pageSlice.actions;
export default pageSlice.reducer;
