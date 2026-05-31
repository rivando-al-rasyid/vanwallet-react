/**
 * api.js — Central API utility for VanWallet
 * Aligned to Swagger spec: Vanwallet 1.0 (Gin backend, base: localhost:8080/)
 *
 * Swagger endpoints used:
 *   Auth:         POST /auth/login, POST /auth/logout, POST /auth/register
 *                 GET  /auth/pin, POST /auth/pin/verify
 *   Profile:      GET  /profile, GET /profile/info
 *                 PATCH /profile/edit, PATCH /profile/password, PATCH /profile/change/pin
 *   Transactions: GET  /transactions, GET /transactions/history, GET /transactions/{id}
 *                 GET  /transactions/summary, GET /transactions/report
 *                 GET  /transactions/receivers
 *                 POST /transactions/topup, POST /transactions/topup/{id}/confirm
 *                 POST /transactions/transfer, POST /transactions/withdraw
 *                 POST /transactions/expense
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = "vanwallet_token";

const INCOME_TYPES = new Set(["TOPUP", "TRANSFER_IN"]);

// ─── URL & Token helpers ──────────────────────────────────────────────────────

export function resolveApiRoot() {
  const raw = String(BASE_URL || "").replace(/\/+$/, "");
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `http://${raw}`;
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

// ─── Data Mappers ─────────────────────────────────────────────────────────────

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
    pin: info?.pin_hash && info.pin_hash.trim() !== "" ? info.pin_hash : null,
    token,
  };
}

export function mapHistoryItem(item) {
  const direction =
    item.direction || (INCOME_TYPES.has(item.type) ? "income" : "expense");
  const name = item.title || item.note || item.type || "Transaction";
  return {
    id: item.id,
    img: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EBF4FF&color=7F9CF5`,
    name,
    phone: item.payment_method || item.status || item.source,
    amount: formatRupiah(item.amount),
    type: direction,
    createdAt: item.created_at,
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

/**
 * GET /auth/pin
 * Returns the PIN hash sequence for the current user (used to check if PIN is set)
 */
export async function fetchPinStatus() {
  return requestData("/auth/pin", {}, "Failed to fetch PIN status");
}

/**
 * POST /auth/pin/verify
 * Verifies validity of PIN entry blocks
 */
