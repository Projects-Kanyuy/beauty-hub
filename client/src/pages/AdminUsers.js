import React from "react";
import { useAdminUsers, useSubscriptionPlans } from "../api/swr";
import { FaSpinner, FaUnlockAlt} from "react-icons/fa";
import { toast } from "react-toastify";
import { manualActivate, restrictAccess } from "../api";

const AdminUsers = () => {
  const { data: users = [], isLoading, mutate } = useAdminUsers();
  const { data: plans = [] } = useSubscriptionPlans();

  const handleGrantAccess = async (userId) => {
    const planId = plans?.[0]?._id; 
    if (!planId) return toast.error("Create a Subscription Plan first!");

    if (!window.confirm("Grant this client immediate access without payment?")) return;

    try {
      await manualActivate({ userId, planId, durationMonths: 1, note: "Admin Override" });
      toast.success("Client account activated!");
      mutate(); // This triggers SWR to re-fetch the users with the new 'LIVE' status
    } catch (err) {
      toast.error("Activation failed");
    }
  }

  if (isLoading) return <div className="p-20 text-center"><FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto" /></div>;

  return (
    <div className="p-8 space-y-8 bg-[#F5F5F7] min-h-screen">
      <h1 className="text-4xl font-black tracking-tighter text-[#1D1D1F]">Identity Manager</h1>

      <div className="bg-white rounded-[3rem] overflow-hidden border border-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F7] text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <tr>
              <th className="p-6">User / Email</th>
              <th className="p-6">Role</th>
              <th className="p-6">Access Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user._id} className="group hover:bg-gray-50/50 transition-all duration-300">
                <td className="p-6">
                  <p className="font-bold text-[#1D1D1F]">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </td>
                <td className="p-6">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {user.role?.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-6">
                   <div className="flex items-center gap-2">
                      {/* Pulsing Green Dot if LIVE, Solid Orange if PENDING */}
                      <div className={`w-2 h-2 rounded-full ${user.accessStatus === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-orange-400'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${user.accessStatus === 'LIVE' ? 'text-green-600' : 'text-orange-500'}`}>
                        {user.accessStatus === 'LIVE' ? 'Access Live' : 'Pending'}
                      </span>
                   </div>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    {/* Only show Grant Access if they are NOT live */}
                    {user.accessStatus !== 'LIVE' && user.role !== 'admin' && (
                      <button 
                        onClick={() => handleGrantAccess(user._id)} 
                        className="bg-[#1D1D1F] text-white px-5 py-2 rounded-full font-bold text-[10px] uppercase hover:bg-blue-600 transition-all shadow-md"
                      >
                        <FaUnlockAlt className="inline mr-1" size={10} /> Grant Access
                      </button>
                    )}
                    <button 
                       onClick={() => { restrictAccess(user._id); mutate(); }}
                       className="text-red-500 font-bold text-[10px] uppercase hover:bg-red-50 px-4 py-2 rounded-full transition-all"
                    >
                      Restrict
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;