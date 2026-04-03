import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./globals.css";

import App from "./App.jsx";
import Login from "./pages/auth/Login.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>,
);
