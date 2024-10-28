import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  Conversation,
  ErrorResponse,
  FileData,
  Message,
  UploadedFile,
} from "../types/types"; // Adjust the import path according to your structure

const CONVERSATION_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/conversation`;
const MESSAGES_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/message`;

export interface ChatState {
  status: string;
  error: string;
  hasNext: boolean;
  conversations: Conversation[];
  messages: Message[];
  activeConversation: Conversation | null;
  notifications: Notification[];
  files: FileData[];
}

const initialState: ChatState = {
  status: "idle",
  error: "",
  hasNext: false,
  conversations: [],
  messages: [],
  activeConversation: null,
  notifications: [],
  files: [],
};

// Function to get all conversations
export const getConversation = createAsyncThunk<
  Conversation[], // Return type
  string, // Argument type (token)
  { rejectValue: string } // Rejection type
>("conversation/all", async (token, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(CONVERSATION_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    return rejectWithValue(
      (error as { response: { data: ErrorResponse } }).response.data.message,
    );
  }
});

// Function to open or create a conversation
export const openCreateConversation = createAsyncThunk<
  Conversation,
  { token: string; receiver_id: string; isGroup: boolean },
  { rejectValue: string }
>(
  "conversation/open_create",
  async ({ token, receiver_id, isGroup }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        CONVERSATION_ENDPOINT,
        { receiver_id, isGroup },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as { response: { data: ErrorResponse } }).response.data.message,
      );
    }
  },
);

// Function to create a group conversation
export const createGroupConversation = createAsyncThunk<
  Conversation,
  { token: string; name: string; users: string[] },
  { rejectValue: string }
>(
  "conversation/create_group",
  async ({ token, name, users }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${CONVERSATION_ENDPOINT}/group`,
        { name, users },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as { response: { data: ErrorResponse } }).response.data.message,
      );
    }
  },
);

// Function to get messages of a conversation
export const getConversationMessages = createAsyncThunk<
  Message[],
  { token: string; conversation_id: string; lang: string; page: number },
  { rejectValue: string }
>(
  "conversation/messages",
  async ({ token, conversation_id, lang, page }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${MESSAGES_ENDPOINT}/${conversation_id}?lang=${lang}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data.length > 0 ? data.slice().reverse() : [];
    } catch (error) {
      return rejectWithValue(
        (error as { response: { data: ErrorResponse } }).response.data.message,
      );
    }
  },
);

// Function to send a message
export const sendMessages = createAsyncThunk<
  Message,
  {
    sendMessage: string;
    conversation_id: string;
    token: string;
    files: UploadedFile[];
    otherUserId: string;
  },
  { rejectValue: string }
>(
  "message/send",
  async (
    { sendMessage, conversation_id, token, files, otherUserId },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post(
        MESSAGES_ENDPOINT,
        { message: sendMessage, conversation_id, files, otherUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return await data;
    } catch (error) {
      return rejectWithValue(
        (error as { response: { data: ErrorResponse } }).response.data.message,
      );
    }
  },
);

// Chat slice definition
export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (
      state,
      action: PayloadAction<Conversation | null>,
    ) => {
      state.activeConversation = action.payload;
      state.files = [];
    },
    removeMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    removeConversation: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    updateMessagesAndConversation: (state, action: PayloadAction<Message>) => {
      // Update messages if the conversation matches
      if (state.activeConversation?._id === action.payload.conversation._id) {
        const existingMessage = state.messages.find(
          (message) => message._id === action.payload._id,
        );

        if (!existingMessage) {
          state.messages.push(action.payload);
        }
      }

      // Update conversation list
      const conversation = {
        ...action.payload.conversation,
        latestMessage: action.payload,
      };
      const newConversations = state.conversations.filter(
        (conv) => conv._id !== conversation._id,
      );
      newConversations.unshift(conversation);
      state.conversations = newConversations;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addFiles: (state, action: PayloadAction<FileData>) => {
      state.files.push(action.payload);
    },
    removeFile: (state, action: PayloadAction<number>) => {
      state.files.splice(action.payload, 1);
    },
    emptyFile: (state) => {
      state.files = [];
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    emptyMessages: (state) => {
      state.messages = [];
    },
    setHasNext: (state, action: PayloadAction<boolean>) => {
      state.hasNext = action.payload;
    },
  },
  extraReducers: (builder) => {
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
        state.error = action.payload ?? "An error occurred";
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
        state.error = action.payload ?? "An error occurred";
      })
      .addCase(getConversationMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.status = "success";
        if (action.payload.length > 0) {
          const newMessages = action.payload.filter(
            (newMessage) =>
              !state.messages.some((message) => message._id === newMessage._id),
          );
          state.messages = [...newMessages, ...state.messages];
        } else {
          state.hasNext = false;
        }
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "An error occurred";
      })
      .addCase(sendMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessages.fulfilled, (state, action) => {
        state.status = "success";
        state.messages.push(action.payload);

        const conversation = {
          ...action.payload.conversation,
          latestMessage: action.payload,
        };
        const newConversations = state.conversations.filter(
          (conv) => conv._id !== conversation._id,
        );
        newConversations.unshift(conversation);
        state.conversations = newConversations;
      })
      .addCase(sendMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "An error occurred";
      });
  },
});

// Exporting actions and reducer
export const {
  setActiveConversation,
  updateMessagesAndConversation,
  addFiles,
  removeFile,
  emptyFile,
  setMessages,
  emptyMessages,
  setHasNext,
  removeMessages,
  removeConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
