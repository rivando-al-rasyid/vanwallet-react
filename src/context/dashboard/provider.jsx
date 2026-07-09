import { useState } from "react";
import { Outlet } from "react-router";
import DashboardContext from "./context";
import Header from "../../components/dashboard/Header";
import Sidebar from "../../components/dashboard/Sidebar";

function DashboardProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="bg-base-100 text-base-content h-dvh overflow-hidden">
        <Header />
        <main className="flex h-dvh min-w-0 pt-16">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <section className="h-[calc(100dvh-4rem)] min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-5 lg:p-8">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_10%_10%,color-mix(in_oklch,var(--color-primary)_16%,transparent),transparent_26%),radial-gradient(circle_at_90%_0%,color-mix(in_oklch,var(--color-secondary)_10%,transparent),transparent_22%)]" />
            <div className="relative mx-auto flex w-full max-w-screen-2xl min-w-0 flex-col gap-4 pb-4 sm:gap-5">
              {children ?? <Outlet />}
            </div>
          </section>
        </main>
      </div>
    </DashboardContext.Provider>
  );
}

export default DashboardProvider;
