// dotenv setup
require('dotenv').config();

// Replace the values with your actual API login key and transaction key
const apiLoginKey =  process.env.AUTHORIZE_NET_API_LOGIN_ID;
const transactionKey = process.env.AUTHORIZE_NET_TRANSACTION_KEY;

module.exports = {
  apiLoginKey,
  transactionKey
};
