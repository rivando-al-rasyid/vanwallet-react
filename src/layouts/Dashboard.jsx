import { Outlet } from "react-router";
import Header from "./dashboard/Header";
import Sidebar from "./dashboard/Sidebar";
export default function DashboardLayout() {
  return (
    <>
      <Header />
      <main className="flex pt-16 min-h-screen">
        <Sidebar />
        <section className="flex-1 flex flex-col gap-6 p-8 overflow-auto">
          <Outlet />
        </section>
      </main>
    </>
  );
}
