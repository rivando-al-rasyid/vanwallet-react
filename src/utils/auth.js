import {
  clearToken,
  fetchUserInfo,
  mapUserFromInfo,
  requestData,
  requestJson,
  setToken,
} from "./api";

export async function loginUser({ email, password }) {
  const envelope = await requestJson(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    "Login failed",
  );

  const token = envelope.data;
  setToken(token);

  const info = await fetchUserInfo();
  return mapUserFromInfo(info, token);
}

export async function registerUser({ email, password }) {
  const user = await requestData(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    "Registration failed",
  );

  const loggedIn = await loginUser({ email, password });
  return { ...loggedIn, id: user?.id || loggedIn.id };
}

export async function verifyPin(pin) {
  await requestJson(
    "/auth/pin/verify",
    {
      method: "POST",
      body: JSON.stringify({ pin }),
    },
    "Invalid PIN. Please try again.",
  );
  return true;
}

export { clearToken, fetchUserInfo };
