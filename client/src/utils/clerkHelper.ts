import type { SupportedFirstFactor, EmailCodeFactor } from "@/types/clerkTypes";

export function isEmailCodeFactor(f: SupportedFirstFactor): f is EmailCodeFactor {
  return f.strategy === "email_code";
}

export function getClerkErrorMessage(e: unknown, fallback: string): string {
  if (typeof e !== "object" || e === null) return fallback;

  const maybe = e as { errors?: Array<{ longMessage?: string; message?: string }> };
  const msg = maybe.errors?.[0]?.longMessage || maybe.errors?.[0]?.message;
  return msg || fallback;
}