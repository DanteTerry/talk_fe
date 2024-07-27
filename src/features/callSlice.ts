import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
    setCall: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setCall } = callSlice.actions;
export default callSlice.reducer;
