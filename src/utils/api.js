/**
 * api.js — Central API utility for VanWallet
 *
 * Backend routes (Gin, base: VITE_API_BASE_URL):
 *   Auth:         POST /auth/login, /auth/register, /auth/logout
 *                 GET  /auth/pin
 *                 POST /auth/pin/verify
 *                 POST /auth/reset, /auth/reset/confirm, /auth/change-password
 *   Profile:      GET  /profile, /profile/info
 *                 PATCH /profile/edit
 *                 PATCH /profile/change/pin
 *                 PATCH /profile/change/password
 *   Transactions: GET  /transaction, /transaction/history, /transaction/:id
 *                 GET  /transaction/summary, /transaction/report, /transaction/receiver
 *                 POST /transaction/topup
 *                 PATCH /transaction/topup/:id/confirm
 *                 POST /transaction/transfer, /transaction/withdrawal, /transaction/expense
 */

const TOKEN_KEY = "vanwallet_token";

export function resolveApiRoot() {
  return "/api";
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function resolveAssetUrl(path) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${resolveApiRoot()}${path.startsWith("/") ? path : `/${path}`}`;
}

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatRupiah(amount) {
  return `Rp.${Number(amount || 0).toLocaleString("id-ID")}`;
}

export function formatRupiahShort(amount) {
  const value = Number(amount || 0);
  if (value >= 1_000_000) return `Rp.${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `Rp.${Math.round(value / 1_000)}k`;
  return formatRupiah(value);
}

// ─── Data Mapper ──────────────────────────────────────────────────────────────

export function mapUserFromInfo(info, token) {
  return {
    id: info?.id,
    email: info?.email || "",
    name: info?.full_name || info?.email?.split("@")[0] || "User",
    phone: info?.phone || "",
    avatar:
      resolveAssetUrl(info?.photo) ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(info?.full_name || info?.email || "User")}&background=EBF4FF&color=7F9CF5`,
    currentBalance: info?.current_balance ?? 0,
    // pin_hash is a plain string from the server; empty string means no PIN set
    pin: info?.pin_hash && info.pin_hash.trim() !== "" ? info.pin_hash : null,
    token,
  };
}

// ─── Core HTTP helpers ────────────────────────────────────────────────────────

export async function requestJson(
  path,
  options = {},
  fallbackMessage = "Request failed",
) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${resolveApiRoot()}${path}`, {
    ...options,
    headers,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok || body?.isSuccess === false) {
    throw new Error(body?.error || body?.message || fallbackMessage);
  }

  return body;
}

export async function requestData(
  path,
  options = {},
  fallbackMessage = "Request failed",
) {
  const envelope = await requestJson(path, options, fallbackMessage);
  return envelope?.data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** POST /auth/login — returns JWT token in data field */
export async function loginApi({ email, password }) {
  const envelope = await requestJson(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    "Login failed",
  );
  const token = envelope.data;
  setToken(token);
  const info = await fetchUserInfo();
  return mapUserFromInfo(info, token);
}

/** POST /auth/register — creates user account only (no auto-login) */
export async function registerApi({ email, password }) {
  await requestJson(
    "/auth/register",
    { method: "POST", body: JSON.stringify({ email, password }) },
    "Registration failed",
  );
}

/** POST /auth/logout — invalidates server session */
export async function logoutApi() {
  try {
    await requestJson("/auth/logout", { method: "POST" }, "Logout failed");
  } finally {
    clearToken();
  }
}

/** GET /auth/pin — checks whether PIN is set */
export async function fetchPinStatus() {
  return requestData("/auth/pin", {}, "Failed to fetch PIN status");
}

/** POST /auth/pin/verify */
export async function verifyPinApi(pin) {
  await requestJson(
    "/auth/pin/verify",
    { method: "POST", body: JSON.stringify({ pin }) },
    "Invalid PIN. Please try again.",
  );
  return true;
}

/** POST /auth/reset — request a password-reset token */
export async function requestPasswordReset(email) {
  return requestData(
    "/auth/reset",
    { method: "POST", body: JSON.stringify({ email }) },
    "Failed to request password reset",
  );
}

/** POST /auth/reset/confirm — exchange opaque token for a reset JWT */
export async function confirmPasswordReset(token) {
  return requestData(
    "/auth/reset/confirm",
    { method: "POST", body: JSON.stringify({ token }) },
    "Failed to confirm reset token",
  );
}

/**
 * POST /auth/change-password
 * Requires the short-lived reset JWT (from confirmPasswordReset) as Bearer token.
 */
export async function changePasswordWithResetToken(resetJwt, newPassword) {
  const res = await fetch(`${resolveApiRoot()}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resetJwt}`,
    },
    body: JSON.stringify({ new_password: newPassword }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || body?.isSuccess === false) {
    throw new Error(
      body?.error || body?.message || "Failed to change password",
    );
  }
  return body;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

/** GET /profile/info — unified user stats */
export async function fetchUserInfo() {
  return requestData("/profile/info", {}, "Failed to fetch user info");
}

/** GET /profile — basic profile details */
export async function fetchProfile() {
  return requestData("/profile", {}, "Failed to fetch profile");
}

/** PATCH /profile/edit — update name, phone, photo (multipart) */
export async function updateProfileApi({ fullName, phone, photoFile }) {
  const formData = new FormData();
  if (fullName) formData.append("full_name", fullName);
  if (phone) formData.append("phone", phone);
  if (photoFile) formData.append("photo", photoFile);
  await requestJson(
    "/profile/edit",
    { method: "PATCH", body: formData },
    "Failed to update profile",
  );
}

/** PATCH /profile/change/pin — first-time setup (no old_pin) or change */
export async function setPinApi(pin) {
  await requestJson(
    "/profile/change/pin",
    { method: "PATCH", body: JSON.stringify({ pin_hash: pin }) },
    "Failed to set PIN",
  );
}

/** PATCH /profile/change/pin — change existing PIN (requires old_pin) */
export async function changePinApi(currentPin, newPin) {
  await requestJson(
    "/profile/change/pin",
    {
      method: "PATCH",
      body: JSON.stringify({ old_pin: currentPin, pin_hash: newPin }),
    },
    "Failed to change PIN",
  );
}

/** PATCH /profile/change/password — change password while logged in */
export async function changePasswordApi(oldPassword, newPassword) {
  await requestJson(
    "/profile/change/password",
    {
      method: "PATCH",
      body: JSON.stringify({
        old_password: oldPassword,
        password: newPassword,
      }),
    },
    "Failed to change password",
  );
}

// ─── Transactions ─────────────────────────────────────────────────────────────

/** GET /transaction/summary */
export async function fetchSummary() {
  return requestData("/transaction/summary", {}, "Failed to fetch summary");
}

/** GET /transaction/report?range=7days&type=both */
export async function fetchReport({ range = "7days", type = "both" } = {}) {
  const params = new URLSearchParams({ range, type });
  return requestData(
    `/transaction/report?${params}`,
    {},
    "Failed to fetch report",
  );
}

/** GET /transaction/history?page=1&limit=10 */
export async function fetchHistory({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const data = await requestData(
    `/transaction/history?${params}`,
    {},
    "Failed to fetch history",
  );
  return {
    items: data?.data ?? [],
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
    total: data?.total ?? 0,
  };
}

/** GET /transaction?page=1&limit=10 — raw ledger */
export async function fetchAllTransactions({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return requestData(
    `/transaction?${params}`,
    {},
    "Failed to fetch transactions",
  );
}

/** GET /transaction/:id */
export async function fetchTransactionById(id) {
  return requestData(`/transaction/${id}`, {}, "Failed to fetch transaction");
}

/** GET /transaction/receiver?q=&page=1&limit=10 */
export async function searchReceivers({ q = "", page = 1, limit = 10 }) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (q.trim()) {
    params.set("q", q.trim());
  }

  const data = await requestData(
    `/transaction/receiver?${params.toString()}`,
    {},
    "Failed to fetch receivers",
  );

  const items = (data?.data ?? []).map((receiver) => ({
    id: receiver.wallet_id,
    userId: receiver.user_id,
    walletId: receiver.wallet_id,
    name: receiver.full_name || receiver.email,
    phone: receiver.phone || receiver.wallet_label,
    img:
      resolveAssetUrl(receiver.photo) ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        receiver.full_name || receiver.email,
      )}&background=EBF4FF&color=7F9CF5`,
    email: receiver.email,
  }));

  return {
    items,
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
    total: data?.total ?? 0,
  };
}

/**
 * POST /transaction/topup
 * Requires wallet_id, amount, payment_method, pin in body.
 */
export async function initiateTopup({ walletId, amount, paymentMethod, pin }) {
  return requestData(
    "/transaction/topup",
    {
      method: "POST",
      body: JSON.stringify({
        wallet_id: walletId,
        amount: Number(amount),
        payment_method: paymentMethod,
        pin,
      }),
    },
    "Failed to initiate top up",
  );
}

/** PATCH /transaction/topup/:id/confirm */
export async function confirmTopup(topupId) {
  return requestData(
    `/transaction/topup/${topupId}/confirm`,
    { method: "PATCH" },
    "Failed to confirm top up",
  );
}

/** POST /transaction/transfer — requires sender_wallet_id, recipient_wallet_id, amount, pin */
export async function createTransfer({
  senderWalletId,
  recipientWalletId,
  amount,
  note,
  pin,
}) {
  return requestData(
    "/transaction/transfer",
    {
      method: "POST",
      body: JSON.stringify({
        sender_wallet_id: senderWalletId,
        recipient_wallet_id: recipientWalletId,
        amount: Number(amount),
        note: note || "",
        pin,
      }),
    },
    "Transfer failed",
  );
}

/** POST /transaction/withdrawal — requires wallet_id, amount, bank details, pin */
export async function createWithdraw({
  walletId,
  amount,
  bankName,
  accountNumber,
  accountHolder,
  pin,
}) {
  return requestData(
    "/transaction/withdrawal",
    {
      method: "POST",
      body: JSON.stringify({
        wallet_id: walletId,
        amount: Number(amount),
        bank_name: bankName,
        account_number: accountNumber,
        account_holder: accountHolder,
        pin,
      }),
    },
    "Withdrawal failed",
  );
}

/** POST /transaction/expense — requires wallet_id, amount, pin */
export async function createExpense({
  walletId,
  amount,
  adminFee,
  category,
  merchantName,
  note,
  pin,
}) {
  return requestData(
    "/transaction/expense",
    {
      method: "POST",
      body: JSON.stringify({
        wallet_id: walletId,
        amount: Number(amount),
        admin_fee: adminFee ?? 0,
        category: category || "",
        merchant_name: merchantName || "",
        note: note || "",
        pin,
      }),
    },
    "Failed to log expense",
  );
}
