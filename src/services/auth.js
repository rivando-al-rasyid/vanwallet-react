const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const defaultHeaders = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

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

  return data;
}

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

  return data;
}

export async function getUsers(page = 1) {
  const res = await fetch(`${BASE_URL}/users?page=${page}`, {
    headers: defaultHeaders,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Gagal mengambil daftar user");
  }

  return data;
}

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