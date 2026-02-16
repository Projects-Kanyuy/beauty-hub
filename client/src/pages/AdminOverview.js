import React from "react";
import useSWR from "swr";
import { apiClient } from "../api";
import { FaUsers, FaStore, FaDollarSign, FaChartLine, FaSpinner, FaClock } from "react-icons/fa";

const fetcher = (url) => apiClient.get(url).then(res => res.data);

const AdminOverview = () => {
  const { data: stats, isLoading } = useSWR("/api/admin/stats", fetcher, { refreshInterval: 5000 });

  if (isLoading) return <div className="p-20 text-center"><FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" /></div>;

  const kpis = [
    { title: "Revenue", value: `$${stats?.totalRevenue || 0}`, icon: FaDollarSign, color: "text-green-500", bg: "bg-green-50" },
    { title: "Users", value: stats?.totalUsers || 0, icon: FaUsers, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Salons", value: stats?.totalSalons || 0, icon: FaStore, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "Growth", value: "0%", icon: FaChartLine, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="p-8 space-y-10 bg-[#F5F5F7] min-h-screen">
      <h1 className="text-4xl font-black tracking-tighter text-[#1D1D1F]">Command Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-white shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{kpi.title}</p>
              <p className="text-3xl font-black">{kpi.value}</p>
            </div>
            <div className={`p-4 ${kpi.bg} ${kpi.color} rounded-2xl`}>
              <kpi.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[3.5rem] border border-white shadow-sm">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <FaClock className="text-blue-500" /> Recent Activity
        </h2>
        <div className="space-y-4">
          {stats?.recentActivity?.map((act, i) => (
            <div key={i} className="flex justify-between items-center p-5 bg-[#F5F5F7] rounded-2xl border border-transparent hover:border-gray-200 transition-all">
              <span className="font-bold text-gray-700">{act.message}</span>
              <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">
                {act.time ? new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;