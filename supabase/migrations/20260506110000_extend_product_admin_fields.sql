alter table public.products
  add column if not exists slug text,
  add column if not exists summary text,
  add column if not exists gallery_images text[] not null default '{}',
  add column if not exists specifications text[] not null default '{}';

update public.products
set slug = regexp_replace(
  regexp_replace(lower(btrim(name)), '[^a-z0-9]+', '-', 'g'),
  '(^-|-$)',
  '',
  'g'
)
where slug is null or btrim(slug) = '';

alter table public.products
  alter column slug set not null;

alter table public.products
  drop constraint if exists products_slug_format,
  add constraint products_slug_format check (
    slug = lower(slug)
    and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  );

create unique index if not exists products_slug_unique_idx
  on public.products (lower(slug))
  where is_active = true;

notify pgrst, 'reload schema';
