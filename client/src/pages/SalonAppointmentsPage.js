// src/pages/SalonAppointmentsPage.js
import dayGridPlugin from "@fullcalendar/daygrid/index.js";
import interactionPlugin from "@fullcalendar/interaction/index.js";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid/index.js";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaQuestionCircle, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  updateAppointmentStatus,
} from "../api";
import { useActiveSubscription, useMySalon, useSalonAppointments } from "../api/swr";
import AlertBox from "../components/AlertBox";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const SalonAppointmentsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const {
    data: subscriptionData,
    isLoading: loadingSubscription,
  } = useActiveSubscription(user?._id);
  const { data: salon, isLoading: loadingSalon } = useMySalon();
  const {
    data: appointments = [],
    isLoading: loadingAppointments,
    error,
  } = useSalonAppointments(salon?._id);
  const loading = loadingSubscription || loadingSalon || loadingAppointments;
  const hasActiveSubscription = !!subscriptionData?.data;

  useEffect(() => {
    if (!appointments) return;
    const formattedEvents = appointments.map((appt) => ({
      id: appt._id,
      title: `${appt.customer?.name || appt.clientName} - ${appt.serviceName || "Service"}`,
      start: appt.startTime || appt.appointmentDateTime,
      end: appt.endTime || appt.appointmentDateTime,
      extendedProps: { ...appt },
      backgroundColor:
        appt.status === "Confirmed"
          ? "#10B981"
          : appt.status === "Pending"
          ? "#F59E0B"
          : "#EF4444",
      borderColor:
        appt.status === "Confirmed"
          ? "#10B981"
          : appt.status === "Pending"
          ? "#F59E0B"
          : "#EF4444",
    }));
    setEvents(formattedEvents);
  }, [appointments]);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event.extendedProps);
  };

  const handleConfirm = async () => {
    if (!selectedEvent) return;
    try {
      await updateAppointmentStatus(selectedEvent._id, { status: "Confirmed" });

      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === selectedEvent._id
            ? { ...e, backgroundColor: "#10B981", borderColor: "#10B981" }
            : e
        )
      );
      setSelectedEvent((prev) => ({ ...prev, status: "Confirmed" }));
      toast.success(t("appointments.confirmed"));
    } catch (error) {
      console.error("Failed to confirm appointment:", error);
      toast.error(t("appointments.confirmFailed"));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-purple" />
      </div>
    );
  if (!hasActiveSubscription)
    return (
      <AlertBox
        title={t("salondashboard.noSubscription")}
        message={t("appointments.subscriptionRequired")}
        type="warning"
        actionLabel={t("salondashboard.choosePlan")}
        actionLink="/subscriptions"
      />
    );
  if (error)
    return (
      <AlertBox
        title={t("appointments.error")}
        message={t("appointments.errorLoad")}
        type="error"
        onRetry={() => window.location.reload()}
      />
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-6">
        {t("appointments.title")}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            eventClick={handleEventClick}
            height="auto"
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">
            {t("appointments.details")}
          </h2>
          {selectedEvent ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                {selectedEvent.customer.name}
              </h3>
              <p
                className={`flex items-center space-x-2 text-sm font-semibold ${
                  selectedEvent.status === "Confirmed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {selectedEvent.status === "Confirmed" ? (
                  <FaCheckCircle />
                ) : (
                  <FaQuestionCircle />
                )}
                <span>
                  {t("appointments.status")}: {selectedEvent.status}
                </span>
              </p>
              <div className="border-t pt-4 space-y-3 text-text-muted">
                <p>
                  <strong>{t("appointments.service")}:</strong>{" "}
                  {selectedEvent.serviceName}
                </p>
                <p>
                  <strong>{t("appointments.time")}:</strong>{" "}
                  {new Date(selectedEvent.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(selectedEvent.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="border-t pt-4 flex space-x-2">
                {selectedEvent.status === "Pending" && (
                  <Button
                    variant="gradient"
                    className="!py-2 flex-1"
                    onClick={handleConfirm}
                  >
                    {t("appointments.confirm")}
                  </Button>
                )}
                <Button variant="secondary" className="!py-2 flex-1">
                  {t("appointments.reschedule")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-text-muted py-10">
              <p>{t("appointments.clickToView")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalonAppointmentsPage;
