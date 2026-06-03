-- Supabase profiles table schema and RLS policies (idempotent migration)

-- 1) Create or alter profiles table linked 1:1 with auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  subscription_plan text default 'free' not null,
  onboarding_completed boolean default false not null,
  career_goal text,
  degree text,
  interests jsonb default '[]'::jsonb not null,
  syllabus_topics jsonb default '[]'::jsonb not null,
  level integer default 1 not null,
  xp integer default 0 not null,
  completed_skills jsonb default '[]'::jsonb not null,
  badges jsonb default '[]'::jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2) Index on email for quick lookup
create unique index if not exists profiles_email_idx on public.profiles (email);

-- 3) Trigger function to create profile on new auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
as $$
begin
  -- Attempt to insert a profile record; if it exists, do nothing
  insert into public.profiles (id, email, full_name, created_at, updated_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', ''),
    now(),
    now()
  ) on conflict (id) do nothing;
  return new;
end;
$$;

-- 4) Attach trigger to auth.users
drop trigger if exists create_profile on auth.users;
create trigger create_profile
after insert on auth.users
for each row
execute function public.handle_new_user();

-- 5) Update updated_at on profile changes
create or replace function public.update_profiles_updated_at()
returns trigger
language plpgsql security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.update_profiles_updated_at();

-- 6) Enable Row Level Security and policies
alter table public.profiles enable row level security;
-- Allow authenticated users to select their own profile
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select
  using (auth.uid() = id);

-- Allow authenticated users to insert their own profile
drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles
  for insert
  with check (auth.uid() = id);

-- Allow authenticated users to update their own profile
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 7) Backfill: populate existing auth.users into profiles if missing
insert into public.profiles (id, email, created_at, updated_at)
select id, email, now(), now()
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- 8) Add columns if missing (idempotent for migrations)
alter table public.profiles add column if not exists career_goal text;
alter table public.profiles add column if not exists degree text;
alter table public.profiles add column if not exists interests jsonb default '[]'::jsonb not null;
alter table public.profiles add column if not exists syllabus_topics jsonb default '[]'::jsonb not null;
alter table public.profiles add column if not exists level integer default 1 not null;
alter table public.profiles add column if not exists xp integer default 0 not null;
alter table public.profiles add column if not exists completed_skills jsonb default '[]'::jsonb not null;
alter table public.profiles add column if not exists badges jsonb default '[]'::jsonb not null;

-- Ensure subscription and onboarding columns exist
alter table public.profiles add column if not exists subscription_plan text default 'free' not null;
alter table public.profiles add column if not exists onboarding_completed boolean default false not null;

-- End of migration
