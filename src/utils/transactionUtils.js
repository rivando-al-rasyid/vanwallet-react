/**
 * transactionUtils.js — Transaction API helpers aligned to Swagger spec
 *
 * POST /transactions/topup            → initiateTopup
 * POST /transactions/topup/{id}/confirm → confirmTopup
 * POST /transactions/transfer         → createTransfer
 * POST /transactions/withdraw         → createWithdraw
 * POST /transactions/expense          → createExpense
 * GET  /transactions/history          → fetchHistory
 * GET  /transactions                  → fetchAllTransactions
 * GET  /transactions/{id}             → fetchTransactionById
 * GET  /transactions/receivers        → searchReceivers
 * GET  /transactions/summary          → fetchSummary
 * GET  /transactions/report           → fetchReport
 */

export {
  initiateTopup,
  confirmTopup,
  createTransfer,
  createWithdraw,
  createExpense,
  fetchHistory,
  fetchAllTransactions,
  fetchTransactionById,
  searchReceivers,
  fetchSummary,
  fetchReport,
} from "./api";
