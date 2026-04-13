import { Heart } from 'lucide-react';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--gradient-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-brand)',
          }}>
            <Heart size={24} color="#fff" fill="#fff" />
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Promise Marry</h1>
        <p className="text-text-muted text-sm">AI 기반 웨딩 플래너 서비스</p>
      </div>

      {/* 카드 */}
      <div style={{
        background: '#fff',
        borderRadius: 28,
        padding: '32px 28px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
        border: '1px solid rgba(229,231,235,0.6)',
      }}>
        <h2 className="text-xl font-bold text-text-primary mb-6">로그인</h2>
        <LoginForm />
      </div>
    </div>
  );
}
