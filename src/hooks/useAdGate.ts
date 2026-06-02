import { useState } from 'react';
import { useFeatureGate } from '@/hooks/useFeatureGate';

// Gate any action behind an ad (free plan only)
export function useAdGate() {
  const { isFreePlan } = useFeatureGate();
  const [adOpen, setAdOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);

  const runWithAd = (action: () => void) => {
    if (!isFreePlan()) {
      action();
      return;
    }
    setPendingAction(() => action);
    setAdOpen(true);
  };

  const handleAdFinished = () => {
    pendingAction?.();
    setPendingAction(null);
  };

  return { adOpen, setAdOpen, runWithAd, handleAdFinished };
}

