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
  fetchMySalon,
  fetchSalonAppointments,
  updateAppointmentStatus,
} from "../api";
import Button from "../components/Button";

const SalonAppointmentsPage = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: salon } = await fetchMySalon();
      if (!salon) throw new Error(t("appointments.errorNoSalon"));

      const { data: appointments } = await fetchSalonAppointments(salon._id);

      const formattedEvents = appointments.map((appt) => ({
        id: appt._id,
        title: `${appt.customer.name} - ${appt.serviceName}`,
        start: appt.startTime,
        end: appt.endTime,
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
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t("appointments.errorLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

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
  if (error)
    return (
      <div className="bg-red-100 text-red-700 p-6 rounded-lg">
        <h2 className="font-bold">{t("appointments.error")}</h2>
        <p>{error}</p>
      </div>
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
