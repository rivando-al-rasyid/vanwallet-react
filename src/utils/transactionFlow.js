/**
 * transactionFlow.js
 *
 * Previously orchestrated balance updates manually (Tonic Fabricate pattern).
 * Balance is now managed server-side by the Go backend on every transaction.
 *
 * This file is kept as a stub. Use the direct API functions from api.js instead:
 *   - POST /transactions/topup + /confirm → initiateTopup + confirmTopup
 *   - POST /transactions/transfer         → createTransfer
 *   - POST /transactions/withdraw         → createWithdraw
 *   - POST /transactions/expense          → createExpense
 */

export async function applyTransactionWithBalanceUpdate() {
  console.warn(
    "[transactionFlow] applyTransactionWithBalanceUpdate() is deprecated. " +
    "Use createTransfer / createWithdraw / createExpense from api.js directly.",
  );
}
