import { useState } from "react";
import { FaEye } from "react-icons/fa";

const mockPayments = [
  {
    id: 1,
    user: "Jane Smith",
    email: "jane@example.com",
    amount: 49900,
    currency: "XAF",
    gateway: "swychr",
    status: "Completed",
    entity: "Subscription",
    date: "2025-01-05",
  },
  {
    id: 2,
    user: "John Doe",
    email: "john@example.com",
    amount: 19900,
    currency: "XAF",
    gateway: "swychr",
    status: "Failed",
    entity: "Subscription",
    date: "2025-01-04",
  },
  {
    id: 3,
    user: "Mary Johnson",
    email: "mary@example.com",
    amount: 99900,
    currency: "XAF",
    gateway: "swychr",
    status: "Pending",
    entity: "Subscription",
    date: "2025-01-06",
  },
];

const statusColors = {
  Completed: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Canceled: "bg-gray-100 text-gray-700",
};

const AdminPayments = () => {
  const [payments] = useState(mockPayments);
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? payments : payments.filter((p) => p.status === filter);

  // Summary
  const total = payments.length;
  const completed = payments.filter((p) => p.status === "Completed").length;
  const pending = payments.filter((p) => p.status === "Pending").length;
  const failed = payments.filter((p) => p.status === "Failed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        <p className="text-sm text-gray-500">
          Overview of all transactions and their statuses
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
          <div className="bg-gray-200 p-2 rounded-full text-gray-700">💰</div>
          <div>
            <p className="text-gray-500 text-sm">Total</p>
            <p className="text-lg font-bold text-gray-800">{total}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
          <span className="bg-green-500/20 text-green-700 p-2 rounded-full">
            ●
          </span>
          <div>
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-lg font-bold text-gray-800">{completed}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
          <span className="bg-yellow-500/20 text-yellow-700 p-2 rounded-full">
            ●
          </span>
          <div>
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-lg font-bold text-gray-800">{pending}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
          <span className="bg-red-500/20 text-red-700 p-2 rounded-full">●</span>
          <div>
            <p className="text-gray-500 text-sm">Failed</p>
            <p className="text-lg font-bold text-gray-800">{failed}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["All", "Completed", "Pending", "Failed", "Canceled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition
              ${
                filter === status
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Gateway</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((pay) => (
              <tr key={pay.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {pay.user}
                </td>
                <td className="px-4 py-3 text-gray-700">{pay.email}</td>
                <td className="px-4 py-3">{pay.entity}</td>
                <td className="px-4 py-3 font-semibold">
                  {pay.amount.toLocaleString()} {pay.currency}
                </td>
                <td className="px-4 py-3">{pay.gateway}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[pay.status]
                    }`}
                  >
                    {pay.status}
                  </span>
                </td>
                <td className="px-4 py-3">{pay.date}</td>
                <td className="px-4 py-3 text-right">
                  <button className="flex items-center gap-1 text-blue-600 hover:underline">
                    <FaEye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No payments found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
