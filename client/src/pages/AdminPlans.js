// src/pages/AdminPlans.js
import { useMemo, useState } from "react";
import { FaEdit, FaPlus, FaSave, FaTrash, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import { createSubscriptionPlan, deleteSubscriptionPlan, updateSubscriptionPlan } from "../api";
import { useSubscriptionPlans } from "../api/swr";

const AdminPlans = () => {
  const { data: plans = [], isLoading } = useSubscriptionPlans(); // REAL HOOK
  const { mutate } = useSWRConfig();
  
  const [form, setForm] = useState({ planName: "", amount: "", currency: "USD", durationMonths: 1, planSpecs: "" });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, planSpecs: form.planSpecs.split("\n") };

    try {
      if (editingId) {
        await updateSubscriptionPlan(editingId, payload);
        toast.success("Plan updated.");
      } else {
        await createSubscriptionPlan(payload);
        toast.success("Plan created.");
      }
      mutate("/api/subscription-types"); // Refresh real-time
      setEditingId(null);
    } catch (err) {
      toast.error("Error saving plan");
    }
  };

  if (isLoading) return <FaSpinner className="animate-spin text-4xl mx-auto mt-20" />;

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-4xl font-bold tracking-tighter">Plan Manager</h1>
      
      {/* Create/Edit Card */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white grid grid-cols-2 gap-6">
        <input placeholder="Plan Name" className="p-4 bg-gray-50 rounded-2xl" value={form.planName} onChange={e => setForm({...form, planName: e.target.value})} />
        <input placeholder="Amount ($)" type="number" className="p-4 bg-gray-50 rounded-2xl" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
        <textarea placeholder="Features (one per line)" className="col-span-2 p-4 bg-gray-50 rounded-2xl h-32" value={form.planSpecs} onChange={e => setForm({...form, planSpecs: e.target.value})} />
        <button className="bg-black text-white p-4 rounded-full font-bold">{editingId ? "Update Plan" : "Create New Plan"}</button>
      </form>

      {/* List of Real Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative group">
            <h3 className="text-2xl font-bold">{plan.planName}</h3>
            <p className="text-blue-600 font-black text-xl mt-2">{plan.currency} {plan.amount}</p>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => setEditingId(plan._id)} className="p-2 bg-gray-100 rounded-full"><FaEdit size={12}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminPlans;