import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./style.css";

import App from "./App.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";

import Dashboard from "./pages/Dashboard/Index.jsx";
import Transfer from "./pages/Dashboard/Transfer.jsx";
import History from "./pages/Dashboard/History.jsx";
import TopUp from "./pages/Dashboard/TopUp.jsx";
import SetNominal from "./pages/Dashboard/SetNominal.jsx";

import Profile from "./pages/Dashboard/Profile";
import ChangePassword from "./pages/Dashboard/ChangePassword";
import ChangePin from "./pages/Dashboard/ChangePin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
