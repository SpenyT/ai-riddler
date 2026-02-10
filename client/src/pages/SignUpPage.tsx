import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

import OAuthButtons from "@/components/auth/OAuthButtons";
import PasswordSignUp from "@/components/auth/PasswordSignUp";

type Props = {
  redirectTo?: string;
};

export default function SignUpPage({ redirectTo = "/dashboard" }: Props) {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.assign(redirectTo);
    }
  }, [isLoaded, isSignedIn, redirectTo]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="text-sm text-slate-300 mt-1">
          Sign up with a provider or create an account with email and password.
        </p>

        <div className="mt-6">
          <OAuthButtons signMode="signup" redirectUrlComplete={redirectTo} />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <PasswordSignUp onSuccessRedirectTo={redirectTo} />

        <div className="mt-6 text-sm text-slate-300">
          Already have an account?{" "}
          <a className="underline hover:text-white" href="/signin">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
