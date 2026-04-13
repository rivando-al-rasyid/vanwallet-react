import { useState } from "react";
import { Outlet } from "react-router";
import DashboardContext from "./context";
import Header from "../../components/dashboard/Header";
import Sidebar from "../../components/dashboard/Sidebar";

function DashboardProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="min-h-screen bg-gray-50">
        {/* Header always visible on all screen sizes */}
        <Header />

        <main className="flex pt-16">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <section className="flex-1 flex flex-col gap-6 p-4 lg:p-8 overflow-auto min-h-[calc(100vh-4rem)]">
            {children ?? <Outlet />}
          </section>
        </main>
      </div>
    </DashboardContext.Provider>
  );
}

export default DashboardProvider;
