import { ClipboardList, Sparkles } from 'lucide-react';
import { BigCard } from '@/components/home/BigCard';
import { ServiceGrid } from '@/components/home/ServiceGrid';
import { GreetingBanner } from '@/components/home/GreetingBanner';
import { CommunityBanner } from '@/components/home/CommunityBanner';
import { SERVICE_GRID_ITEMS } from '@/config/service-grid';

export default function VendorPage() {
  return (
    <div className="space-y-6 pt-2">
      {/* 1. 인사말 */}
      <GreetingBanner role="vendor" />

      {/* 2. 2-up 대형 카드 */}
      <div className="grid grid-cols-2 gap-3">
        <BigCard
          title="예약 관리"
          subtitle="고객 예약 현황"
          Icon={ClipboardList}
          href="/vendor/reservations"
          gradient="bg-gradient-to-br from-[#FF8A3D] to-[#FF4D6D]"
        />
        <BigCard
          title="AI 업체 비서"
          subtitle="업무 자동화"
          Icon={Sparkles}
          href="/vendor/ai"
          gradient="bg-gradient-to-br from-[#1FB28C] to-[#0E8A6C]"
        />
      </div>

      {/* 3. 서비스 그리드 (8개) */}
      <section>
        <h2 className="text-sm font-semibold text-text-muted mb-3">업체 서비스</h2>
        <ServiceGrid items={SERVICE_GRID_ITEMS.vendor} />
      </section>

      {/* 4. 동종 업계 게시판 배너 */}
      <CommunityBanner
        href="/vendor/board"
        title="동종 업계 게시판"
        description="같은 분야 업체들과 정보를 교류해요"
        darkStyle
      />
    </div>
  );
}
