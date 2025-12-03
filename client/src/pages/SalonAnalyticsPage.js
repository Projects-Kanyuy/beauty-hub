// src/pages/SalonAnalyticsPage.js
import { useEffect, useState } from "react";
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
import { fetchSalonAnalytics } from "../api";

const COLORS = ["#8B5CF6", "#D946EF", "#6366F1", "#EC4899"]; // Purple, Pink, Indigo, Fuchsia

const SalonAnalyticsPage = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const { data } = await fetchSalonAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError(t("analytics.errorLoadData"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [t]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-purple" />
      </div>
    );
  if (error)
    return (
      <div className="bg-red-100 text-red-700 p-6 rounded-lg">
        <h2 className="font-bold">{t("analytics.error")}</h2>
        <p>{error}</p>
      </div>
    );
  if (!analytics) return <p>{t("analytics.noData")}</p>;

  const { kpis, bookingsOverTime, servicePopularity } = analytics;

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-6">
        {t("analytics.title")}
      </h1>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-text-muted">
            {t("analytics.totalEarnings")}
          </p>
          <p className="text-3xl font-bold">
            ₦{kpis.totalEarnings.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-text-muted">{t("analytics.newClients")}</p>
          <p className="text-3xl font-bold">{kpis.newClients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-text-muted">
            {t("analytics.completedAppointments")}
          </p>
          <p className="text-3xl font-bold">{kpis.completedAppointments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-text-muted">
            {t("analytics.averageRating")}
          </p>
          <p className="text-3xl font-bold flex items-center">
            {kpis.avgRating} <FaStar className="ml-2 text-yellow-400" />
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm h-96">
          <h2 className="font-bold mb-4">{t("analytics.bookingsOverTime")}</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={bookingsOverTime}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <XAxis dataKey="month" tick={{ fill: "#6B7280" }} />
              <YAxis tick={{ fill: "#6B7280" }} />
              <Tooltip cursor={{ fill: "rgba(139, 92, 246, 0.1)" }} />
              <Legend />
              <Bar dataKey="bookings" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm h-96">
          <h2 className="font-bold mb-4">{t("analytics.servicePopularity")}</h2>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={servicePopularity}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalonAnalyticsPage;
