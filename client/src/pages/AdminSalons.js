import React from "react";
import { useAdminSalons } from "../api/swr";
import { FaSpinner } from "react-icons/fa";

const AdminSalons = () => {
  const { data: salons = [], isLoading } = useAdminSalons();

  if (isLoading) return <div className="p-20 text-center"><FaSpinner className="animate-spin mx-auto text-4xl text-blue-600" /></div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-black tracking-tighter">Salon Fleet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Total Salons</p>
          <p className="text-4xl font-black">{salons.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] overflow-hidden border border-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F7] text-[10px] uppercase font-bold tracking-widest text-gray-400">
            <tr>
              <th className="p-6">Salon Name</th>
              <th className="p-6">Owner</th>
              <th className="p-6">City</th>
              <th className="p-6 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {salons.map(salon => (
              <tr key={salon._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-6 font-bold">{salon.name}</td>
                <td className="p-6">
                  <p className="text-sm">{salon.owner?.name}</p>
                  <p className="text-xs text-gray-400">{salon.owner?.email}</p>
                </td>
                <td className="p-6 text-gray-500">{salon.city}</td>
                <td className="p-6 text-right">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                    salon.isVerified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {salon.isVerified ? 'Verified' : 'Pending'}
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
export default AdminSalons;