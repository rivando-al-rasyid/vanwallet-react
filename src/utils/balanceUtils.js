import { apiGet, apiPut } from "./api";

export async function getBalance(userId) {
  return apiGet(`/balances/${userId}`);
}

export async function updateBalance(userId, newBalance) {
  return apiPut(`/balances/${userId}`, { balance: newBalance });
}