export async function verifyPinApi(pin) {
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

// ─── Profile ──────────────────────────────────────────────────────────────────

/**
 * GET /profile
 * Returns the current user's profile details
 */
export async function fetchProfile() {
  return requestData("/profile", {}, "Failed to fetch profile");
}

/**
 * GET /profile/info
 * Returns unified user statistics (balance, income, expense, etc.)
 */
export async function fetchUserInfo() {
  return requestData("/profile/info", {}, "Failed to fetch user info");
}

/**
 * PATCH /profile/edit
 * Updates name, phone, and optionally photo (multipart/form-data)
 */
export async function updateProfile({ fullName, phone, photoFile }) {
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

/**
 * PATCH /profile/password
 * Changes the user's login password
 */
export async function changePasswordApi(oldPassword, newPassword) {
  await requestJson(
    "/profile/password",
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

/**
 * PATCH /profile/change/pin  — First-time PIN setup (no old_pin)
 */
export async function setPinApi(pin) {
  await requestJson(
    "/profile/change/pin",
    {
      method: "PATCH",
      body: JSON.stringify({ pin_hash: pin }),
    },
    "Failed to set PIN",
  );
}

/**
 * PATCH /profile/change/pin  — Change existing PIN (requires old_pin verification)
 */
export async function changePinApi(currentPin, newPin) {
  await requestJson(
    "/profile/change/pin",
    {
      method: "PATCH",
      body: JSON.stringify({
        old_pin: currentPin,
        pin_hash: newPin,
      }),
    },
    "Failed to change PIN",
  );
}

// ─── Transactions ─────────────────────────────────────────────────────────────

/**
 * GET /transactions/summary
 * Returns current_balance, total_income, total_expense
 */
export async function fetchSummary() {
  return requestData("/transactions/summary", {}, "Failed to fetch summary");
}

/**
 * GET /transactions/report?range=7days&type=both
 * Returns chart report analytics with daily points
 */
export async function fetchReport({ range = "7days", type = "both" } = {}) {
  const params = new URLSearchParams({ range, type });
  return requestData(
    `/transactions/report?${params.toString()}`,
    {},
    "Failed to fetch report",
  );
}

/**
 * GET /transactions/history?page=1&limit=10
 * Returns paginated, user-friendly historical transaction logs
 */
export async function fetchHistory({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const data = await requestData(
    `/transactions/history?${params.toString()}`,
    {},
    "Failed to fetch history",
  );

  const items = (data?.data || []).map(mapHistoryItem);
  return {
    items,
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
    total: data?.total ?? items.length,
  };
}

/**
 * GET /transactions
 * Returns all raw technical ledger records
 */
export async function fetchAllTransactions() {
  return requestData("/transactions", {}, "Failed to fetch transactions");
}

/**
 * GET /transactions/{id}
 * Returns a single transaction detail
 */
export async function fetchTransactionById(id) {
  return requestData(`/transactions/${id}`, {}, "Failed to fetch transaction");
}

/**
 * GET /transactions/receivers?q=&page=1&limit=10
 * Searches profiles available as transfer recipients
 */
export async function searchReceivers({ q, page = 1, limit = 10 }) {
  const params = new URLSearchParams({
    q,
    page: String(page),
    limit: String(limit),
  });
  const data = await requestData(
    `/transactions/receivers?${params.toString()}`,
    {},
    "Failed to search receivers",
  );

  const items = (data?.data || []).map((receiver) => ({
    id: receiver.wallet_id,
    userId: receiver.user_id,
    walletId: receiver.wallet_id,
    name: receiver.full_name || receiver.email,
    phone: receiver.phone || receiver.wallet_label,
    img:
      resolveAssetUrl(receiver.photo) ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(receiver.full_name || receiver.email)}&background=EBF4FF&color=7F9CF5`,
    email: receiver.email,
  }));

  return {
    items,
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
    total: data?.total ?? items.length,
  };
}

/**
 * POST /transactions/topup
 * Initiates a top-up deposit pipeline. Returns { id, ... } for confirmation.
 */
export async function initiateTopup({ amount, paymentMethod }) {
  return requestData(
    "/transactions/topup",
    {
      method: "POST",
      body: JSON.stringify({
        amount: Number(amount),
        payment_method: paymentMethod,
      }),
    },
    "Failed to initiate top up",
  );
}

/**
 * POST /transactions/topup/{id}/confirm
 * Finalizes (confirms) a pending top-up event
 */
export async function confirmTopup(topupId) {
  return requestData(
    `/transactions/topup/${topupId}/confirm`,
    { method: "POST" },
    "Failed to confirm top up",
  );
}

/**
 * POST /transactions/transfer
 * Inter-wallet peer asset migration (requires PIN)
 */
export async function createTransfer({
  senderWalletId,
  recipientWalletId,
  amount,
  note,
  pin,
}) {
  return requestData(
    "/transactions/transfer",
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

/**
 * POST /transactions/withdraw
 * Executes a capital exit (withdrawal) pipeline
 */
export async function createWithdraw({ amount, bankAccount, bankName, pin }) {
  return requestData(
    "/transactions/withdraw",
    {
      method: "POST",
      body: JSON.stringify({
        amount: Number(amount),
        bank_account: bankAccount,
        bank_name: bankName,
        pin,
      }),
    },
    "Withdrawal failed",
  );
}

/**
 * POST /transactions/expense
 * Logs an outward operational purchase (expense)
 */
export async function createExpense({ amount, note, category, pin }) {
  return requestData(
    "/transactions/expense",
    {
      method: "POST",
      body: JSON.stringify({
        amount: Number(amount),
        note: note || "",
        category: category || "",
        pin,
      }),
    },
    "Failed to log expense",
  );
}

// ─── Auth session ─────────────────────────────────────────────────────────────

/**
 * POST /auth/logout
 * Terminates the server-side session token, then clears local token
 */
export async function logoutApi() {
  try {
    await requestJson("/auth/logout", { method: "POST" }, "Logout failed");
  } finally {
    clearToken();
  }
}
