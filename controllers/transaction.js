const transaction = require("../models/transactions");
const startBalance = require("../models/startBalance");
const moment = require("moment");

const createTransaction = async (req, res) => {
  const { category, description, cardBalance, cardName, sum } = req.body;
  const { id } = req.params;
  const transactionData = await transaction.create({
    category,
    description,
    cardBalance,
    cardName,
    sum,
  });
  const currentBalance = await startBalance.findById(id);
  const days = moment().daysInMonth();
  const monthLimit =
    currentBalance.bothSalary * (currentBalance.percentagePerMounth / 100);
  const dailyLimit = currentBalance.previousDayLimit + monthLimit / days;
  const currentLimit = currentBalance.previousDayLimit + sum;
  const updateBalance = await startBalance.findByIdAndUpdate(
    id,
    {
      previousDayLimit: currentLimit,
      monthLimit: monthLimit - currentLimit,
    },
    { new: true }
  );
  res.json({ updateBalance, transactionData });
};

module.exports = { createTransaction };
