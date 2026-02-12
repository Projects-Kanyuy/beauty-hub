// services/swychrService.js
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.accountpe.com/api/payin',
});

const login = async () => {
  try {
    const { data } = await api.post('/admin/auth', {
      email: process.env.SWYCHR_EMAIL,
      password: process.env.SWYCHR_PASSWORD,
    });
    return data.token;
  } catch (error) {
    console.log("Swychr Login Error Data:", error.response?.data);
    throw new Error("Swychr Login Failed: Check .env credentials");
  }
};

const createPaymentLink = async (token, payload) => {
  try {
    const { data } = await api.post('/create_payment_links', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.log("Swychr Link Error Data:", error.response?.data);
    throw new Error("Swychr Link Creation Failed");
  }
};

const getPaymentStatus = async (token, transactionId) => {
  const { data } = await api.post('/payment_link_status', { transaction_id: transactionId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

module.exports = { login, createPaymentLink, getPaymentStatus };
