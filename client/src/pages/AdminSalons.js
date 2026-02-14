import { useState } from "react";
import { FaStore, FaUserAlt } from "react-icons/fa";

const mockSalons = [
  {
    id: 1,
    name: "Glamour Studio",
    owner: "Jane Smith",
    email: "jane@glamour.com",
    status: "active",
  },
  {
    id: 2,
    name: "Beauty Bliss",
    owner: "John Doe",
    email: "john@beautybliss.com",
    status: "pending",
  },
  {
    id: 3,
    name: "Elite Salon",
    owner: "Mary Johnson",
    email: "mary@elite.com",
    status: "blocked",
  },
  {
    id: 4,
    name: "Chic Cuts",
    owner: "Alice Brown",
    email: "alice@chiccuts.com",
    status: "active",
  },
];

const statusStyles = {
  active: "bg-green-100 text-green-700",
  blocked: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const AdminSalons = () => {
  const [salons, setSalons] = useState(mockSalons);

  const toggleStatus = (id) => {
    setSalons((prev) =>
      prev.map((salon) =>
        salon.id === id
          ? {
              ...salon,
              status:
                salon.status === "active"
                  ? "blocked"
                  : salon.status === "blocked"
                  ? "active"
                  : salon.status, // pending stays same
            }
          : salon
      )
    );
  };

  const deleteSalon = (id) => {
    setSalons((prev) => prev.filter((salon) => salon.id !== id));
  };

  // Summary
  const totalSalons = salons.length;
  const activeSalons = salons.filter((s) => s.status === "active").length;
  const blockedSalons = salons.filter((s) => s.status === "blocked").length;
  const pendingSalons = salons.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Salon Management</h1>
        <p className="text-sm text-gray-500">
          Overview of all registered salons and their status.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm">
          <FaStore className="text-blue-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Total Salons</p>
            <p className="text-lg font-bold text-gray-800">{totalSalons}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm">
          <span className="bg-green-500/20 text-green-700 p-2 rounded-full">
            ●
          </span>
          <div>
            <p className="text-gray-500 text-sm">Active</p>
            <p className="text-lg font-bold text-gray-800">{activeSalons}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm">
          <span className="bg-yellow-500/20 text-yellow-700 p-2 rounded-full">
            ●
          </span>
          <div>
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-lg font-bold text-gray-800">{pendingSalons}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm">
          <span className="bg-red-500/20 text-red-700 p-2 rounded-full">●</span>
          <div>
            <p className="text-gray-500 text-sm">Blocked</p>
            <p className="text-lg font-bold text-gray-800">{blockedSalons}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Salon Name</th>
              <th className="px-4 py-3 text-left">Owner</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {salons.map((salon) => (
              <tr key={salon.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {salon.name}
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <FaUserAlt className="text-gray-400" />
                  {salon.owner}
                </td>
                <td className="px-4 py-3 text-gray-500">{salon.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      statusStyles[salon.status]
                    }`}
                  >
                    {salon.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  {salon.status !== "pending" && (
                    <button
                      onClick={() => toggleStatus(salon.id)}
                      className="px-3 py-1 rounded-md text-xs font-medium border hover:bg-gray-100"
                    >
                      {salon.status === "active" ? "Block" : "Unblock"}
                    </button>
                  )}
                  <button
                    onClick={() => deleteSalon(salon.id)}
                    className="px-3 py-1 rounded-md text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSalons;
