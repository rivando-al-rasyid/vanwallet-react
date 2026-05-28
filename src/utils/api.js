const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = "vanwallet_token";

const INCOME_TYPES = new Set(["TOPUP", "TRANSFER_IN"]);

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

export function formatRupiah(amount) {
  return `Rp.${Number(amount || 0).toLocaleString("id-ID")}`;
}

export function formatRupiahShort(amount) {
  const value = Number(amount || 0);
  if (value >= 1_000_000) return `Rp.${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `Rp.${Math.round(value / 1_000)}k`;
  return formatRupiah(value);
}

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
    pin: (info?.pin_hash && info.pin_hash.trim() !== "") ? info.pin_hash : null,
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

export async function fetchUserInfo() {
  return requestData("/profile/me", {}, "Failed to fetch user info");
}

export async function fetchProfile() {
  return requestData("/profile/", {}, "Failed to fetch profile");
}

export async function fetchSummary() {
  return requestData("/transaction/summary", {}, "Failed to fetch summary");
}

export async function fetchReport({ range = "7days", type = "both" } = {}) {
  const params = new URLSearchParams({ range, type });
  return requestData(
    `/transaction/report?${params.toString()}`,
    {},
    "Failed to fetch report",
  );
}

export async function fetchHistory({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const data = await requestData(
    `/transaction/history?${params.toString()}`,
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

export async function searchReceivers({ q, page = 1, limit = 10 }) {
  const params = new URLSearchParams({
    q,
    page: String(page),
    limit: String(limit),
  });
  const data = await requestData(
    `/transaction/receiver?${params.toString()}`,
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

export async function updateProfile({ fullName, phone, photoFile }) {
  const formData = new FormData();
  if (fullName) formData.append("full_name", fullName);
  if (phone) formData.append("phone", phone);
  if (photoFile) formData.append("photo", photoFile);

  await requestJson(
    "/profile/",
    { method: "POST", body: formData },
    "Failed to update profile",
  );
}

export async function changePasswordApi(oldPassword, newPassword) {
  await requestJson(
    "/profile/change/password",
    {
      method: "POST",
      body: JSON.stringify({
        old_password: oldPassword,
        password: newPassword,
      }),
    },
    "Failed to change password",
  );
}

// First-time PIN setup (no old_pin required)
export async function setPinApi(pin) {
  await requestJson(
    "/profile/change/pin",
    {
      method: "POST",
      body: JSON.stringify({ pin_hash: pin }),
    },
    "Failed to set PIN",
  );
}

// Change existing PIN (requires current PIN verification)
export async function changePinApi(currentPin, newPin) {
  await requestJson(
    "/profile/change/pin",
    {
      method: "POST",
      body: JSON.stringify({
        old_pin: currentPin,
        pin_hash: newPin,
      }),
    },
    "Failed to change PIN",
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

export async function logoutApi() {
  try {
    await requestJson("/auth/logout", { method: "POST" }, "Logout failed");
  } finally {
    clearToken();
  }
}
