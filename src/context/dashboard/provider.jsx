import { useState } from "react";
import { Outlet } from "react-router";
import DashboardContext from "./context";
import Header from "../../components/dashboard/Header";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardLayout from "../../layouts/DashboardLayout";

function DashboardProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <DashboardLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        header={<Header />}
        sidebar={<Sidebar setIsOpen={setSidebarOpen} />}
      >
        {children ?? <Outlet />}
      </DashboardLayout>
    </DashboardContext.Provider>
  );
}

export default DashboardProvider;
