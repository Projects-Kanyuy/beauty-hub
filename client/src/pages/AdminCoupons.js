import { useState } from "react";
import { apiClient, createCoupon,  } from "../api";
import useSWR from "swr";
import { toast } from "react-toastify";

const AdminCoupons = () => {
  const { data: coupons = [], mutate } = useSWR("/api/subscriptions/coupons", (url) => apiClient.get(url).then(res => res.data));
  const [form, setForm] = useState({ code: "", type: "ADD_MONTH", expiresAt: "" });

  const handleCreate = async () => {
    try {
      await createCoupon(form);
      toast.success("Marketing code live!");
      mutate(); // Refresh real-time
    } catch (err) {
      toast.error("Failed to create code");
    }
  };

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-4xl font-black tracking-tighter">Marketing Tools</h1>
      
      {/* Create Coupon Card */}
      <div className="bg-black text-white p-10 rounded-[3rem] shadow-2xl flex gap-6 items-end">
        <div className="flex-1">
          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2 block">Promo Code</label>
          <input className="w-full bg-white/10 p-4 rounded-2xl border border-white/20 outline-none" 
                 onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} />
        </div>
        <button onClick={handleCreate} className="bg-white text-black px-10 py-4 rounded-full font-bold">Generate Code</button>
      </div>

      {/* Real Coupon List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coupons.map(c => (
          <div key={c._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tighter">{c.type}</div>
             <p className="text-2xl font-black tracking-widest mt-4">{c.code}</p>
             <p className="text-gray-400 text-xs mt-2 italic">Expires: {new Date(c.expiresAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminCoupons;