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
