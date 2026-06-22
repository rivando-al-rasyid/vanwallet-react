import { redirect } from "react-router";

import { store } from "../store/store.js";
import { getToken } from "./api.js";

function getSafeRedirectPath(request) {
  const url = new URL(request.url);
  const redirectTo = `${url.pathname}${url.search}${url.hash}`;

  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/dashboard";
  }

  return redirectTo;
}

function getPersistedAuthUser() {
  try {
    const persistedAuth = localStorage.getItem("persist:auth");

    if (!persistedAuth) {
      return null;
    }

    const parsedAuth = JSON.parse(persistedAuth);
    const parsedUser = JSON.parse(parsedAuth.user || "null");

    return parsedUser;
  } catch {
    return null;
  }
}

export function dashboardLoader({ request }) {
  const stateUser = store.getState().auth.user;
  const persistedUser = getPersistedAuthUser();
  const user = stateUser || persistedUser;
  const token = user?.token || getToken();

  if (!user && !token) {
    const redirectTo = encodeURIComponent(getSafeRedirectPath(request));

    throw redirect(`/login?redirectTo=${redirectTo}`);
  }

  if (user && !user.pin) {
    const redirectTo = encodeURIComponent(getSafeRedirectPath(request));

    throw redirect(`/login/pin?redirectTo=${redirectTo}`);
  }

  return null;
}
