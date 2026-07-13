const adminSessionCookieName = "amcol_admin_session";
const sessionMaxAgeSeconds = 60 * 60 * 8;

type SessionPayload = {
  username: string;
  expiresAt: number;
};

function getAdminUsername() {
  return process.env.ADMIN_USERNAME?.trim() ?? "";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

function base64UrlEncode(value: string) {
  return btoa(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const paddedValue = value.padEnd(
    value.length + ((4 - (value.length % 4)) % 4),
    "=",
  );

  return atob(paddedValue.replace(/-/g, "+").replace(/_/g, "/"));
}

async function signPayload(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );

  return base64UrlEncode(
    String.fromCharCode(...Array.from(new Uint8Array(signature))),
  );
}

export function hasAdminCredentials() {
  return Boolean(getAdminUsername() && getAdminPassword());
}

export async function validateAdminCredentials(
  username: string,
  password: string,
) {
  return username === getAdminUsername() && password === getAdminPassword();
}

export async function createAdminSessionToken(username: string) {
  const payload = base64UrlEncode(
    JSON.stringify({
      username,
      expiresAt: Date.now() + sessionMaxAgeSeconds * 1000,
    } satisfies SessionPayload),
  );
  const signature = await signPayload(payload);

  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined) {
  if (!token || !hasAdminCredentials()) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  try {
    if ((await signPayload(payload)) !== signature) {
      return false;
    }

    const session = JSON.parse(base64UrlDecode(payload)) as SessionPayload;

    return (
      session.username === getAdminUsername() && session.expiresAt > Date.now()
    );
  } catch {
    return false;
  }
}

export const adminSession = {
  cookieName: adminSessionCookieName,
  maxAgeSeconds: sessionMaxAgeSeconds,
};
