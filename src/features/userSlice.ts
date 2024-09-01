import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: "";
  name: string;
  email: string;
  picture: string;
  status: string;
  token: string;
}

// Define the initial state type
export interface UserState {
  user: User;
}

// Set up the initial state with proper types
const initialState: UserState = {
  user: {
    _id: "",
    name: "",
    email: "",
    picture: "",
    status: "",
    token: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = {
        _id: "",
        name: "",
        email: "",
        picture: "",
        status: "",
        token: "",
      };
    },
    logIn: (state, action: PayloadAction<User>) => {
      // Using PayloadAction<User> for proper typing
      state.user = action.payload;
    },
  },
});

// Export the actions
export const { logout, logIn } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
