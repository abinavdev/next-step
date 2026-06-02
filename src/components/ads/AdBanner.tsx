import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  placement?: string;
  className?: string;
}

export default function AdBanner({
  placement = 'dashboard',
  className,
}: AdBannerProps) {
  const { isFreePlan } = useFeatureGate();
  const navigate = useNavigate();
  const [closed, setClosed] = useState(false);

  // Ads only for free plan
  if (!isFreePlan() || closed) return null;

  return (
    <section
      aria-label="Sponsored"
      data-placement={placement}
      className={cn(
        'w-full rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5',
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 text-xs font-bold text-red-400">
          Ad
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
            Sponsored
          </p>
          <p className="mt-1 text-sm text-foreground">
            Mock sponsor: curated career bundles, interview prep, and project templates.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Remove ads by upgrading to Project Assistance or Mentor Support.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => navigate('/pricing')}
          className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500"
        >
          Upgrade Now
        </button>
        <button
          type="button"
          onClick={() => setClosed(true)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>
    </section>
  );
}

