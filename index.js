require('dotenv').config();
const express = require('express');
const { paymentHandler } = require('./payment');

const app = express();
const port = 3000;

app.use(express.json());

// Payment API endpoint
app.post('/payment', paymentHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
