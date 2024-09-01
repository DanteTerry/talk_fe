import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CallState } from "../types/types";

const initialState: CallState = {
  receivingCall: false,
  callEnded: false,
  socketId: "",
  name: "",
  picture: "",
  signal: "",
  myPeerId: "",
  remotePeerId: "",
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setCall: (state, action: PayloadAction<Partial<CallState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setCall } = callSlice.actions;
export default callSlice.reducer;
