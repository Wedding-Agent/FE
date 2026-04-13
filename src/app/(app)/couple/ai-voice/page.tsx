'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Mic } from 'lucide-react';

export default function AiVoicePage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', position: 'sticky', top: 0,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(229,231,235,0.5)', minHeight: 52, zIndex: 50,
      }}>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          style={{
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'rgba(241,245,249,0.8)', borderRadius: 10,
            color: 'rgba(50,50,70,0.7)', cursor: 'pointer',
          }}
        >
          <ChevronLeft size={22} />
        </button>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#20242c' }}>
          AI 음성 상담
        </span>
        <div style={{ width: 36 }} />
      </div>

      {/* 준비 중 */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
        padding: '48px 32px', textAlign: 'center',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(14,165,233,0.35)',
        }}>
          <Mic size={36} color="#fff" />
        </div>
        <p style={{ fontSize: 20, fontWeight: 900, color: '#20242c', margin: 0 }}>구현 예정</p>
        <p style={{ fontSize: 14, color: 'rgba(50,50,70,0.5)', margin: 0, lineHeight: 1.6 }}>
          AI 음성 상담 기능은 현재 개발 중입니다.<br />
          조금만 기다려 주세요!
        </p>
      </div>
    </div>
  );
}
