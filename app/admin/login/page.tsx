import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  adminSession,
  hasAdminCredentials,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    configured?: string;
  }>;
};

function getStatusMessage(error: string | undefined, configured: string | undefined) {
  if (configured === "missing") {
    return "Admin credentials are not configured yet.";
  }

  if (error === "invalid") {
    return "The username or password was not recognized.";
  }

  if (error === "expired") {
    return "Your admin session expired. Sign in again to continue.";
  }

  return null;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const cookieStore = await cookies();
  const existingSession = cookieStore.get(adminSession.cookieName)?.value;

  if (await verifyAdminSessionToken(existingSession)) {
    redirect("/admin");
  }

  const params = await searchParams;
  const isConfigured = hasAdminCredentials();
  const statusMessage = !isConfigured
    ? "Admin credentials are not configured yet."
    : getStatusMessage(params?.error, params?.configured);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef4f7_0%,#f8fbfd_42%,#ffffff_100%)] text-slate-950">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <section className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/images/AMCOL_Logo.webp"
              alt="AMCOL Industrial"
              width={170}
              height={66}
              priority
              className="h-auto w-40"
            />
          </Link>
          <div className="mt-12 max-w-xl">
            <p className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
              Admin Portal
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
              Catalog access for AMCOL operators.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
              Sign in to manage product records, category details, imagery, and
              publishing updates.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-54px_rgba(15,23,42,0.75)] sm:p-8">
          <div className="mb-8 lg:hidden">
            <Image
              src="/images/AMCOL_Logo.webp"
              alt="AMCOL Industrial"
              width={150}
              height={58}
              priority
              className="h-auto w-36"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
              Secure Login
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Access admin workspace
            </h2>
          </div>

          {statusMessage ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
              {statusMessage}
            </div>
          ) : null}

          <form action="/api/admin/login" method="post" className="mt-8 grid gap-5">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Username
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                disabled={!isConfigured}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-normal text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={!isConfigured}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-normal text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </label>
            <button
              type="submit"
              disabled={!isConfigured}
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-sm leading-6 text-slate-500">
            Credentials are read from Vercel environment variables and are never
            sent to the browser.
          </p>
        </section>
      </div>
    </main>
  );
}
