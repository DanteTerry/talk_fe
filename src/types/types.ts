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
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Conversation {
  _id: string;
  name: string;
  picture: string;
  isGroup: boolean;
  users: UserDataForUtil[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  latestMessage: Message;
}

export interface Message {
  _id: string;
  sender: User;
  message: string;
  conversation: Conversation;
  files: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CallData {
  socketId: string;
  receivingCall: boolean;
  callEnded: boolean;
  name: string;
  picture: string;
  signal: string;
  usersInCall: SocketUser[];
}

export interface UserForNotification {
  _id: string;
  name: string;
  email: string;
  picture: string;
}

export interface FriendRequest {
  _id: string;
  sender: UserForNotification;
  receiver: UserForNotification;
  status: "accepted" | "rejected" | "pending";
  requestDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface request {
  friendRequests: FriendRequest[];
}

export interface FriendRequestsResponse {
  success: boolean;
  friendRequests: request;
}

export interface CallState {
  receivingCall: boolean;
  callEnded: boolean;
  socketId: string;
  name: string;
  picture: string;
  signal: string;
  myPeerId: string;
  remotePeerId: string;
}

export interface FriendsData {
  success: boolean;
  friends: User[];
  activeFriend: User | null;
}

export interface SocketUser {
  userId: string;
  socketId: string;
}

export interface ToggleVideoPayload {
  userId: string;
  enabled: boolean;
}

export interface ToggleAudioPayload {
  userId: string;
  enabled: boolean;
}

export interface UploadedFile {
  file: {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: string;
    access_mode: string;
    original_filename: string;
  };
  type: string;
}

export interface FileItem {
  file: UploadedFile | File;
  type: "IMAGE" | "VIDEO" | "DOCUMENT" | "OTHER"; // Adjust as necessary
  fileData: string; // URL or base64 string representing file data
}

export type FileData = {
  file: File;
  fileData: string;
  type:
    | "TXT"
    | "PDF"
    | "DOCX"
    | "XLSX"
    | "PPTX"
    | "VIDEO"
    | "MP3"
    | "OGG"
    | "WAV"
    | "ARCHIVE"
    | "IMAGE";
};

export interface UserDataForUtil {
  _id: string;
  name: string;
  email: string;
  picture: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface searchResult {
  value: string;
  label: string;
  picture: string;
}
