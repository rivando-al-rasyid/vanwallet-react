import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./style.css";

import App from "./App.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import LoginPin from "./pages/auth/LoginPin.jsx";
import Dashboard from "./layouts/DashboardLayout.jsx";

import Index from "./pages/dashboard/Index.jsx";
import Transfer from "./pages/dashboard/Transfer.jsx";
import History from "./pages/dashboard/History.jsx";
import TopUp from "./pages/dashboard/TopUp.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import ChangePassword from "./pages/dashboard/ChangePassword.jsx";
import ChangePin from "./pages/dashboard/ChangePin.jsx";
import SetNominal from "./pages/dashboard/SetNominal.jsx";

import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<App />} />

      {/* Guest-only routes — logged-in users are redirected to /dashboard */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/login/pin" element={<LoginPin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Route>

      {/* Protected routes — unauthenticated users are redirected to /login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Index />} />

          <Route path="transfer">
            <Route index element={<Transfer />} />
            <Route path=":id" element={<SetNominal />} />
          </Route>

          <Route path="history" element={<History />} />
          <Route path="topup" element={<TopUp />} />

          {/* Profile nested routes */}
          <Route path="profile">
            <Route index element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="change-pin" element={<ChangePin />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>,
);
