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

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint product_categories_slug_key unique (slug),
  constraint product_categories_slug_format check (
    slug = lower(slug)
    and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint product_categories_name_not_blank check (btrim(name) <> '')
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.product_categories(id) on delete restrict,
  name text not null,
  price text not null,
  description text not null,
  brand text,
  sku text,
  unit text,
  stock_status text not null default 'In stock',
  image_url text not null,
  image_alt text,
  featured boolean not null default false,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint products_name_not_blank check (btrim(name) <> ''),
  constraint products_price_not_blank check (btrim(price) <> ''),
  constraint products_description_not_blank check (btrim(description) <> ''),
  constraint products_image_url_not_blank check (btrim(image_url) <> ''),
  constraint products_stock_status_check check (
    stock_status in (
      'In stock',
      'Low stock',
      'Available on request',
      'Call for availability'
    )
  )
);

create index if not exists product_categories_active_idx
  on public.product_categories (is_active);

create index if not exists products_category_id_idx
  on public.products (category_id);

create index if not exists products_active_category_idx
  on public.products (category_id, is_active);

create index if not exists products_created_at_idx
  on public.products (created_at desc);

create index if not exists products_featured_idx
  on public.products (featured)
  where featured = true;

create unique index if not exists products_sku_unique_idx
  on public.products (lower(sku))
  where sku is not null and btrim(sku) <> '';

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_product_categories_updated_at'
  ) then
    create trigger set_product_categories_updated_at
    before update on public.product_categories
    for each row
    execute function public.set_updated_at();
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_products_updated_at'
  ) then
    create trigger set_products_updated_at
    before update on public.products
    for each row
    execute function public.set_updated_at();
  end if;
end;
$$;

insert into public.product_categories (slug, name, description)
values
  (
    'cleaners-degreasers',
    'Cleaners & Degreasers',
    'Cut through grease, oil, carbon buildup, and shop-floor grime with industrial cleaning solutions designed for maintenance teams, plant shutdowns, and routine equipment care.'
  ),
  (
    'surface-disinfectants-deodorizers',
    'Surface Disinfectants & Deodorizers',
    'Keep workplaces, washrooms, kitchens, and high-touch surfaces clean with dependable disinfectants and odor-control products suited to industrial and commercial environments.'
  ),
  (
    'sprayers-pumps',
    'Sprayers & Pumps',
    'From chemical application to fluid transfer, our sprayers and pumps help crews handle maintenance chemicals, coatings, and cleaning agents with accuracy and efficiency.'
  ),
  (
    'adhesives-sealants-tape',
    'Adhesives, Sealants & Tape',
    'Seal joints, bond materials, and protect surfaces with industrial-grade silicones, construction adhesives, specialty sealants, and tapes for maintenance and installation work.'
  ),
  (
    'fire-protection',
    'Fire Protection',
    'Support emergency readiness with extinguishers, signage, and safety accessories designed to help sites stay compliant and respond quickly when every second matters.'
  ),
  (
    'safety',
    'Safety',
    'Outfit your team with trusted personal protective equipment and site-safety essentials for construction zones, industrial plants, logistics yards, and maintenance operations.'
  ),
  (
    'locks-security',
    'Locks & Security',
    'Protect gates, storage areas, tools, and perimeter assets with robust locking hardware and security accessories built for industrial and commercial settings.'
  ),
  (
    'lubricants',
    'Lubricants',
    'Maintain moving equipment, free seized parts, and protect metal surfaces with lubricants and penetrants suited for workshops, fleets, and industrial maintenance programs.'
  ),
  (
    'abrasives',
    'Abrasives',
    'Handle prep, cutting, deburring, and finishing with abrasive discs and accessories selected for fabrication shops, maintenance work, and metal-processing tasks.'
  ),
  (
    'welding',
    'Welding',
    'Support fabrication, repair, and structural work with welding machines, consumables, and accessories chosen for dependable arc performance and shop-floor productivity.'
  ),
  (
    'hvac-chemicals',
    'HVAC Chemicals',
    'Keep HVAC systems running cleanly and efficiently with coil cleaners, treatment products, and maintenance chemicals formulated for service teams and facility managers.'
  ),
  (
    'coatings-sealers',
    'Coatings & Sealers',
    'Preserve assets and extend service life with coatings and sealers engineered for demanding environments, exposed steel, concrete surfaces, and corrosion-prone installations.'
  ),
  (
    'corrosion-control',
    'Corrosion Control',
    'Defend equipment, structures, and exposed components against rust and corrosion with treatments and maintenance products suited for marine, industrial, and outdoor use.'
  ),
  (
    'ladders',
    'Ladders',
    'Choose from dependable ladder solutions for warehouses, maintenance teams, utility jobs, and site work where safe access and durability are essential.'
  ),
  (
    'spill-containment-emergency-response',
    'Spill Containment & Emergency Response',
    'Prepare teams for leaks, drips, and fluid emergencies with containment and response products that help reduce downtime, protect personnel, and support environmental control measures.'
  ),
  (
    'marine',
    'Marine',
    'Support marine logistics, offshore work, and dockside maintenance with durable supplies chosen for salt-air exposure, heavy handling, and operational reliability.'
  ),
  (
    'medical',
    'Medical',
    'Source medical-support and hygiene-related products suited for occupational health stations, emergency preparedness, and frontline protection in controlled environments.'
  ),
  (
    'commodity-chemicals',
    'Commodity Chemicals',
    'Meet processing, cleaning, and manufacturing demand with commodity chemical supply options that support production continuity and site-level operational needs.'
  ),
  (
    'matting',
    'Matting',
    'Improve footing, reduce fatigue, and protect surfaces with matting solutions tailored for industrial entrances, wet areas, workshop floors, and high-traffic zones.'
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  is_active = true,
  updated_at = timezone('utc', now());

alter table public.product_categories enable row level security;
alter table public.products enable row level security;

revoke all on public.product_categories from anon, authenticated;
revoke all on public.products from anon, authenticated;

grant select on public.product_categories to anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.product_categories to authenticated;
grant insert, update, delete on public.products to authenticated;

drop policy if exists "Public read active categories" on public.product_categories;
create policy "Public read active categories"
on public.product_categories
for select
using (is_active = true);

drop policy if exists "Authenticated manage categories" on public.product_categories;
create policy "Authenticated manage categories"
on public.product_categories
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public read active products" on public.products;
create policy "Public read active products"
on public.products
for select
using (is_active = true);

drop policy if exists "Authenticated manage products" on public.products;
create policy "Authenticated manage products"
on public.products
for all
to authenticated
using (true)
with check (true);
