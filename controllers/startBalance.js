const startBalance = require("../models/startBalance");
const moment = require("moment");

const addBalance = async (req, res) => {
  const { _id } = req.user;
  const { bothSalary, passiveIncome, savings, cost, footage, percentagePerMounth } = req.body;
  const monthSalary =
    (cost - savings) / ((bothSalary + passiveIncome) * (percentagePerMounth / 100));

  const year = Math.floor(monthSalary / 12);
  const month = Math.floor(monthSalary - year * 12);

  const newBalance = await startBalance.create({
    bothSalary,
    passiveIncome,
    savings,
    cost,
    footage,
    percentagePerMounth,
    year,
    month,
    owner: _id,
  });
  res.json({ newBalance });
};

const getBalance = async (req, res) => {
  const { _id } = req.user;
  const balance = await startBalance.findOne({ owner: _id });
  res.send(balance);
};

const patchBalance = async (req, res) => {
  const { _id } = req.user;
  const balance = await startBalance.findOneAndUpdate(
    { owner: _id },
    { ...req.body },
    { new: true }
  );
  res.send(balance);
};

const getDailyLimit = async (req, res) => {
  const { _id } = req.user;
  const currentBalance = await startBalance.findOne({ owner: _id });
  const days = moment().daysInMonth();
  const monthLimit = currentBalance.bothSalary * (currentBalance.percentagePerMounth / 100);
  const dailyLimit = currentBalance.previousDayLimit + monthLimit / days;
  res.json({ dailyLimit });
};

module.exports = { addBalance, getBalance, patchBalance, getDailyLimit };
