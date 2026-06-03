/**
 * api.js — Central API utility for VanWallet
 *
 * Backend routes base: /api
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_STORAGE_KEY = "vanwallet_token";
const DEFAULT_API_ROOT = "http://backend:8080";

const JSON_CONTENT_TYPE = "application/json";
const DEFAULT_ERROR_MESSAGE = "Request failed";

// ─── URL Helpers ──────────────────────────────────────────────────────────────

function removeTrailingSlash(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function hasProtocol(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}

function isDockerBackendUrl(url) {
  return url.includes("backend:8080");
}

function isLocalhostApiUrl(url) {
  return url === "http://localhost:8080" || url === "https://localhost:8080";
}

function shouldUseDefaultApiRoot(url) {
  return !url || isLocalhostApiUrl(url) || isDockerBackendUrl(url);
}

export function resolveApiRoot() {
  const normalizedBaseUrl = removeTrailingSlash(API_BASE_URL);

  if (shouldUseDefaultApiRoot(normalizedBaseUrl)) {
    return DEFAULT_API_ROOT;
  }

  if (hasProtocol(normalizedBaseUrl)) {
    return normalizedBaseUrl;
  }

  return `http://${normalizedBaseUrl}`;
}

export function resolveAssetUrl(assetPath) {
  if (!assetPath) {
    return "";
  }

  if (assetPath.startsWith("http") || assetPath.startsWith("data:")) {
    return assetPath;
  }

  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;

  return `${resolveApiRoot()}${normalizedPath}`;
}

// ─── Token Helpers ────────────────────────────────────────────────────────────

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (!token) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return;
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Ignore storage errors so the app does not crash in restricted browsers.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage errors so logout flow can still continue safely.
  }
}

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatRupiah(amount) {
  const numericAmount = Number(amount || 0);

  return `Rp.${numericAmount.toLocaleString("id-ID")}`;
}

export function formatRupiahShort(amount) {
  const numericAmount = Number(amount || 0);

  if (numericAmount >= 1_000_000) {
    return `Rp.${(numericAmount / 1_000_000).toFixed(1)}M`;
  }

  if (numericAmount >= 1_000) {
    return `Rp.${Math.round(numericAmount / 1_000)}k`;
  }

  return formatRupiah(numericAmount);
}

// ─── Common Helpers ───────────────────────────────────────────────────────────

function buildDefaultAvatarUrl(name = "User") {
  const encodedName = encodeURIComponent(name);

  return `https://ui-avatars.com/api/?name=${encodedName}&background=EBF4FF&color=7F9CF5`;
}

function getDisplayName(userInfo) {
  if (userInfo?.full_name) {
    return userInfo.full_name;
  }

  if (userInfo?.email) {
    return userInfo.email.split("@")[0];
  }

  return "User";
}

function hasValidPinHash(pinHash) {
  return typeof pinHash === "string" && pinHash.trim() !== "";
}

function createJsonBody(payload) {
  return JSON.stringify(payload);
}

function toPositiveNumber(value, fieldName = "amount") {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    throw new Error(`${fieldName} must be a valid positive number`);
  }

  return numericValue;
}

function toOptionalText(value) {
  return value || "";
}

function createPaginationParams({ page = 1, limit = 10 } = {}) {
  return new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
}

function normalizePaginatedResponse(data, fallbackPage, fallbackLimit) {
  return {
    items: data?.data ?? [],
    page: data?.page ?? fallbackPage,
    limit: data?.limit ?? fallbackLimit,
    total: data?.total ?? 0,
  };
}

// ─── Data Mapper ──────────────────────────────────────────────────────────────

export function mapUserFromInfo(userInfo, token) {
  const displayName = getDisplayName(userInfo);
  const avatarUrl = resolveAssetUrl(userInfo?.photo) || buildDefaultAvatarUrl(displayName);

  return {
    id: userInfo?.id,
    email: userInfo?.email || "",
    name: displayName,
    phone: userInfo?.phone || "",
    avatar: avatarUrl,
    currentBalance: userInfo?.current_balance ?? 0,

    // pin_hash is a plain string from the server.
    // Empty string means no PIN set.
    pin: hasValidPinHash(userInfo?.pin_hash) ? userInfo.pin_hash : null,

    token,
  };
}

function mapReceiver(receiver) {
  const displayName = receiver.full_name || receiver.email || "User";
  const avatarUrl = resolveAssetUrl(receiver.photo) || buildDefaultAvatarUrl(displayName);

  return {
    id: receiver.wallet_id,
    userId: receiver.user_id,
    walletId: receiver.wallet_id,
    name: displayName,
    phone: receiver.phone || receiver.wallet_label,
    img: avatarUrl,
    email: receiver.email,
  };
}

// ─── Core HTTP Helpers ────────────────────────────────────────────────────────

function buildHeaders(options) {
  const headers = {
    ...(options.headers || {}),
  };

  const token = getToken();

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const hasBody = Boolean(options.body);
  const isFormData = options.body instanceof FormData;
  const alreadyHasContentType = Boolean(headers["Content-Type"]);

  if (hasBody && !isFormData && !alreadyHasContentType) {
    headers["Content-Type"] = JSON_CONTENT_TYPE;
  }

  return headers;
}

async function parseJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJsonResponse = contentType.includes(JSON_CONTENT_TYPE);

  if (!isJsonResponse) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getErrorMessage(body, fallbackMessage) {
  return body?.error || body?.message || fallbackMessage || DEFAULT_ERROR_MESSAGE;
}

function throwIfRequestFailed(response, body, fallbackMessage) {
  const requestFailed = !response.ok || body?.isSuccess === false;

  if (!requestFailed) {
    return;
  }

  throw new Error(getErrorMessage(body, fallbackMessage));
}

export async function requestJson(
  path,
  options = {},
  fallbackMessage = DEFAULT_ERROR_MESSAGE,
) {
  const headers = buildHeaders(options);
  const url = `${resolveApiRoot()}${path}`;

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("Unable to connect to the server. Please check your network or backend service.");
  }

  const body = await parseJsonResponse(response);

  throwIfRequestFailed(response, body, fallbackMessage);

  return body;
}

export async function requestData(
  path,
  options = {},
  fallbackMessage = DEFAULT_ERROR_MESSAGE,
) {
  const envelope = await requestJson(path, options, fallbackMessage);

  return envelope?.data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Returns JWT token in data field.
 */
