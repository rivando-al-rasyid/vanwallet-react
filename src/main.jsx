import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "./style.css";

import App from "./App.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import RegisterPin from "./pages/auth/RegisterPin.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import Index from "./pages/dashboards/Index.jsx";
import Transfer from "./pages/dashboards/Transfer.jsx";
import History from "./pages/dashboards/History.jsx";
import TopUp from "./pages/dashboards/TopUp.jsx";
import Profile from "./pages/dashboards/Profile.jsx";
import ChangePassword from "./pages/dashboards/ChangePassword.jsx";
import ChangePin from "./pages/dashboards/ChangePin.jsx";
import SetNominal from "./pages/dashboards/SetNominal.jsx";
import DashboardProvider from "./context/dashboard/provider.jsx";
import { persistor, store } from "./store/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />

          {/* Guest-only routes */}
          <Route path="/login" element={<Login />} />

          <Route path="register">
            <Route index element={<Register />} />
            <Route path="pin" element={<RegisterPin />} />
          </Route>

          <Route path="forgotpassword" element={<ForgotPassword />} />

          {/* Protected routes — redirect to /login if not authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardProvider />}>
              <Route index element={<Index />} />

              <Route path="transfer">
                <Route index element={<Transfer />} />
                <Route path=":id" element={<SetNominal />} />
              </Route>

              <Route path="history" element={<History />} />
              <Route path="topup" element={<TopUp />} />

              <Route path="profile">
                <Route index element={<Profile />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="change-pin" element={<ChangePin />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
