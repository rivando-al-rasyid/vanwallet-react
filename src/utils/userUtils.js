import { apiGet, apiPost, apiPut } from "./api";

// ─── Fetch ─────────────────────────────────────────────────────────────────────

export async function getAllUsers() {
  return apiGet("/users", { auth: false });
}

export async function getUserById(id) {
  return apiGet(`/users/${id}`);
}

// ─── Write ─────────────────────────────────────────────────────────────────────

/**
 * Creates a new user via POST /users.
 */
export async function registerUser({ name, email, password, phone, pin }) {
  return apiPost(
    "/users",
    { name, email, password, phone, pin },
    { auth: false },
  );
}

export async function updateUser(id, payload) {
  return apiPut(`/users/${id}`, payload);
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Simulates login by fetching all users and matching credentials.
 * The Fabricate mock API does not have a real /auth/login endpoint.
 */
export async function loginUser({ email, password }) {
  const users = await getAllUsers();
  const match = users.find(
    (u) => u.email === email && String(u.password) === String(password),
  );
  if (!match) throw new Error("Invalid email or password");
  return match;
}

/**
 * Verifies a user's PIN by comparing against their stored record.
 */
export async function verifyPin(userId, inputPin) {
  if (!userId) throw new Error("User session not found");
  const user = await apiGet(`/users/${userId}`, { auth: false });
  if (String(user.pin) !== String(inputPin)) {
    throw new Error("Invalid PIN. Please try again.");
  }
  return true;
}

export async function changePassword({ userId, oldPassword, newPassword }) {
  const user = await apiGet(`/users/${userId}`);
  if (String(user.password) !== String(oldPassword))
    throw new Error("Password lama tidak sesuai.");
  return apiPut(`/users/${userId}`, { password: newPassword });
}

export async function changePinApi(id, newPin) {
  return apiPut(`/users/${id}`, { pin: newPin });
}

const otpStore = new Map();
const OTP_EXPIRY_MS = 2 * 60 * 1000;

export async function requestPasswordResetOtp(email) {
  const users = await getAllUsers();
  const user = users.find((item) => item.email === email);
  if (!user) throw new Error("Email is not registered.");

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(email, {
    code: otp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  });

  return { sent: true, code: otp, expiresAt: Date.now() + OTP_EXPIRY_MS };
}

export async function verifyPasswordResetOtp(email, otpCode) {
  const record = otpStore.get(email);
  if (!record || String(record.code) !== String(otpCode)) {
    throw new Error("Invalid OTP");
  }

  if (Date.now() > record.expiresAt) {
    throw new Error("OTP expired, request a new code");
  }

  return { verified: true };
}

export async function resetPasswordWithOtp({ email, otpCode, newPassword }) {
  const users = await getAllUsers();
  const user = users.find((item) => item.email === email);
  if (!user) throw new Error("Email is not registered.");

  await verifyPasswordResetOtp(email, otpCode);
  otpStore.delete(email);
  return apiPut(`/users/${user.id}`, { password: newPassword }, { auth: false });
}
