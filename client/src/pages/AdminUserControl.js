import React, { useEffect, useState } from "react";
import { getAdminOverview, manualActivate, restrictAccess } from "../api";
import { 
  FaUnlockAlt, 
  FaUserSlash, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaSpinner, 
  FaUserShield,
  FaPhoneAlt
} from "react-icons/fa";
import { toast } from "react-toastify";

const AdminUserControl = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Track which user is being processed

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAdminOverview();
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
  }, []);

  const handleGrantAccess = async (userId) => {
    const note = window.prompt("Enter reason for manual activation (e.g. Agent Deal, Promotional Access)");
    if (!note) return;

    try {
      setActionLoading(userId);
      // We use a generic plan ID here or you can fetch them from an API
      await manualActivate({ 
        userId, 
        planId: "67d54cc3a1ec8abb3fdd89ff", // Ensure this matches a real Plan ID in your DB
        durationMonths: 1, 
        note 
      });
      toast.success("Account activated! Salon is now visible in directory.");
      await loadData();
    } catch (err) {
      toast.error("Activation failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspendAccess = async (userId) => {
    const confirm = window.confirm("SUSPEND USER: This will block their dashboard and hide their salon from the directory instantly. Continue?");
    if (!confirm) return;

    try {
      setActionLoading(userId);
      await restrictAccess(userId);
      toast.warning("Access revoked. Salon has been unlisted.");
      await loadData();
    } catch (err) {
      toast.error("Suspension failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-primary-purple mb-4" />
        <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">Fetching Registry...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-gray-100 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary-purple text-white p-2 rounded-xl">
               <FaUserShield size={20} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900">Access Management</h1>
          </div>
          <p className="text-gray-500 font-medium tracking-tight">Manual overrides and directory visibility control.</p>
        </div>
        <div className="text-right">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Registered</p>
            <p className="text-3xl font-black text-primary-purple">{users.length}</p>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-50">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F5F5F7] text-[10px] uppercase font-black tracking-[0.2em] text-gray-400">
            <tr>
              <th className="p-8">Professional Info</th>
              <th className="p-8">Contact</th>
              <th className="p-8">Directory Status</th>
              <th className="p-8 text-right">Administrative Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((sub) => (
              <tr key={sub._id} className="hover:bg-purple-50/30 transition-all group">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400 uppercase">
                        {sub.user?.name?.[0] || 'U'}
                    </div>
                    <div>
                        <p className="font-black text-gray-900 text-lg tracking-tight group-hover:text-primary-purple transition-colors">
                            {sub.user?.name}
                        </p>
                        <p className="text-sm text-gray-400 font-medium">{sub.user?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-sm">
                        <FaPhoneAlt size={12} className="text-emerald-500" />
                        {sub.user?.phone || 'No Phone'}
                    </div>
                </td>
                <td className="p-8">
                   <div className="flex items-center gap-2">
                        {sub.status === 'Active' ? (
                            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                                <FaCheckCircle /> LIVE IN DIRECTORY
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100">
                                <FaExclamationCircle /> UNLISTED / SUSPENDED
                            </span>
                        )}
                   </div>
                </td>
                <td className="p-8 text-right">
                  {actionLoading === sub.user?._id ? (
                    <FaSpinner className="animate-spin text-primary-purple ml-auto" />
                  ) : sub.status !== 'Active' ? (
                    <button 
                      onClick={() => handleGrantAccess(sub.user?._id)}
                      className="bg-primary-purple text-white px-8 py-3 rounded-2xl font-black text-xs hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 ml-auto shadow-lg shadow-purple-100"
                    >
                      <FaUnlockAlt size={12} /> BYPASS & ACTIVATE
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleSuspendAccess(sub.user?._id)}
                      className="text-gray-400 hover:text-red-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 ml-auto transition-colors px-4 py-2 border-2 border-transparent hover:border-red-50"
                    >
                      <FaUserSlash size={14} /> Suspend Access
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-bold italic">
                No subscription records found in the system.
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserControl;