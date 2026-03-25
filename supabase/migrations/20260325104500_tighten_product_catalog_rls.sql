create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
    or coalesce((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin', false);
$$;

drop policy if exists "Authenticated manage categories" on public.product_categories;
drop policy if exists "Authenticated manage products" on public.products;

create policy "Admin manage categories"
on public.product_categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admin manage products"
on public.products
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
