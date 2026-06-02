/**
 * auth.js — Authentication flows aligned to Swagger spec
 *
 * POST /auth/login    → returns token in data field
 * POST /auth/register → creates user entity, then auto-login
 * POST /auth/pin/verify → verifies PIN (used in protected actions)
 */

import {
  clearToken,
  fetchUserInfo,
  mapUserFromInfo,
  requestData,
  requestJson,
  setToken,
} from "./api";

/**
 * POST /auth/login
 * Body: { email, password }
 * Response: { data: "<jwt_token>" }
 * Then calls GET /profile/info to hydrate user object
 */
export async function loginUser({ email, password }) {
  const envelope = await requestJson(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    "Login failed",
  );

  // The Go backend returns the token in envelope.data
  const token = envelope.data;
  setToken(token);

  // Hydrate full user profile after token is set
  const info = await fetchUserInfo();
  return mapUserFromInfo(info, token);
}

/**
 * POST /auth/register
 * Body: { email, password }
 * Registers a new user entity, then auto-login to get token + profile
 */
export async function registerUser({ email, password }) {
  await requestJson(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    "Registration failed",
  );

  // Auto-login after successful registration to obtain token
  return loginUser({ email, password });
}

/**
 * POST /auth/pin/verify
 * Body: { pin }
 * Used to verify PIN before sensitive operations (transfer, withdraw, etc.)
 * Returns true on success, throws on failure
 */
export async function verifyPin(pin) {
  await requestJson(
    "/auth/pin/verify",
    {
      method: "POST",
      body: JSON.stringify({ pin }),
    },
    "Invalid PIN. Please try again.",
  );
  return true;
}

export { clearToken, fetchUserInfo };
