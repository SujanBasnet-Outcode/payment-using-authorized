const { APIContracts, APIControllers } = require("authorizenet");
const constants = require("./constants.js");

const updateSubscription = async (paymentNonce, amount) => {
  const merchantAuthenticationType = createMerchantAuthenticationType();

  const interval = new APIContracts.PaymentScheduleType.Interval({
    length: 1, // once every other month
    unit: APIContracts.ARBSubscriptionUnitEnum.MONTHS,
  });

  const paymentScheduleType = new APIContracts.PaymentScheduleType({
    interval,
    startDate: "2023-06-21",
    totalOccurrences: 12,
    trialOccurrences: 0,
  });

  const creditCard = new APIContracts.CreditCardType({
    cardNumber: "4242424242424242",
    expirationDate: "2023-12",
    cardCode: "999",
  });

  const paymentType = new APIContracts.PaymentType({
    creditCard,
  });

  const customer = new APIContracts.CustomerType({
    type: APIContracts.CustomerTypeEnum.INDIVIDUAL,
    id: "99999456654",
    email: "sujanbasnyet334@gmail.com",
  });

  const nameAndAddress = new APIContracts.NameAndAddressType({
    firstName: "Sujan",
    lastName: "Basnyet",
    address: "123 Main Street",
    city: "Bellevue",
    state: "WA",
    zip: "98004",
    country: "USA",
  });

  const arbSubscription = new APIContracts.ARBSubscriptionType({
    name: "DreamBigSubscription",
    paymentSchedule: paymentScheduleType,
    amount: "12.23",
    trialAmount: "0.00",
    payment: paymentType,
    customer,
    billTo: nameAndAddress,
    shipTo: nameAndAddress,
  });

  const createRequest = new APIContracts.ARBCreateSubscriptionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setSubscription(arbSubscription);

  const ctrl = new APIControllers.ARBCreateSubscriptionController(
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

const executeController = (ctrl) =>
  new Promise((resolve) => {
    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new APIContracts.CreateTransactionResponse(apiResponse);
      resolve(response);
    });
  });

const updateSubscriptionHandler = async (req, res) => {
  try {
    const { paymentNonce, amount } = req.body;
    const response = await updateSubscription(paymentNonce, amount);

    res.json(response);
  } catch (error) {
    console.error("An error occurred during payment:", error);
    res.status(500).json({ error: "Payment failed" });
  }
};
module.exports = {
  updateSubscriptionHandler,
};
