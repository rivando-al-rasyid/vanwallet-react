import { useState } from "react";
import { Outlet } from "react-router";
import DashboardContext from "./context";
import Header from "../../components/dashboard/Header";
import Sidebar from "../../components/dashboard/Sidebar";

function DashboardProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="bg-base-200 text-base-content min-h-screen overflow-x-hidden">
        <Header />
        <main className="flex min-w-0 pt-16">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <section className="min-h-[calc(100dvh-4rem)] min-w-0 flex-1 overflow-x-hidden p-3 sm:p-5 lg:p-8">
            <div className="mx-auto flex w-full max-w-screen-2xl min-w-0 flex-col gap-5 sm:gap-6">
              {children ?? <Outlet />}
            </div>
          </section>
        </main>
      </div>
    </DashboardContext.Provider>
  );
}

export default DashboardProvider;
