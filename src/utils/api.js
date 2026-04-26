// ─── API Config ────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const API_ROOT = String(BASE_URL || "").replace(/\/+$/, "");

// ─── Session Token Helpers ─────────────────────────────────────────────────────
const SESSION_KEY = "ewallet_session_token";
export const setSessionToken = (t) =>
  t
    ? localStorage.setItem(SESSION_KEY, t)
    : localStorage.removeItem(SESSION_KEY);
export const getSessionToken = () => localStorage.getItem(SESSION_KEY);
export const clearSessionToken = () => localStorage.removeItem(SESSION_KEY);

/**
 * Thin JSON fetch wrapper shared by all util modules.
 * Throws an Error with the API's message on non-2xx responses.
 *
 * @param {string} path
 * @param {RequestInit & { body?: any, auth?: boolean }} [options]
 *   - body: plain object (auto-stringified) or string/FormData
 *   - auth: when true, attach the session token header
 * @param {string} [fallbackMessage]
 */
export async function apiRequest(
  path,
  options = {},
  fallbackMessage = "Request failed",
) {
  const { body, auth = true, headers: extraHeaders, ...rest } = options;

  // Auto-serialize plain-object bodies
  const isPlainObject =
    body && typeof body === "object" && !(body instanceof FormData);
  const serializedBody = isPlainObject ? JSON.stringify(body) : body;

  const headers = {
    Accept: "application/json",
    ...(isPlainObject ? { "Content-Type": "application/json" } : {}),
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
    ...(auth && getSessionToken()
      ? { "X-Session-Token": getSessionToken() }
      : {}),
    ...(extraHeaders || {}),
  };

  let res;
  try {
    res = await fetch(`${API_ROOT}${path}`, {
      ...rest,
      headers,
      body: serializedBody,
    });
  } catch (e) {
    throw new Error("Network error — please check your connection.");
  }

  // Safely parse response (handles empty bodies, non-JSON errors)
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!res.ok) {
    // Auto-clear expired sessions
    if (res.status === 401) clearSessionToken();
    throw new Error(
      data?.error || data?.message || `${fallbackMessage} (${res.status})`,
    );
  }

  return data;
}

// ─── Convenience Helpers ───────────────────────────────────────────────────────
export const apiGet = (path, opts) =>
  apiRequest(path, { ...opts, method: "GET" });
export const apiPost = (path, body, opts) =>
  apiRequest(path, { ...opts, method: "POST", body });
export const apiPut = (path, body, opts) =>
  apiRequest(path, { ...opts, method: "PUT", body });
export const apiDelete = (path, opts) =>
  apiRequest(path, { ...opts, method: "DELETE" });
