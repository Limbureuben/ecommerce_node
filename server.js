require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoConnect = require('./src/config/db');
const cors = require('cors');
const UserRoute = require('./src/routes/user/UserRoute');
const ProductRoute = require('./src/routes/product/ProductRoute');
const path = require("path");
const paymentRoute = require('./src/routes/payment/paymentRoute');
const handleZenoWebhook = require('./src/webhook/webhook');

const app = express();

async function startServer() {

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //allow cors for application to communicate
  app.use(cors());

  //connect database
  await mongoConnect();
  app.use("/public", express.static(path.join(__dirname, "public")));

  //my routes
  app.use('/api/users', UserRoute)
  app.use('/api/products', ProductRoute)
  app.use('/api/payment', paymentRoute)
  app.use("/api/webhook/zenopay", handleZenoWebhook);

  const port = 5000;
  app.listen(port, () => { console.log(`Server running on http://localhost:${port}`); });
}

startServer();
