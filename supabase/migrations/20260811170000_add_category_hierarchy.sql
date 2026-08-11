alter table public.product_categories
add column if not exists parent_id uuid null references public.product_categories(id) on delete restrict;

alter table public.products
add column if not exists subcategory_id uuid null references public.product_categories(id) on delete restrict;

create index if not exists product_categories_parent_id_idx
  on public.product_categories (parent_id);

create index if not exists products_subcategory_id_idx
  on public.products (subcategory_id);

create or replace function public.validate_product_category_parent()
returns trigger
language plpgsql
as $$
declare
  selected_parent uuid;
begin
  if new.parent_id is null then
    return new;
  end if;

  if new.parent_id = new.id then
    raise exception 'A category cannot be its own parent.';
  end if;

  select parent_id into selected_parent
  from public.product_categories
  where id = new.parent_id;

  if not found then
    raise exception 'Parent category does not exist.';
  end if;

  if selected_parent is not null then
    raise exception 'Subcategories cannot be parents of other categories.';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_product_category_parent_trigger on public.product_categories;
create trigger validate_product_category_parent_trigger
before insert or update of parent_id on public.product_categories
for each row
execute function public.validate_product_category_parent();

create or replace function public.validate_product_subcategory()
returns trigger
language plpgsql
as $$
declare
  category_parent uuid;
  subcategory_parent uuid;
begin
  select parent_id into category_parent
  from public.product_categories
  where id = new.category_id and is_active = true;

  if category_parent is not null then
    raise exception 'Products must be assigned to a top-level category.';
  end if;

  if new.subcategory_id is null then
    return new;
  end if;

  select parent_id into subcategory_parent
  from public.product_categories
  where id = new.subcategory_id and is_active = true;

  if subcategory_parent is null then
    raise exception 'Product subcategory must be a child category.';
  end if;

  if subcategory_parent <> new.category_id then
    raise exception 'Product subcategory must belong to the selected category.';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_product_subcategory_trigger on public.products;
create trigger validate_product_subcategory_trigger
before insert or update of category_id, subcategory_id on public.products
for each row
execute function public.validate_product_subcategory();

