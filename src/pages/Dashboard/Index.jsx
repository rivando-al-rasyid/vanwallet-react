import Navbar from "../../layouts/Dashboard/Header";
import Sidebar from "../../layouts/Dashboard/Sidebar";
import { useState, useMemo } from "react";

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

const ALL_LABELS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const ALL_INCOME = [80000, 78000, 85000, 22000, 20000, 70000, 8000];
const ALL_EXPENSE = [15000, 52000, 65000, 32000, 8000, 60000, 48000];

export default function Index() {
  const [days, setDays] = useState("7");
  const [typeFilter, setTypeFilter] = useState("All");

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
    <>
      <Navbar />
      <main className="flex">
        <Sidebar />
        <section className="flex-1 flex flex-col gap-6 p-8 overflow-auto">
          <div className="grid grid-cols-3 gap-5">
            {/* Balance Card */}
            <div className="fade-in delay-1 col-span-1 bg-white rounded-lg p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <svg
                  className="w-4 h-4"
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
                <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  Rp.120.000
                </p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Income</p>
                  <p className="text-sm font-semibold text-emerald-500 flex items-center gap-1">
                    Rp.200.000
                    <span className="text-xs bg-emerald-50 text-emerald-500 px-1.5 py-0.5 rounded-full">
                      +2%
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.45488 5.60777L14 4L12.6198 9.6061L10.898 7.9532L8.12069 10.8463C8.02641 10.9445 7.89615 11 7.76 11C7.62385 11 7.49359 10.9445 7.39931 10.8463L5.36 8.72199L2.36069 11.8463C2.16946 12.0455 1.85294 12.0519 1.65373 11.8607C1.45453 11.6695 1.44807 11.3529 1.63931 11.1537L4.99931 7.65373C5.09359 7.55552 5.22385 7.5 5.36 7.5C5.49615 7.5 5.62641 7.55552 5.72069 7.65373L7.76 9.77801L10.1766 7.26067L8.45488 5.60777Z"
                        fill="#00A700"
                      />
                    </svg>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Expense</p>
                  <p className="text-sm font-semibold text-red-500 flex items-center gap-1">
                    Rp.100.000
                    <span className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full">
                      +5%
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.54512 10.3922L2 12L3.38019 6.3939L5.10196 8.0468L7.87931 5.15373C7.97359 5.05552 8.10385 5 8.24 5C8.37615 5 8.50641 5.05552 8.60069 5.15373L10.64 7.27801L13.6393 4.15373C13.8305 3.95453 14.1471 3.94807 14.3463 4.13931C14.5455 4.33054 14.5519 4.64706 14.3607 4.84627L11.0007 8.34627C10.9064 8.44448 10.7761 8.5 10.64 8.5C10.5039 8.5 10.3736 8.44448 10.2793 8.34627L8.24 6.22199L5.82335 8.73933L7.54512 10.3922Z"
                        fill="#D00000"
                      />
                    </svg>
                  </p>
                </div>
              </div>
            </div>

            {/* Fast Service Card */}
            <div className="fade-in delay-1 col-span-2 bg-white rounded-lg p-6 shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Fast Service</h2>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-5 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.46 5.99999L11 5.40999V8.99999C11 9.2652 11.1054 9.51956 11.2929 9.70709C11.4804 9.89463 11.7348 9.99999 12 9.99999C12.2652 9.99999 12.5196 9.89463 12.7071 9.70709C12.8946 9.51956 13 9.2652 13 8.99999V5.40999L13.54 5.95999C13.6308 6.06251 13.7416 6.1453 13.8657 6.20322C13.9898 6.26114 14.1244 6.29296 14.2613 6.29671C14.3982 6.30047 14.5344 6.27606 14.6615 6.22502C14.7885 6.17398 14.9038 6.09739 15 5.99999C15.0937 5.90702 15.1681 5.79642 15.2189 5.67456C15.2697 5.55271 15.2958 5.422 15.2958 5.28999C15.2958 5.15798 15.2697 5.02727 15.2189 4.90541C15.1681 4.78355 15.0937 4.67295 15 4.57999L12.71 2.28999C12.6149 2.19895 12.5028 2.12758 12.38 2.07999C12.1365 1.97997 11.8635 1.97997 11.62 2.07999C11.4972 2.12758 11.3851 2.19895 11.29 2.28999L9 4.53999C8.80639 4.7336 8.69762 4.99618 8.69762 5.26999C8.69762 5.54379 8.80639 5.80638 9 5.99999C9.19361 6.1936 9.4562 6.30236 9.73 6.30236C10.0038 6.30236 10.2664 6.1936 10.46 5.99999ZM12 12C11.4067 12 10.8266 12.1759 10.3333 12.5056C9.83994 12.8352 9.45542 13.3038 9.22836 13.8519C9.0013 14.4001 8.94189 15.0033 9.05764 15.5853C9.1734 16.1672 9.45912 16.7018 9.87868 17.1213C10.2982 17.5409 10.8328 17.8266 11.4147 17.9423C11.9967 18.0581 12.5999 17.9987 13.1481 17.7716C13.6962 17.5446 14.1648 17.16 14.4944 16.6667C14.8241 16.1734 15 15.5933 15 15C15 14.2043 14.6839 13.4413 14.1213 12.8787C13.5587 12.3161 12.7956 12 12 12ZM12 16C11.8022 16 11.6089 15.9413 11.4444 15.8315C11.28 15.7216 11.1518 15.5654 11.0761 15.3827C11.0004 15.1999 10.9806 14.9989 11.0192 14.8049C11.0578 14.6109 11.153 14.4327 11.2929 14.2929C11.4327 14.153 11.6109 14.0578 11.8049 14.0192C11.9989 13.9806 12.2 14.0004 12.3827 14.0761C12.5654 14.1518 12.7216 14.28 12.8315 14.4444C12.9414 14.6089 13 14.8022 13 15C13 15.2652 12.8946 15.5196 12.7071 15.7071C12.5196 15.8946 12.2652 16 12 16ZM5 15C5 15.1978 5.05865 15.3911 5.16853 15.5556C5.27841 15.72 5.43459 15.8482 5.61732 15.9239C5.80004 15.9996 6.00111 16.0194 6.19509 15.9808C6.38907 15.9422 6.56725 15.8469 6.70711 15.7071C6.84696 15.5672 6.9422 15.3891 6.98079 15.1951C7.01937 15.0011 6.99957 14.8 6.92388 14.6173C6.84819 14.4346 6.72002 14.2784 6.55557 14.1685C6.39112 14.0586 6.19778 14 6 14C5.73478 14 5.48043 14.1053 5.29289 14.2929C5.10536 14.4804 5 14.7348 5 15ZM19 15C19 14.8022 18.9414 14.6089 18.8315 14.4444C18.7216 14.28 18.5654 14.1518 18.3827 14.0761C18.2 14.0004 17.9989 13.9806 17.8049 14.0192C17.6109 14.0578 17.4327 14.153 17.2929 14.2929C17.153 14.4327 17.0578 14.6109 17.0192 14.8049C16.9806 14.9989 17.0004 15.1999 17.0761 15.3827C17.1518 15.5654 17.28 15.7216 17.4444 15.8315C17.6089 15.9413 17.8022 16 18 16C18.2652 16 18.5196 15.8946 18.7071 15.7071C18.8946 15.5196 19 15.2652 19 15ZM20 7.99999H16C15.7348 7.99999 15.4804 8.10535 15.2929 8.29288C15.1054 8.48042 15 8.73477 15 8.99999C15 9.2652 15.1054 9.51956 15.2929 9.70709C15.4804 9.89463 15.7348 9.99999 16 9.99999H20C20.2652 9.99999 20.5196 10.1053 20.7071 10.2929C20.8946 10.4804 21 10.7348 21 11V19C21 19.2652 20.8946 19.5196 20.7071 19.7071C20.5196 19.8946 20.2652 20 20 20H4C3.73478 20 3.48043 19.8946 3.29289 19.7071C3.10536 19.5196 3 19.2652 3 19V11C3 10.7348 3.10536 10.4804 3.29289 10.2929C3.48043 10.1053 3.73478 9.99999 4 9.99999H8C8.26522 9.99999 8.51957 9.89463 8.70711 9.70709C8.89464 9.51956 9 9.2652 9 8.99999C9 8.73477 8.89464 8.48042 8.70711 8.29288C8.51957 8.10535 8.26522 7.99999 8 7.99999H4C3.20435 7.99999 2.44129 8.31606 1.87868 8.87867C1.31607 9.44128 1 10.2043 1 11V19C1 19.7956 1.31607 20.5587 1.87868 21.1213C2.44129 21.6839 3.20435 22 4 22H20C20.7956 22 21.5587 21.6839 22.1213 21.1213C22.6839 20.5587 23 19.7956 23 19V11C23 10.2043 22.6839 9.44128 22.1213 8.87867C21.5587 8.31606 20.7956 7.99999 20 7.99999Z"
                      fill="white"
                    />
                  </svg>
                  Top Up
                </button>
                <button className="flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-5 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.5039 2.07729C20.1889 1.87802 20.931 2.07025 21.434 2.58253C21.937 3.0938 22.123 3.83957 21.918 4.52999L20.669 8.73188C20.55 9.13144 20.1339 9.35789 19.7359 9.23913C19.3389 9.11936 19.1129 8.69867 19.2319 8.30012L20.481 4.09722C20.551 3.86171 20.4259 3.7027 20.3689 3.64533C20.3119 3.58696 20.1519 3.46014 19.9209 3.52758L3.82937 8.20652C3.57336 8.281 3.51736 8.49537 3.50536 8.58394C3.49436 8.6725 3.49036 8.89392 3.71837 9.03482L7.10449 11.1182C7.4575 11.3355 7.5695 11.8005 7.35249 12.1568C7.21149 12.3883 6.96548 12.5171 6.71247 12.5171C6.57947 12.5171 6.44446 12.4819 6.32246 12.4064L2.93634 10.3221C2.26532 9.90942 1.91331 9.16667 2.01831 8.38265C2.12331 7.59762 2.65833 6.97464 3.41336 6.75523L19.5039 2.07729ZM18.0282 12.3492C18.1482 11.9487 18.5652 11.7212 18.9622 11.842C19.3592 11.9618 19.5852 12.3824 19.4662 12.782L17.1441 20.596C16.9191 21.3519 16.2971 21.8833 15.5201 21.9829C15.4331 21.995 15.3471 22 15.2611 22C14.583 22 13.963 21.6518 13.602 21.0539L9.50187 14.2645C9.32286 13.9666 9.36786 13.5841 9.61287 13.3386L15.4341 7.48007C15.7271 7.18518 16.2011 7.18518 16.4941 7.48007C16.7871 7.77496 16.7871 8.25302 16.4941 8.54791L11.0899 13.9877L14.8841 20.2699C15.0221 20.4984 15.2391 20.4964 15.3291 20.4863C15.4171 20.4742 15.6301 20.4199 15.7061 20.1643L18.0282 12.3492Z"
                      fill="white"
                    />
                  </svg>
                  Transfer
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 fade-in delay-3">
            {/* Chart */}
            <div className="col-span-2 bg-white rounded-lg p-5 shadow-sm border border-slate-100">
              <div className="rounded-lg w-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">
                    Financial Chart
                  </h2>
                  <div className="flex gap-3">
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
            <div className="col-span-1 bg-white rounded-lg p-5 shadow-sm border border-slate-100 flex flex-col gap-4 fade-in delay-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">
                  Transaction History
                </h3>
                <a
                  href="#"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  See All
                </a>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto max-h-100 pr-1">
                {[
                  {
                    img: 5,
                    name: "Robert Fox",
                    type: "Transfer",
                    amount: "+Rp50.000",
                    positive: true,
                  },
                  {
                    img: 47,
                    name: "Floyd Miles",
                    type: "Send",
                    amount: "-Rp50.000",
                    positive: false,
                  },
                  {
                    img: 23,
                    name: "Ujang",
                    type: "Send",
                    amount: "-Rp50.000",
                    positive: false,
                  },
                  {
                    img: 5,
                    name: "Robert Fox",
                    type: "Transfer",
                    amount: "+Rp50.000",
                    positive: true,
                  },
                  {
                    img: 47,
                    name: "Floyd Miles",
                    type: "Send",
                    amount: "-Rp50.000",
                    positive: false,
                  },
                  {
                    img: 23,
                    name: "Ujang",
                    type: "Send",
                    amount: "-Rp50.000",
                    positive: false,
                  },
                ].map((tx, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <img
                      src={`https://i.pravatar.cc/40?img=${tx.img}`}
                      className="w-10 h-10 rounded-full object-cover"
                      alt={tx.name}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {tx.name}
                      </p>
                      <p className="text-xs text-slate-400">{tx.type}</p>
                    </div>
                    <span
                      className={`text-sm font-bold shrink-0 ${tx.positive ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
