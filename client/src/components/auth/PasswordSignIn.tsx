import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import type { PasswordSignProps } from "@/types/clerkTypes";
import { getClerkErrorMessage } from "@/utils/clerkHelper";

export default function PasswordSignIn({ onSuccessRedirectTo, className = "" } : PasswordSignProps) {
  const { isLoaded, signIn, setActive } = useSignIn();

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setErr(null);
    setLoading(true);

    try {
      const res = await signIn.create({
        identifier: identifier.trim(), // email OR username
        password,
      });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });

        if (onSuccessRedirectTo) {
          window.location.assign(onSuccessRedirectTo);
        }
      } else {
        setErr("Sign-in requires additional steps.");
      }
    } catch (e: unknown) {
      setErr(getClerkErrorMessage(e, "Unable to sign in."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      <div>
        <label className="text-sm text-slate-200">
          Username or email
        </label>
        <input
          className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600 text-white"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
          placeholder="username or email"
          required
        />
      </div>

      <div>
        <label className="text-sm text-slate-200">Password</label>
        <input
          className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {err && (
        <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-xl p-3">
          {err}
        </div>
      )}

      <button
        type="submit"
        disabled={!isLoaded || loading}
        className="w-full rounded-xl bg-white text-slate-900 font-medium py-2 hover:bg-slate-100 disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
