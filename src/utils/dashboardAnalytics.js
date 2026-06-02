function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDayLabel(date) {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function buildDateRange(daysCount) {
  const today = new Date();
  return Array.from({ length: daysCount }, (_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - (daysCount - 1 - index));
    return date;
  });
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

export function buildDashboardAnalytics(transactions = [], daysCount = 7) {
  const safeDaysCount = Math.max(1, Number(daysCount) || 7);
  const dateRange = buildDateRange(safeDaysCount);
  const groupedByDay = new Map(
    dateRange.map((date) => [toDateKey(date), { income: 0, expense: 0 }]),
  );

  transactions.forEach((transaction) => {
    if (!transaction?.createdAt) return;
    const dateKey = toDateKey(new Date(transaction.createdAt));
    const amount = toNumber(transaction.amount);
    const current = groupedByDay.get(dateKey);
    if (!current) return;

    if (transaction.sign === "+") {
      current.income += amount;
    } else if (transaction.sign === "-") {
      current.expense += amount;
    }
  });

  const labels = dateRange.map((date) => formatDayLabel(date));
  const incomeSeries = dateRange.map(
    (date) => groupedByDay.get(toDateKey(date))?.income ?? 0,
  );
  const expenseSeries = dateRange.map(
    (date) => groupedByDay.get(toDateKey(date))?.expense ?? 0,
  );

  const totalIncome = incomeSeries.reduce((sum, item) => sum + item, 0);
  const totalExpense = expenseSeries.reduce((sum, item) => sum + item, 0);

  return {
    labels,
    incomeSeries,
    expenseSeries,
    totalIncome,
    totalExpense,
  };
}
