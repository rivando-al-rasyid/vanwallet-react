import { useState } from "react";
import { Outlet } from "react-router";
import DashboardContext from "./context";
import Header from "../../components/dashboard/Header";
import Sidebar from "../../components/dashboard/Sidebar";

function DashboardProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="bg-light min-h-screen">
        {/* Header always visible on all screen sizes */}
        <Header />

        <main className="flex pt-16">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <section className="layout-fill min-h-[calc(100vh-4rem)] gap-6 overflow-auto p-4 lg:p-8">
            {children ?? <Outlet />}
          </section>
        </main>
      </div>
    </DashboardContext.Provider>
  );
}

export default DashboardProvider;
