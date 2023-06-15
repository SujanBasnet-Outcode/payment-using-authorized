function getRandomAmount() {
  // Generate a random amount between 10 and 100
  const minAmount = 10;
  const maxAmount = 100;
  const randomAmount = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;

  // Format the amount with 2 decimal places
  const formattedAmount = randomAmount.toFixed(2);

  return formattedAmount;
}

module.exports = {
  getRandomAmount
};
