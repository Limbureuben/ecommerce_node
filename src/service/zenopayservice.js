const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const ZENOPAY_URL = "https://zenoapi.com/api/payments/mobile_money_tanzania";
const STATUS_URL = "https://zenoapi.com/api/payments/order-status";
const API_KEY = process.env.ZENOPAY_API_KEY;

async function createPayment({ name, phone, email, amount }) {
  const orderId = uuidv4();

  const payload = {
    order_id: orderId,
    buyer_name: name,
    buyer_phone: phone,
    buyer_email: email,
    amount,
    webhook_url: `${process.env.BASE_URL}/api/webhook/zenopay`,
  };

  const res = await axios.post(ZENOPAY_URL, payload, {
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
  });

  return { orderId, data: res.data };
}

async function checkPaymentStatus(orderId) {
  const res = await axios.get(`${STATUS_URL}?order_id=${orderId}`, {
    headers: { "x-api-key": API_KEY },
  });

  return res.data;
}

module.exports = { createPayment, checkPaymentStatus };
