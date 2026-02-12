import { useState } from "react";
import { FaCheckCircle, FaEye, FaTimes } from "react-icons/fa";

const mockSubscriptions = [
  {
    id: 1,
    user: "Jane Smith",
    email: "jane@example.com",
    plan: "Pro",
    duration: "1 Month",
    status: "Active",
    startDate: "2025-01-01",
    endDate: "2025-02-01",
  },
  {
    id: 2,
    user: "John Doe",
    email: "john@example.com",
    plan: "Basic",
    duration: "1 Month",
    status: "Expired",
    startDate: "2024-11-01",
    endDate: "2024-12-01",
  },
  {
    id: 3,
    user: "Mary Johnson",
    email: "mary@example.com",
    plan: "Premium",
    duration: "3 Months",
    status: "Cancelled",
    startDate: "2024-12-01",
    endDate: "2025-03-01",
  },
];

const statusColors = {
  Active: "bg-green-100 text-green-800",
  Expired: "bg-gray-100 text-gray-700",
  Cancelled: "bg-red-100 text-red-800",
};

const AdminSubscriptions = () => {
  const subscriptions = mockSubscriptions;
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? subscriptions
      : subscriptions.filter((s) => s.status === filter);

  // Summary
  const total = subscriptions.length;
  const active = subscriptions.filter((s) => s.status === "Active").length;
  const expired = subscriptions.filter((s) => s.status === "Expired").length;
  const cancelled = subscriptions.filter(
    (s) => s.status === "Cancelled"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Subscriptions</h1>
        <p className="text-sm text-gray-500">
          Manage user subscription plans and statuses
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
          <FaCheckCircle className="text-gray-500 text-2xl" />
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
            <p className="text-gray-500 text-sm">Active</p>
            <p className="text-lg font-bold text-gray-800">{active}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
          <span className="bg-gray-500/20 text-gray-700 p-2 rounded-full">
            ●
          </span>
          <div>
            <p className="text-gray-500 text-sm">Expired</p>
            <p className="text-lg font-bold text-gray-800">{expired}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
          <span className="bg-red-500/20 text-red-700 p-2 rounded-full">●</span>
          <div>
            <p className="text-gray-500 text-sm">Cancelled</p>
            <p className="text-lg font-bold text-gray-800">{cancelled}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["All", "Active", "Expired", "Cancelled"].map((status) => (
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
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">End</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {sub.user}
                </td>
                <td className="px-4 py-3 text-gray-700">{sub.email}</td>
                <td className="px-4 py-3 font-semibold">{sub.plan}</td>
                <td className="px-4 py-3">{sub.duration}</td>
                <td className="px-4 py-3">{sub.startDate}</td>
                <td className="px-4 py-3">{sub.endDate}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[sub.status]
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  <button className="flex items-center gap-1 text-blue-600 hover:underline">
                    <FaEye /> View
                  </button>
                  {sub.status === "Active" && (
                    <button className="flex items-center gap-1 text-red-600 hover:underline">
                      <FaTimes /> Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No subscriptions found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptions;
