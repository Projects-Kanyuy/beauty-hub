// src/pages/SalonAnalyticsPage.js
import { useTranslation } from "react-i18next";
import { FaSpinner, FaStar } from "react-icons/fa";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSalonAnalytics } from "../api/swr";
import AlertBox from "../components/AlertBox";

const COLORS = ["#8B5CF6", "#D946EF", "#6366F1", "#EC4899"]; // Purple, Pink, Indigo, Fuchsia

const SalonAnalyticsPage = () => {
  const { t } = useTranslation();
  const {
    data: analytics,
    isLoading: loading,
    error,
  } = useSalonAnalytics();

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-5xl text-purple-500" />
      </div>
    );
  if (error)
    return (
      <AlertBox
        title={t("analytics.error")}
        message={t("analytics.errorLoadData")}
        type="error"
        onRetry={() => window.location.reload()}
      />
    );
  if (!analytics)
    return (
      <p className="text-center text-gray-400 mt-20">{t("analytics.noData")}</p>
    );

  const { kpis, bookingsOverTime, servicePopularity } = analytics;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900">
        {t("analytics.title")}
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: t("analytics.totalEarnings"),
            value: `$${kpis.totalEarnings.toLocaleString()}`,
          },
          { label: t("analytics.newClients"), value: kpis.newClients },
          {
            label: t("analytics.completedAppointments"),
            value: kpis.completedAppointments,
          },
          {
            label: t("analytics.averageRating"),
            value: (
              <div className="flex items-center">
                {kpis.avgRating} <FaStar className="ml-2 text-yellow-400" />
              </div>
            ),
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
          >
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bookings Over Time */}
        <div className="lg:col-span-2 bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 h-96">
          <h2 className="font-semibold text-lg mb-4">
            {t("analytics.bookingsOverTime")}
          </h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={bookingsOverTime}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip cursor={{ fill: "rgba(139, 92, 246, 0.1)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="bookings" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Service Popularity */}
        <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 h-96">
          <h2 className="font-semibold text-lg mb-4">
            {t("analytics.servicePopularity")}
          </h2>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={servicePopularity}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {servicePopularity.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalonAnalyticsPage;
