import { CalendarDays, Sparkles } from 'lucide-react';
import { BigCard } from '@/components/home/BigCard';
import { ServiceGrid } from '@/components/home/ServiceGrid';
import { GreetingBanner } from '@/components/home/GreetingBanner';
import { CommunityBanner } from '@/components/home/CommunityBanner';
import { SERVICE_GRID_ITEMS } from '@/config/service-grid';

export default function PlannerPage() {
  return (
    <div className="space-y-6 pt-2">
      {/* 1. 인사말 */}
      <GreetingBanner role="planner" />

      {/* 2. 2-up 대형 카드 */}
      <div className="grid grid-cols-2 gap-3">
        <BigCard
          title="일정 관리"
          subtitle="고객·내 일정 보기"
          Icon={CalendarDays}
          href="/planner/calendar"
          gradient="bg-gradient-to-br from-[#2E7BFF] to-[#6E4BFF]"
        />
        <BigCard
          title="AI 플래너 비서"
          subtitle="업무 자동화"
          Icon={Sparkles}
          href="/planner/ai"
          gradient="bg-gradient-to-br from-[#E040FB] to-[#6E4BFF]"
        />
      </div>

      {/* 3. 서비스 그리드 (8개) */}
      <section>
        <h2 className="text-sm font-semibold text-text-muted mb-3">플래너 서비스</h2>
        <ServiceGrid items={SERVICE_GRID_ITEMS.planner} />
      </section>

      {/* 4. 플래너 계획 추천 배너 */}
      <CommunityBanner
        href="/planner/board"
        title="플래너 게시판"
        description="동료 플래너들과 정보를 공유해요"
        darkStyle
      />
    </div>
  );
}
