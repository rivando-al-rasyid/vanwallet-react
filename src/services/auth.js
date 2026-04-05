const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Header default untuk semua request ke reqres.in
const defaultHeaders = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

/**
 * Login user via reqres.in
 * Reqres hanya menerima email tertentu, contoh: eve.holt@reqres.in
 * Password bisa apa saja asal tidak kosong
 */
export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login gagal");
  }

  return data; // { token: "..." }
}

/**
 * Register user via reqres.in
 * Reqres HANYA menerima email yang sudah terdaftar di database mereka,
 * contoh: eve.holt@reqres.in, charles.morris@reqres.in
 */
export async function registerUser({ email, password }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Registrasi gagal");
  }

  return data; // { id: ..., token: "..." }
}

/**
 * Ambil daftar user dari reqres.in
 * Dipakai di Transfer page sebagai daftar kontak
 * @param {number} page - halaman (default 1, max 2 di reqres)
 */
export async function getUsers(page = 1) {
  const res = await fetch(`${BASE_URL}/users?page=${page}`, {
    headers: defaultHeaders,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Gagal mengambil daftar user");
  }

  return data; // { page, per_page, total, total_pages, data: [...] }
}

// --- Helpers localStorage ---

export function saveSession(token, email) {
  localStorage.setItem("token", token);
  localStorage.setItem("user_email", email);
}

export function getSession() {
  return {
    token: localStorage.getItem("token"),
    email: localStorage.getItem("user_email"),
  };
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_email");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}
