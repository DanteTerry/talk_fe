import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export type OnlineUserState = User[];

export interface onlineUser {
  userId: string;
  socketId: string;
}

// Set the initial state with its type
const initialState: onlineUser[] = [];

// Define the slice
const onlineUserSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    // Type the action payload as an array of User objects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOnlineUsers: (_state, action: PayloadAction<onlineUser[]>) => {
      return action.payload;
    },
  },
});

// Export the action creator
export const { setOnlineUsers } = onlineUserSlice.actions;

// Export the reducer
export default onlineUserSlice.reducer;
