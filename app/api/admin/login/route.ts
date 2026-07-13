import { NextResponse } from "next/server";
import {
  adminSession,
  createAdminSessionToken,
  hasAdminCredentials,
  validateAdminCredentials,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const loginUrl = new URL("/admin/login", request.url);

  if (!hasAdminCredentials()) {
    loginUrl.searchParams.set("configured", "missing");
    return NextResponse.redirect(loginUrl);
  }

  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!(await validateAdminCredentials(username, password))) {
    loginUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set({
    name: adminSession.cookieName,
    value: await createAdminSessionToken(username),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: adminSession.maxAgeSeconds,
  });

  return response;
}
