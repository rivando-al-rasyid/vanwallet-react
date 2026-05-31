/**
 * balanceUtils.js
 *
 * Balance is no longer managed via a separate /balances endpoint.
 * The Go backend returns current_balance as part of GET /profile/info
 * (via fetchUserInfo) and GET /transactions/summary (via fetchSummary).
 *
 * This file is kept for backward compatibility; callers should migrate
 * to fetchSummary() or fetchUserInfo() from api.js.
 */

import { fetchSummary } from "./api";

/**
 * @deprecated Use fetchSummary() from api.js instead.
 * Returns { current_balance, total_income, total_expense }
 */
export async function getBalance() {
  const summary = await fetchSummary();
  return {
    balance: summary?.current_balance ?? 0,
    ...summary,
  };
}

/**
 * @deprecated Balance updates are handled server-side via transaction endpoints.
 * This is a no-op stub to prevent import errors in legacy code.
 */
export async function updateBalance(_userId, _newBalance) {
  console.warn(
    "[balanceUtils] updateBalance() is deprecated. " +
    "Balance is managed server-side via /transactions/* endpoints.",
  );
}
