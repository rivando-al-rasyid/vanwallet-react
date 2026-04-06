import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./style.css";

import App from "./App.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import PinOtp from "./pages/auth/PinOtp.jsx";

import Dashboard from "./pages/dashboard/Index.jsx";
import Transfer from "./pages/dashboard/Transfer.jsx";
import History from "./pages/dashboard/History.jsx";
import TopUp from "./pages/dashboard/TopUp.jsx";
import SetNominal from "./pages/dashboard/SetNominal.jsx";

import Profile from "./pages/dashboard/Profile";
import ChangePassword from "./pages/dashboard/ChangePassword";
import ChangePin from "./pages/dashboard/ChangePin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpassword/otp" element={<PinOtp />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transfer" element={<Transfer />} />
      <Route path="/transfer/:id" element={<SetNominal />} />
      <Route path="/history" element={<History />} />
      <Route path="/topup" element={<TopUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/change-password" element={<ChangePassword />} />
      <Route path="/profile/change-pin" element={<ChangePin />} />
    </Routes>
  </BrowserRouter>,
);
