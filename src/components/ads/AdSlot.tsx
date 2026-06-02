import { useEffect } from 'react';
import { initAdsForUser, loadAds } from '@/ads';
import { useFeatureGate } from '@/hooks/useFeatureGate';

interface AdSlotProps {
  size?: 'banner' | 'square' | 'sidebar';
  placement?: string;
  provider?: string;
  fallback?: React.ReactNode;
  className?: string;
}

export function AdSlot({
  size = 'banner',
  placement = 'unknown',
  provider,
  fallback,
  className,
}: AdSlotProps) {
  const { isFreePlan } = useFeatureGate();

  useEffect(() => {
    // initialize ad system only for free users
    if (!isFreePlan()) return;

    initAdsForUser();

    // optionally load provider-specific scripts
    if (provider) {
      loadAds(provider, placement).catch(() => {
        // swallow errors for now — fallback will display
      });
    }
  }, [isFreePlan, provider, placement]);

  if (!isFreePlan()) return null;

  const base = `ad-slot placement-${placement} ${className || ''}`;

  // simple placeholder creatives with responsive behavior
  if (size === 'banner') {
    return (
      <div className={base} aria-hidden>
        {/* Desktop: full-width banner */}
        <div className="hidden sm:block w-full h-20 rounded-md border border-border bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center text-sm text-muted-foreground">
          {fallback || <span className="font-medium">Ad Space — Banner</span>}
        </div>

        {/* Mobile: 300x250 rectangle centered */}
        <div className="block sm:hidden w-[300px] h-[250px] mx-auto rounded-md border border-border bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center text-sm text-muted-foreground">
          {fallback || <span className="font-medium">Ad Space 300x250</span>}
        </div>
      </div>
    );
  }

  if (size === 'square') {
    return (
      <div className={base} aria-hidden>
        <div className="w-[300px] h-[250px] rounded-md border border-border bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center text-sm text-muted-foreground mx-auto">
          {fallback || <span className="font-medium">Ad Space</span>}
        </div>
      </div>
    );
  }

  // sidebar
  return (
    <aside className={base} aria-hidden>
      <div className="hidden lg:block w-64 rounded-md border border-border bg-secondary/5 dark:bg-secondary/20 p-4">
        <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
          {fallback || <span className="font-medium">Sponsored</span>}
        </div>
      </div>
    </aside>
  );
}

export default AdSlot;
