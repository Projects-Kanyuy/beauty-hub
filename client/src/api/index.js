// src/api/index.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = axios.create({ baseURL: API_BASE_URL });
const PUBLIC_API = axios.create({ baseURL: API_BASE_URL });
export const apiClient = API;

// --- THIS IS THE INTERCEPTOR ---
// It will run on every request made by this API instance
API.interceptors.request.use((req) => {
  const url = req.url || "";
  const method = (req.method || "get").toLowerCase();
  const isPublicSalonRead = method === "get" && (url === "/api/salons" || url.startsWith("/api/salons/"));
  const isPublicPlanRead =
    method === "get" &&
    (url === "/api/subscription-types" || url.startsWith("/api/subscription-types/"));

  // Public read endpoints should not include auth headers.
  if (isPublicSalonRead || isPublicPlanRead) {
    if (req.headers?.Authorization) {
      delete req.headers.Authorization;
    }
    return req;
  }

  // 1. Get the user's info from localStorage
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    try {
      // 2. If the user is logged in, parse the token from their info
      const token = JSON.parse(userInfo)?.token;
      // 3. Attach token only when it exists and is a non-empty string.
      if (typeof token === "string" && token.trim()) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      localStorage.removeItem("userInfo");
    }
  }

  // 4. Return the modified request so it can be sent
  return req;
});

// --- SALON API CALLS ---
export const fetchSalons = () => PUBLIC_API.get("/api/salons");
export const fetchSalonById = (id) => PUBLIC_API.get(`/api/salons/${id}`);
// Add more salon-related API calls here (e.g., create, update)

// --- AUTH API CALLS ---
export const loginUser = (formData) => API.post("/api/users/login", formData);
export const registerUser = (formData) => API.post("/api/users", formData);

// --- APPOINTMENT API CALLS ---
export const fetchMySalon = () => API.get("/api/salons/mysalon");
export const createSalon = (salonData) => API.post("/api/salons", salonData);
export const fetchMyApointments = () =>
  API.get("/api/appointments/myappointments");
export const createAppointment = (bookingData) =>
  API.post("/api/appointments", bookingData);
export const fetchSalonAppointments = (salonId) =>
  API.get(`/api/appointments/salon/${salonId}`);
export const updateAppointmentStatus = (id, data) =>
  API.put(`/api/appointments/${id}/status`, data);
export const updateMySalon = (id, data) => API.put(`/api/salons/${id}`, data);
export const addService = (salonId, serviceData) =>
  API.post(`/api/salons/${salonId}/services`, serviceData);
export const updateService = (salonId, serviceId, serviceData) =>
  API.put(`/api/salons/${salonId}/services/${serviceId}`, serviceData);
export const deleteService = (salonId, serviceId) =>
  API.delete(`/api/salons/${salonId}/services/${serviceId}`);
export const fetchSalonReviews = (salonId) =>
  PUBLIC_API.get(`/api/salons/${salonId}/reviews`);
export const fetchSalonAnalytics = () => API.get("/api/analytics");
export const fetchMyMessages = () => API.get("/api/messages");
export const addReviewReply = (reviewId, replyData) =>
  API.put(`/api/reviews/${reviewId}/reply`, replyData);
export const updateUserProfile = (userData) =>
  API.put("/api/users/profile", userData);

export const subscribe = (data) =>
  API.post("/api/subscriptions/subscribe", data);

export const listSubscriptionPlans = () => PUBLIC_API.get("/api/subscription-types");

export const getSubscriptionPlanById = (id) =>
  PUBLIC_API.get(`/api/subscription-types/${id}`);

export const getActiveSubscription = (userId) =>
  API.get(`/api/subscriptions/${userId}/get-active-subscription`);

export const getPaymentStatus = (paymentId) =>
  API.get(`/api/payments/${paymentId}/check-payment-status`);

export const redeemCouponCode = (body) =>
  API.post("/api/subscriptions/redeem-coupon-code", body);
export const getSwychrRate = (currency) => 
  API.get(`/api/subscriptions/get-rate/${currency}`);
export const createSubscriptionPlan = (data) => 
  API.post("/api/subscriptions/types", data);
export const updateSubscriptionPlan = (id, data) => 
  API.put(`/api/subscriptions/types/${id}`, data);
export const deleteSubscriptionPlan = (id) =>
   API.delete(`/api/subscriptions/types/${id}`);
// Fetch all user subscriptions for the admin list
export const getAdminOverview = () => 
  API.get("/api/admin/overview");

// Manually activate a user
export const manualActivate = (data) => 
  API.post("/api/admin/manual-activate", data);

// Suspend a user
export const restrictAccess = (userId) => 
  API.put(`/api/admin/restrict-access/${userId}`);


export const getAdminStats = () => 
  API.get("/api/admin/stats"); // New endpoint for KPIs

// --- USER & SALON MGMT ---
export const getAllUsers = () => 
  API.get("/api/users/all"); // Admin route for users
export const updateUserRole = (id, role) => 
  API.put(`/api/users/${id}/role`, { role });
export const blockUser = (id) => 
  API.put(`/api/users/${id}/block`);

// --- PAYMENTS & COUPONS ---
export const getAllPayments = () => 
  API.get("/api/payments"); 
export const getAllCoupons = () => 
  API.get("/api/subscriptions/coupons");
export const createCoupon = (data) => 
  API.post("/api/admin/create-coupon-code", data);

// --- APPOINTMENTS ---
export const getAllAppointments = () => 
  API.get("/api/appointments/admin/all");
