import { createSlice } from "@reduxjs/toolkit";
import { FriendsData } from "../types/types";

const initialState: FriendsData = {
  success: false,
  friends: [],
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
  },
});

export const { setFriends } = friendsSlice.actions;

export default friendsSlice.reducer;
