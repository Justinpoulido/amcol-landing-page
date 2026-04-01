alter table public.product_categories
add column if not exists image_url text;

alter table public.product_categories
drop constraint if exists product_categories_image_url_not_blank;

alter table public.product_categories
add constraint product_categories_image_url_not_blank
check (image_url is null or btrim(image_url) <> '');
