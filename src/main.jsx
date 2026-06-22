import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "./style.css";

import App from "./App.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AskPin from "./pages/auth/AskPin.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ConfirmReset from "./pages/auth/ConfirmReset.jsx";
import ChangePasswordReset from "./pages/auth/ChangePasswordReset.jsx";
import DashboardProvider from "./context/dashboard/provider.jsx";
import Index from "./pages/dashboards/Index.jsx";
import Transfer from "./pages/dashboards/Transfer.jsx";
import SetNominal from "./pages/dashboards/SetNominal.jsx";
import TransferModal from "./pages/dashboards/TransferModal.jsx";
import History from "./pages/dashboards/History.jsx";
import TopUp from "./pages/dashboards/TopUp.jsx";
import Profile from "./pages/dashboards/Profile.jsx";
import ChangePassword from "./pages/dashboards/ChangePassword.jsx";
import ChangePin from "./pages/dashboards/ChangePin.jsx";
import { persistor, store } from "./store/store.js";
import { dashboardLoader } from "./utils/loaders.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "pin",
        element: <AskPin />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/register/pin",
    element: <AskPin />,
  },
  {
    path: "/forgotpassword",
    children: [
      {
        index: true,
        element: <ForgotPassword />,
      },
      {
        path: "confirm",
        element: <ConfirmReset />,
      },
      {
        path: "change",
        element: <ChangePasswordReset />,
      },
    ],
  },
  {
    path: "/dashboard",
    loader: dashboardLoader,
    element: <DashboardProvider />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "transfer",
        children: [
          {
            index: true,
            element: <Transfer />,
          },
          {
            path: ":id",
            element: <SetNominal />,
          },
          {
            path: ":id/confirm",
            element: <TransferModal />,
          },
        ],
      },
      {
        path: "history",
        element: <History />,
      },
      {
        path: "topup",
        element: <TopUp />,
      },
      {
        path: "profile",
        children: [
          {
            index: true,
            element: <Profile />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
          },
          {
            path: "change-pin",
            element: <ChangePin />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>,
);
