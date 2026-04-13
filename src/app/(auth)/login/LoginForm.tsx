'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/features/auth/schemas';
import { useLogin } from '@/features/auth/hooks';
import { cn } from '@/lib/cn';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-text-primary">
          이메일
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="이메일을 입력해주세요"
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-surface text-text-primary text-sm',
            'placeholder:text-text-muted outline-none transition-colors',
            'focus:border-brand focus:ring-2 focus:ring-brand/20',
            errors.email ? 'border-red-400' : 'border-border'
          )}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-text-primary">
          비밀번호
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="비밀번호를 입력해주세요"
            className={cn(
              'w-full px-4 py-3 pr-12 rounded-xl border bg-surface text-text-primary text-sm',
              'placeholder:text-text-muted outline-none transition-colors',
              'focus:border-brand focus:ring-2 focus:ring-brand/20',
              errors.password ? 'border-red-400' : 'border-border'
            )}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all',
          'bg-brand hover:bg-[#E63956] active:scale-[0.98]',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          'flex items-center justify-center gap-2'
        )}
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        로그인
      </button>

      <p className="text-center text-sm text-text-muted">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="text-brand font-medium hover:underline">
          회원가입
        </Link>
      </p>

      {/* 개발 편의용 mock 계정 안내 */}
      <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-600 space-y-0.5">
        <p className="font-semibold">테스트 계정</p>
        <p>커플: couple@test.com / 비밀번호1234</p>
        <p>플래너: planner@test.com / 비밀번호1234</p>
        <p>업체: vendor@test.com / 비밀번호1234</p>
      </div>
    </form>
  );
}
