import "server-only";

import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { del, put } from "@vercel/blob";
import {
  getSupabaseStorageHostname,
  hasSupabaseAdminConfig,
  PRODUCT_IMAGES_BUCKET,
} from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const maximumImageSize = 5 * 1024 * 1024;
const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function validateImage(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Please upload a JPEG, PNG, WebP, GIF, or AVIF image.");
  }

  if (file.size > maximumImageSize) {
    throw new Error("Images must be 5 MB or smaller.");
  }
}

function getStoragePathFromPublicUrl(publicUrl: string): string | null {
  const expectedHostname = getSupabaseStorageHostname();

  if (!expectedHostname) {
    return null;
  }

  try {
    const url = new URL(publicUrl);

    if (url.hostname !== expectedHostname) {
      return null;
    }

    const marker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

export async function uploadCatalogImage(
  imageFile: File,
  folder: "products" | "categories",
  label: string,
) {
  validateImage(imageFile);

  const extension = path.extname(imageFile.name).toLowerCase() || ".png";
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}-${
    sanitizeSegment(label) || "catalog-image"
  }${extension}`;
  const uploadedPath = `${folder}/${fileName}`;

  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdminClient();
    const bytes = await imageFile.arrayBuffer();
    const { error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(uploadedPath, Buffer.from(bytes), {
        contentType: imageFile.type,
        upsert: false,
      });

    if (error) {
      throw new Error(`Unable to upload catalog image: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(uploadedPath);

    return publicUrl;
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(uploadedPath, imageFile, {
      access: "public",
      contentType: imageFile.type,
    });

    return blob.url;
  }

  throw new Error(
    "Catalog image storage is not configured. Add Supabase admin credentials or BLOB_READ_WRITE_TOKEN.",
  );
}

async function removeCatalogImage(publicUrl: string) {
  if (publicUrl.includes(".public.blob.vercel-storage.com")) {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      await del(publicUrl);
    }

    return;
  }

  const storagePath = getStoragePathFromPublicUrl(publicUrl);

  if (!storagePath || !hasSupabaseAdminConfig()) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new Error(`Unable to remove catalog image: ${error.message}`);
  }
}

export async function removeCatalogImages(publicUrls: Array<string | undefined>) {
  const uniqueUrls = [...new Set(publicUrls.filter((url): url is string => Boolean(url)))];
  const results = await Promise.allSettled(uniqueUrls.map(removeCatalogImage));

  for (const result of results) {
    if (result.status === "rejected") {
      console.warn("Catalog data was saved, but an old image could not be removed.", result.reason);
    }
  }
}
