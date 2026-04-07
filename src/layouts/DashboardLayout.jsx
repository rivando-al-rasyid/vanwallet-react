import { Outlet } from "react-router";
import Header from "./dashboard/Header";
import Sidebar from "./dashboard/Sidebar";
import { useState } from "react";

/**
 * Dashboard layout component that provides main structure for authenticated pages.
 * Includes a fixed header, sidebar navigation, and content area for nested routes.
 */
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header setSidebarOpen={setSidebarOpen} />
      <main className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </main>
    </div>
  );
}

/**
 * Content area wrapper for dashboard pages.
 * Provides consistent spacing and layout for page content.
 */
function ContentArea({ children }) {
  return (
    <section className="flex-1 flex flex-col gap-6 p-8 overflow-auto">
      {children}
    </section>
  );
}
