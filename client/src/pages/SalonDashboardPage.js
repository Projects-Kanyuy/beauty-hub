// src/pages/SalonDashboardPage.js
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCalendarPlus,
  FaRegComments,
  FaRegStar,
  FaSpinner,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchMySalon, fetchSalonAppointments } from "../api";
import { useAuth } from "../context/AuthContext";

const SalonDashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [salonData, setSalonData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const { data: salon } = await fetchMySalon();
        setSalonData(salon);
        const { data: appts } = await fetchSalonAppointments(salon._id);
        setAppointments(appts);
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError(err.response?.data?.message || t("salondashboard.errorLoad"));
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [user, t]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-purple" />
      </div>
    );

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
        <h2 className="font-bold text-xl">{t("salondashboard.errorTitle")}</h2>
        <p className="mt-2">{error}</p>
        {error.includes("not found") && (
          <Link
            to="/salon-owner/profile"
            className="mt-4 inline-block bg-primary-purple text-white px-4 py-2 rounded-md font-semibold hover:opacity-90"
          >
            {t("salondashboard.createProfile")}
          </Link>
        )}
      </div>
    );
  }

  const todayAppointments = appointments.filter(
    (a) => new Date(a.startTime).toDateString() === new Date().toDateString()
  );
  const pendingRequests = appointments.filter((a) => a.status === "Pending");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main">
          {t("salondashboard.welcomeBack", {
            name: salonData?.name || user?.name,
          })}
        </h1>
        <p className="text-text-muted">{t("salondashboard.summary")}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-text-muted">
            {t("salondashboard.todaysBookings")}
          </p>
          <p className="text-3xl font-bold text-text-main">
            {todayAppointments.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-text-muted">
            {t("salondashboard.pendingRequests")}
          </p>
          <p className="text-3xl font-bold text-text-main">
            {pendingRequests.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-text-muted">
            {t("salondashboard.totalEarnings")}
          </p>
          <p className="text-3xl font-bold text-gray-400">...</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-text-muted">
            {t("salondashboard.newReviews")}
          </p>
          <p className="text-3xl font-bold text-gray-400">...</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {t("salondashboard.todaysAppointments")}
            </h2>
            <Link
              to="/salon-owner/appointments"
              className="text-sm font-semibold text-primary-purple hover:underline"
            >
              {t("salondashboard.viewCalendar")}
            </Link>
          </div>
          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appt) => (
                <div
                  key={appt._id}
                  className="flex items-center p-3 bg-gray-50 rounded-md"
                >
                  <div className="bg-primary-purple text-white font-bold text-sm px-3 py-2 rounded-md">
                    {new Date(appt.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="font-semibold text-text-main">
                      {appt.customer.name}
                    </p>
                    <p className="text-sm text-text-muted">
                      {appt.serviceName}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      appt.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-text-muted py-8 text-center">
                {t("salondashboard.noAppointments")}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">
              {t("salondashboard.quickActions")}
            </h2>
            <div className="space-y-3">
              <Link
                to="/salon-owner/profile"
                className="flex items-center space-x-3 p-3 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <FaCalendarPlus className="text-primary-purple" />{" "}
                <span>{t("salondashboard.addBooking")}</span>
              </Link>
              <Link
                to="/salon-owner/messages"
                className="flex items-center space-x-3 p-3 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <FaRegComments className="text-primary-purple" />{" "}
                <span>{t("salondashboard.replyMessages")}</span>
              </Link>
              <Link
                to="/salon-owner/reviews"
                className="flex items-center space-x-3 p-3 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <FaRegStar className="text-primary-purple" />{" "}
                <span>{t("salondashboard.respondReviews")}</span>
              </Link>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">
              {t("salondashboard.recentMessages")}
            </h2>
            <div className="space-y-3 text-center text-text-muted py-4">
              <p>{t("salondashboard.noNewMessages")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonDashboardPage;
