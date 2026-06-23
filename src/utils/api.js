
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
const TOKEN_STORAGE_KEY = "vanwallet_token";

const DEFAULT_API_ROOT = "/api";
const JSON_CONTENT_TYPE = "application/json";
const DEFAULT_ERROR_MESSAGE = "Request failed";

// ─── URL Helpers ──────────────────────────────────────────────────────────────

function removeTrailingSlash(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function removeLeadingSlash(value) {
  return String(value || "").trim().replace(/^\/+/, "");
}

function hasProtocol(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}

function isBadBrowserApiUrl(url) {
  return !url || url.includes("backend:8080");
}

export function resolveApiRoot() {
  const normalizedBaseUrl = removeTrailingSlash(API_BASE_URL);

  if (isBadBrowserApiUrl(normalizedBaseUrl)) {
    return DEFAULT_API_ROOT;
  }

  if (hasProtocol(normalizedBaseUrl)) {
    return normalizedBaseUrl;
  }

  if (normalizedBaseUrl.startsWith("/")) {
    return normalizedBaseUrl;
  }

  return `/${normalizedBaseUrl}`;
}

export function buildApiUrl(path) {
  const apiRoot = resolveApiRoot();
  const normalizedPath = `/${removeLeadingSlash(path)}`;

  return `${apiRoot}${normalizedPath}`;
}

export function resolveAssetUrl(assetPath) {
  if (!assetPath) {
    return "";
  }

  if (assetPath.startsWith("http://") || assetPath.startsWith("https://") || assetPath.startsWith("data:")) {
    return assetPath;
  }

  const normalizedPath = `/${removeLeadingSlash(assetPath)}`;

  // Important:
  // image path should be served through the frontend server /img proxy,
  // not through /api/img.
  if (normalizedPath.startsWith("/img/")) {
    return normalizedPath;
  }

  return normalizedPath;
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
    // Ignore storage errors.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage errors.
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

function createPaginationParams({ page = 1, limit = 10, ...filters } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    params.set(key, String(value).trim());
  });

  return params;
}

function normalizePaginatedResponse(data, fallbackPage, fallbackLimit, mapItem = (item) => item) {
  const rawItems = Array.isArray(data?.data) ? data.data : [];
  const total = data?.total ?? rawItems.length;
  const limit = data?.limit ?? fallbackLimit;
  const totalPages = data?.total_pages ?? Math.max(1, Math.ceil(total / limit));

  return {
    items: rawItems.map(mapItem),
    page: data?.page ?? fallbackPage,
    limit,
    total,
    totalPages,
  };
}

// ─── Data Mapper ──────────────────────────────────────────────────────────────

export function mapUserFromInfo(userInfo, token = null) {
  const displayName = getDisplayName(userInfo);
  const avatarUrl = resolveAssetUrl(userInfo?.photo) || buildDefaultAvatarUrl(displayName);

  return {
    id: userInfo?.id,
    email: userInfo?.email || "",
    name: displayName,
    phone: userInfo?.phone || "",
    avatar: avatarUrl,
    currentBalance: userInfo?.current_balance ?? 0,
    walletId: userInfo?.wallet_id || userInfo?.wallet?.id || userInfo?.wallets?.[0]?.id || null,

    // pin_hash is a plain string from the server.
    // Empty string means no PIN set.
    pin: hasValidPinHash(userInfo?.pin_hash) ? userInfo.pin_hash : null,

    token,
  };
}


function normalizeTransactionDirection(transaction) {
  const direction = String(transaction?.direction || "").toLowerCase();

  if (direction === "income" || direction === "expense") {
    return direction;
  }

  const type = String(transaction?.type || "").toUpperCase();
  return type === "TOPUP" || type === "TRANSFER_IN" ? "income" : "expense";
}

function getTransactionTitle(transaction) {
  return (
    transaction?.title ||
    transaction?.merchant_name ||
    transaction?.payment_method ||
    transaction?.wallet_label ||
    transaction?.type ||
    "Transaction"
  );
}

function buildTransactionIconUrl(direction) {
  const background = direction === "income" ? "DCFCE7" : "FEE2E2";
  const color = direction === "income" ? "16A34A" : "DC2626";
  const icon = direction === "income" ? "%2B" : "%E2%88%92";

  return `https://ui-avatars.com/api/?name=${icon}&background=${background}&color=${color}&bold=true`;
}

function mapHistoryItem(transaction) {
  const direction = normalizeTransactionDirection(transaction);
  const title = getTransactionTitle(transaction);

  return {
    ...transaction,
    id: transaction?.id,
    name: title,
    phone: transaction?.note || transaction?.wallet_label || transaction?.status || transaction?.source || "-",
    img: buildTransactionIconUrl(direction),
    amount: formatRupiah(transaction?.amount ?? 0),
    rawAmount: transaction?.amount ?? 0,
    type: direction,
    transactionType: transaction?.type || "",
    status: transaction?.status || "",
    source: transaction?.source || "",
    createdAt: transaction?.created_at || transaction?.createdAt || transaction?.date || "",
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

  // Normal authenticated requests use the backend HttpOnly access_token cookie.
  // Do not attach a stale localStorage token here, because Authorization takes
  // precedence over the cookie in the backend middleware. Reset-password flows
  // can still pass an explicit Authorization header through options.headers.

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
  const url = buildApiUrl(path);

  let response;

  try {
    response = await fetch(url, {
      credentials: "include",
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

export async function loginApi({ email, password }) {
  clearToken();

  await requestJson(
    "/auth/login",
    {
      method: "POST",
      body: createJsonBody({ email, password }),
    },
    "Login failed",
  );

  const userInfo = await fetchUserInfo();

  return mapUserFromInfo(userInfo);
}

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

export async function fetchUserInfo() {
  return requestData(
    "/auth/me",
    {},
    "Failed to fetch user info",
  );
}

export async function fetchProfile() {
  return requestData(
    "/profile",
    {},
    "Failed to fetch profile",
  );
}

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

export async function fetchSummary() {
  return requestData(
    "/transaction/summary",
    {},
    "Failed to fetch summary",
  );
}

export async function fetchReport({ range = "7days", type = "both" } = {}) {
  const params = new URLSearchParams({ range, type });

  return requestData(
    `/transaction/report?${params.toString()}`,
    {},
    "Failed to fetch report",
  );
}

export async function fetchHistory({
  page = 1,
  limit = 10,
  walletId = "",
  source = "",
  type = "",
  status = "",
  direction = "",
  startDate = "",
  endDate = "",
  q = "",
} = {}) {
  const params = createPaginationParams({
    page,
    limit,
    wallet_id: walletId,
    source,
    type,
    status,
    direction,
    start_date: startDate,
    end_date: endDate,
    q,
  });

  const data = await requestData(
    `/transaction/history?${params.toString()}`,
    {},
    "Failed to fetch history",
  );

  return normalizePaginatedResponse(data, page, limit, mapHistoryItem);
}

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

  return normalizePaginatedResponse(
    { ...data, data: receivers },
    page,
    limit,
    mapReceiver,
  );
}

export async function initiateTopup({
  walletId,
  amount,
  paymentMethod,
}) {
  return requestData(
    "/transaction/topup",
    {
      method: "POST",
      body: createJsonBody({
        wallet_id: walletId,
        amount: toPositiveNumber(amount),
        payment_method: paymentMethod,
      }),
    },
    "Failed to initiate top up",
  );
}

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