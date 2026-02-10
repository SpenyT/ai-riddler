import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import type { PasswordSignProps } from "@/types/clerkTypes";
import { getClerkErrorMessage } from "@/utils/clerkHelper";

export default function PasswordSignUp({ onSuccessRedirectTo = "/dashboard" }: PasswordSignProps) {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function startSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    if (confirm && password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }

    setErr(null);
    setLoading(true);

    try {
      await signUp.create({
        username: username.trim(),
        emailAddress: emailAddress.trim(),
        password,
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (e: unknown) {
      setErr(getClerkErrorMessage(e, "Unable to create account."));
    } finally {
      setLoading(false);
    }
  }

  async function verifyEmailCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setErr(null);
    setLoading(true);

    try {
      const res = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        window.location.assign(onSuccessRedirectTo);
      } else {
        setErr("Verification incomplete. Please try again.");
      }
    } catch (e: unknown) {
      setErr(getClerkErrorMessage(e, "Invalid verification code."));
    } finally {
      setLoading(false);
    }
  }

  if (pendingVerification) {
    return (
      <form onSubmit={verifyEmailCode} className="space-y-4">
        <div>
          <label className="text-sm text-slate-200">Email verification code</label>
          <input
            className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600 text-white"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            placeholder="123456"
            required
          />
          <p className="mt-2 text-xs text-slate-400">
            We sent a code to <span className="text-slate-200">{emailAddress}</span>.
          </p>
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
          {loading ? "Verifying..." : "Verify & create account"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={startSignUp} className="space-y-4">
      <div>
        <label className="text-sm text-slate-200">Username</label>
        <input
          className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </div>

      <div>
        <label className="text-sm text-slate-200">Email</label>
        <input
          className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600 text-white"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          type="email"
          autoComplete="email"
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
          autoComplete="new-password"
          required
        />
      </div>

      {/* Optional confirm password (recommended UX) */}
      <div>
        <label className="text-sm text-slate-200">Confirm password</label>
        <input
          className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600 text-white"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          type="password"
          autoComplete="new-password"
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
        {loading ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
