import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./style.css";

import App from "./App.jsx";
import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/Dashboard/Index.jsx";
import Register from "./pages/auth/Register.jsx";
import Transfer from "./pages/Dashboard/Transfer.jsx";
import History from "./pages/Dashboard/History.jsx";
import TopUp from "./pages/Dashboard/TopUp.jsx";
import Profile from "./pages/Dashboard/Profile.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transfer" element={<Transfer />} />
      <Route path="/history" element={<History />} />
      <Route path="/topup" element={<TopUp />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </BrowserRouter>,
);
