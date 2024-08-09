import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const CONVERSATION_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/conversation`;
const MESSAGES_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/message`;

const initialState = {
  status: "",
  error: "",
  hasNext: false,
  conversations: [],
  messages: [],
  activeConversation: {},
  notifications: [],
  files: [],
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
export const openCreateConversation = createAsyncThunk(
  "conversation/open_create",
  async (values, { rejectWithValue }) => {
    try {
      const { token, receiver_id, isGroup } = values;
      const { data } = await axios.post(
        `${CONVERSATION_ENDPOINT}`,
        { receiver_id, isGroup },
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

export const createGroupConversation = createAsyncThunk(
  "conversation/create_group",
  async (values, { rejectWithValue }) => {
    const { token, name, users } = values;
    try {
      const { data } = await axios.post(
        `${`${CONVERSATION_ENDPOINT}/group`}`,
        { name, users },
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

export const getConversationMessages = createAsyncThunk(
  "conversation/messages",
  async (values, { rejectWithValue }) => {
    const { token, conversation_id, lang, page } = values;
    try {
      const { data } = await axios.get(
        `${MESSAGES_ENDPOINT}/${conversation_id}?lang=${lang}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.length > 0) {
        const messages = await data.slice().reverse();
        return messages;
      }
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
    const otherUserId = values.otherUserId;

    try {
      const { data } = await axios.post(
        `${MESSAGES_ENDPOINT}`,
        { message, conversation_id, files, otherUserId },
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
      state.files = [];
    },

    updateMessagesAndConversation: (state, action) => {
      // update the messages
      if (state.activeConversation._id === action?.payload?.conversation._id) {
        const existingMessage = state.messages.find(
          (message) => message._id === action.payload._id,
        );

        if (!existingMessage) {
          state.messages = [...state.messages, action.payload];
        }
      }

      // update the conversation
      const conversation = {
        ...action?.payload?.conversation,
        latestMessage: action.payload,
      };
      const newConversation = [...state.conversations].filter(
        (conv) => conv._id !== conversation._id,
      );
      newConversation.unshift(conversation);
      state.conversations = newConversation;
    },

    addFiles: (state, action) => {
      state.files = [...state.files, action.payload];
    },
    emptyFile: (state) => {
      state.files = [];
    },
    removeFile: (state, action) => {
      state.files = state.files.filter((_, index) => index !== action.payload);
    },
    emptyMessages: (state) => {
      state.messages = [];
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    setHasNext: (state, action) => {
      state.hasNext = action.payload;
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
      .addCase(openCreateConversation.pending, (state) => {
        state.status = "loading";
      })

      .addCase(openCreateConversation.fulfilled, (state, action) => {
        state.status = "success";
        state.activeConversation = action.payload;
      })
      .addCase(openCreateConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getConversationMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.status = "success";
        if (action?.payload?.length > 0) {
          state.messages = [...action?.payload, ...state?.messages];
        } else {
          state.hasNext = false;
        }
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

export const {
  setActiveConversation,
  updateMessagesAndConversation,
  addFiles,
  removeFile,
  emptyFile,
  setMessages,
  emptyMessages,
  setHasNext,
} = chatSlice.actions;

export default chatSlice.reducer;
