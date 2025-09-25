const axios = require("axios");

async function createPayment({ name, phone, email, amount }) {
  const { v4: uuidv4 } = await import("uuid"); // dynamic import
  const orderId = uuidv4();

  const payload = {
    order_id: orderId,
    buyer_name: name,
    buyer_phone: phone,
    buyer_email: email,
    amount,
    webhook_url: `${process.env.BASE_URL}/api/webhook/zenopay`,
  };

  const res = await axios.post("https://zenoapi.com/api/payments/mobile_money_tanzania", payload, {
    headers: {
      "x-api-key": process.env.ZENOPAY_API_KEY,
      "Content-Type": "application/json",
    },
  });

  return { orderId, data: res.data };
}

async function checkPaymentStatus(orderId) {
  const res = await axios.get(`https://zenoapi.com/api/payments/order-status?order_id=${orderId}`, {
    headers: { "x-api-key": process.env.ZENOPAY_API_KEY },
  });

  return res.data;
}

module.exports = { createPayment, checkPaymentStatus };
