import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FriendsData, User } from "../types/types";

const initialState: FriendsData = {
  success: false,
  friends: [],
  activeFriend: {
    _id: "",
    name: "",
    email: "",
    picture: "",
    status: "",
    createdAt: "",
    updatedAt: "",
    __v: 0,
  },
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<User[]>) => {
      state.friends = action.payload;
    },

    setActiveFriend: (state, action: PayloadAction<User | null>) => {
      state.activeFriend = action.payload;
    },
  },
});

export const { setFriends, setActiveFriend } = friendsSlice.actions;

export default friendsSlice.reducer;
