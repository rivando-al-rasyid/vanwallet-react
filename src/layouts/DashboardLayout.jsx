import { memo } from "react";

/**
 * Fixed viewport app shell built on DaisyUI's `drawer` component.
 * Header + sidebar stay put; only the content pane scrolls.
 */
export const DashboardLayout = memo(function DashboardLayout({
  sidebarOpen,
  setSidebarOpen,
  header,
  sidebar,
  children,
}) {
  return (
    <div className="drawer lg:drawer-open h-dvh">
      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={(e) => setSidebarOpen(e.target.checked)}
      />

      <div className="drawer-content flex h-dvh min-w-0 flex-col overflow-hidden">
        {header}
        <main className="bg-base-200/40 relative min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-5 lg:p-8">
          <div className="relative mx-auto flex w-full max-w-screen-2xl min-w-0 flex-col gap-4 pb-4 sm:gap-5">
            {children}
          </div>
        </main>
      </div>

      <div className="drawer-side z-50 lg:h-dvh">
        <label
          htmlFor="dashboard-drawer"
          aria-label="Close sidebar"
          className="drawer-overlay"
        />
        {sidebar}
      </div>
    </div>
  );
});

export default DashboardLayout;
