export type Role = 'couple' | 'planner' | 'vendor';

export type OAuthProvider = 'email' | 'kakao' | 'google' | 'naver' | 'apple';

export const PROVIDER_LABEL: Record<OAuthProvider, string> = {
  email:  '이메일',
  kakao:  '카카오',
  google: '구글',
  naver:  '네이버',
  apple:  '애플',
};

export const PROVIDER_EMOJI: Record<OAuthProvider, string> = {
  email:  '📧',
  kakao:  '💬',
  google: 'G',
  naver:  'N',
  apple:  '',
};

export const PROVIDER_COLOR: Record<OAuthProvider, { bg: string; text: string }> = {
  email:  { bg: 'rgba(100,116,139,0.12)', text: '#475569' },
  kakao:  { bg: '#FEE500',                text: '#3C1E1E' },
  google: { bg: '#EEF2FF',                text: '#4285F4' },
  naver:  { bg: '#E8F9EE',                text: '#03C75A' },
  apple:  { bg: '#1C1C1E',                text: '#FFFFFF' },
};

export const ROLE_LABEL: Record<Role, string> = {
  couple:  '커플',
  planner: '플래너',
  vendor:  '업체',
};

export interface User {
  id: string;
  nickname: string;
  role: Role;
  email?: string;
  provider?: OAuthProvider;
  createdAt?: string;
}

export interface LoginResponse {
  access_token: string;
  user_id: string;
  nickname: string;
  role: Role;
  email?: string;
  provider?: OAuthProvider;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  role: Role;
}
