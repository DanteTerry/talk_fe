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
