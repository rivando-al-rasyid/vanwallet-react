import { redirect } from "react-router";

import { store } from "../store/store.js";
import { fetchUserInfo, mapUserFromInfo } from "./api.js";
import { mergeUser } from "../store/slices/authSlice.js";

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

function redirectToLogin(request) {
  const redirectTo = encodeURIComponent(getSafeRedirectPath(request));

  throw redirect(`/login?redirectTo=${redirectTo}`);
}

function redirectToPin(request) {
  const redirectTo = encodeURIComponent(getSafeRedirectPath(request));

  throw redirect(`/login/pin?redirectTo=${redirectTo}`);
}

async function refreshAuthenticatedUser() {
  const info = await fetchUserInfo();
  const user = mapUserFromInfo(info);

  store.dispatch(mergeUser(user));

  return user;
}

export async function dashboardLoader({ request }) {
  const stateUser = store.getState().auth.user;
  const persistedUser = getPersistedAuthUser();
  let user = stateUser || persistedUser;

  try {
    // The backend now authenticates with an HttpOnly access_token cookie.
    // Always verify with /auth/me so stale persisted Redux state cannot open
    // protected pages after the backend session has expired or been revoked.
    user = await refreshAuthenticatedUser();
  } catch {
    redirectToLogin(request);
  }

  if (!user) {
    redirectToLogin(request);
  }

  if (!user.pin) {
    redirectToPin(request);
  }

  return null;
}
