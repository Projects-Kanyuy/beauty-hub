import { useState } from "react";
import { FaEye, FaPlus } from "react-icons/fa";

const mockCoupons = [
  {
    id: 1,
    code: "WELCOME10",
    type: "Percentage",
    value: 10,
    usageLimit: 100,
    used: 32,
    status: "Active",
    expiresAt: "2025-02-01",
  },
  {
    id: 2,
    code: "FLAT500",
    type: "Fixed",
    value: 500,
    usageLimit: 50,
    used: 50,
    status: "Expired",
    expiresAt: "2024-12-15",
  },
  {
    id: 3,
    code: "SUMMER20",
    type: "Percentage",
    value: 20,
    usageLimit: 200,
    used: 75,
    status: "Active",
    expiresAt: "2025-03-15",
  },
];

const statusColors = {
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-gray-100 text-gray-700",
  Expired: "bg-red-100 text-red-800",
};

const AdminCoupons = () => {
  const [coupons] = useState(mockCoupons);

  // Summary
  const total = coupons.length;
  const active = coupons.filter((c) => c.status === "Active").length;
  const expired = coupons.filter((c) => c.status === "Expired").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
          <p className="text-sm text-gray-500">
            Manage promotional codes and track their usage
          </p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
          <FaPlus />
          Create Coupon
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
          <div className="bg-gray-200 p-2 rounded-full text-gray-700">🎟️</div>
          <div>
            <p className="text-gray-500 text-sm">Total Coupons</p>
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
          <span className="bg-red-500/20 text-red-700 p-2 rounded-full">●</span>
          <div>
            <p className="text-gray-500 text-sm">Expired</p>
            <p className="text-lg font-bold text-gray-800">{expired}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                <td className="px-4 py-3">{c.type}</td>
                <td className="px-4 py-3">
                  {c.type === "Percentage" ? `${c.value}%` : `${c.value} XAF`}
                </td>
                <td className="px-4 py-3">
                  {c.used}/{c.usageLimit}
                </td>
                <td className="px-4 py-3">{c.expiresAt}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      statusColors[c.status]
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  <button className="flex items-center gap-1 text-blue-600 hover:underline">
                    <FaEye /> View
                  </button>
                  {c.status === "Active" && (
                    <button className="text-red-600 hover:underline">
                      Disable
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {coupons.length === 0 && (
          <div className="text-center py-6 text-gray-500">No coupons found</div>
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;
