const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ROOT = String(BASE_URL || "").replace(/\/+$/, "");

async function requestJson(
  path,
  options = {},
  fallbackMessage = "Request failed",
) {
  const res = await fetch(`${API_ROOT}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || fallbackMessage);
  return data;
}

// GET all users
export async function getAllUsers() {
  return requestJson("/user", {}, "Failed to fetch users list");
}
export async function getAllHistory() {
  return requestJson("/historyTransaction", {}, "Failed to fetch users list");
}

// Simulated login: GET all users, match by email + password
export async function loginUser({ email, password }) {
  const users = await getAllUsers();
  const match = users.find(
    (user) => user.email === email && user.password === password,
  );
  if (!match) throw new Error("Invalid email or password");
  return match;
}

// Simulated register: POST new user
export async function registerUser({ name, email, password, phone }) {
  return requestJson(
    "/user",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    },
    "Registration failed",
  );
}

export async function transaction({
  userId,
  transactionType,
  transactionDesc,
  amount,
}) {
  return requestJson(
    "/historyTransaction",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        transactionType,
        transactionDesc,
        amount,
      }),
    },
    "Registration failed",
  );
}

// GET single user by ID
export async function getUserById(id) {
  return requestJson(`/user/${id}`, {}, "Failed to fetch user data");
}

// GET all users (for Transfer page contact list)
export async function getUsers() {
  return getAllUsers();
}

// PUT update user by ID
export async function updateUser(id, payload) {
  return requestJson(
    `/user/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Failed to update user data",
  );
}

export async function verifyPin(userId, inputPin) {
  if (!userId) throw new Error("User session not found");

  const user = await requestJson(
    `/user/${userId}`,
    {},
    "Failed to verify user",
  );

  // Checking if the PIN matches (assuming 'pin' is a field in your user object)
  if (String(user.pin) !== String(inputPin)) {
    throw new Error("Invalid PIN. Please try again.");
  }

  return true;
}

// PUT change password — verifies old password first, then updates
export async function changePassword({ userId, oldPassword, newPassword }) {
  const user = await requestJson(`/user/${userId}`, {}, "Failed to fetch user");
  if (user.password !== oldPassword) {
    throw new Error("Password lama tidak sesuai.");
  }
  return requestJson(
    `/user/${userId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    },
    "Failed to change password",
  );
}

// PUT change PIN
export async function changePinApi(id, newPin) {
  return requestJson(
    `/user/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: newPin }),
    },
    "Failed to change PIN",
  );
}
