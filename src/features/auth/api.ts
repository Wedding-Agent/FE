import { apiClient } from '@/lib/api-client';
import type { LoginResponse, SignupRequest } from '@/types/auth';
import type { LoginInput } from './schemas';

export async function loginApi(data: LoginInput): Promise<LoginResponse> {
  return apiClient.post('auth/login', { json: data }).json<LoginResponse>();
}

export async function signupApi(data: SignupRequest): Promise<void> {
  await apiClient.post('auth/signup', { json: data });
}
