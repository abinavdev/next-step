import { create } from 'zustand';
import type { UserProfile, OnboardingData, Badge, Roadmap } from '@/types';
import { upsertProfile, updateProfileFields } from '@/lib/profile';
import { useAuthStore } from '@/stores/authStore';

interface UserState {
  profile: UserProfile | null;
  onboarding: OnboardingData;
  isOnboardingComplete: boolean;
  isHydrated: boolean;
  setProfile: (profile: UserProfile) => void;
  updateOnboarding: (data: Partial<OnboardingData>) => void;
  completeOnboarding: (roadmap?: Roadmap) => void;
  setHydrated: (value: boolean) => void;
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

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  onboarding: initialOnboarding,
  isOnboardingComplete: false,
  isHydrated: false,

  setProfile: (profile) => {
    set({ profile });
    // persist profile to Supabase if authenticated
    const authUser = useAuthStore.getState().user;
    if (authUser) {
      upsertProfile({
        id: authUser.id,
        email: authUser.email,
        full_name: profile.name,
        degree: profile.degree,
        career_goal: profile.careerGoal,
        syllabus_topics: profile.syllabusTopics,
        interests: profile.interests,
        level: profile.level,
        xp: profile.xp,
        completed_skills: profile.completedSkills,
        badges: profile.badges,
        roadmap: profile.roadmap,
      }).catch((err) => {
        console.error('SUPABASE ERROR', err);
      });
    }
  },

  updateOnboarding: (data) =>
    set((state) => {
      const next = { ...state.onboarding, ...data };
      // persist certain onboarding fields immediately when user is authenticated
      const authUser = useAuthStore.getState().user;
      if (authUser) {
        const values: any = {};
        if (typeof data.careerGoal !== 'undefined') values.career_goal = next.careerGoal;
        if (typeof data.degree !== 'undefined') values.degree = next.degree;
        if (typeof data.branch !== 'undefined') values.branch = next.branch;
        if (typeof data.syllabusTopics !== 'undefined') values.syllabus_topics = next.syllabusTopics;
        if (typeof data.interests !== 'undefined') values.interests = next.interests;
        if (Object.keys(values).length > 0) {
          console.log('CAREER UPDATE', {
            careerGoal: next.careerGoal,
            values,
            authUserId: authUser?.id,
          });
          updateProfileFields(authUser.id, values).catch((err) => {
            console.error('SUPABASE ERROR', err);
          });
        }
      }
      // also update in-memory profile when careerGoal updated so UI reflects selection immediately
      const newProfile = state.profile && typeof data.careerGoal !== 'undefined'
        ? { ...state.profile, careerGoal: next.careerGoal }
        : state.profile;
      return {
        onboarding: next,
        profile: newProfile,
      };
    }),

  completeOnboarding: (roadmap) => {
    const { onboarding } = get();
    console.log('ONBOARDING DATA', onboarding);
    const authUser = useAuthStore.getState().user;
    const newProfile: UserProfile = {
      id: authUser?.id || crypto.randomUUID(),
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
      roadmap: roadmap || null,
    };
    set({
      profile: newProfile,
      isOnboardingComplete: true,
    });

    // persist onboarding flag to Supabase profiles table if authenticated
    if (authUser) {
      upsertProfile({
        id: authUser.id,
        email: authUser.email,
        full_name: newProfile.name,
        degree: newProfile.degree,
        career_goal: newProfile.careerGoal,
        syllabus_topics: newProfile.syllabusTopics,
        interests: newProfile.interests,
        level: newProfile.level,
        xp: newProfile.xp,
        completed_skills: newProfile.completedSkills,
        badges: newProfile.badges,
        roadmap: newProfile.roadmap,
        onboarding_completed: true,
      })
        .then((result) => {
          console.log('PROFILE UPSERT SUCCESS', result);
        })
        .catch((err) => {
          console.error('SUPABASE ERROR', err);
        });
    }
  },

  setHydrated: (value: boolean) => set({ isHydrated: value }),

  addXP: (amount) =>
    set((state) => {
      if (!state.profile) return state;
      const newXP = state.profile.xp + amount;
      const xpPerLevel = 500;
      const newLevel = Math.floor(newXP / xpPerLevel) + 1;
      
      const authUser = useAuthStore.getState().user;
      if (authUser) {
        updateProfileFields(authUser.id, {
          xp: newXP,
          level: newLevel,
        }).catch((err) => {
          console.error('Error saving XP to Supabase', err);
        });
      }
      
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
      const updatedSkills = [...state.profile.completedSkills, skillId];
      
      const authUser = useAuthStore.getState().user;
      if (authUser) {
        updateProfileFields(authUser.id, {
          completed_skills: updatedSkills,
        }).catch((err) => {
          console.error('Error saving completed skill to Supabase', err);
        });
      }
      
      return {
        profile: {
          ...state.profile,
          completedSkills: updatedSkills,
        },
      };
    }),

  earnBadge: (badge) =>
    set((state) => {
      if (!state.profile) return state;
      if (state.profile.badges.find((b) => b.id === badge.id)) return state;
      const updatedBadges = [...state.profile.badges, { ...badge, earnedAt: new Date() }];
      
      const authUser = useAuthStore.getState().user;
      if (authUser) {
        updateProfileFields(authUser.id, {
          badges: updatedBadges,
        }).catch((err) => {
          console.error('Error saving earned badge to Supabase', err);
        });
      }
      
      return {
        profile: {
          ...state.profile,
          badges: updatedBadges,
        },
      };
    }),

  resetOnboarding: () =>
    set({
      profile: null,
      onboarding: initialOnboarding,
      isOnboardingComplete: false,
      isHydrated: false,
    }),
}));
