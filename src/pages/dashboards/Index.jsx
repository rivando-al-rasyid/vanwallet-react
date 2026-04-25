import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { useTransactionHistory } from "../../hooks/useTransactionHistory";
import { fetchBalance } from "../../store/slices/profileSlice";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ALL_LABELS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const ALL_INCOME = [80000, 78000, 85000, 22000, 20000, 70000, 8000];
const ALL_EXPENSE = [15000, 52000, 65000, 32000, 8000, 60000, 48000];

export default function Index() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [days, setDays] = useState("7");
  const [typeFilter, setTypeFilter] = useState("All");

  const currentUser = useSelector((state) => state.profile.user);
  const balance = useSelector((state) => state.profile.balance);
  const balanceLoading = useSelector((state) => state.profile.balanceLoading);

  // Fetch balance on mount
  useEffect(() => {
    if (currentUser?.id && balance === null) {
      dispatch(fetchBalance(currentUser.id));
    }
  }, [dispatch, currentUser?.id, balance]);

  const { transactions, status, error, reload } = useTransactionHistory();
  const loading = status === "loading";

  const fmtIdr = (val = 0) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  const chartData = useMemo(() => {
    const count = Math.min(parseInt(days), ALL_LABELS.length);
    const labels = ALL_LABELS.slice(-count);
    const income = ALL_INCOME.slice(-count);
    const expense = ALL_EXPENSE.slice(-count);
    const datasets = [];
    if (typeFilter === "All" || typeFilter === "Income") {
      datasets.push({
        label: "Income",
        data: income,
        backgroundColor: "#4D7CFF",
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.45,
      });
    }
    if (typeFilter === "All" || typeFilter === "Expense") {
      datasets.push({
        label: "Expense",
        data: expense,
        backgroundColor: "#CC0000",
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.45,
      });
    }
    return { labels, datasets };
  }, [days, typeFilter]);

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
        ticks: { stepSize: 25000, font: { family: "Montserrat", size: 11 } },
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
    <section className="flex-1 flex flex-col gap-4 p-4 pt-4 sm:gap-6 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 overflow-hidden">
      <div className="flex flex-col gap-4 lg:gap-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">
          {/* Balance Card */}
          <div className="fade-in delay-1 card flex flex-col gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Icon icon="lucide:credit-card" className="w-4 h-4" aria-hidden="true" />
              Balance
            </div>
            <div>
              {balanceLoading ? (
                <div className="h-8 bg-gray-100 rounded animate-pulse w-40" />
              ) : (
                <p className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">
                  {fmtIdr(balance?.balance ?? 0)}
                </p>
              )}
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-bold">
                  Income
                </p>
                <p className="text-sm font-semibold text-emerald-500 flex items-center gap-1">
                  Rp.200k <span className="badge badge-success">+2%</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-bold">
                  Expense
                </p>
                <p className="text-sm font-semibold text-red-500 flex items-center gap-1">
                  Rp.100k <span className="badge badge-danger">+5%</span>
                </p>
              </div>
            </div>
          </div>

          {/* Fast Service Card */}
          <div className="fade-in delay-2 lg:col-span-2 card flex items-center justify-between h-full">
            <div>
              <h2 className="section-title">Fast Service</h2>
            </div>
            <div className="flex flex-row gap-3">
              <button className="btn-primary" onClick={() => navigate("/dashboard/topup")}>
                <span className="text-lg">+</span> Top Up
              </button>
              <button className="btn-primary" onClick={() => navigate("/dashboard/transfer")}>
                <Icon icon="lucide:send" className="w-4 h-4 -rotate-45" aria-hidden="true" />
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 fade-in delay-3">
        {/* Chart */}
        <div className="col-span-full lg:col-span-2 card">
          <div className="rounded-lg w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
              <h2 className="section-title">Financial Chart</h2>
              <div className="flex gap-2 sm:gap-3">
                <select
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                  <option value="30">30 Days</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="All">All</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
            </div>
            <Bar data={chartData} options={options} />
          </div>
        </div>

        {/* Transaction History */}
        <div className="col-span-full lg:col-span-1 card flex flex-col h-full fade-in delay-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title">Transaction History</h3>
            <Link
              to="/dashboard/history"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              See All
            </Link>
          </div>

          <div className="flex-1 flex flex-col gap-2 sm:gap-3">
            {loading && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
                <Icon
                  icon="lucide:loader-circle"
                  className="animate-spin w-6 h-6 text-blue-500"
                  aria-hidden="true"
                />
                <span className="text-xs">Loading...</span>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <p className="text-red-500 font-semibold text-xs">{error}</p>
                <button onClick={reload} className="text-xs text-blue-600 underline">
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && transactions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
                <Icon icon="lucide:inbox" className="w-8 h-8" aria-hidden="true" />
                <span className="text-xs">No transactions yet.</span>
              </div>
            )}

            {!loading &&
              !error &&
              transactions.slice(0, 6).map((tx, i) => (
                <div
                  key={tx.id || i}
                  className="flex items-center gap-2 sm:gap-3 hover:bg-slate-50 p-2 sm:p-3 rounded-lg transition-colors cursor-pointer"
                >
                  <img
                    src={tx.avatar || `https://i.pravatar.cc/40?img=${i + 1}`}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
                    alt={tx.name}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                      {tx.name}
                    </p>
                    <p className="text-xs text-slate-400">{tx.badgeLabel}</p>
                  </div>
                  <span className={`text-xs sm:text-sm font-bold shrink-0 ${tx.amountClass}`}>
                    {tx.sign} {tx.formattedAmount}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
