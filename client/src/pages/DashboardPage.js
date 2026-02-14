import { useTranslation } from "react-i18next";
import {
  FaCalendarPlus,
  FaCog,
  FaHistory,
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
      icon: FaMapMarkerAlt,
      label: t("dashboard.nearMe"),
      description: t("dashboard.nearMeDesc"),
      link: "/near-me",
    },
  ];

  return (
    <div className="bg-gray-100 p-4 sm:p-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-main">
              {t("dashboard.welcomeBack", {
                name: user?.name || t("dashboard.beautyLover"),
              })}{" "}
              ✨
            </h1>
            <p className="flex items-center space-x-1 text-text-muted text-sm mt-1">
              <FaMapMarkerAlt className="text-sm" />
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
            className="flex items-center space-x-1 bg-white px-3 py-2 rounded-lg shadow-sm border hover:bg-gray-50 mt-3 sm:mt-0 text-sm"
          >
            <FaCog className="text-sm" />
            <span>{t("dashboard.settings")}</span>
          </Link>
        </div>

        {/* Stats - horizontal scroll for mobile */}
        <div className="flex space-x-4 overflow-x-auto mb-6 py-2">
          {stats.map((stat) => (
            <div key={stat.label} className="flex-shrink-0 w-40">
              <StatCard
                icon={stat.icon}
                label={t(`dashboard.stats.${stat.label}`)}
                value={stat.value}
              />
            </div>
          ))}
        </div>

        {/* Quick Actions - swipeable on mobile */}
        <h2 className="text-lg font-bold text-text-main mb-2">
          {t("dashboard.quickActions")}
        </h2>
        <div className="flex space-x-4 overflow-x-auto py-2 mb-6">
          {quickActions.map((action) => (
            <div key={action.label} className="flex-shrink-0 w-48">
              <QuickActionCard {...action} />
            </div>
          ))}
        </div>

        {/* Panels */}
        <div className="flex flex-col space-y-6 mb-6">
          <DashboardPanel
            title={t("dashboard.recentBookings")}
            viewAllLink="/bookings"
            icon={FaRegCalendarAlt}
          >
            {!hasBookings ? (
              <div className="text-center py-4 px-2">
                <FaRegCalendarAlt className="text-4xl sm:text-5xl text-gray-300 mx-auto mb-2" />
                <p className="text-text-muted mb-3 text-sm sm:text-base">
                  {t("dashboard.noBookings")}
                </p>
                <Link to="/explore">
                  <Button
                    variant="gradient"
                    className="w-full sm:w-auto py-2 sm:py-3"
                  >
                    {t("dashboard.bookFirstAppointment")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div>{/* Bookings logic */}</div>
            )}
          </DashboardPanel>

          <DashboardPanel
            title={t("dashboard.favoriteSalons")}
            viewAllLink="/favorites"
            icon={FaRegHeart}
          >
            {!hasFavorites ? (
              <div className="text-center py-4 px-2">
                <FaRegHeart className="text-4xl sm:text-5xl text-gray-300 mx-auto mb-2" />
                <p className="text-text-muted mb-3 text-sm sm:text-base">
                  {t("dashboard.noFavorites")}
                </p>
                <Link to="/explore">
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto py-2 sm:py-3"
                  >
                    {t("dashboard.discoverSalons")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div>{/* Favorites logic */}</div>
            )}
          </DashboardPanel>

          <DashboardPanel
            title={t("dashboard.recentActivity")}
            icon={FaHistory}
          >
            <ul className="space-y-3">
              {recentActivity.map((activity, index) => (
                <li
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-3"
                >
                  <div
                    className={`p-2 rounded-full bg-gray-100 ${activity.color}`}
                  >
                    <activity.icon className="text-sm sm:text-base" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-text-main text-sm sm:text-base">
                      {activity.text}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-text-muted">
                    {activity.time}
                  </p>
                </li>
              ))}
            </ul>
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
