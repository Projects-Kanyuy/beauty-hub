// src/pages/DashboardPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt, FaCog, FaSearch, FaCalendarPlus, FaRegCommentDots, FaMapMarkedAlt, FaRegCalendarAlt, FaRegHeart, FaHistory } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import QuickActionCard from '../components/QuickActionCard';
import DashboardPanel from '../components/DashboardPanel';
import Button from '../components/Button';
import { mockDashboardData } from '../data/mockData';

const DashboardPage = () => {
  const { user } = useAuth();
  const { stats, recentActivity } = mockDashboardData;
  const hasBookings = false;
  const hasFavorites = false;

  const quickActions = [
    { icon: FaSearch, label: 'Find Salons', description: 'Discover new salons near you', link: '/explore' },
    { icon: FaCalendarPlus, label: 'Book Appointment', description: 'Schedule your next beauty session', link: '/explore' },
    { icon: FaRegCommentDots, label: 'Messages', description: '2 new messages', link: '/messages', notificationCount: 2 },
    { icon: FaMapMarkedAlt, label: 'Near Me', description: 'Salons in your area', link: '/near-me' },
  ];

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-main">Welcome back, {user?.name || 'Beauty Lover'}! ✨</h1>
            <p className="flex items-center space-x-2 text-text-muted mt-1"><FaMapMarkerAlt /><span>Douala, Cameroon</span></p>
          </div>
          <Link to="/settings" className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border hover:bg-gray-50 mt-4 sm:mt-0"><FaCog /><span>Settings</span></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map(stat => (
            <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
          ))}
        </div>
        <h2 className="text-xl font-bold text-text-main mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {quickActions.map(action => (
            <QuickActionCard key={action.label} {...action} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DashboardPanel title="Recent Bookings" viewAllLink="/bookings" icon={FaRegCalendarAlt}>
            {!hasBookings ? (
              <div className="text-center py-8">
                <FaRegCalendarAlt className="text-5xl text-gray-300 mx-auto mb-3" />
                <p className="text-text-muted mb-4">No bookings yet</p>
                <Link to="/explore"><Button variant="gradient" className="!py-2">Book Your First Appointment</Button></Link>
              </div>
            ) : ( <div>{/* Logic to show bookings */}</div> )}
          </DashboardPanel>
          <DashboardPanel title="Favorite Salons" viewAllLink="/favorites" icon={FaRegHeart}>
             {!hasFavorites ? (
              <div className="text-center py-8">
                <FaRegHeart className="text-5xl text-gray-300 mx-auto mb-3" />
                <p className="text-text-muted mb-4">No favorites yet</p>
                <Link to="/explore"><Button variant="secondary" className="!py-2">Discover Salons</Button></Link>
              </div>
            ) : ( <div>{/* Logic to show favorites */}</div> )}
          </DashboardPanel>
        </div>
        <DashboardPanel title="Recent Activity" icon={FaHistory}>
          <ul className="space-y-4">
            {recentActivity.map((activity, index) => (
              <li key={index} className="flex items-center space-x-4">
                <div className={`p-3 rounded-full bg-gray-100 ${activity.color}`}><activity.icon /></div>
                <div className="flex-grow"><p className="text-text-main">{activity.text}</p></div>
                <p className="text-sm text-text-muted">{activity.time}</p>
              </li>
            ))}
          </ul>
        </DashboardPanel>
      </div>
    </div>
  );
};

export default DashboardPage;