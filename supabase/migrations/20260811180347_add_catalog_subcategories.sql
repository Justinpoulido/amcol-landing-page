alter table public.product_categories
  add column if not exists parent_id uuid,
  add column if not exists display_order integer not null default 0;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_categories_parent_id_fkey'
      and conrelid = 'public.product_categories'::regclass
  ) then
    alter table public.product_categories
      add constraint product_categories_parent_id_fkey
      foreign key (parent_id)
      references public.product_categories(id)
      on delete restrict;
  end if;
end;
$$;

alter table public.product_categories
  drop constraint if exists product_categories_parent_not_self;

alter table public.product_categories
  add constraint product_categories_parent_not_self
  check (parent_id is null or parent_id <> id);

create index if not exists product_categories_parent_active_order_idx
  on public.product_categories (parent_id, is_active, display_order, name);

-- Authorization data must come from server-controlled app_metadata only.
create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

grant select on public.product_categories to anon, authenticated;
grant insert, update, delete on public.product_categories to authenticated;

notify pgrst, 'reload schema';