export async function loginApi({ email, password }) {
  const envelope = await requestJson(
    "/auth/login",
    {
      method: "POST",
      body: createJsonBody({ email, password }),
    },
    "Login failed",
  );

  const token = envelope?.data;

  if (!token) {
    throw new Error("Login failed: token was not returned by server");
  }

  setToken(token);

  const userInfo = await fetchUserInfo();

  return mapUserFromInfo(userInfo, token);
}

/**
 * POST /auth/register
 * Creates user, then auto-login.
 */
export async function registerApi({ email, password }) {
  await requestJson(
    "/auth/register",
    {
      method: "POST",
      body: createJsonBody({ email, password }),
    },
    "Registration failed",
  );

  return loginApi({ email, password });
}

/**
 * POST /auth/logout
 * Invalidates server session.
 */
export async function logoutApi() {
  try {
    await requestJson(
      "/auth/logout",
      { method: "POST" },
      "Logout failed",
    );
  } finally {
    clearToken();
  }
}

/**
 * GET /auth/pin
 * Checks whether PIN is set.
 */
export async function fetchPinStatus() {
  return requestData(
    "/auth/pin",
    {},
    "Failed to fetch PIN status",
  );
}

/**
 * POST /auth/pin/verify
 */
export async function verifyPinApi(pin) {
  await requestJson(
    "/auth/pin/verify",
    {
      method: "POST",
      body: createJsonBody({ pin }),
    },
    "Invalid PIN. Please try again.",
  );

  return true;
}

/**
 * POST /auth/reset
 * Request a password-reset token.
 */
export async function requestPasswordReset(email) {
  return requestData(
    "/auth/reset",
    {
      method: "POST",
      body: createJsonBody({ email }),
    },
    "Failed to request password reset",
  );
}

/**
 * POST /auth/reset/confirm
 * Exchange opaque token for a reset JWT.
 */
export async function confirmPasswordReset(token) {
  return requestData(
    "/auth/reset/confirm",
    {
      method: "POST",
      body: createJsonBody({ token }),
    },
    "Failed to confirm reset token",
  );
}

/**
 * POST /auth/change-password
 * Requires the short-lived reset JWT from confirmPasswordReset as Bearer token.
 */
