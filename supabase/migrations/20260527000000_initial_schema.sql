create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  password_hash text not null default '',
  public_username text unique,
  display_name text not null default '',
  headline text not null default '',
  bio text not null default '',
  avatar_url text not null default '',
  banner_url text not null default '',
  github_username text not null default '',
  linkedin_url text not null default '',
  website_url text not null default '',
  email_public text not null default '',
  current_focus text not null default '',
  experience_level text not null default 'beginner' check (experience_level in ('beginner', 'basic', 'intermediate', 'advanced', 'professional')),
  portfolio_visibility text not null default 'public' check (portfolio_visibility in ('public', 'private', 'unlisted')),
  theme text not null default 'dark',
  accent_color text not null default '#7C3AED',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.technologies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  category text not null check (category in ('Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'AI', 'Design', 'Soft Skills', 'Tools')),
  level text not null default 'beginner' check (level in ('beginner', 'basic', 'intermediate', 'advanced', 'professional')),
  target_level text not null default '' check (target_level in ('', 'beginner', 'basic', 'intermediate', 'advanced', 'professional')),
  status text not null default 'planned' check (status in ('planned', 'studying', 'paused', 'completed', 'reviewing')),
  notes text not null default '',
  is_public boolean not null default true,
  started_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  technology_id uuid references public.technologies(id) on delete set null,
  title text not null,
  description text not null default '',
  week_start date not null,
  week_end date not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  is_public boolean not null default true,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.study_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  technology_id uuid references public.technologies(id) on delete set null,
  title text not null,
  content text not null default '',
  tags text[] not null default '{}',
  insight_type text not null default 'concept' check (insight_type in ('concept', 'bug_fix', 'snippet', 'summary', 'idea', 'tip')),
  visibility text not null default 'private' check (visibility in ('private', 'public', 'unlisted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.imported_repos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  github_repo_id bigint not null,
  name text not null,
  full_name text not null,
  description text,
  html_url text not null,
  homepage_url text,
  language text,
  topics text[] not null default '{}',
  stars integer not null default 0,
  forks integer not null default 0,
  pushed_at timestamptz,
  imported_at timestamptz not null default now(),
  unique (user_id, github_repo_id)
);

create table if not exists public.commits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  sha text not null,
  message text not null default '',
  html_url text not null,
  committed_at timestamptz not null,
  repository_name text not null,
  author_name text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, sha)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  github_repository_id uuid references public.imported_repos(id) on delete set null,
  title text not null,
  slug text not null,
  short_description text not null default '',
  long_description text not null default '',
  tech_stack text[] not null default '{}',
  cover_image_url text not null default '',
  repo_url text not null default '',
  demo_url text not null default '',
  status text not null default 'idea' check (status in ('idea', 'in_development', 'mvp', 'published', 'archived')),
  visibility text not null default 'private' check (visibility in ('private', 'public', 'unlisted')),
  featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (event_type in ('tech_added', 'goal_completed', 'insight_published', 'project_created', 'project_published', 'commit_imported', 'level_updated')),
  title text not null,
  description text not null default '',
  metadata jsonb not null default '{}',
  visibility text not null default 'public' check (visibility in ('private', 'public', 'unlisted')),
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  show_email boolean not null default false,
  show_github boolean not null default true,
  show_linkedin boolean not null default true,
  show_commits boolean not null default true,
  show_goals boolean not null default true,
  show_insights boolean not null default true,
  show_learning_timeline boolean not null default true,
  selected_template text not null default 'default',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_public_username_idx on public.profiles(public_username);
create index if not exists technologies_user_id_idx on public.technologies(user_id);
create index if not exists weekly_goals_user_id_idx on public.weekly_goals(user_id);
create index if not exists study_insights_user_id_idx on public.study_insights(user_id);
create index if not exists projects_user_id_display_order_idx on public.projects(user_id, display_order);
create index if not exists imported_repos_user_id_idx on public.imported_repos(user_id);
create index if not exists commits_user_id_committed_at_idx on public.commits(user_id, committed_at desc);
create index if not exists timeline_events_user_id_created_at_idx on public.timeline_events(user_id, created_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists technologies_set_updated_at on public.technologies;
create trigger technologies_set_updated_at before update on public.technologies for each row execute function public.set_updated_at();

drop trigger if exists weekly_goals_set_updated_at on public.weekly_goals;
create trigger weekly_goals_set_updated_at before update on public.weekly_goals for each row execute function public.set_updated_at();

drop trigger if exists study_insights_set_updated_at on public.study_insights;
create trigger study_insights_set_updated_at before update on public.study_insights for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();

drop trigger if exists portfolio_settings_set_updated_at on public.portfolio_settings;
create trigger portfolio_settings_set_updated_at before update on public.portfolio_settings for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, ''), '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.portfolio_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.technologies enable row level security;
alter table public.weekly_goals enable row level security;
alter table public.study_insights enable row level security;
alter table public.imported_repos enable row level security;
alter table public.commits enable row level security;
alter table public.projects enable row level security;
alter table public.timeline_events enable row level security;
alter table public.portfolio_settings enable row level security;

drop policy if exists "profiles_select_own_or_public" on public.profiles;
create policy "profiles_select_own_or_public" on public.profiles for select
using (auth.uid() = id or portfolio_visibility in ('public', 'unlisted'));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "technologies_select_own_or_public" on public.technologies;
create policy "technologies_select_own_or_public" on public.technologies for select
using (auth.uid() = user_id or is_public = true);

drop policy if exists "technologies_owner_all" on public.technologies;
create policy "technologies_owner_all" on public.technologies for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "weekly_goals_select_own_or_public" on public.weekly_goals;
create policy "weekly_goals_select_own_or_public" on public.weekly_goals for select
using (auth.uid() = user_id or is_public = true);

drop policy if exists "weekly_goals_owner_all" on public.weekly_goals;
create policy "weekly_goals_owner_all" on public.weekly_goals for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "study_insights_select_own_or_public" on public.study_insights;
create policy "study_insights_select_own_or_public" on public.study_insights for select
using (auth.uid() = user_id or visibility in ('public', 'unlisted'));

drop policy if exists "study_insights_owner_all" on public.study_insights;
create policy "study_insights_owner_all" on public.study_insights for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "projects_select_own_or_public" on public.projects;
create policy "projects_select_own_or_public" on public.projects for select
using (auth.uid() = user_id or visibility in ('public', 'unlisted'));

drop policy if exists "projects_owner_all" on public.projects;
create policy "projects_owner_all" on public.projects for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "imported_repos_select_own_or_public" on public.imported_repos;
create policy "imported_repos_select_own_or_public" on public.imported_repos for select
using (auth.uid() = user_id or exists (
  select 1 from public.profiles p where p.id = imported_repos.user_id and p.portfolio_visibility in ('public', 'unlisted')
));

drop policy if exists "imported_repos_owner_all" on public.imported_repos;
create policy "imported_repos_owner_all" on public.imported_repos for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "commits_select_own_or_public" on public.commits;
create policy "commits_select_own_or_public" on public.commits for select
using (auth.uid() = user_id or exists (
  select 1 from public.profiles p where p.id = commits.user_id and p.portfolio_visibility in ('public', 'unlisted')
));

drop policy if exists "commits_owner_all" on public.commits;
create policy "commits_owner_all" on public.commits for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "timeline_events_select_own_or_public" on public.timeline_events;
create policy "timeline_events_select_own_or_public" on public.timeline_events for select
using (auth.uid() = user_id or visibility in ('public', 'unlisted'));

drop policy if exists "timeline_events_owner_all" on public.timeline_events;
create policy "timeline_events_owner_all" on public.timeline_events for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "portfolio_settings_select_own_or_public" on public.portfolio_settings;
create policy "portfolio_settings_select_own_or_public" on public.portfolio_settings for select
using (auth.uid() = user_id or exists (
  select 1 from public.profiles p where p.id = portfolio_settings.user_id and p.portfolio_visibility in ('public', 'unlisted')
));

drop policy if exists "portfolio_settings_owner_all" on public.portfolio_settings;
create policy "portfolio_settings_owner_all" on public.portfolio_settings for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
