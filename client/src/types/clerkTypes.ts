import type { SignInResource } from "@clerk/types";

export type OAuthStrategy = "oauth_google" | "oauth_github" | "oauth_apple";
export type OAuthProvider = "google" | "github" | "apple";

export type OAuthButtonsRowProps = {
  redirectUrl?: string;
  redirectUrlComplete?: string;
  className?: string;
};

export type PasswordSignProps = {
  onSuccessRedirectTo?: string;
  className?: string;
};


export type SupportedFirstFactor = NonNullable<SignInResource["supportedFirstFactors"]>[number];
export type EmailCodeFactor = Extract<SupportedFirstFactor, { strategy: "email_code" }>;
