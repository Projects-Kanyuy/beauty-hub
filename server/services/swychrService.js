// services/swychrService.js
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.accountpe.com/api/payin',
});

const login = async () => {
  const { data } = await api.post('/admin/auth', {
    email: process.env.SWYCHR_EMAIL,
    password: process.env.SWYCHR_PASSWORD,
  });
  return data.token;
};

const createPaymentLink = async (token, payload, idempotencyKey) => {
  const headers = { Authorization: `Bearer ${token}` };
  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }

  const { data } = await api.post('/create_payment_links', payload, {
    headers,
  });
  return data;
};

const getPaymentStatus = async (token, transactionId) => {
  const { data } = await api.post('/payment_link_status', { transaction_id: transactionId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

module.exports = { login, createPaymentLink, getPaymentStatus };
