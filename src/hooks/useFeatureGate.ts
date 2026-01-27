import { useAuthStore } from '@/stores/authStore';
import type { PlanType } from '@/types';

export type Feature = 
  | 'project-chart'
  | 'milestones'
  | 'tasks'
  | 'deadlines'
  | 'premium-resources'
  | 'mentorship'
  | 'messaging'
  | 'session-booking';

const FEATURE_MAP: Record<PlanType, Feature[]> = {
  'free': [],
  'project-assistance': [
    'project-chart',
    'milestones',
    'tasks',
    'deadlines',
    'premium-resources',
  ],
  'mentor-assistance': [
    'project-chart',
    'milestones',
    'tasks',
    'deadlines',
    'premium-resources',
    'mentorship',
    'messaging',
    'session-booking',
  ],
};

export function useFeatureGate() {
  const { user } = useAuthStore();
  const planId = user?.subscription?.planId || 'free';

  const hasFeature = (feature: Feature): boolean => {
    return FEATURE_MAP[planId].includes(feature);
  };

  const isFreePlan = (): boolean => planId === 'free';

  const isProjectPlan = (): boolean => planId === 'project-assistance';

  const isMentorPlan = (): boolean => planId === 'mentor-assistance';

  const canUpgradeTo = (targetPlan: PlanType): boolean => {
    if (planId === 'free') {
      return targetPlan === 'project-assistance' || targetPlan === 'mentor-assistance';
    }
    if (planId === 'project-assistance') {
      return targetPlan === 'mentor-assistance';
    }
    return false; // No downgrade
  };

  return {
    hasFeature,
    isFreePlan,
    isProjectPlan,
    isMentorPlan,
    canUpgradeTo,
    currentPlan: planId,
  };
}
