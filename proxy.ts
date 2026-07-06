import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const adminRealm = "AMCOL Admin";

function unauthorizedResponse() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${adminRealm}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

function credentialsNotConfiguredResponse() {
  return new NextResponse("Admin credentials are not configured.", {
    status: 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function getBasicCredentials(authorizationHeader: string | null) {
  if (!authorizationHeader?.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(authorizationHeader.slice("Basic ".length).trim());
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex < 0) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return credentialsNotConfiguredResponse();
  }

  const credentials = getBasicCredentials(request.headers.get("authorization"));

  if (
    credentials?.username === adminUsername &&
    credentials.password === adminPassword
  ) {
    return NextResponse.next();
  }

  return unauthorizedResponse();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
