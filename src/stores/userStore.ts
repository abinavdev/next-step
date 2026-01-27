import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, OnboardingData, Badge } from '@/types';

interface UserState {
  profile: UserProfile | null;
  onboarding: OnboardingData;
  isOnboardingComplete: boolean;
  setProfile: (profile: UserProfile) => void;
  updateOnboarding: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  addXP: (amount: number) => void;
  completeSkill: (skillId: string) => void;
  earnBadge: (badge: Badge) => void;
  resetOnboarding: () => void;
}

const initialOnboarding: OnboardingData = {
  step: 1,
  degree: '',
  branch: '',
  syllabusTopics: [],
  interests: [],
  careerGoal: '',
  knowsCareerGoal: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      onboarding: initialOnboarding,
      isOnboardingComplete: false,

      setProfile: (profile) => set({ profile }),

      updateOnboarding: (data) =>
        set((state) => ({
          onboarding: { ...state.onboarding, ...data },
        })),

      completeOnboarding: () => {
        const { onboarding } = get();
        const newProfile: UserProfile = {
          id: crypto.randomUUID(),
          name: 'Student',
          degree: onboarding.degree,
          branch: onboarding.branch,
          syllabusTopics: onboarding.syllabusTopics,
          interests: onboarding.interests,
          careerGoal: onboarding.careerGoal,
          level: 1,
          xp: 0,
          completedSkills: [],
          badges: [],
        };
        set({
          profile: newProfile,
          isOnboardingComplete: true,
        });
      },

      addXP: (amount) =>
        set((state) => {
          if (!state.profile) return state;
          const newXP = state.profile.xp + amount;
          const xpPerLevel = 500;
          const newLevel = Math.floor(newXP / xpPerLevel) + 1;
          return {
            profile: {
              ...state.profile,
              xp: newXP,
              level: newLevel,
            },
          };
        }),

      completeSkill: (skillId) =>
        set((state) => {
          if (!state.profile) return state;
          if (state.profile.completedSkills.includes(skillId)) return state;
          return {
            profile: {
              ...state.profile,
              completedSkills: [...state.profile.completedSkills, skillId],
            },
          };
        }),

      earnBadge: (badge) =>
        set((state) => {
          if (!state.profile) return state;
          if (state.profile.badges.find((b) => b.id === badge.id)) return state;
          return {
            profile: {
              ...state.profile,
              badges: [...state.profile.badges, { ...badge, earnedAt: new Date() }],
            },
          };
        }),

      resetOnboarding: () =>
        set({
          profile: null,
          onboarding: initialOnboarding,
          isOnboardingComplete: false,
        }),
    }),
    {
      name: 'nextstep-user-storage',
    }
  )
);
