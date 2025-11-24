// src/App.js
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Import Layouts & Protected Routes ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SalonOwnerLayout from "./components/SalonOwnerLayout";
import CustomerProtectedRoute from "./components/routing/CustomerProtectedRoute";
import SalonOwnerProtectedRoute from "./components/routing/SalonOwnerProtectedRoute";

// --- Import All Pages ---
import HomePage from "./pages/Home";
import Subscriptions from "./pages/Subscriptions";
import BeautyTipsPage from "./pages/BeautyTipsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CustomerSettingsPage from "./pages/CustomerSettingsPage";
import FavoritesPage from "./pages/FavoritesPage";
import ComparePage from "./pages/ComparePage";
import NearMePage from "./pages/NearMePage";
import SalonDashboardPage from "./pages/SalonDashboardPage";
import SalonAppointmentsPage from "./pages/SalonAppointmentsPage";
import SalonProfilePage from "./pages/SalonProfilePage";
import SalonServicesPage from "./pages/SalonServicesPage";
import SalonMessagesPage from "./pages/SalonMessagesPage";
import SalonReviewsPage from "./pages/SalonReviewsPage";
import SalonAnalyticsPage from "./pages/SalonAnalyticsPage";
import SalonSettingsPage from "./pages/SalonSettingsPage";
import SalonDetailPage from "./pages/SalonDetailPage";
import PaymentPage from "./pages/PaymentPage";
import SalonsPage from "./pages/SalonsPage";
import { getActiveSubscription } from "./api";

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
    <div className="font-sans">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route
          path="/"
          // element={

          // }
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
        <Route path="/salons" element={<SalonsPage />} />
        <Route path="/salon/:id" element={<SalonDetailPage />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* === AUTH ROUTES (For logged-out users only) === */}
        <Route
          path="/login"
          // element={
          //   !user ? (
          //     <LoginPage />
          //   ) : (
          //     <Navigate
          //       to={
          //         user.role === "salon_owner" && !!activePlan
          //           ? "/salon-owner/dashboard"
          //           : "/dashboard"
          //       }
          //       replace
          //     />
          //   )
          // }
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={
            // !user ? (
            <RegisterPage />
            // ) : (
            //   <Navigate
            //     to={
            //       user.role === "salon_owner"
            //         ? "/salon-owner/dashboard"
            //         : "/dashboard"
            //     }
            //     replace
            //   />
            // )
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
    </div>
  );
}

export default App;
