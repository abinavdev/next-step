import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { cn } from '@/lib/utils';

interface AdModalProps {
  open: boolean;
  onClose: () => void;
  onFinished: () => void;
  minViewSeconds?: number; // default 5
  rewardCredits?: boolean;
  onReward?: () => void;
}

export default function AdModal({
  open,
  onClose,
  onFinished,
  minViewSeconds = 5,
  rewardCredits = false,
  onReward,
}: AdModalProps) {
  const { isFreePlan } = useFeatureGate();
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(minViewSeconds);
  const [canSkip, setCanSkip] = useState(false);

  if (!open || !isFreePlan()) return null;

  useEffect(() => {
    setSecondsLeft(minViewSeconds);
    setCanSkip(false);
  }, [open, minViewSeconds]);

  useEffect(() => {
    if (!open) return;
    if (secondsLeft <= 0) {
      setCanSkip(true);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [open, secondsLeft]);

  const finish = () => {
    if (rewardCredits && onReward) onReward();
    onFinished();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70">
      {/* Not blocking scroll: only overlay content intercepts clicks */}
      <div className="pointer-events-none flex min-h-full items-center justify-center px-4 py-10">
        <div className="pointer-events-auto w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-large">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
            Sponsored
          </p>
          <h2 className="mt-2 text-lg font-semibold text-foreground">
            Watch this short ad to continue
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ads never consume your credits.{' '}
            {rewardCredits ? 'Completing this can grant +1 bonus credit.' : null}
          </p>

          <div className="mt-4 flex h-32 items-center justify-center rounded-xl border border-dashed border-border bg-background/60 text-sm text-muted-foreground">
            Mock Ad Creative
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/pricing')}
              className="text-xs text-red-400 underline underline-offset-4 hover:text-red-300"
            >
              Remove ads by upgrading
            </button>

            <div className="flex items-center gap-2">
              {!canSkip && (
                <span className="text-xs text-muted-foreground">
                  Skip in {secondsLeft}s
                </span>
              )}
              <button
                type="button"
                onClick={finish}
                disabled={!canSkip}
                className={cn(
                  'rounded-md px-3 py-2 text-xs font-semibold transition-colors',
                  canSkip
                    ? 'bg-red-600 text-white hover:bg-red-500'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                {canSkip ? 'Continue' : 'Please wait...'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

