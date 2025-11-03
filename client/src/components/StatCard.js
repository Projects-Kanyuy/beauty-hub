const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
    <div>
      <p className="text-sm text-text-muted">{label}</p>
      <p className="text-2xl font-bold text-text-main">{value}</p>
    </div>
    <div className="text-3xl">{icon}</div>
  </div>
);
export default StatCard;