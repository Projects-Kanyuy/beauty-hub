import { useState } from "react";
import { FaTrash, FaUserAlt, FaUsers, FaUserShield } from "react-icons/fa";

const ROLES = ["customer", "salon_owner", "admin"];

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "customer",
    status: "active",
    lastLogin: "2025-12-22 10:15 AM",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "salon_owner",
    status: "active",
    lastLogin: "2025-12-22 09:30 AM",
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "blocked",
    lastLogin: "2025-12-21 11:00 PM",
  },
  {
    id: 4,
    name: "Mark Johnson",
    email: "mark@example.com",
    role: "customer",
    status: "active",
    lastLogin: "2025-12-22 08:45 AM",
  },
];

const statusStyles = {
  active: "bg-green-100 text-green-700",
  blocked: "bg-red-100 text-red-700",
};

const roleIcons = {
  customer: FaUserAlt,
  salon_owner: FaUsers,
  admin: FaUserShield,
};

const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id && user.role !== "admin"
          ? { ...user, status: user.status === "active" ? "blocked" : "active" }
          : user
      )
    );
  };

  const updateRole = (id, newRole) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
    );
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  // Summary
  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalBlocked = users.filter((u) => u.status === "blocked").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-sm text-gray-500">
          Overview and management of user accounts, roles, and access.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm">
          <FaUsers className="text-blue-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-lg font-bold text-gray-800">{totalUsers}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm">
          <FaUserShield className="text-purple-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Admins</p>
            <p className="text-lg font-bold text-gray-800">{totalAdmins}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm">
          <FaTrash className="text-red-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Blocked Users</p>
            <p className="text-lg font-bold text-gray-800">{totalBlocked}</p>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Last Login</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => {
              const Icon = roleIcons[user.role];
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  {/* User */}
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Icon className="text-gray-400" />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      disabled={user.role === "admin"}
                      className="
                        border rounded-md px-2 py-1 text-sm
                        disabled:bg-gray-100 disabled:text-gray-400
                      "
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        statusStyles[user.status]
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Last Login */}
                  <td className="px-4 py-3 text-gray-500">{user.lastLogin}</td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      disabled={user.role === "admin"}
                      className="px-3 py-1 rounded-md text-xs font-medium border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {user.status === "active" ? "Block" : "Unblock"}
                    </button>

                    <button
                      onClick={() => deleteUser(user.id)}
                      disabled={user.role === "admin"}
                      className="px-3 py-1 rounded-md text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
