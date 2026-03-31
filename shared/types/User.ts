export type UserRole = "user" | "admin" | "seller";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: UserRole[];
}

export interface UserRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  uid: string;
  accessToken: string;
  refreshToken: string;
}
