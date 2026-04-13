'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signupSchema, type SignupInput } from '@/features/auth/schemas';
import { useSignup } from '@/features/auth/hooks';
import type { Role } from '@/types/auth';
import { cn } from '@/lib/cn';

const ROLE_BUTTON_STYLE: Record<Role, string> = {
  couple: 'bg-gradient-to-r from-[#FF6B8A] to-[#9B5DE5] hover:opacity-90',
  planner: 'bg-gradient-to-r from-[#2E7BFF] to-[#6E4BFF] hover:opacity-90',
  vendor: 'bg-gradient-to-r from-[#FF8A3D] to-[#1FB28C] hover:opacity-90',
};

interface RoleSignupFormProps {
  role: Role;
}

export function RoleSignupForm({ role }: RoleSignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signup, isPending } = useSignup(role);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const inputClass = (hasError: boolean) =>
    cn(
      'w-full px-4 py-3 rounded-xl border bg-surface text-text-primary text-sm',
      'placeholder:text-text-muted outline-none transition-colors',
      'focus:ring-2 focus:ring-brand/20',
      hasError ? 'border-red-400 focus:border-red-400' : 'border-border focus:border-brand'
    );

  return (
    <form onSubmit={handleSubmit((data) => signup(data))} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="nickname" className="text-sm font-medium text-text-primary">닉네임</label>
        <input
          id="nickname"
          type="text"
          placeholder="닉네임을 입력해주세요"
          className={inputClass(!!errors.nickname)}
          {...register('nickname')}
        />
        {errors.nickname && <p className="text-xs text-red-500">{errors.nickname.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-text-primary">이메일</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="이메일을 입력해주세요"
          className={inputClass(!!errors.email)}
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-text-primary">비밀번호</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="8자 이상 입력해주세요"
            className={cn(inputClass(!!errors.password), 'pr-12')}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="passwordConfirm" className="text-sm font-medium text-text-primary">
          비밀번호 확인
        </label>
        <input
          id="passwordConfirm"
          type="password"
          autoComplete="new-password"
          placeholder="비밀번호를 다시 입력해주세요"
          className={inputClass(!!errors.passwordConfirm)}
          {...register('passwordConfirm')}
        />
        {errors.passwordConfirm && (
          <p className="text-xs text-red-500">{errors.passwordConfirm.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all',
          'active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed',
          'flex items-center justify-center gap-2',
          ROLE_BUTTON_STYLE[role]
        )}
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        회원가입
      </button>
    </form>
  );
}
