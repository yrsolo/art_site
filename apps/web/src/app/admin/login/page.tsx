import { redirect } from "next/navigation";

import { loginAction } from "@/server/admin-actions";
import { getSession } from "@/server/auth";

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const [session, params] = await Promise.all([getSession(), searchParams]);

  if (session) {
    redirect("/admin");
  }

  const hasError = params.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3eee7] px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.25em] text-black/60">Admin login</p>
        <h1 className="mt-4 text-4xl font-semibold">Enter the studio panel</h1>
        <p className="mt-3 text-sm text-black/60">
          Credentials are verified on the server against local environment variables.
        </p>
        {hasError ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Invalid username or password.
          </p>
        ) : null}
        <form action={loginAction} className="mt-6 space-y-4">
          <label className="block space-y-2 text-sm">
            <span>Username</span>
            <input name="username" className="w-full rounded-2xl border border-black/10 px-4 py-3" required />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Password</span>
            <input type="password" name="password" className="w-full rounded-2xl border border-black/10 px-4 py-3" required />
          </label>
          <button type="submit" className="w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
