-- Shepherding Journal cloud storage
-- Run this in Supabase SQL Editor after creating your project.
create table if not exists public.shepherding_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.shepherding_data enable row level security;

revoke all on table public.shepherding_data from anon;
grant select, insert, update, delete on table public.shepherding_data to authenticated;

drop policy if exists "Users can read their own journal" on public.shepherding_data;
drop policy if exists "Users can create their own journal" on public.shepherding_data;
drop policy if exists "Users can update their own journal" on public.shepherding_data;
drop policy if exists "Users can delete their own journal" on public.shepherding_data;

create policy "Users can read their own journal"
on public.shepherding_data for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own journal"
on public.shepherding_data for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own journal"
on public.shepherding_data for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own journal"
on public.shepherding_data for delete to authenticated
using ((select auth.uid()) = user_id);
