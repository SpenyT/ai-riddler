import { useSignIn, useSignUp } from "@clerk/clerk-react";
import type { OAuthStrategy, OAuthProvider, OAuthButtonsProps } from "@/types/clerkTypes";

const PROVIDERS: Array<{
  provider: OAuthProvider;
  strategy: OAuthStrategy;
  label: string;
  iconSrc: string;
  iconSize: string;
}> = [
  {
    provider: "google",
    strategy: "oauth_google",
    label: "Continue with Google",
    iconSrc: "/icons/google.svg",
    iconSize: "h-7 w-7"
  },
  {
    provider: "github",
    strategy: "oauth_github",
    label: "Continue with GitHub",
    iconSrc: "/icons/github_black.svg",
    iconSize: "h-7 w-7"
  },
  {
    provider: "apple",
    strategy: "oauth_apple",
    label: "Continue with Apple",
    iconSrc: "/icons/apple_black.svg",
    iconSize: "h-12 w-12"
  },
];

export default function OAuthButtons({ 
  redirectUrl = "/auth/callback",
  redirectUrlComplete = "/dashboard",
  signMode = "signin"
} : OAuthButtonsProps) {
  const { isLoaded: signInLoaded, signIn } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();

  const isLoaded = signMode === "signin" ? signInLoaded : signUpLoaded;

  async function startOAuth(strategy: OAuthStrategy) {
    if (signMode === "signin") {
      if (!signInLoaded || !signIn) return;
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl,
        redirectUrlComplete,
      });
      return;
    }

    if (!signUpLoaded || !signUp) return;
    await signUp.authenticateWithRedirect({
      strategy,
      redirectUrl,
      redirectUrlComplete,
    });
  }

  return (
    <div className="flex justify-center">
      <div className="flex gap-5">
        {PROVIDERS.map((p) => (
          <button
            key={p.provider}
            type="button"
            onClick={() => startOAuth(p.strategy)}
            disabled={!isLoaded}
            aria-label={p.label}
            title={p.label}
            className={[
              "h-12 w-12 rounded-lg",
              "inline-flex items-center justify-center",
              "border border-slate-300 bg-white",
              "hover:bg-slate-50 active:scale-[0.98]",
              "cursor-pointer",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
            ].join(" ")}
          >
            <img
              src={p.iconSrc}
              alt=""
              className={p.iconSize}
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
