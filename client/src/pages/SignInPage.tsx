import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

import OAuthButtons from "@/components/auth/OAuthButtonsRow";
import PasswordSignIn from "@/components/auth/PasswordSignIn";

type SignInProps = {
  redirectTo?: string; // where to land after sign-in
};

export default function SignInPage({ redirectTo = "/" }: SignInProps) {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.assign(redirectTo);
    }
  }, [isLoaded, isSignedIn, redirectTo]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl p-6">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-slate-300 mt-1">
          Continue with a provider or use your email/username and password.
        </p>

        <div className="mt-6">
          <OAuthButtons
            redirectUrl="/auth/callback"
            redirectUrlComplete={redirectTo}
          />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <PasswordSignIn onSuccessRedirectTo={redirectTo} />

        <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
          <a className="underline hover:text-white" href="/sign-up">
            Create an account
          </a>
          <a className="underline hover:text-white" href="/forgot-password">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}