with subcategory_seed(parent_slug, slug, name, description) as (
  values
    ('cleaners-degreasers', 'degreaser', 'Degreaser', 'Degreaser products within Cleaners & Degreasers.'),
    ('cleaners-degreasers', 'cleaner', 'Cleaner', 'Cleaner products within Cleaners & Degreasers.'),
    ('cleaners-degreasers', 'cleaners-degreasers-facility-care', 'Facility Care', 'Facility Care products within Cleaners & Degreasers.'),
    ('surface-disinfectants-deodorizers', 'disinfectant', 'Disinfectant', 'Disinfectant products within Surface Disinfectants & Deodorizers.'),
    ('surface-disinfectants-deodorizers', 'deodorizer', 'Deodorizer', 'Deodorizer products within Surface Disinfectants & Deodorizers.'),
    ('surface-disinfectants-deodorizers', 'surface-disinfectants-deodorizers-facility-care', 'Facility Care', 'Facility Care products within Surface Disinfectants & Deodorizers.'),
    ('sprayers-pumps', 'pressure-sprayer', 'Pressure Sprayer', 'Pressure Sprayer products within Sprayers & Pumps.'),
    ('sprayers-pumps', 'transfer-pump', 'Transfer Pump', 'Transfer Pump products within Sprayers & Pumps.'),
    ('sprayers-pumps', 'chemical-handling', 'Chemical Handling', 'Chemical Handling products within Sprayers & Pumps.'),
    ('adhesives-sealants-tape', 'sealant', 'Sealant', 'Sealant products within Adhesives, Sealants & Tape.'),
    ('adhesives-sealants-tape', 'silicone', 'Silicone', 'Silicone products within Adhesives, Sealants & Tape.'),
    ('adhesives-sealants-tape', 'adhesive', 'Adhesive', 'Adhesive products within Adhesives, Sealants & Tape.'),
    ('fire-protection', 'extinguishers', 'Extinguishers', 'Extinguishers products within Fire Protection.'),
    ('fire-protection', 'accessories', 'Accessories', 'Accessories products within Fire Protection.'),
    ('fire-protection', 'safety-signage', 'Safety Signage', 'Safety Signage products within Fire Protection.'),
    ('safety', 'head-protection', 'Head Protection', 'Head Protection products within Safety.'),
    ('safety', 'ppe', 'PPE', 'PPE products within Safety.'),
    ('safety', 'worksite-safety', 'Worksite Safety', 'Worksite Safety products within Safety.'),
    ('locks-security', 'padlocks', 'Padlocks', 'Padlocks products within Locks & Security.'),
    ('locks-security', 'hardware', 'Hardware', 'Hardware products within Locks & Security.'),
    ('locks-security', 'access-control', 'Access Control', 'Access Control products within Locks & Security.'),
    ('lubricants', 'lubricant', 'Lubricant', 'Lubricant products within Lubricants.'),
    ('lubricants', 'lubricants-maintenance', 'Maintenance', 'Maintenance products within Lubricants.'),
    ('lubricants', 'penetrant', 'Penetrant', 'Penetrant products within Lubricants.'),
    ('abrasives', 'grinding', 'Grinding', 'Grinding products within Abrasives.'),
    ('abrasives', 'cutting', 'Cutting', 'Cutting products within Abrasives.'),
    ('abrasives', 'finishing', 'Finishing', 'Finishing products within Abrasives.'),
    ('welding', 'equipment', 'Equipment', 'Equipment products within Welding.'),
    ('welding', 'consumables', 'Consumables', 'Consumables products within Welding.'),
    ('welding', 'protection', 'Protection', 'Protection products within Welding.'),
    ('hvac-chemicals', 'system-cleaner', 'System Cleaner', 'System Cleaner products within HVAC Chemicals.'),
    ('hvac-chemicals', 'hvac-chemicals-maintenance', 'Maintenance', 'Maintenance products within HVAC Chemicals.'),
    ('hvac-chemicals', 'hvac-chemicals-facility-care', 'Facility Care', 'Facility Care products within HVAC Chemicals.'),
    ('coatings-sealers', 'sealer', 'Sealer', 'Sealer products within Coatings & Sealers.'),
    ('coatings-sealers', 'coating', 'Coating', 'Coating products within Coatings & Sealers.'),
    ('coatings-sealers', 'primer', 'Primer', 'Primer products within Coatings & Sealers.'),
    ('corrosion-control', 'corrosion-inhibitor', 'Corrosion Inhibitor', 'Corrosion Inhibitor products within Corrosion Control.'),
    ('corrosion-control', 'metal-protection', 'Metal Protection', 'Metal Protection products within Corrosion Control.'),
    ('corrosion-control', 'corrosion-control-maintenance', 'Maintenance', 'Maintenance products within Corrosion Control.'),
    ('ladders', 'extension-ladder', 'Extension Ladder', 'Extension Ladder products within Ladders.'),
    ('ladders', 'access-equipment', 'Access Equipment', 'Access Equipment products within Ladders.'),
    ('ladders', 'facility-access', 'Facility Access', 'Facility Access products within Ladders.'),
    ('spill-containment-emergency-response', 'spill-kit', 'Spill Kit', 'Spill Kit products within Spill Containment & Emergency Response.'),
    ('spill-containment-emergency-response', 'containment', 'Containment', 'Containment products within Spill Containment & Emergency Response.'),
    ('spill-containment-emergency-response', 'emergency-response', 'Emergency Response', 'Emergency Response products within Spill Containment & Emergency Response.'),
    ('marine', 'rigging', 'Rigging', 'Rigging products within Marine.'),
    ('marine', 'logistics', 'Logistics', 'Logistics products within Marine.'),
    ('marine', 'marine-maintenance', 'Maintenance', 'Maintenance products within Marine.'),
    ('medical', 'respiratory', 'Respiratory', 'Respiratory products within Medical.'),
    ('medical', 'medical-ppe', 'PPE', 'PPE products within Medical.'),
    ('medical', 'preparedness', 'Preparedness', 'Preparedness products within Medical.'),
    ('commodity-chemicals', 'bulk-supply', 'Bulk Supply', 'Bulk Supply products within Commodity Chemicals.'),
    ('commodity-chemicals', 'processing', 'Processing', 'Processing products within Commodity Chemicals.'),
    ('commodity-chemicals', 'operations', 'Operations', 'Operations products within Commodity Chemicals.'),
    ('matting', 'safety-matting', 'Safety Matting', 'Safety Matting products within Matting.'),
    ('matting', 'facility-protection', 'Facility Protection', 'Facility Protection products within Matting.'),
    ('matting', 'ergonomic-support', 'Ergonomic Support', 'Ergonomic Support products within Matting.')
)
insert into public.product_categories (slug, name, description, parent_id, is_featured)
select
  subcategory_seed.slug,
  subcategory_seed.name,
  subcategory_seed.description,
  parent.id,
  false
from subcategory_seed
join public.product_categories parent
  on parent.slug = subcategory_seed.parent_slug
where parent.is_active = true
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  parent_id = excluded.parent_id,
  is_active = true,
  is_featured = false,
  updated_at = timezone('utc', now());

notify pgrst, 'reload schema';
