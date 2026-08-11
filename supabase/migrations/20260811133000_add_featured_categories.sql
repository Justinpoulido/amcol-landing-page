alter table public.product_categories
add column if not exists is_featured boolean not null default false;

create index if not exists product_categories_featured_idx
  on public.product_categories (is_featured)
  where is_featured = true;

update public.product_categories
set
  is_featured = true,
  updated_at = timezone('utc', now())
where slug in (
  'cleaners-degreasers',
  'surface-disinfectants-deodorizers',
  'sprayers-pumps',
  'adhesives-sealants-tape',
  'fire-protection',
  'safety',
  'locks-security',
  'lubricants',
  'abrasives',
  'welding',
  'hvac-chemicals',
  'coatings-sealers',
  'corrosion-control',
  'ladders',
  'spill-containment-emergency-response',
  'marine',
  'medical',
  'commodity-chemicals',
  'matting'
);
