const { APIContracts, APIControllers } = require("authorizenet");
const constants = require("./constants.js");

const chargeCreditCard = async (cardNumber, expirationDate, cardCode, amount) => {
  const merchantAuthenticationType = createMerchantAuthenticationType();
  const creditCard = createCreditCard(cardNumber, expirationDate, cardCode);
  const paymentType = createPaymentType(creditCard);
  const transactionRequestType = createTransactionRequestType(paymentType, amount);

  const createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  const ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());

  return executeController(ctrl);
};

const createMerchantAuthenticationType = () => {
  const { apiLoginKey, transactionKey } = constants;
  return new APIContracts.MerchantAuthenticationType({
    name: apiLoginKey,
    transactionKey,
  });
};

const createCreditCard = (cardNumber, expirationDate, cardCode) => {
  return new APIContracts.CreditCardType({
    cardNumber,
    expirationDate,
    cardCode,
  });
};

const createPaymentType = (creditCard) => {
  return new APIContracts.PaymentType({
    creditCard,
  });
};

const createTransactionRequestType = (paymentType, amount) => {
  return new APIContracts.TransactionRequestType({
    transactionType: APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION,
    payment: paymentType,
    amount,
  });
};

const executeController = (ctrl) => {
  return new Promise((resolve) => {
    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new APIContracts.CreateTransactionResponse(apiResponse);
      resolve(response);
    });
  });
};

const paymentHandler = async (req, res) => {
  try {
    const { cardNumber, expirationDate, cardCode, amount } = req.body;
    const response = await chargeCreditCard(cardNumber, expirationDate, cardCode, amount);
    // Handle the response as needed
    res.json(response);
  } catch (error) {
    // Handle any errors that occurred during the payment process
    res.status(500).json({ error: "Payment failed" });
  }
};

module.exports = {
  paymentHandler,
};