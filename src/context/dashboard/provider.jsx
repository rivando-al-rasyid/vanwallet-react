import { useState } from "react";
import { Outlet } from "react-router";
import DashboardContext from "./context";
import Header from "../../components/dashboard/Header";
import Sidebar from "../../components/dashboard/Sidebar";

function DashboardProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="min-h-screen bg-base-200 text-base-content">
        <Header />
        <main className="flex pt-16">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <section className="min-h-[calc(100vh-4rem)] min-w-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
              {children ?? <Outlet />}
            </div>
          </section>
        </main>
      </div>
    </DashboardContext.Provider>
  );
}

export default DashboardProvider;
