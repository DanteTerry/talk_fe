import { createSlice } from "@reduxjs/toolkit";
import { FriendRequestsResponse } from "../types/types";

const initialState: FriendRequestsResponse = {
  success: false,
  friendRequests: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setFriendRequests: (state, action) => {
      state.friendRequests = action.payload;
    },

    setRequestStatus: (state, action) => {
      const { requestId, status } = action.payload;

      if (state.friendRequests.length === 0) return;

      const updatedRequests = state.friendRequests.map((request) => {
        if (request._id === requestId) {
          return {
            ...request,
            status,
          };
        }

        return request;
      });

      state.friendRequests = updatedRequests;
    },
  },
});

export const { setFriendRequests, setRequestStatus } =
  notificationSlice.actions;

export default notificationSlice.reducer;
