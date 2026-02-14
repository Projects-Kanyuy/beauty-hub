"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCalendarPlus,
  FaRegComments,
  FaRegStar,
  FaSpinner,
  FaPlus,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  useActiveSubscription,
  useMySalon,
  useSalonAppointments,
} from "../api/swr";
import AlertBox from "../components/AlertBox";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

const SalonDashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Fetch Subscription Data
  const {
    data: subscriptionData,
    isLoading: loadingSubscription,
    error: subscriptionError,
  } = useActiveSubscription(user?._id);
  
  const hasActiveSubscription = !!subscriptionData?.data;

  // 2. Fetch Salon Data (Now returns null if no salon exists)
  const {
    data: salonData,
    isLoading: loadingSalon,
    error: salonError,
  } = useMySalon();

  // 3. Fetch Appointments (Only if salon exists)
  const {
    data: appointments = [],
    isLoading: loadingAppointments,
    error: appointmentsError,
  } = useSalonAppointments(salonData?._id);

  const loading = loadingSubscription || loadingSalon || loadingAppointments;
  
  // Only count as an error if it's NOT a 404/Null case
  const hasActualError = subscriptionError || (salonError && salonError.status !== 404) || appointmentsError;

  // NEW LOGIC: Salon doesn't exist if data is null or we get a 404
  const needsToCreateProfile = !salonData || salonError?.status === 404;

  const todayAppointments = useMemo(
    () =>
      appointments?.filter(
        (a) =>
          new Date(a.startTime || a.appointmentDateTime).toDateString() ===
          new Date().toDateString(),
      ) || [],
    [appointments],
  );

  const pendingRequests = useMemo(
    () => appointments?.filter((a) => a.status === "Pending") || [],
    [appointments],
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary-purple" />
      </div>
    );

  // If there is an actual system error (Server Down / 500)
  if (hasActualError)
    return (
      <div className="p-10">
        <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-[2rem] shadow-sm">
          <h2 className="font-bold text-2xl">{t("salondashboard.errorTitle")}</h2>
          <p className="mt-2 text-lg">{t("salondashboard.errorLoad")}</p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Try Refreshing
          </Button>
        </div>
      </div>
    );

  // IF NO SALON EXISTS: Show "Create Profile" view instead of an error
  if (needsToCreateProfile) {
    return (
      <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 text-primary-purple text-3xl">
          <FaPlus />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter text-gray-900 mb-4">
          Ready to launch?
        </h1>
        <p className="text-gray-500 text-lg max-w-md mb-10 leading-relaxed">
          You haven't set up your salon profile yet. Create it now to start receiving bookings.
        </p>
        <Link
          to="/become-salon-owner"
          className="bg-primary-purple text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
        >
          {t("salondashboard.createProfile")}
        </Link>
      </div>
    );
  }

  // NORMAL DASHBOARD VIEW
  return (
    <div className="p-6 md:p-10 space-y-10">
      {/* Premium Welcome Header */}
      <div className="bg-gradient-to-r from-primary-purple to-purple-600 text-white p-10 rounded-[2.5rem] shadow-lg">
        <h1 className="text-4xl font-bold tracking-tight">
          {t("salondashboard.welcomeBack", {
            name: salonData?.name || user?.name,
          })}
        </h1>
        <p className="opacity-80 mt-2 text-lg">{t("salondashboard.summary")}</p>
      </div>

      {/* Subscription Alert */}
      {!hasActiveSubscription && (
        <AlertBox
          title={t("salondashboard.noSubscription")}
          message={t("salondashboard.subscribeToUnlock")}
          type="warning"
          actionLabel={t("salondashboard.choosePlan")}
          actionLink="/subscriptions"
        />
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: t("salondashboard.todaysBookings"),
            value: todayAppointments.length,
          },
          {
            label: t("salondashboard.pendingRequests"),
            value: pendingRequests.length,
          },
          { label: t("salondashboard.totalEarnings"), value: "—" },
          { label: t("salondashboard.newReviews"), value: salonData?.reviews?.length || 0 },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all"
          >
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">{stat.label}</p>
            <p className="text-4xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Appointments + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Appointments Card */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {t("salondashboard.todaysAppointments")}
            </h2>
            <Link
              to="/salon-owner/appointments"
              className="text-primary-purple font-bold text-sm hover:underline"
            >
              {t("salondashboard.viewCalendar")}
            </Link>
          </div>

          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appt) => (
                <div
                  key={appt._id}
                  className="flex items-center p-5 bg-gray-50 rounded-[1.5rem] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100"
                >
                  <div className="bg-primary-purple text-white px-4 py-2 rounded-xl font-bold text-sm">
                    {new Date(appt.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  <div className="ml-5 flex-1">
                    <p className="font-bold text-gray-900">{appt.customer?.name}</p>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{appt.serviceName}</p>
                  </div>

                  <span
                    className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
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
              <div className="py-20 text-center">
                <p className="text-gray-400 font-medium italic">
                  {t("salondashboard.noAppointments")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Messages */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-bold tracking-tight mb-8">
              {t("salondashboard.quickActions")}
            </h2>

            <div className="space-y-3">
              {[
                {
                  icon: FaCalendarPlus,
                  label: t("salondashboard.addBooking"),
                  link: "/salon-owner/profile",
                },
                {
                  icon: FaRegComments,
                  label: t("salondashboard.replyMessages"),
                  link: "/salon-owner/messages",
                },
                {
                  icon: FaRegStar,
                  label: t("salondashboard.respondReviews"),
                  link: "/salon-owner/reviews",
                },
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.link}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-primary-purple group-hover:text-white transition-all">
                    <action.icon />
                  </div>
                  <span className="font-bold text-gray-700">{action.label}</span>
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