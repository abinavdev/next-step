import { useState, useEffect, useCallback } from 'react';
import { getProfile, upsertProfile, updateSubscription, ProfileRow, SubscriptionPlan } from '@/lib/profile';
import { useAuthStore } from '@/stores/authStore';

export function useProfile() {
  const authUser = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!authUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const p = await getProfile(authUser.id);
      setProfile(p || null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (payload: Partial<ProfileRow>) => {
    if (!authUser) throw new Error('Not authenticated');
    setIsLoading(true);
    setError(null);
    try {
      const p = await upsertProfile({ id: authUser.id, ...payload });
      setProfile(p || null);
      return p;
    } catch (err: any) {
      setError(err?.message || 'Failed to save profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const setSubscription = async (plan: SubscriptionPlan) => {
    if (!authUser) throw new Error('Not authenticated');
    setIsLoading(true);
    setError(null);
    try {
      const p = await updateSubscription(authUser.id, plan);
      setProfile(p || null);
      return p;
    } catch (err: any) {
      setError(err?.message || 'Failed to update subscription');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { profile, isLoading, error, load, save, setSubscription };
}

export default useProfile;
