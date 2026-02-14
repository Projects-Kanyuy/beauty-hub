// src/App.js
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SWRConfig } from "swr";
import { getActiveSubscription } from "./api";
import { useAuth } from "./context/AuthContext";

// --- Layouts & Protected Routes ---
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import SalonOwnerLayout from "./components/SalonOwnerLayout";
import CustomerProtectedRoute from "./components/routing/CustomerProtectedRoute";
import SalonOwnerProtectedRoute from "./components/routing/SalonOwnerProtectedRoute";
import AdminProtectedRoute from "./components/routing/AdminProtectedRoute";

// --- Pages ---
import AdminLayout from "./components/AdminLayout";
import FloatingActions from "./components/FloatingActions";
import AboutPage from "./pages/AboutPage";
import AdminAppointments from "./pages/AdminAppointments";
import AdminCoupons from "./pages/AdminCoupons";
import AdminOverview from "./pages/AdminOverview";
import AdminPayments from "./pages/AdminPayments";
import AdminPlans from "./pages/AdminPlans";
import AdminSalons from "./pages/AdminSalons";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import AdminUsers from "./pages/AdminUsers";
import BeautyTipsPage from "./pages/BeautyTipsPage";
import BecomeSalonOwnerPage from "./pages/BecomeSalonOwnerPage";
import ComparePage from "./pages/ComparePage";
import ContactPage from "./pages/ContactPage";
import CustomerSettingsPage from "./pages/CustomerSettingsPage";
import DashboardPage from "./pages/DashboardPage";
import FavoritesPage from "./pages/FavoritesPage";
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import NearMePage from "./pages/NearMePage";
import PaymentPage from "./pages/PaymentPage";
import RegisterPage from "./pages/RegisterPage";
import SalonAnalyticsPage from "./pages/SalonAnalyticsPage";
import SalonAppointmentsPage from "./pages/SalonAppointmentsPage";
import SalonDashboardPage from "./pages/SalonDashboardPage";
import SalonDetailPage from "./pages/SalonDetailPage";
import SalonMessagesPage from "./pages/SalonMessagesPage";
import SalonProfilePage from "./pages/SalonProfilePage";
import SalonReviewsPage from "./pages/SalonReviewsPage";
import SalonServicesPage from "./pages/SalonServicesPage";
import SalonSettingsPage from "./pages/SalonSettingsPage";
import SalonsPage from "./pages/SalonsPage";
import Subscriptions from "./pages/Subscriptions";

// Layout for the main public/customer site
const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <>
      <Navbar isLoggedIn={!!user} user={user} handleLogout={logout} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
};

function App() {
  const { user, loading } = useAuth();
  const [activePlan, setActivePlan] = useState(null);
  // const location = useLocation();

  useEffect(() => {
    if (!user || user?.role !== "salon_owner") return;

    const getPlan = async () => {
      const plan = await getActiveSubscription(user?._id);
      console.log({ plan });
      setActivePlan(plan);
    };
    getPlan();
  }, [user]);

  // Show a loading screen while context is checking for a stored user
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        dedupingInterval: 15000,
        errorRetryCount: 2,
      }}
    >
      <div className="font-sans">
        <ScrollToTop />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />

        <Routes>
          {/* === PUBLIC ROUTES === */}
          <Route
            path="/"
            element={
              !user ? (
                <MainLayout>
                  <HomePage />
                </MainLayout>
              ) : (
                <Navigate
                  to={
                    user.role === "salon_owner" && activePlan
                      ? "/salon-owner/dashboard"
                      : "/subscriptions"
                  }
                  replace
                />
              )
            }
          />
          <Route
            path="/become-salon-owner"
            element={
              <MainLayout>
                <BecomeSalonOwnerPage />
              </MainLayout>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <MainLayout>
                <Subscriptions />
              </MainLayout>
            }
          />
          <Route
            path="/tips"
            element={
              <MainLayout>
                <BeautyTipsPage />
              </MainLayout>
            }
          />
          <Route
            path="/about"
            element={
              <MainLayout>
                <AboutPage />
              </MainLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <MainLayout>
                <ContactPage />
              </MainLayout>
            }
          />
          <Route
            path="/salons"
            element={
              <MainLayout>
                <SalonsPage />
              </MainLayout>
            }
          />
          <Route
            path="/salon/:id"
            element={
              <MainLayout>
                <SalonDetailPage />
              </MainLayout>
            }
          />
          <Route
            path="/payment"
            element={
              <MainLayout>
                <PaymentPage />
              </MainLayout>
            }
          />

          {/* === AUTH ROUTES (For logged-out users only) === */}
          <Route
            path="/login"
            element={
              <MainLayout>
                <LoginPage />
              </MainLayout>
            }
          />
          <Route
            path="/register"
            element={
              <MainLayout>
                <RegisterPage />
              </MainLayout>
            }
          />

          {/* === CUSTOMER PROTECTED ROUTES === */}
          <Route element={<CustomerProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <MainLayout>
                  <CustomerSettingsPage />
                </MainLayout>
              }
            />
            <Route
              path="/favorites"
              element={
                <MainLayout>
                  <FavoritesPage />
                </MainLayout>
              }
            />
            <Route
              path="/compare"
              element={
                <MainLayout>
                  <ComparePage />
                </MainLayout>
              }
            />
            <Route
              path="/near-me"
              element={
                <MainLayout>
                  <NearMePage />
                </MainLayout>
              }
            />
          </Route>

          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="overview" element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="salons" element={<AdminSalons />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="plans" element={<AdminPlans />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="coupons" element={<AdminCoupons />} />
            </Route>
          </Route>

          {/* === SALON OWNER PROTECTED ROUTES === */}
          <Route element={<SalonOwnerProtectedRoute />}>
            <Route
              path="/salon-owner/*"
              element={
                <SalonOwnerLayout>
                  <Routes>
                    <Route path="dashboard" element={<SalonDashboardPage />} />
                    <Route
                      path="appointments"
                      element={<SalonAppointmentsPage />}
                    />
                    <Route path="profile" element={<SalonProfilePage />} />
                    <Route path="services" element={<SalonServicesPage />} />
                    <Route path="messages" element={<SalonMessagesPage />} />
                    <Route path="reviews" element={<SalonReviewsPage />} />
                    <Route path="analytics" element={<SalonAnalyticsPage />} />
                    <Route path="settings" element={<SalonSettingsPage />} />
                  </Routes>
                </SalonOwnerLayout>
              }
            />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FloatingActions />
      </div>
    </SWRConfig>
  );
}

export default App;
