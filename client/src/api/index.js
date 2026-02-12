// src/api/index.js
import axios from "axios";

// const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });
// const API = axios.create({ baseURL: "https://api.beautyheaven.site" });

//const API = axios.create({ baseURL: "http://localhost:5000" });
// live demo- "https://beauty-hub-jj4h.onrender.com"

const baseURL = process.env.REACT_APP_API_URL;

const API = axios.create({ baseURL });

export const apiClient = API;

// --- THIS IS THE INTERCEPTOR ---
// It will run on every request made by this API instance
API.interceptors.request.use((req) => {
  // 1. Get the user's info from localStorage
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    // 2. If the user is logged in, parse the token from their info
    const token = JSON.parse(userInfo).token;

    // 3. Attach the token to the Authorization header
    // This is the header our backend's 'protect' middleware looks for
    req.headers.Authorization = `Bearer ${token}`;
  }

  // 4. Return the modified request so it can be sent
  return req;
});

// --- SALON API CALLS ---
export const fetchSalons = () => API.get("/api/salons");
export const fetchSalonById = (id) => API.get(`/api/salons/${id}`);
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
  API.get(`/api/salons/${salonId}/reviews`);
export const fetchSalonAnalytics = () => API.get("/api/analytics");
export const fetchMyMessages = () => API.get("/api/messages");
export const addReviewReply = (reviewId, replyData) =>
  API.put(`/api/reviews/${reviewId}/reply`, replyData);
export const updateUserProfile = (userData) =>
  API.put("/api/users/profile", userData);

export const subscribe = (data) =>
  API.post("/api/subscriptions/subscribe", data);

export const listSubscriptionPlans = () => API.get("/api/subscription-types");

export const getSubscriptionPlanById = (id) =>
  API.get(`/api/subscription-types/${id}`);

export const createSubscriptionPlan = (payload) =>
  API.post("/api/subscription-types", payload);

export const updateSubscriptionPlan = (id, payload) =>
  API.put(`/api/subscription-types/${id}`, payload);

export const deleteSubscriptionPlan = (id) =>
  API.delete(`/api/subscription-types/${id}`);

export const getActiveSubscription = (userId) =>
  API.get(`/api/subscriptions/${userId}/get-active-subscription`);

export const getPaymentStatus = (paymentId) =>
  API.get(`/api/payments/${paymentId}/check-payment-status`);

export const redeemCouponCode = (body) =>
  API.post("/api/subscriptions/redeem-coupon-code", body);

// Add more appointment-related API calls here
