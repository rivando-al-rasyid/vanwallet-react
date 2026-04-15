import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "./style.css";

import App from "./App.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import LoginPin from "./pages/auth/LoginPin.jsx";
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
            <Route path="login">
              <Route index element={<Login />} />
              <Route path="pin" element={<LoginPin />} />
            </Route>
            <Route path="register" element={<Register />} />
            <Route path="forgotpassword" element={<ForgotPassword />} />

            {/* Dashboard routes wrapped by DashboardProvider */}
            <Route path="dashboard" element={<DashboardProvider />}>
              <Route index element={<Index />} />

              <Route path="transfer">
                <Route index element={<Transfer />} />
                <Route path=":id" element={<SetNominal />} />
              </Route>

              <Route path="history" element={<History />} />
              <Route path="topup" element={<TopUp />} />

              <Route path="profile" >
                <Route index element={<Profile />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="change-pin" element={<ChangePin />} />
              </Route>
            </Route>
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>);
