import { memo } from "react";
import Brand from "../components/Brand";

/**
 * Split layout: form on the left, illustration on a blue-gradient
 * panel on the right. Fills exactly one viewport — no body scroll.
 * Used by Login, Register, AskPin.
 */
export const AuthLayout = memo(function AuthLayout({ children, aside }) {
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

export default AuthLayout;
