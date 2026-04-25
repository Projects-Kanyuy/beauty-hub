import React, { useState } from "react";
import { useAdminUsers, useSubscriptionPlans } from "../api/swr";
import { FaSpinner, FaUnlockAlt, FaSearch, FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import { manualActivate, restrictAccess } from "../api";

const AdminUsers = () => {
  const { data: users = [], isLoading, mutate } = useAdminUsers();
  const { data: plans = [] } = useSubscriptionPlans();
  
  // 1. STATE FOR SEARCH
  const [searchTerm, setSearchTerm] = useState("");

  const handleGrantAccess = async (userId) => {
    const planId = plans?.[0]?._id; 
    if (!planId) return toast.error("Create a Subscription Plan first!");

    if (!window.confirm("Grant this client immediate access without payment?")) return;

    try {
      await manualActivate({ userId, planId, durationMonths: 1, note: "Admin Override" });
      toast.success("Client account activated!");
      mutate(); 
    } catch (err) {
      toast.error("Activation failed");
    }
  }

  // 2. SEARCH FILTER LOGIC
  const filteredUsers = users.filter((user) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchStr) ||
      user.email?.toLowerCase().includes(searchStr)
    );
  });

  if (isLoading) return <div className="p-20 text-center"><FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto" /></div>;

  return (
    <div className="p-8 space-y-8 bg-[#F5F5F7] min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-[#1D1D1F]">Identity Manager</h1>
          <p className="text-gray-500 text-sm font-medium">Manage user access and verification status.</p>
        </div>

        {/* 3. SEARCH INPUT BOX */}
        <div className="relative w-full md:w-96 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-purple transition-colors" />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-purple outline-none font-medium transition-all"
          />
        </div>
      </header>

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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="group hover:bg-gray-50/50 transition-all duration-300">
                  <td className="p-6">
                    <p className="font-bold text-[#1D1D1F]">{user.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                  </td>
                  <td className="p-6">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {user.role?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-6">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.accessStatus === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-orange-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${user.accessStatus === 'LIVE' ? 'text-green-600' : 'text-orange-500'}`}>
                          {user.accessStatus === 'LIVE' ? 'Access Live' : 'Pending'}
                        </span>
                     </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      {user.accessStatus !== 'LIVE' && user.role !== 'admin' && (
                        <button 
                          onClick={() => handleGrantAccess(user._id)} 
                          className="bg-[#1D1D1F] text-white px-5 py-2.5 rounded-full font-bold text-[10px] uppercase hover:bg-blue-600 transition-all shadow-md"
                        >
                          <FaUnlockAlt className="inline mr-1" size={10} /> Grant Access
                        </button>
                      )}
                      
                      {user.role !== 'admin' ? (
                        <button 
                           onClick={() => { if(window.confirm("Restrict this user?")) { restrictAccess(user._id).then(() => mutate()); } }}
                           className="text-red-500 font-bold text-[10px] uppercase hover:bg-red-50 px-4 py-2 rounded-full transition-all"
                        >
                          Restrict
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-300 font-black flex items-center gap-1">
                          <FaUserShield /> PROTECTED
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-20 text-center text-gray-400 font-bold italic">
                  No users match your search "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;