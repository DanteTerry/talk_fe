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
