create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all on public.profiles from anon;
grant select, update on public.profiles to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.create_profile_for_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_user();

create table if not exists public.planner_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  template_type text not null check (template_type in (
    'simple', 'priority', 'weekly', 'shopping', 'project', 'study',
    'fitness', 'reading', 'work', 'goals', 'budget', 'meals',
    'habits', 'event', 'travel', 'home', 'timeblock', 'notes',
    'wellness', 'monthly'
  )),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, template_type)
);

create index if not exists planner_lists_user_id_idx
  on public.planner_lists (user_id);

alter table public.planner_lists enable row level security;
revoke all on public.planner_lists from anon;
grant select, insert, update, delete on public.planner_lists to authenticated;

drop policy if exists "Users can read their own planner lists" on public.planner_lists;
create policy "Users can read their own planner lists"
  on public.planner_lists for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own planner lists" on public.planner_lists;
create policy "Users can create their own planner lists"
  on public.planner_lists for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own planner lists" on public.planner_lists;
create policy "Users can update their own planner lists"
  on public.planner_lists for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own planner lists" on public.planner_lists;
create policy "Users can delete their own planner lists"
  on public.planner_lists for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_planner_lists_updated_at on public.planner_lists;
create trigger set_planner_lists_updated_at
  before update on public.planner_lists
  for each row execute procedure public.set_updated_at();
