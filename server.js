require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoConnect = require('./src/config/db');
const cors = require('cors');
const UserRoute = require('./src/routes/user/UserRoute');
const ProductRoute = require('./src/routes/product/ProductRoute');

const app = express();

async function startServer() {

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //allow cors for application to communicate
  app.use(cors());

  //connect database
  await mongoConnect();

  //my routes
  app.use('/api/users', UserRoute)
  app.use('/api/products', ProductRoute)

  const port = 5000;
  app.listen(port, () => { console.log(`Server running on http://localhost:${port}`); });
}

startServer();
