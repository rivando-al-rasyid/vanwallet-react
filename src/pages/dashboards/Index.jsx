import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { formatRupiah, formatRupiahShort } from "../../utils/api";
import { fetchDashboard } from "../../store/slices/transactionSlice";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Index() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [days, setDays] = useState("7");
  const [typeFilter, setTypeFilter] = useState("All");

  const { summary, report, recentTransactions, status, error } = useSelector(
    (state) => state.transaction.dashboard,
  );

  const loading = status === "idle" || status === "loading";

  const reportRange = days === "30" ? "30days" : days === "14" ? "14days" : "7days";
  const reportType =
    typeFilter === "Income"
      ? "income"
      : typeFilter === "Expense"
        ? "expense"
        : "both";

  const loadDashboard = useCallback(() => {
    dispatch(fetchDashboard({ range: reportRange, type: reportType, historyLimit: 6 }));
  }, [dispatch, reportRange, reportType]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const chartData = useMemo(() => {
    const points = report?.points || [];
    const labels = points.map((point) => point.label);
    const datasets = [];

    if (typeFilter === "All" || typeFilter === "Income") {
      datasets.push({
        label: "Income",
        data: points.map((point) => point.income || 0),
        backgroundColor: "#4D7CFF",
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.45,
      });
    }

    if (typeFilter === "All" || typeFilter === "Expense") {
      datasets.push({
        label: "Expense",
        data: points.map((point) => point.expense || 0),
        backgroundColor: "#CC0000",
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.45,
      });
    }

    return { labels, datasets };
  }, [report, typeFilter]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 32,
          font: { size: 15, weight: "500" },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `Rp ${ctx.parsed.y.toLocaleString("id-ID")}`,
        },
      },
    },
    scales: {
      x: {
        offset: true,
        grid: {
          drawOnChartArea: false,
          color: "rgba(0,0,0,0.06)",
          drawTicks: true,
          tickLength: 15,
          tickColor: "#000",
          offset: false,
        },
        border: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 13 },
          padding: 12,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        ticks: {
          stepSize: 25000,
          font: { family: "Montserrat", size: 11 },
        },
        grid: {
          color: "rgba(0,0,0,0.06)",
          drawTicks: true,
          tickLength: 7,
          tickColor: "#000",
        },
      },
    },
  };

  return (
    <section className="flex flex-1 flex-col gap-4 overflow-hidden p-4 pt-4 sm:gap-6 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
      <div className="flex flex-col gap-4 lg:gap-5">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="fade-in card flex flex-col gap-4 delay-1">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
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
              <p className="text-2xl font-extrabold tracking-tight text-slate-800 lg:text-3xl">
                {loading
                  ? "..."
                  : formatRupiah(summary?.current_balance ?? 0)}
              </p>
            </div>

            <div className="flex gap-6">
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Income
                </p>
                <p className="flex items-center gap-1 text-sm font-semibold text-emerald-500">
                  {loading
                    ? "..."
                    : formatRupiahShort(summary?.total_income ?? 0)}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Expense
                </p>
                <p className="flex items-center gap-1 text-sm font-semibold text-red-500">
                  {loading
                    ? "..."
                    : formatRupiahShort(summary?.total_expense ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="fade-in card flex h-full items-center justify-between delay-2 lg:col-span-2">
            <div>
              <h2 className="section-title">Fast Service</h2>
            </div>

            <div className="flex flex-row gap-3">
              <button
                className="btn-primary"
                onClick={() => navigate("/dashboard/topup")}
              >
                <span className="text-lg">+</span> Top Up
              </button>
              <button
                className="btn-primary"
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
      <div className="fade-in grid grid-cols-1 gap-4 delay-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <div className="card col-span-full lg:col-span-2">
          <div className="w-full rounded-lg">
            <div className="mb-4 flex flex-col sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="section-title">Financial Chart</h2>
              <div className="flex gap-2 sm:gap-3">
                <select
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                >
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                  <option value="30">30 Days</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
            </div>
            {loading ? (
              <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                Loading chart...
              </div>
            ) : (
              <Bar data={chartData} options={options} />
            )}
          </div>
        </div>

        <div className="card fade-in col-span-full flex h-full flex-col delay-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="section-title">Transaction History</h3>
            <Link
              to="/dashboard/history"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              See All
            </Link>
          </div>
          <div className="flex flex-1 flex-col gap-2 sm:gap-3">
            {loading && (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-400">
                <svg
                  className="h-6 w-6 animate-spin text-blue-500"
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
                <p className="text-xs font-semibold text-red-500">{error}</p>
                <button
                  onClick={loadDashboard}
                  className="text-xs text-blue-600 underline"
                >
                  Try again
                </button>
              </div>
            )}
            {!loading && !error && recentTransactions.length === 0 && (
              <div className="py-10 text-center text-xs text-slate-400">
                No transactions yet.
              </div>
            )}
            {!loading &&
              !error &&
              recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-slate-50 sm:gap-3 sm:p-3"
                >
                  <img
                    src={tx.img}
                    className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
                    alt={tx.name}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
                      {tx.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {tx.type === "income" ? "Income" : "Expense"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-bold sm:text-sm ${tx.type === "income" ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {tx.amount}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
