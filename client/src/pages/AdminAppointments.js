import React from "react";
import { useAdminAppointments } from "../api/swr";
import { FaSpinner } from "react-icons/fa";

const AdminAppointments = () => {
  const { data: appointments = [], isLoading } = useAdminAppointments();

  if (isLoading) return <div className="p-20 text-center"><FaSpinner className="animate-spin mx-auto text-4xl text-purple-600" /></div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-black tracking-tighter">Live Bookings</h1>
      
      <div className="bg-white rounded-[3rem] overflow-hidden border border-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F7] text-[10px] uppercase font-bold tracking-widest text-gray-400">
            <tr>
              <th className="p-6">Client</th>
              <th className="p-6">Salon</th>
              <th className="p-6">Date</th>
              <th className="p-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {appointments.map(appt => (
              <tr key={appt._id} className="hover:bg-gray-50">
                <td className="p-6 font-bold">{appt.customer?.name || 'Guest'}</td>
                <td className="p-6 text-gray-600">{appt.salon?.name}</td>
                <td className="p-6 text-sm text-gray-400">
                  {new Date(appt.appointmentDateTime).toLocaleDateString()}
                </td>
                <td className="p-6 text-right">
                   <span className="text-[10px] font-black uppercase tracking-widest">{appt.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminAppointments;