const { APIContracts, APIControllers } = require("authorizenet");
const constants = require("./constants.js");

const createTransactionWithNonce = async (paymentNonce, amount) => {
  const merchantAuthenticationType = createMerchantAuthenticationType();
  const opaqueData = createOpaqueDataType(paymentNonce);
  const paymentType = createPaymentType(opaqueData);
  const transactionRequestType = createTransactionRequestType(
    paymentType,
    amount
  );

  const createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  const ctrl = new APIControllers.CreateTransactionController(
    createRequest.getJSON()
  );

  return executeController(ctrl);
};

const createMerchantAuthenticationType = () => {
  const { apiLoginKey, transactionKey } = constants;
  return new APIContracts.MerchantAuthenticationType({
    name: apiLoginKey,
    transactionKey,
  });
};

const createOpaqueDataType = (paymentNonce) =>
  new APIContracts.OpaqueDataType({
    dataDescriptor: "COMMON.ACCEPT.INAPP.PAYMENT",
    dataValue: paymentNonce.dataValue,
  });

const createPaymentType = (opaqueData) => {
  return new APIContracts.PaymentType({
    opaqueData,
  });
};

const createTransactionRequestType = (paymentType, amount) =>
  new APIContracts.TransactionRequestType({
    transactionType: APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION,
    payment: paymentType,
    amount,
  });

const executeController = (ctrl) =>
  new Promise((resolve) => {
    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new APIContracts.CreateTransactionResponse(apiResponse);
      resolve(response);
    });
  });

const paymentHandlerWithNonce = async (req, res) => {
  try {
    const { paymentNonce, amount } = req.body;
    const response = await createTransactionWithNonce(paymentNonce, amount);
    res.json(response);
  } catch (error) {
    console.error("An error occurred during payment:", error);
    res.status(500).json({ error: "Payment failed" });
  }
};
module.exports = {
  paymentHandlerWithNonce,
};
