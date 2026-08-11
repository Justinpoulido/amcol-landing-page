create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

comment on function public.is_admin() is
  'Returns true only when the trusted app_metadata role claim is admin.';

alter function public.set_updated_at() set search_path = '';
alter function public.validate_product_category_parent() set search_path = '';
alter function public.validate_product_subcategory() set search_path = '';

drop policy if exists "Public read product images" on storage.objects;
