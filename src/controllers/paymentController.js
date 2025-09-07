const Payment = require('../model/payment/payment');
const { createPayment, checkPaymentStatus } = require('../service/zenopayservice');

// Create a payment request
async function initiatePayment(req, res) {
    try {
        const { name, phone, email, amount } = req.body;
        const { orderId, data } = await createPayment({ name, phone, email, amount });

        await Payment.create({
            orderId,
            buyerName: name,
            buyerPhone: phone,
            buyerEmail: email,
            amount,
            status: "pending",
        });

        res.json({ success: true, orderId, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Check payment status
async function getPaymentStatus(req, res) {
    try {
        const { orderId } = req.params;

        const statusData = await checkPaymentStatus(orderId);

        await Payment.findOneAndUpdate(
            { orderId },
            { status: statusData.status }
        );

        res.json(statusData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { initiatePayment, getPaymentStatus };
