import { useTranslation } from "react-i18next";
import {
  FaCalendarPlus,
  FaCog,
  FaHistory,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaRegCommentDots,
  FaRegHeart,
  FaSearch,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import DashboardPanel from "../components/DashboardPanel";
import QuickActionCard from "../components/QuickActionCard";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { mockDashboardData } from "../data/mockData";

const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { stats, recentActivity } = mockDashboardData;
  const hasBookings = false;
  const hasFavorites = false;

  const quickActions = [
    {
      icon: FaSearch,
      label: t("dashboard.findSalons"),
      description: t("dashboard.findSalonsDesc"),
      link: "/explore",
    },
    {
      icon: FaCalendarPlus,
      label: t("dashboard.bookAppointment"),
      description: t("dashboard.bookAppointmentDesc"),
      link: "/explore",
    },
    {
      icon: FaRegCommentDots,
      label: t("dashboard.messages"),
      description: t("dashboard.messagesDesc", { count: 2 }),
      link: "/messages",
      notificationCount: 2,
    },
    {
      icon: FaMapMarkedAlt,
      label: t("dashboard.nearMe"),
      description: t("dashboard.nearMeDesc"),
      link: "/near-me",
    },
  ];

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-main">
              {t("dashboard.welcomeBack", {
                name: user?.name || t("dashboard.beautyLover"),
              })}{" "}
              ✨
            </h1>
            <p className="flex items-center space-x-2 text-text-muted mt-1">
              <FaMapMarkerAlt />
              <span>
                {t("dashboard.location", {
                  city: "Douala",
                  country: "Cameroon",
                })}
              </span>
            </p>
          </div>
          <Link
            to="/settings"
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border hover:bg-gray-50 mt-4 sm:mt-0"
          >
            <FaCog />
            <span>{t("dashboard.settings")}</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              label={t(`dashboard.stats.${stat.label}`)}
              value={stat.value}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-text-main mb-4">
          {t("dashboard.quickActions")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action) => (
            <QuickActionCard key={action.label} {...action} />
          ))}
        </div>

        {/* Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DashboardPanel
            title={t("dashboard.recentBookings")}
            viewAllLink="/bookings"
            icon={FaRegCalendarAlt}
          >
            {!hasBookings ? (
              <div className="text-center py-8">
                <FaRegCalendarAlt className="text-5xl text-gray-300 mx-auto mb-3" />
                <p className="text-text-muted mb-4">
                  {t("dashboard.noBookings")}
                </p>
                <Link to="/explore">
                  <Button variant="gradient" className="!py-2">
                    {t("dashboard.bookFirstAppointment")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div>{/* Logic to show bookings */}</div>
            )}
          </DashboardPanel>

          <DashboardPanel
            title={t("dashboard.favoriteSalons")}
            viewAllLink="/favorites"
            icon={FaRegHeart}
          >
            {!hasFavorites ? (
              <div className="text-center py-8">
                <FaRegHeart className="text-5xl text-gray-300 mx-auto mb-3" />
                <p className="text-text-muted mb-4">
                  {t("dashboard.noFavorites")}
                </p>
                <Link to="/explore">
                  <Button variant="secondary" className="!py-2">
                    {t("dashboard.discoverSalons")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div>{/* Logic to show favorites */}</div>
            )}
          </DashboardPanel>
        </div>

        <DashboardPanel title={t("dashboard.recentActivity")} icon={FaHistory}>
          <ul className="space-y-4">
            {recentActivity.map((activity, index) => (
              <li key={index} className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-full bg-gray-100 ${activity.color}`}
                >
                  <activity.icon />
                </div>
                <div className="flex-grow">
                  <p className="text-text-main">{activity.text}</p>
                </div>
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
