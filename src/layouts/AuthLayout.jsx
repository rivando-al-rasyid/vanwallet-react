import { memo } from "react";
import Brand from "../components/Brand";

/**
 * Split layout: form on the left, illustration on the right.
 * Fills exactly one viewport (h-dvh) — no page scroll.
 * Used by Login, Register, AskPin.
 */
export const AuthSplitLayout = memo(function AuthSplitLayout({
  children,
  aside,
}) {
  return (
    <main className="bg-base-100 grid h-dvh grid-cols-1 overflow-hidden lg:grid-cols-2">
      <section className="flex h-full min-h-0 items-center justify-center overflow-y-auto px-5 py-6 sm:px-10 sm:py-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-sm">
          <Brand />
          <div className="mt-5">{children}</div>
        </div>
      </section>
      {aside}
    </main>
  );
});

/**
 * Centered layout: single form, no illustration panel.
 * Used by ForgotPassword, ConfirmReset, ChangePasswordReset.
 */
export const AuthCenteredLayout = memo(function AuthCenteredLayout({
  children,
}) {
  return (
    <main className="bg-base-100 grid h-dvh place-items-center overflow-hidden px-5 py-6 sm:px-10">
      <section className="max-h-full w-full max-w-sm overflow-y-auto">
        <Brand />
        <div className="mt-5">{children}</div>
      </section>
    </main>
  );
});
