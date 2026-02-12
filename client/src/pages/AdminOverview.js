import {
  FaArrowDown,
  FaArrowUp,
  FaCalendarAlt,
  FaDollarSign,
  FaExclamationTriangle,
  FaStore,
  FaUsers,
} from "react-icons/fa";

const kpis = [
  {
    title: "Total Users",
    value: 1245,
    change: "+4.2%",
    trend: "up",
    icon: FaUsers,
  },
  {
    title: "Active Salons",
    value: 342,
    change: "+1.1%",
    trend: "up",
    icon: FaStore,
  },
  {
    title: "Appointments Today",
    value: 58,
    change: "-6.8%",
    trend: "down",
    icon: FaCalendarAlt,
  },
  {
    title: "Monthly Revenue",
    value: "$12,450",
    change: "+12.5%",
    trend: "up",
    icon: FaDollarSign,
  },
];

const alerts = [
  { id: 1, message: "3 salons pending verification" },
  { id: 2, message: "5 failed payment attempts today" },
  { id: 3, message: "2 negative reviews flagged" },
];

const recentActivity = [
  { id: 1, action: "New user registered", time: "5 min ago" },
  { id: 2, action: "Salon subscription upgraded", time: "18 min ago" },
  { id: 3, action: "Appointment cancelled", time: "42 min ago" },
  { id: 4, action: "Payment completed", time: "1 hr ago" },
];

const AdminOverview = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Platform Overview</h1>
        <p className="text-sm text-gray-500">
          Snapshot of system activity and health
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const TrendIcon = kpi.trend === "up" ? FaArrowUp : FaArrowDown;
          return (
            <div
              key={kpi.title}
              className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {kpi.value}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-100 text-slate-700">
                  <kpi.icon size={20} />
                </div>
              </div>

              <div
                className={`mt-4 flex items-center gap-1 text-sm font-medium ${
                  kpi.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                <TrendIcon size={12} />
                {kpi.change} vs last period
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 h-64 flex items-center justify-center text-gray-400">
            Revenue (Last 30 Days)
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 h-64 flex items-center justify-center text-gray-400">
            Appointments Trend
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
          <div className="flex items-center gap-2 mb-4 text-red-600 font-semibold">
            <FaExclamationTriangle />
            Needs Attention
          </div>

          <ul className="space-y-3 text-sm text-gray-700">
            {alerts.map((alert) => (
              <li key={alert.id} className="flex items-start gap-2">
                <span className="mt-1 w-2 h-2 rounded-full bg-red-500" />
                {alert.message}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>

        <ul className="divide-y text-sm">
          {recentActivity.map((item) => (
            <li
              key={item.id}
              className="py-3 flex justify-between text-gray-700"
            >
              <span>{item.action}</span>
              <span className="text-gray-400">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminOverview;
