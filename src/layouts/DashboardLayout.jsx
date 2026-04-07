import { Outlet } from "react-router";
import Header from "./dashboard/Header";
import Sidebar from "./dashboard/Sidebar";

/**
 * Dashboard layout component that provides the main structure for authenticated pages.
 * Includes a fixed header, sidebar navigation, and content area for nested routes.
 */
export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex pt-16">
        <Sidebar />
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
