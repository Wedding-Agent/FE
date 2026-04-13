import { Heart } from 'lucide-react';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Heart size={28} className="text-brand fill-brand" />
          <h1 className="text-2xl font-bold text-text-primary">Promise Marry</h1>
        </div>
        <p className="text-text-muted text-sm">AI 기반 웨딩 플래너 서비스</p>
      </div>

      <div className="bg-surface rounded-card p-6 shadow-sm border border-border">
        <h2 className="text-lg font-bold text-text-primary mb-6">로그인</h2>
        <LoginForm />
      </div>
    </div>
  );
}
