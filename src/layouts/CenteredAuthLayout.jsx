import { memo } from "react";
import Brand from "../components/Brand";

/**
 * Centered layout: single form, no illustration panel.
 * Only the forgot-password flow (request / confirm / change) uses this.
 */
export const CenteredAuthLayout = memo(function CenteredAuthLayout({
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

export default CenteredAuthLayout;
