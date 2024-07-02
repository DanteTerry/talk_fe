import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const CONVERSATION_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/conversation`;
console.log(CONVERSATION_ENDPOINT);

const initialState = {
  status: "",
  error: "",
  conversations: [],
  activeConversation: {},
  notifications: [],
};

// function
export const getConversation = createAsyncThunk(
  "conversation/all",
  async (token, { rejectWithValue }) => {
    try {
      console.log(token);
      const { data } = await axios.get(`${CONVERSATION_ENDPOINT}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(data);
      return data;
    } catch (error: unknown) {
      console.log(error);
      return rejectWithValue(error.response.data.error.message);
    }
  },
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getConversation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.status = "success";
        state.conversations = action.payload;
      })
      .addCase(getConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setActiveConversation } = chatSlice.actions;

export default chatSlice.reducer;
