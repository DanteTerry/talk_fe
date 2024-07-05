import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const CONVERSATION_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/conversation`;
const MESSAGES_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/message`;

const initialState = {
  status: "",
  error: "",
  conversations: [],
  messages: [],
  activeConversation: {},
  notifications: [],
};

// function to get all conversations
export const getConversation = createAsyncThunk(
  "conversation/all",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${CONVERSATION_ENDPOINT}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error: unknown) {
      console.log(error);
      return rejectWithValue(error.response.data.error.message);
    }
  },
);

export const getConversationMessages = createAsyncThunk(
  "conversation/messages",
  async (values, { rejectWithValue }) => {
    const { token, conversation_id } = values;
    try {
      const { data } = await axios.get(
        `${MESSAGES_ENDPOINT}/${conversation_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data;
    } catch (error: unknown) {
      console.log(error);
      return rejectWithValue(error.response.data.error.message);
    }
  },
);

export const sendMessages = createAsyncThunk(
  "message/send",
  async (values, { rejectWithValue }) => {
    const message = values.sendMessage;
    const conversation_id = values.conversation_id;
    const token = values.token;
    const files = values.files;

    try {
      const { data } = await axios.post(
        `${MESSAGES_ENDPOINT}`,
        { message, conversation_id, files },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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
    updateMessagesAndConversation: (state, action) => {
      // update the messages
      if (state.activeConversation._id === action.payload.conversation._id) {
        state.messages = [...state.messages, action.payload];
      }

      // update the conversation
      const conversation = {
        ...action.payload.conversation,
        latestMessage: action.payload,
      };
      const newConversation = [...state.conversations].filter(
        (conv) => conv._id !== conversation._id,
      );
      newConversation.unshift(conversation);
      state.conversations = newConversation;
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
      })
      .addCase(getConversationMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.status = "success";
        state.messages = action.payload;
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessages.fulfilled, (state, action) => {
        state.status = "success";
        state.messages = [...state.messages, action.payload];
        const conversation = {
          ...action.payload.conversation,
          latestMessage: action.payload,
        };
        const newConversation = [...state.conversations].filter(
          (conv) => conv._id !== conversation._id,
        );
        newConversation.unshift(conversation);
        state.conversations = newConversation;
      })
      .addCase(sendMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setActiveConversation, updateMessagesAndConversation } =
  chatSlice.actions;

export default chatSlice.reducer;
