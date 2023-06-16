require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { paymentHandler } = require('./payment');
const { paymentHandlerWithNonce } = require('./paymentNonce');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Payment API endpoint
app.post('/payment', paymentHandler);


app.post("/payment-with-nonce", paymentHandlerWithNonce);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
