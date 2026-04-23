import React, { useEffect, useState } from "react";
import { getAllUsers, resetUserPassword } from "../api";
import { FaKey, FaSearch, FaUserShield, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminPasswordManager = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      toast.error("Failed to load user list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleReset = async (userId, name) => {
    const newPass = window.prompt(`Set new password for ${name}:`);
    if (!newPass || newPass.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setUpdating(userId);
      await resetUserPassword({ userId, newPassword: newPass });
      toast.success(`Credentials updated for ${name}. Send them the new password.`);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center"><FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto" /></div>;

  return (
    <div className="p-10 space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-gray-900">Password Manager</h1>
        <p className="text-gray-500 font-medium">Reset client credentials and manage login access.</p>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text"
          placeholder="Search by name or email..."
          className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-purple outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 text-primary-purple rounded-xl flex items-center justify-center font-black uppercase text-sm">
                  {user.name?.[0]}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                  {user.role}
                </span>
              </div>
              <h3 className="font-black text-gray-900 text-lg truncate">{user.name}</h3>
              <p className="text-sm text-gray-500 truncate mb-6">{user.email}</p>
            </div>

            {user.role !== "admin" ? (
              <button 
                onClick={() => handleReset(user._id, user.name)}
                disabled={updating === user._id}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-black transition-all"
              >
                {updating === user._id ? <FaSpinner className="animate-spin" /> : <FaKey size={10} />}
                SET NEW PASSWORD
              </button>
            ) : (
              <div className="py-3 text-center bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <FaUserShield /> System Protected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPasswordManager;