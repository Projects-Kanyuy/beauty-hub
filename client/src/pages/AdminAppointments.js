import { useState } from "react";
import { FaCalendarAlt, FaEye, FaTimes } from "react-icons/fa";

const mockAppointments = [
  {
    id: 1,
    client: "Sarah Johnson",
    salon: "Glamour Studio",
    service: "Hair Styling",
    date: "2025-01-12",
    time: "14:00",
    amount: "15,000 XAF",
    status: "Pending",
  },
  {
    id: 2,
    client: "Michael Brown",
    salon: "Beauty Bliss",
    service: "Manicure",
    date: "2025-01-11",
    time: "10:30",
    amount: "8,000 XAF",
    status: "Confirmed",
  },
  {
    id: 3,
    client: "Anna White",
    salon: "Elite Salon",
    service: "Home Makeup",
    date: "2025-01-10",
    time: "16:00",
    amount: "25,000 XAF",
    status: "Completed",
  },
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const AdminAppointments = () => {
  const appointments = mockAppointments;
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredAppointments =
    statusFilter === "All"
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  // Summary counts
  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === "Pending").length;
  const confirmed = appointments.filter((a) => a.status === "Confirmed").length;
  const completed = appointments.filter((a) => a.status === "Completed").length;
  const cancelled = appointments.filter((a) => a.status === "Cancelled").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <p className="text-sm text-gray-500">
          Manage client appointments and statuses
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
          <FaCalendarAlt className="text-gray-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Total</p>
            <p className="text-lg font-bold text-gray-800">{total}</p>
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
          <span className="bg-blue-500/20 text-blue-700 p-2 rounded-full">
            ●
          </span>
          <div>
            <p className="text-gray-500 text-sm">Confirmed</p>
            <p className="text-lg font-bold text-gray-800">{confirmed}</p>
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
          <span className="bg-red-500/20 text-red-700 p-2 rounded-full">●</span>
          <div>
            <p className="text-gray-500 text-sm">Cancelled</p>
            <p className="text-lg font-bold text-gray-800">{cancelled}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition
              ${
                statusFilter === status
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Salon</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredAppointments.map((appt) => (
              <tr key={appt.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {appt.client}
                </td>
                <td className="px-4 py-3 text-gray-700">{appt.salon}</td>
                <td className="px-4 py-3 text-gray-700">{appt.service}</td>
                <td className="px-4 py-3">{appt.date}</td>
                <td className="px-4 py-3">{appt.time}</td>
                <td className="px-4 py-3 font-semibold">{appt.amount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[appt.status]
                    }`}
                  >
                    {appt.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  <button className="flex items-center gap-1 text-blue-600 hover:underline">
                    <FaEye /> View
                  </button>
                  {appt.status !== "Completed" && (
                    <button className="flex items-center gap-1 text-red-600 hover:underline">
                      <FaTimes /> Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No appointments found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;
