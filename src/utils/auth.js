const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ROOT = String(BASE_URL || "").replace(/\/+$/, "");

async function requestJson(path, options = {}, fallbackMessage = "Request failed") {
  const res = await fetch(`${API_ROOT}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || fallbackMessage);
  return data;
}

// GET all users
export async function getAllUsers() {
  return requestJson("/user", {}, "Failed to fetch users list");
}

// Simulated login: GET all users, match by email + password
export async function loginUser({ email, password }) {
  const users = await getAllUsers();
  const match = users.find(
    (user) => user.email === email && user.password === password
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

// Session helpers
export function saveSession({ id, email, name, phone, avatar }) {
  localStorage.setItem("user_id", id);
  localStorage.setItem("user_email", email);
  localStorage.setItem("user_name", name);
  localStorage.setItem("user_phone", phone ?? "");
  localStorage.setItem("user_avatar", avatar ?? "");
}

export function getSession() {
  return {
    id: localStorage.getItem("user_id"),
    email: localStorage.getItem("user_email"),
    name: localStorage.getItem("user_name"),
    phone: localStorage.getItem("user_phone"),
    avatar: localStorage.getItem("user_avatar"),
  };
}

export function clearSession() {
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_email");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_phone");
  localStorage.removeItem("user_avatar");
}

export function isLoggedIn() {
  return !!localStorage.getItem("user_id");
}

export async function verifyPin(inputPin) {
  const userId = localStorage.getItem("user_id");
  if (!userId) throw new Error("User session not found");

  const user = await requestJson(`/user/${userId}`, {}, "Failed to verify user");

  // Checking if the PIN matches (assuming 'pin' is a field in your user object)
  if (String(user.pin) !== String(inputPin)) {
    throw new Error("Invalid PIN. Please try again.");
  }

  return true;
}