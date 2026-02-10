import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import type { SupportedFirstFactor } from "@/types/clerkTypes";
import { getClerkErrorMessage, isEmailCodeFactor } from "@/utils/clerkHelper";

export default function EmailCodeSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  async function sendCode(): Promise<void> {
    if (!isLoaded || !signIn) return;

    const identifier = email.trim();
    if (!identifier) {
      setErr("Please enter your email.");
      return;
    }

    setErr(null);
    setLoading(true);

    try {
      const si = await signIn.create({ identifier });

      const factors = (si.supportedFirstFactors ?? []) as SupportedFirstFactor[];
      const emailFactor = factors.find(isEmailCodeFactor);

      if (!emailFactor) {
        setErr("Email code sign-in is not available for this account.");
        return;
      }

      await si.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailFactor.emailAddressId,
      });

      setPending(true);
    } catch (e: unknown) {
      setErr(getClerkErrorMessage(e, "Failed to send code."));
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setErr(null);
    setLoading(true);

    try {
      const res = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: code.trim(),
      });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
      } else {
        setErr("Verification incomplete.");
      }
    } catch (e: unknown) {
      setErr(getClerkErrorMessage(e, "Invalid code."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {!pending ? (
        <>
          <div>
            <label className="text-sm text-slate-200">Email</label>
            <input
              className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
            />
          </div>

          {err && (
            <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-xl p-3">
              {err}
            </div>
          )}

          <button
            type="button"
            onClick={sendCode}
            disabled={!isLoaded || loading}
            className="w-full rounded-xl bg-white text-slate-900 font-medium py-2 hover:bg-slate-100 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send code"}
          </button>
        </>
      ) : (
        <form onSubmit={verifyCode} className="space-y-4">
          <div>
            <label className="text-sm text-slate-200">Verification code</label>
            <input
              className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600 text-white"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
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
            {loading ? "Verifying..." : "Verify & continue"}
          </button>
        </form>
      )}
    </div>
  );
}
