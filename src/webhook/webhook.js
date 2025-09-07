const express = require('express');
const Payment = require('../model/payment/payment');
const router = express.Router();

router.post('/hook', async (req, res) => {
    try {
        const { order_id, status} = req.body;

         await Payment.findOneAndUpdate({ orderId: order_id }, { status });

        console.log("Webhook update:", order_id, status);
        res.json({ received: true });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;