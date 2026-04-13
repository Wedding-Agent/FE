export type Role = 'couple' | 'planner' | 'vendor';

export interface User {
  id: string;
  nickname: string;
  role: Role;
}

export interface LoginResponse {
  access_token: string;
  user_id: string;
  nickname: string;
  role: Role;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  role: Role;
}
