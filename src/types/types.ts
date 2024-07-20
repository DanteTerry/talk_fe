export interface ErrorResponse {
  status: number;
  success: boolean;
  message: string;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  picture: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  latestMessage?: unknown;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  picture: string;
  status: string;
}

export interface Conversation {
  _id: string;
  name: string;
  picture: string;
  isGroup: boolean;
  users: User[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  latestMessage: string;
}

export interface Message {
  _id: string;
  sender: User;
  message: string;
  conversation: Conversation;
  files: string[]; // Adjust this type if you know the structure of files
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CallData {
  receivingCall: boolean;
  callEnded: boolean;
  socketId: string;
  name: string;
  picture: string;
  signal: string;
}
