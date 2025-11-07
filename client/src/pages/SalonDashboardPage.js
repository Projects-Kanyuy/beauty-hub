// src/pages/SalonDashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMySalon, fetchSalonAppointments } from '../api';
import { FaCalendarPlus, FaRegComments, FaRegStar, FaSpinner } from 'react-icons/fa';

const SalonDashboardPage = () => {
  const { user } = useAuth();
  const [salonData, setSalonData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) { setLoading(false); return; }
      try {
        setLoading(true);
        setError(null);
        const { data: salon } = await fetchMySalon();
        setSalonData(salon);
        const { data: appts } = await fetchSalonAppointments(salon._id);
        setAppointments(appts);
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [user]);

  if (loading) return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-4xl text-primary-purple" /></div>;
  
  if (error) {
     return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
        <h2 className="font-bold text-xl">Error Loading Dashboard</h2>
        <p className="mt-2">{error}</p>
        {error.includes('not found') && (
          <Link to="/salon-owner/profile" className="mt-4 inline-block bg-primary-purple text-white px-4 py-2 rounded-md font-semibold hover:opacity-90">
            Create Your Salon Profile
          </Link>
        )}
      </div>
     );
  }

  const todayAppointments = appointments.filter(a => new Date(a.startTime).toDateString() === new Date().toDateString());
  const pendingRequests = appointments.filter(a => a.status === 'Pending');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main">Welcome back, {salonData?.name || user?.name}!</h1>
        <p className="text-text-muted">Here's a summary of your salon's activity today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm"><p className="text-sm text-text-muted">Today's Bookings</p><p className="text-3xl font-bold text-text-main">{todayAppointments.length}</p></div>
        <div className="bg-white p-6 rounded-lg shadow-sm"><p className="text-sm text-text-muted">Pending Requests</p><p className="text-3xl font-bold text-text-main">{pendingRequests.length}</p></div>
        <div className="bg-white p-6 rounded-lg shadow-sm"><p className="text-sm text-text-muted">Total Earnings (Month)</p><p className="text-3xl font-bold text-gray-400">...</p></div>
        <div className="bg-white p-6 rounded-lg shadow-sm"><p className="text-sm text-text-muted">New Reviews</p><p className="text-3xl font-bold text-gray-400">...</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Today's Appointments</h2>
            <Link to="/salon-owner/appointments" className="text-sm font-semibold text-primary-purple hover:underline">View Calendar</Link>
          </div>
          <div className="space-y-4">
            {todayAppointments.length > 0 ? todayAppointments.map((appt) => (
              <div key={appt._id} className="flex items-center p-3 bg-gray-50 rounded-md">
                <div className="bg-primary-purple text-white font-bold text-sm px-3 py-2 rounded-md">{new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                <div className="ml-4 flex-grow">
                  <p className="font-semibold text-text-main">{appt.customer.name}</p>
                  <p className="text-sm text-text-muted">{appt.serviceName}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${appt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{appt.status}</span>
              </div>
            )) : <p className="text-text-muted py-8 text-center">No appointments scheduled for today.</p>}
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/salon-owner/profile" className="flex items-center space-x-3 p-3 bg-gray-100 rounded-md hover:bg-gray-200"><FaCalendarPlus className="text-primary-purple" /> <span>Add a Walk-in Booking</span></Link>
              <Link to="/salon-owner/messages" className="flex items-center space-x-3 p-3 bg-gray-100 rounded-md hover:bg-gray-200"><FaRegComments className="text-primary-purple" /> <span>Reply to Messages</span></Link>
              <Link to="/salon-owner/reviews" className="flex items-center space-x-3 p-3 bg-gray-100 rounded-md hover:bg-gray-200"><FaRegStar className="text-primary-purple" /> <span>Respond to Reviews</span></Link>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
             <h2 className="text-xl font-bold mb-4">Recent Messages</h2>
             <div className="space-y-3 text-center text-text-muted py-4"><p>No new messages.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonDashboardPage;