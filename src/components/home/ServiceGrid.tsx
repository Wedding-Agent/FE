import Link from 'next/link';
import type { ServiceGridItem } from '@/config/service-grid';
import { cn } from '@/lib/cn';

interface ServiceGridProps {
  items: ServiceGridItem[];
}

export function ServiceGrid({ items }: ServiceGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map(({ label, Icon, href, bgColor, iconColor }) => (
        <Link
          key={href + label}
          href={href}
          className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
        >
          <div
            className={cn(
              'w-14 h-14 rounded-icon flex items-center justify-center',
              bgColor
            )}
          >
            <Icon size={24} strokeWidth={1.75} className={iconColor} />
          </div>
          <span className="text-[10px] text-text-muted text-center leading-tight font-medium whitespace-pre-line">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}
