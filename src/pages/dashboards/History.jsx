import { useState } from "react";
import { Icon } from "@iconify/react";
import SearchInput from "../../components/SearchInput";
import { Pagination } from "../../components/Pagination";
import TableRow from "../../components/TableRow";
import Modal from "../../components/Modal";
import { useTransactionHistory } from "../../hooks/useTransactionHistory";
import { useTransactionFilter } from "../../hooks/useTransactionFilter";

const TRANSACTION_TYPE_MAP = {
  deposit:    { label: "Deposit",    badgeClass: "badge-success", sign: "+", amountClass: "text-green-600" },
  withdrawal: { label: "Withdrawal", badgeClass: "badge-danger",  sign: "-", amountClass: "text-red-500"   },
  payment:    { label: "Payment",    badgeClass: "badge-danger",  sign: "-", amountClass: "text-red-500"   },
  invoice:    { label: "Invoice",    badgeClass: "badge-warning", sign: "",  amountClass: "text-gray-700"  },
};

function getTransactionMeta(transactionType) {
  return (
    TRANSACTION_TYPE_MAP[transactionType?.toLowerCase()] ?? {
      label:       transactionType || "Unknown",
      badgeClass:  "badge-warning",
      sign:        "",
      amountClass: "text-gray-700",
    }
  );
}

const DetailIcon = () => (
  <Icon icon="lucide:eye" width={16} height={16} aria-hidden="true" />
);

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const formatAmount = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(Number(amount));

export default function History() {
  const [selectedItem, setSelectedItem] = useState(null);

  // ── custom hooks ──────────────────────────────────────────────────────────
  const { transactions, status, error, reload } = useTransactionHistory();
  const {
    paginated, filtered,
    search, currentPage, totalPages,
    handleSearch, handlePageChange,
  } = useTransactionFilter(transactions);
  // ─────────────────────────────────────────────────────────────────────────

  const loading = status === "loading";
  const meta = selectedItem ? getTransactionMeta(selectedItem.transactionType) : null;

  return (
    <>
      {/* Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <Icon
            icon="lucide:history"
            width={16}
            height={16}
            color="#2563EB"
            className="sm:w-5 sm:h-5"
            aria-hidden="true"
          />
        </div>
        <h1 className="section-title">History Transaction</h1>
      </div>

      {/* Main Card */}
      <div className="card min-h-150">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-100">
          <h2 className="section-title order-2 sm:order-1">Find Transaction</h2>
          <div className="order-1 sm:order-2">
            <SearchInput value={search} onChange={handleSearch} placeholder="Enter Number Or Full Name" />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 gap-3 text-gray-400">
            <Icon icon="lucide:loader-circle" className="animate-spin w-6 h-6 sm:w-8 sm:h-8 text-blue-500" aria-hidden="true" />
            <span className="text-xs sm:text-sm">Mengambil data history...</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-red-500 font-semibold text-sm">{error}</p>
            <button onClick={reload} className="text-xs text-blue-600 underline">
              Coba lagi
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <TableRow
              items={paginated}
              actionIcon={<DetailIcon />}
              onAction={(item) => setSelectedItem(item)}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              visibleCount={paginated.length}
              totalItems={filtered.length}
            />
          </>
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selectedItem} panelClassName="text-left">
        {selectedItem && (
          <div className="flex flex-col gap-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Transaction Detail</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <Icon icon="lucide:x" width={20} height={20} aria-hidden="true" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <img src={selectedItem.avatar} alt={selectedItem.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div>
                <p className="font-bold text-gray-800 text-base">{selectedItem.name}</p>
                <p className="text-sm text-gray-500">{selectedItem.phone}</p>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="flex flex-col gap-3">
              <DetailRow label="Description" value={selectedItem.transactionDesc} />
              <DetailRow label="Type" value={<span className={`badge ${meta.badgeClass}`}>{meta.label}</span>} />
              <DetailRow
                label="Amount"
                value={<span className={`font-bold ${meta.amountClass}`}>{meta.sign} {formatAmount(selectedItem.amount)}</span>}
              />
              <DetailRow label="Date" value={formatDate(selectedItem.createdAt)} />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="w-full mt-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-700">{value}</span>
    </div>
  );
}
