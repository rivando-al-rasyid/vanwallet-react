import { apiGet, apiPost } from "./api";

export async function getTransactionsByUser(userId) {
  return apiGet(`/users/${userId}/transactions`);
}

export async function createTransaction({
  userId,
  transactionType,
  transactionDesc,
  amount,
}) {
  return apiPost("/transactions", {
    userId,
    transactionType,
    transactionDesc,
    amount: String(amount), // API expects amount as string
  });
}