export async function changePasswordWithResetToken(resetJwt, newPassword) {
  return requestJson(
    "/auth/change-password",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resetJwt}`,
      },
      body: createJsonBody({
        new_password: newPassword,
      }),
    },
    "Failed to change password",
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────

/**
 * GET /profile/info
 * Unified user stats.
 */
export async function fetchUserInfo() {
  return requestData(
    "/profile/info",
    {},
    "Failed to fetch user info",
  );
}

/**
 * GET /profile
 * Basic profile details.
 */
export async function fetchProfile() {
  return requestData(
    "/profile",
    {},
    "Failed to fetch profile",
  );
}

/**
 * PATCH /profile/edit
 * Update name, phone, photo using multipart form data.
 */
export async function updateProfileApi({ fullName, phone, photoFile }) {
  const formData = new FormData();

  if (fullName) {
    formData.append("full_name", fullName);
  }

  if (phone) {
    formData.append("phone", phone);
  }

  if (photoFile) {
    formData.append("photo", photoFile);
  }

  await requestJson(
    "/profile/edit",
    {
      method: "PATCH",
      body: formData,
    },
    "Failed to update profile",
  );
}

/**
 * PATCH /profile/change/pin
 * First-time PIN setup.
 */
export async function setPinApi(pin) {
  await requestJson(
    "/profile/change/pin",
    {
      method: "PATCH",
      body: createJsonBody({
        pin_hash: pin,
      }),
    },
    "Failed to set PIN",
  );
}

/**
 * PATCH /profile/change/pin
 * Change existing PIN.
 */
export async function changePinApi(currentPin, newPin) {
  await requestJson(
    "/profile/change/pin",
    {
      method: "PATCH",
      body: createJsonBody({
        old_pin: currentPin,
        pin_hash: newPin,
      }),
    },
    "Failed to change PIN",
  );
}

/**
 * PATCH /profile/change/password
 * Change password while logged in.
 */
export async function changePasswordApi(oldPassword, newPassword) {
  await requestJson(
    "/profile/change/password",
    {
      method: "PATCH",
      body: createJsonBody({
        old_password: oldPassword,
        password: newPassword,
      }),
    },
    "Failed to change password",
  );
}

// ─── Transactions ─────────────────────────────────────────────────────────────

/**
 * GET /transaction/summary
 */
export async function fetchSummary() {
  return requestData(
    "/transaction/summary",
    {},
    "Failed to fetch summary",
  );
}

/**
 * GET /transaction/report?range=7days&type=both
 */
export async function fetchReport({ range = "7days", type = "both" } = {}) {
  const params = new URLSearchParams({ range, type });

  return requestData(
    `/transaction/report?${params.toString()}`,
    {},
    "Failed to fetch report",
  );
}

/**
 * GET /transaction/history?page=1&limit=10
 */
export async function fetchHistory({ page = 1, limit = 10 } = {}) {
  const params = createPaginationParams({ page, limit });

  const data = await requestData(
    `/transaction/history?${params.toString()}`,
    {},
    "Failed to fetch history",
  );

  return normalizePaginatedResponse(data, page, limit);
}

/**
 * GET /transaction?page=1&limit=10
 * Raw ledger.
 */
export async function fetchAllTransactions({ page = 1, limit = 10 } = {}) {
  const params = createPaginationParams({ page, limit });

  return requestData(
    `/transaction?${params.toString()}`,
    {},
    "Failed to fetch transactions",
  );
}

/**
 * GET /transaction/:id
 */
export async function fetchTransactionById(transactionId) {
  return requestData(
    `/transaction/${transactionId}`,
    {},
    "Failed to fetch transaction",
  );
}

/**
 * GET /transaction/receiver?q=&page=1&limit=10
 */
export async function searchReceivers({ q = "", page = 1, limit = 10 } = {}) {
  const params = createPaginationParams({ page, limit });
  const trimmedQuery = q.trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }

  const data = await requestData(
    `/transaction/receiver?${params.toString()}`,
    {},
    "Failed to fetch receivers",
  );

  const receivers = data?.data ?? [];

  return {
    items: receivers.map(mapReceiver),
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
    total: data?.total ?? 0,
  };
}

/**
 * POST /transaction/topup
 * Requires wallet_id, amount, payment_method, pin.
 */
export async function initiateTopup({
  walletId,
  amount,
  paymentMethod,
  pin,
}) {
  return requestData(
    "/transaction/topup",
    {
      method: "POST",
      body: createJsonBody({
        wallet_id: walletId,
        amount: toPositiveNumber(amount),
        payment_method: paymentMethod,
        pin,
      }),
    },
    "Failed to initiate top up",
  );
}

/**
 * PATCH /transaction/topup/:id/confirm
 */
export async function confirmTopup(topupId) {
  return requestData(
    `/transaction/topup/${topupId}/confirm`,
    {
      method: "PATCH",
    },
    "Failed to confirm top up",
  );
}

/**
 * POST /transaction/transfer
 * Requires sender_wallet_id, recipient_wallet_id, amount, pin.
 */
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
      body: createJsonBody({
        sender_wallet_id: senderWalletId,
        recipient_wallet_id: recipientWalletId,
        amount: toPositiveNumber(amount),
        note: toOptionalText(note),
        pin,
      }),
    },
    "Transfer failed",
  );
}

/**
 * POST /transaction/withdrawal
 * Requires wallet_id, amount, bank details, pin.
 */
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
      body: createJsonBody({
        wallet_id: walletId,
        amount: toPositiveNumber(amount),
        bank_name: bankName,
        account_number: accountNumber,
        account_holder: accountHolder,
        pin,
      }),
    },
    "Withdrawal failed",
  );
}

/**
 * POST /transaction/expense
 * Requires wallet_id, amount, pin.
 */
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
      body: createJsonBody({
        wallet_id: walletId,
        amount: toPositiveNumber(amount),
        admin_fee: adminFee ?? 0,
        category: toOptionalText(category),
        merchant_name: toOptionalText(merchantName),
        note: toOptionalText(note),
        pin,
      }),
    },
    "Failed to log expense",
  );
}