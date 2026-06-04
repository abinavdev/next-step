import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { getProfile, upsertProfile, updateSubscription } from '@/lib/profile';
import { useUserStore } from '@/stores/userStore';

export type PlanType = 'free' | 'project-assistance' | 'mentor-assistance';

export interface Subscription {
  planId: PlanType;
  planName: string;
  price: number;
  features: string[];
  startDate: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscription?: Subscription;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  setSubscription: (subscription: Subscription) => Promise<void>;
  getSubscription: () => Subscription | undefined;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // initialize default state
  const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  };

  // Helper to map Supabase user to our User type
  function mapUser(user: any): User {
    return {
      id: user.id,
      name: (user.user_metadata && user.user_metadata.name) || user.email.split('@')[0],
      email: user.email,
    };
  }

  // Subscribe to auth changes and load profile
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      const mapped = mapUser(session.user);
      set({ user: mapped, isAuthenticated: true, isLoading: false });
      // load profile
      getProfile(mapped.id)
        .then((p) => {
          if (p) {
            set((s) => ({
              user: {
                ...(s.user as any),
                subscription: p.subscription_plan ? { planId: p.subscription_plan as any, planName: p.subscription_plan, price: 0, features: [], startDate: new Date() } : undefined,
              },
            }));
            // restore profile and hydration flag in userStore
            useUserStore.setState({
              profile: {
                id: mapped.id,
                name: p.full_name || mapped.name,
                degree: p.degree || '',
                branch: '',
                syllabusTopics: (p.syllabus_topics as any) || [],
                interests: (p.interests as any) || [],
                careerGoal: p.career_goal || '',
                level: p.level || 1,
                xp: p.xp || 0,
                completedSkills: (p.completed_skills as any) || [],
                badges: (p.badges as any) || [],
                roadmap: p.roadmap || null,
              },
              isOnboardingComplete: !!p.onboarding_completed,
              isHydrated: true,
            });
          }
        })
        .catch(() => {
          // ensure we mark hydration even on error to avoid blocking routes
          useUserStore.setState({ isHydrated: true });
        });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
      useUserStore.setState({ isHydrated: true });
    }
  }).catch(() => {
    set({ user: null, isAuthenticated: false, isLoading: false });
    useUserStore.setState({ isHydrated: true });
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      const mapped = mapUser(session.user);
      set({ user: mapped, isAuthenticated: true, isLoading: false });
      getProfile(mapped.id).then((p) => {
        if (p) {
          set((s) => ({
            user: {
              ...(s.user as any),
              subscription: p.subscription_plan ? { planId: p.subscription_plan as any, planName: p.subscription_plan, price: 0, features: [], startDate: new Date() } : undefined,
            },
          }));
          useUserStore.setState({
            profile: {
              id: mapped.id,
              name: p.full_name || mapped.name,
              degree: p.degree || '',
              branch: '',
              syllabusTopics: (p.syllabus_topics as any) || [],
              interests: (p.interests as any) || [],
              careerGoal: p.career_goal || '',
              level: p.level || 1,
              xp: p.xp || 0,
              completedSkills: (p.completed_skills as any) || [],
              badges: (p.badges as any) || [],
              roadmap: p.roadmap || null,
            },
            isOnboardingComplete: !!p.onboarding_completed,
            isHydrated: true,
          });
        }
      }).catch(() => {
        useUserStore.setState({ isHydrated: true });
      });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
      useUserStore.setState({ isHydrated: true });
    }
  });

  return {
    ...initialState,

    login: async (email: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.session || !data.user) throw new Error('No session returned');
        const mapped = mapUser(data.user);
        set({ user: mapped, isAuthenticated: true, isLoading: false });
        // load profile
        try {
          const p = await getProfile(mapped.id);
          if (p) {
            set((s) => ({
              user: {
                ...(s.user as any),
                subscription: p.subscription_plan ? { planId: p.subscription_plan as any, planName: p.subscription_plan, price: 0, features: [], startDate: new Date() } : undefined,
              },
            }));
            useUserStore.setState({
              profile: {
                id: mapped.id,
                name: p.full_name || mapped.name,
                degree: p.degree || '',
                branch: '',
                syllabusTopics: (p.syllabus_topics as any) || [],
                interests: (p.interests as any) || [],
                careerGoal: p.career_goal || '',
                level: p.level || 1,
                xp: p.xp || 0,
                completedSkills: (p.completed_skills as any) || [],
                badges: (p.badges as any) || [],
                roadmap: p.roadmap || null,
              },
              isOnboardingComplete: !!p.onboarding_completed,
              isHydrated: true,
            });
          }
        } catch (e) {
          useUserStore.setState({ isHydrated: true });
        }
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Login failed',
          isLoading: false,
        });
        throw error;
      }
    },

    register: async (name: string, email: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
        if (error) throw error;
        // signUp may not immediately create a session (if email confirmations enabled)
        if (data?.user) {
          const mapped = mapUser(data.user);
          set({ user: mapped, isAuthenticated: !!data.session, isLoading: false });
          // ensure profile exists
          try {
            await upsertProfile({ id: mapped.id, email: mapped.email, full_name: name, subscription_plan: 'free' });
          } catch (err) {
            // ignore
          }
        } else {
          set({ isLoading: false });
        }
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Registration failed',
          isLoading: false,
        });
        throw error;
      }
    },

    logout: async () => {
      set({ isLoading: true, error: null });
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ user: null, isAuthenticated: false, isLoading: false });
        // clear userStore
        useUserStore.getState().resetOnboarding && useUserStore.getState().resetOnboarding();
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Logout failed',
          isLoading: false,
        });
        throw error;
      }
    },

    forgotPassword: async (email: string) => {
      set({ isLoading: true, error: null });
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password',
        });
        if (error) throw error;
        set({ isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Password reset failed',
          isLoading: false,
        });
        throw error;
      }
    },

    setSubscription: async (subscription: Subscription) => {
      const user = get().user;
      if (!user) return;
      set({ isLoading: true, error: null });
      try {
        await updateSubscription(user.id, subscription.planId as any);
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                subscription,
              }
            : null,
          isLoading: false,
        } as any));
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Subscription update failed', isLoading: false });
        throw err;
      }
    },

    getSubscription: () => {
      return get().user?.subscription;
    },

    clearError: () => set({ error: null }),
  };
});
