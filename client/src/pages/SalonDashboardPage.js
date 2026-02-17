"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaCalendarPlus, FaRegComments, FaRegStar, FaSpinner, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useActiveSubscription, useMySalon, useSalonAppointments } from "../api/swr";
import AlertBox from "../components/AlertBox";
import { useAuth } from "../context/AuthContext";

const SalonDashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: subscriptionData, isLoading: loadingSubscription } = useActiveSubscription(user?._id);
  const hasActiveSubscription = !!subscriptionData?.data;

  const { data: salonData, isLoading: loadingSalon, error: salonError } = useMySalon();

  const { data: appointments = [], isLoading: loadingAppointments } = useSalonAppointments(salonData?._id);

  const loading = loadingSubscription || loadingSalon || loadingAppointments;
  const needsToCreateProfile = !salonData || salonError?.status === 404;

  const todayAppointments = useMemo(() =>
      appointments?.filter((a) => 
        new Date(a.startTime || a.appointmentDateTime).toDateString() === new Date().toDateString()
      ) || [], [appointments]
  );

  const pendingRequests = useMemo(() => 
    appointments?.filter((a) => a.status === "Pending") || [], [appointments]
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <FaSpinner className="animate-spin text-4xl text-primary-purple" />
    </div>
  );

  if (needsToCreateProfile) {
    return (
      <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 text-primary-purple text-3xl"><FaPlus /></div>
        <h1 className="text-4xl font-bold tracking-tighter text-gray-900 mb-4">Ready to launch?</h1>
        <p className="text-gray-500 text-lg max-w-md mb-10 leading-relaxed">You haven't set up your salon profile yet. Create it now to start receiving bookings.</p>
        <Link to="/salon-owner/profile" className="bg-primary-purple text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all">
          {t("salondashboard.createProfile")}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10">
      <div className="bg-gradient-to-r from-primary-purple to-purple-600 text-white p-8 rounded-3xl shadow-lg">
        <h1 className="text-4xl font-semibold">{t("salondashboard.welcomeBack", { name: salonData?.name || user?.name })}</h1>
        <p className="opacity-90 mt-2 text-lg">{t("salondashboard.summary")}</p>
      </div>

      {!hasActiveSubscription && (
        <AlertBox title={t("salondashboard.noSubscription")} message={t("salondashboard.subscribeToUnlock")} type="warning" actionLabel={t("salondashboard.choosePlan")} actionLink="/subscriptions" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t("salondashboard.todaysBookings"), value: todayAppointments.length },
          { label: t("salondashboard.pendingRequests"), value: pendingRequests.length },
          { label: t("salondashboard.totalEarnings"), value: "$——" },
          { label: t("salondashboard.newReviews"), value: salonData?.reviews?.length || 0 },
        ].map((stat, i) => (
          <div key={i} className="backdrop-blur-lg bg-white/70 hover:bg-white/100 transition-all border border-gray-200/50 rounded-3xl p-6 shadow-sm hover:shadow-xl">
            <p className="text-gray-500 mb-2">{stat.label}</p>
            <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 backdrop-blur-xl bg-white/70 rounded-3xl shadow-md p-8 border border-gray-200/40">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">{t("salondashboard.todaysAppointments")}</h2>
            <Link to="/salon-owner/appointments" className="text-primary-purple font-semibold hover:underline">{t("salondashboard.viewCalendar")}</Link>
          </div>
          <div className="space-y-4">
            {todayAppointments.length > 0 ? todayAppointments.map((appt) => (
              <div key={appt._id} className="flex items-center p-4 bg-gray-50/70 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="bg-primary-purple text-white px-4 py-2 rounded-xl font-bold">
                  {new Date(appt.startTime || appt.appointmentDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-semibold text-lg">{appt.customer?.name || appt.clientName}</p>
                  <p className="text-gray-500 text-sm">{appt.serviceName}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${appt.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {appt.status}
                </span>
              </div>
            )) : <p className="text-gray-500 text-center py-10 text-lg">{t("salondashboard.noAppointments")}</p>}
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-md p-8 border border-gray-200/40">
            <h2 className="text-2xl font-semibold mb-6">{t("salondashboard.quickActions")}</h2>
            <div className="space-y-4">
              {[
                { icon: FaCalendarPlus, label: t("salondashboard.addBooking"), link: "/salon-owner/profile" },
                { icon: FaRegComments, label: t("salondashboard.replyMessages"), link: "/salon-owner/messages" },
                { icon: FaRegStar, label: t("salondashboard.respondReviews"), link: "/salon-owner/reviews" },
              ].map((action, i) => (
                <Link key={i} to={action.link} className="flex items-center space-x-4 p-4 hover:bg-gray-100 rounded-xl transition font-medium">
                  <action.icon className="text-primary-purple text-xl" />
                  <span className="text-lg">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonDashboardPage;