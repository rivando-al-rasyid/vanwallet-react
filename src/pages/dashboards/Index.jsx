import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { formatRupiah, formatRupiahShort } from "../../utils/api";
import { fetchDashboard } from "../../store/slices/transactionSlice";

import Chart from "chart.js/auto";

export default function Index() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [days, setDays] = useState("7");
  const [typeFilter, setTypeFilter] = useState("All");

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const { summary, report, recentTransactions, status, error } = useSelector(
    (state) => state.transaction.dashboard,
  );

  const loading = status === "idle" || status === "loading";

  const reportRange =
    days === "30" ? "30days" : days === "14" ? "14days" : "7days";

  const reportType =
    typeFilter === "Income"
      ? "income"
      : typeFilter === "Expense"
        ? "expense"
        : "both";

  const loadDashboard = useCallback(() => {
    dispatch(
      fetchDashboard({
        range: reportRange,
        type: reportType,
        historyLimit: 6,
      }),
    );
  }, [dispatch, reportRange, reportType]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const chartMetrics = useMemo(() => {
    const points = report?.points || [];

    const allValues = points.flatMap((point) => [
      Math.abs(point.income || 0),
      Math.abs(point.expense || 0),
    ]);

    const highestValue = Math.max(...allValues, 0);
    const roundedMax = Math.ceil(highestValue / 25000) * 25000;
    const safeMax = Math.max(100000, roundedMax || 100000);

    return {
      maxValue: safeMax,
      stepSize:
        safeMax <= 100000 ? 25000 : Math.ceil(safeMax / 4 / 5000) * 5000,
    };
  }, [report]);

  const chartData = useMemo(() => {
    const points = report?.points || [];
    const labels = points.map((point) => point.label);
    const datasets = [];

    if (typeFilter === "All" || typeFilter === "Income") {
      datasets.push({
        label: "Income",
        data: points.map((point) => Math.abs(point.income || 0)),
        tone: "income",
        borderRadius: 8,
        borderSkipped: false,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
        maxBarThickness: 32,
      });
    }

    if (typeFilter === "All" || typeFilter === "Expense") {
      datasets.push({
        label: "Expense",
        data: points.map((point) => Math.abs(point.expense || 0)),
        tone: "expense",
        borderRadius: 8,
        borderSkipped: false,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
        maxBarThickness: 32,
      });
    }

    return {
      labels,
      datasets,
    };
  }, [report, typeFilter]);

  useEffect(() => {
    if (!canvasRef.current || loading) return;

    const { maxValue, stepSize } = chartMetrics;
    const styles = getComputedStyle(document.documentElement);
    const cssColor = (name, fallback) =>
      styles.getPropertyValue(name).trim() || fallback;
    const primaryColor = cssColor("--color-primary", "#4F46E5");
    const errorColor = cssColor("--color-error", "#E11D48");
    const baseContentColor = cssColor("--color-base-content", "#64748b");
    const neutralColor = cssColor("--color-neutral", "#0f172a");
    const themedChartData = {
      labels: chartData.labels,
      datasets: chartData.datasets.map((dataset) => ({
        ...dataset,
        backgroundColor:
          dataset.tone === "income" ? primaryColor : errorColor,
      })),
    };

    const config = {
      type: "bar",
      data: themedChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 8,
            right: 4,
            left: 0,
            bottom: 0,
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              boxWidth: 8,
              boxHeight: 8,
              padding: 28,
              color: baseContentColor,
              font: {
                size: 12,
                weight: "500",
              },
            },
          },
          title: {
            display: false,
          },
          tooltip: {
            backgroundColor: neutralColor,
            padding: 10,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const value = Math.abs(context.parsed.y || 0);

                return `${context.dataset.label}: Rp ${value.toLocaleString(
                  "id-ID",
                )}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: baseContentColor,
              font: {
                size: 12,
              },
              padding: 8,
              maxRotation: 0,
              minRotation: 0,
            },
          },
          y: {
            beginAtZero: true,
            max: maxValue,
            border: {
              display: false,
            },
            ticks: {
              stepSize,
              color: baseContentColor,
              font: {
                size: 11,
              },
              padding: 8,
              callback: (value) => Number(value).toLocaleString("id-ID"),
            },
            grid: {
              color: "rgba(148, 163, 184, 0.24)",
              drawTicks: false,
            },
          },
        },
      },
    };

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [chartData, chartMetrics, loading]);

  return (
    <section className="flex flex-1 flex-col gap-4 overflow-hidden p-4 pt-4 sm:gap-6 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
      <div className="flex flex-col gap-4 lg:gap-5">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="rounded-[1.5rem] border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-base-content/65">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="5" width="20" height="14" rx="3" />
                <path d="M2 10h20" />
              </svg>
              Balance
            </div>

            <div>
              <p className="text-2xl font-extrabold tracking-tight text-base-content lg:text-3xl">
                {loading ? "..." : formatRupiah(summary?.current_balance ?? 0)}
              </p>
            </div>

            <div className="flex gap-6">
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-wider text-base-content/50 uppercase">
                  Income
                </p>
                <p className="flex items-center gap-1 text-sm font-semibold text-success">
                  {loading
                    ? "..."
                    : formatRupiahShort(summary?.total_income ?? 0)}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-bold tracking-wider text-base-content/50 uppercase">
                  Expense
                </p>
                <p className="flex items-center gap-1 text-sm font-semibold text-error">
                  {loading
                    ? "..."
                    : formatRupiahShort(summary?.total_expense ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6 flex h-full items-center justify-between lg:col-span-2">
            <div>
              <h2 className="text-lg font-black text-base-content">Fast Service</h2>
            </div>

            <div className="flex flex-row gap-3">
              <button
                className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:from-primary/90 hover:to-secondary/90 disabled:opacity-60"
                onClick={() => navigate("/dashboard/topup")}
              >
                <span className="text-lg">+</span> Top Up
              </button>

              <button
                className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:from-primary/90 hover:to-secondary/90 disabled:opacity-60"
                onClick={() => navigate("/dashboard/transfer")}
              >
                <svg
                  className="h-4 w-4 -rotate-45"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <div className="rounded-[1.5rem] border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6 col-span-full lg:col-span-2">
          <div className="w-full rounded-xl border border-base-300 p-4 sm:p-5">
            <div className="mb-4 flex flex-col sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-black text-base-content">Financial Chart</h2>

              <div className="flex gap-2 sm:gap-3">
                <select
                  value={days}
                  onChange={(event) => setDays(event.target.value)}
                  className="rounded-lg border border-base-300 bg-base-100 px-3 py-1.5 text-xs font-semibold text-base-content/75 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                >
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                  <option value="30">30 Days</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className="rounded-lg border border-base-300 bg-base-100 px-3 py-1.5 text-xs font-semibold text-base-content/75 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex h-[260px] items-center justify-center text-sm text-base-content/50 sm:h-[300px]">
                Loading chart...
              </div>
            ) : (
              <div className="h-[260px] sm:h-[300px]">
                <canvas ref={canvasRef} />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6 col-span-full flex h-full flex-col lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-base-content">Transaction History</h3>

            <Link
              to="/dashboard/history"
              className="text-xs font-semibold text-primary hover:underline"
            >
              See All
            </Link>
          </div>

          <div className="flex flex-1 flex-col gap-2 sm:gap-3">
            {loading && (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-base-content/50">
                <svg
                  className="h-6 w-6 animate-spin text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>

                <span className="text-xs">Loading...</span>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <p className="text-xs font-semibold text-error">{error}</p>

                <button
                  onClick={loadDashboard}
                  className="text-xs text-primary underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && recentTransactions.length === 0 && (
              <div className="py-10 text-center text-xs text-base-content/50">
                No transactions yet.
              </div>
            )}

            {!loading &&
              !error &&
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-base-200 sm:gap-3 sm:p-3"
                >
                  <img
                    src={transaction.img}
                    className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
                    alt={transaction.name}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-base-content sm:text-sm">
                      {transaction.name}
                    </p>

                    <p className="text-xs text-base-content/50">
                      {transaction.type === "income" ? "Income" : "Expense"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-xs font-bold sm:text-sm ${
                      transaction.type === "income"
                        ? "text-success"
                        : "text-error"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {transaction.amount}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
