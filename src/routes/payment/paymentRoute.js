const express = require('express');
const { initiatePayment, getPaymentStatus } = require('../../controllers/paymentController');

const router = express.Router();

router.post("/pay", initiatePayment);
router.get("/status/:orderId", getPaymentStatus);


module.exports = router;