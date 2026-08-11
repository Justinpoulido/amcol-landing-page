import { Buffer } from "node:buffer";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const bucket = "product-images";
const requiredVariables = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

function isVercelBlobUrl(value) {
  try {
    return new URL(value).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

function normalizeImageList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {
    // Support records created before gallery_images was consistently an array.
  }

  return trimmed.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function fileExtension(url, contentType) {
  const extension = path.posix.extname(decodeURIComponent(new URL(url).pathname));

  if (extension) return extension.toLowerCase();

  return {
    "image/avif": ".avif",
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  }[contentType?.split(";", 1)[0].toLowerCase()] ?? ".bin";
}

async function copyImage(sourceUrl, destinationPath) {
  const response = await fetch(sourceUrl);

  if (!response.ok) {
    throw new Error(`Download failed (${response.status})`);
  }

  const { error } = await supabase.storage
    .from(bucket)
    .upload(destinationPath, Buffer.from(await response.arrayBuffer()), {
      contentType: response.headers.get("content-type") || undefined,
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return supabase.storage.from(bucket).getPublicUrl(destinationPath).data.publicUrl;
}

const { data: products, error: productsError } = await supabase
  .from("products")
  .select("id, image_url, gallery_images");

if (productsError) {
  throw new Error(`Unable to load products: ${productsError.message}`);
}

let migrated = 0;
let skipped = 0;
const failures = [];

for (const product of products ?? []) {
  const galleryImages = normalizeImageList(product.gallery_images);
  const sourceImages = [product.image_url, ...galleryImages];
  const replacements = new Map();

  for (const [index, sourceUrl] of sourceImages.entries()) {
    if (!isVercelBlobUrl(sourceUrl)) {
      skipped += 1;
      continue;
    }

    try {
      const response = await fetch(sourceUrl, { method: "HEAD" });
      const extension = fileExtension(sourceUrl, response.headers.get("content-type"));
      const targetPath = `products/migrated/${product.id}/${index}${extension}`;
      replacements.set(sourceUrl, await copyImage(sourceUrl, targetPath));
    } catch (error) {
      failures.push(`${product.id}: ${sourceUrl} — ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  if (replacements.size === 0) continue;

  const imageUrl = replacements.get(product.image_url) ?? product.image_url;
  const updatedGalleryImages = galleryImages.map(
    (url) => replacements.get(url) ?? url,
  );
  const { error: updateError } = await supabase
    .from("products")
    .update({ image_url: imageUrl, gallery_images: updatedGalleryImages })
    .eq("id", product.id);

  if (updateError) {
    failures.push(`${product.id}: Database update failed — ${updateError.message}`);
  } else {
    migrated += replacements.size;
  }
}

console.log(`Migrated ${migrated} image(s); skipped ${skipped} non-Blob image(s).`);

if (failures.length > 0) {
  console.error("Failures:\n" + failures.join("\n"));
  process.exitCode = 1;
}
