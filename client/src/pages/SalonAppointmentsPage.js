// src/pages/SalonAppointmentsPage.js
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid/index.js";
import timeGridPlugin from "@fullcalendar/timegrid/index.js";
import interactionPlugin from "@fullcalendar/interaction/index.js";
import {
  fetchMySalon,
  fetchSalonAppointments,
  updateAppointmentStatus,
} from "../api"; // Use the correct API function
import { toast } from "react-toastify"; // Import toast
import { FaCheckCircle, FaQuestionCircle, FaSpinner } from "react-icons/fa";
import Button from "../components/Button";

const SalonAppointmentsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get the salon ID
      const { data: salon } = await fetchMySalon();
      if (!salon) throw new Error("Salon profile not found.");

      // 2. Fetch appointments for that salon
      const { data: appointments } = await fetchSalonAppointments(salon._id);

      // 3. Format appointments for FullCalendar
      const formattedEvents = appointments.map((appt) => ({
        id: appt._id,
        title: `${appt.customer.name} - ${appt.serviceName}`,
        start: appt.startTime,
        end: appt.endTime,
        extendedProps: {
          ...appt, // Pass all original appointment data
        },
        // Color-code events based on status
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
      setError(err.response?.data?.message || "Failed to load appointments.");
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
      // --- THIS IS THE FIX ---
      // Call the specific updateAppointmentStatus function
      await updateAppointmentStatus(selectedEvent._id, { status: "Confirmed" });

      // Update local state for immediate UI feedback
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === selectedEvent._id
            ? { ...e, backgroundColor: "#10B981", borderColor: "#10B981" }
            : e
        )
      );
      setSelectedEvent((prev) => ({ ...prev, status: "Confirmed" }));

      // --- REPLACE alert() WITH toast.success() ---
      toast.success("Appointment Confirmed!");
    } catch (error) {
      console.error("Failed to confirm appointment:", error);
      // --- REPLACE alert() WITH toast.error() ---
      toast.error("Failed to confirm appointment.");
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
        <h2 className="font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-6">
        Appointments Calendar
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
          <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
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
                <span>Status: {selectedEvent.status}</span>
              </p>
              <div className="border-t pt-4 space-y-3 text-text-muted">
                <p>
                  <strong>Service:</strong> {selectedEvent.serviceName}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
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
                    Confirm
                  </Button>
                )}
                <Button variant="secondary" className="!py-2 flex-1">
                  Reschedule
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-text-muted py-10">
              <p>Click on an appointment to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalonAppointmentsPage;
