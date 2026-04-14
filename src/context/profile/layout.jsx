import { Outlet } from "react-router";
import { ProfileProvider } from "./provider";

// Layout wrapper agar ProfileProvider bisa wrap semua profile routes
// tanpa menggangu struktur Outlet dari DashboardProvider
export default function ProfileProviderLayout() {
  return (
    <ProfileProvider>
      <Outlet />
    </ProfileProvider>
  );
}
