import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  adminSession,
  hasAdminCredentials,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

function redirectToLogin(request: NextRequest, reason?: string) {
  const loginUrl = new URL("/admin/login", request.url);

  if (reason) {
    loginUrl.searchParams.set("error", reason);
  }

  return NextResponse.redirect(loginUrl);
}

function configurationResponse(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Admin credentials are not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("configured", "missing");

  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/admin/login";
  const isAuthEndpoint =
    pathname === "/api/admin/login" || pathname === "/api/admin/logout";

  if (isAuthEndpoint) {
    return NextResponse.next();
  }

  if (!hasAdminCredentials()) {
    return isLoginPage ? NextResponse.next() : configurationResponse(request);
  }

  const isSignedIn = await verifyAdminSessionToken(
    request.cookies.get(adminSession.cookieName)?.value,
  );

  if (isSignedIn) {
    if (isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  return isLoginPage ? NextResponse.next() : redirectToLogin(request, "expired");
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
