import { supabase } from './supabaseClient';

export type SubscriptionPlan = 'free' | 'project-assistance' | 'mentor-assistance';

export interface ProfileRow {
  id: string;
  email: string;
  full_name?: string | null;
  subscription_plan?: SubscriptionPlan | null;
  onboarding_completed?: boolean | null;
  career_goal?: string | null;
  degree?: string | null;
  interests?: string[] | null;
  syllabus_topics?: string[] | null;
  level?: number | null;
  xp?: number | null;
  completed_skills?: string[] | null;
  badges?: any[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const PROFILE_SELECT = `id, email, full_name, subscription_plan, onboarding_completed, career_goal, degree, interests, syllabus_topics, level, xp, completed_skills, badges, created_at, updated_at`;

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from<ProfileRow>('profiles')
    .select(PROFILE_SELECT)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function upsertProfile(profile: Partial<ProfileRow>) {
  const { data, error } = await supabase
    .from<ProfileRow>('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select(PROFILE_SELECT)
    .single();
  if (error) throw error;
  return data;
}

export async function updateSubscription(userId: string, plan: SubscriptionPlan) {
  const { data, error } = await supabase
    .from<ProfileRow>('profiles')
    .update({ subscription_plan: plan })
    .eq('id', userId)
    .select(PROFILE_SELECT)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfileFields(userId: string, values: Partial<ProfileRow>) {
  const { data, error } = await supabase
    .from<ProfileRow>('profiles')
    .update(values)
    .eq('id', userId)
    .select(PROFILE_SELECT)
    .single();
  if (error) throw error;
  return data;
}
