import useSWR from "swr";
import { apiClient } from "../api";

const AdminPayments = () => {
  const { data: payments = [] } = useSWR("/api/payments", (url) => apiClient.get(url).then(res => res.data));

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-4xl font-black tracking-tighter">Swychr Ledger</h1>
      
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F7] text-[10px] uppercase font-bold tracking-widest text-gray-400">
            <tr>
              <th className="p-6">Customer</th>
              <th className="p-6">Amount</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Transaction ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map(p => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-6">
                  <p className="font-bold">{p.userId?.name}</p>
                  <p className="text-xs text-gray-400">{p.userId?.email}</p>
                </td>
                <td className="p-6 font-black">{p.currency} {p.amount}</td>
                <td className="p-6">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                     p.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                   }`}>
                     {p.status}
                   </span>
                </td>
                <td className="p-6 text-right font-mono text-xs text-gray-400">{p._id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminPayments;