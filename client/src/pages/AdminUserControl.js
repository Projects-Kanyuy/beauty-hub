// src/pages/AdminUserControl.js
import React, { useEffect, useState } from "react";
import { getAdminOverview, manualActivate, restrictAccess, useSubscriptionPlans } from "../api";
import { FaUnlockAlt, FaUserSlash, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminUserControl = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const res = await getAdminOverview();
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleGrantAccess = async (userId) => {
    // You can add a prompt to ask for duration/note
    const note = window.prompt("Enter reason for manual activation (e.g. Agent Deal)");
    if (!note) return;

    try {
      await manualActivate({ 
        userId, 
        planId: "671f3a...", // You can make this a dropdown later
        durationMonths: 1, 
        note 
      });
      toast.success("Client account activated manually!");
      loadData();
    } catch (err) {
      toast.error("Activation failed");
    }
  };

  return (
    <div className="p-10 space-y-8">
      <header>
        <h1 className="text-4xl font-black tracking-tighter">Access Management</h1>
        <p className="text-gray-500 italic">"Backend control for business decisions."</p>
      </header>

      <div className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-white">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F7] text-[10px] uppercase font-bold tracking-widest text-gray-400">
            <tr>
              <th className="p-6">Client</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Administrative Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(sub => (
              <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-6">
                  <p className="font-bold text-[#1D1D1F]">{sub.user?.name}</p>
                  <p className="text-xs text-gray-400">{sub.user?.email}</p>
                </td>
                <td className="p-6">
                   <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                     sub.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
                   }`}>
                     {sub.status}
                   </span>
                </td>
                <td className="p-6 text-right">
                  {sub.status !== 'Active' ? (
                    <button 
                      onClick={() => handleGrantAccess(sub.user?._id)}
                      className="bg-primary-purple text-white px-6 py-2 rounded-full font-bold text-xs hover:shadow-lg transition-all"
                    >
                      Bypass & Activate
                    </button>
                  ) : (
                    <button 
                      onClick={() => restrictAccess(sub.user?._id)}
                      className="text-red-600 font-bold text-xs hover:underline"
                    >
                      Suspend Access
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminUserControl;