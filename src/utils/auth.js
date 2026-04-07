const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// GET all users
export async function getAllUsers() {
  const res = await fetch(`${BASE_URL}/user`);
  const data = await res.json();
  if (!res.ok) throw new Error("Gagal mengambil daftar user");
  return data;
}

// Simulated login: GET all users, match by email + password
export async function loginUser({ email, password }) {
  const users = await getAllUsers();
  const match = users.find(
    (u) => u.email === email && u.password === password
  );
  if (!match) throw new Error("Email atau password salah");
  return match;
}

// Simulated register: POST new user
export async function registerUser({ name, email, password, phone }) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Registrasi gagal");
  return data;
}

// GET single user by ID
export async function getUserById(id) {
  const res = await fetch(`${BASE_URL}/user/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error("Gagal mengambil data user");
  return data;
}

// GET all users (for Transfer page contact list)
export async function getUsers() {
  return getAllUsers();
}

// PUT update user by ID
export async function updateUser(id, payload) {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Gagal mengupdate data user");
  return data;
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
