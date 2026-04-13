import { CalendarDays, Sparkles } from 'lucide-react';
import { BigCard } from '@/components/home/BigCard';
import { ServiceGrid } from '@/components/home/ServiceGrid';
import { GreetingBanner } from '@/components/home/GreetingBanner';
import { CommunityBanner } from '@/components/home/CommunityBanner';
import { SERVICE_GRID_ITEMS } from '@/config/service-grid';

export default function CouplePage() {
  return (
    <div className="space-y-6 pt-2">
      {/* 1. 인사말 */}
      <GreetingBanner role="couple" />

      {/* 2. 2-up 대형 카드 */}
      <div className="grid grid-cols-2 gap-3">
        <BigCard
          title="웨딩 캘린더"
          subtitle="다음 일정을 확인해요"
          Icon={CalendarDays}
          href="/couple/calendar"
          gradient="bg-gradient-to-br from-[#FF6B8A] to-[#9B5DE5]"
        />
        <BigCard
          title="AI 웨딩 비서"
          subtitle="지금 시작하기"
          Icon={Sparkles}
          href="/couple/ai"
          gradient="bg-gradient-to-br from-[#9B5DE5] to-[#5E3FBE]"
        />
      </div>

      {/* 3. 서비스 그리드 (8개) */}
      <section>
        <h2 className="text-sm font-semibold text-text-muted mb-3">서비스</h2>
        <ServiceGrid items={SERVICE_GRID_ITEMS.couple} />
      </section>

      {/* 4. 웨딩 커뮤니티 배너 */}
      <CommunityBanner
        href="/couple/community"
        title="웨딩 커뮤니티"
        description="다른 커플들의 이야기를 확인해보세요"
        darkStyle
      />
    </div>
  );
}
