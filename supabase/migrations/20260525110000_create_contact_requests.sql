create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  company text,
  phone text,
  project_type text,
  urgency text,
  message text,
  status text not null default 'new',
  source_page text not null default '/contact',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint contact_requests_full_name_not_blank check (btrim(full_name) <> ''),
  constraint contact_requests_email_not_blank check (btrim(email) <> ''),
  constraint contact_requests_status_check check (
    status in ('new', 'contacted', 'quoted', 'closed', 'spam')
  )
);

create index if not exists contact_requests_created_at_idx
  on public.contact_requests (created_at desc);

create index if not exists contact_requests_status_created_at_idx
  on public.contact_requests (status, created_at desc);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_contact_requests_updated_at'
  ) then
    create trigger set_contact_requests_updated_at
    before update on public.contact_requests
    for each row
    execute function public.set_updated_at();
  end if;
end;
$$;

alter table public.contact_requests enable row level security;

revoke all on public.contact_requests from anon, authenticated;

notify pgrst, 'reload schema';
