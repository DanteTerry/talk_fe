import { createSlice } from "@reduxjs/toolkit";
import { FriendsData } from "../types/types";

const initialState: FriendsData = {
  success: false,
  friends: [],
  activeFriend: {
    _id: "",
    name: "",
    email: "",
    picture: "",
  },
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setActiveFriend: (state, action) => {
      state.activeFriend = action.payload;
    },
  },
});

export const { setFriends, setActiveFriend } = friendsSlice.actions;

export default friendsSlice.reducer;
