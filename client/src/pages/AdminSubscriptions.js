import React from "react";
import { useAdminSubscriptions } from "../api/swr";
import { FaSpinner } from "react-icons/fa";

const AdminSubscriptions = () => {
  const { data: subs = [], isLoading } = useAdminSubscriptions();

  if (isLoading) return <div className="p-20 text-center"><FaSpinner className="animate-spin mx-auto text-4xl text-green-600" /></div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-black tracking-tighter">Active Contracts</h1>
      
      <div className="bg-white rounded-[3rem] overflow-hidden border border-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F7] text-[10px] uppercase font-bold tracking-widest text-gray-400">
            <tr>
              <th className="p-6">Subscriber</th>
              <th className="p-6">Plan</th>
              <th className="p-6">Expires</th>
              <th className="p-6 text-right">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subs.map(sub => (
              <tr key={sub._id} className="hover:bg-gray-50">
                <td className="p-6">
                   <p className="font-bold">{sub.user?.name}</p>
                   <p className="text-xs text-gray-400">{sub.user?.email}</p>
                </td>
                <td className="p-6 font-black text-blue-600">{sub.plan?.planName}</td>
                <td className="p-6 text-sm text-gray-500">
                   {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-6 text-right">
                   <span className="text-[9px] font-bold px-3 py-1 bg-gray-100 rounded-full">
                      {sub.isManualOverride ? 'ADMIN OVERRIDE' : 'SWYCHR PAID'}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminSubscriptions;