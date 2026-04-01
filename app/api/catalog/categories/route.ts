import { NextResponse } from "next/server";
import { getLandingCategories } from "@/lib/catalog-store";

export async function GET() {
  const categories = await getLandingCategories();
  return NextResponse.json({ categories });
}
