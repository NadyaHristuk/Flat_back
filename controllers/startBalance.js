const startBalance = require("../models/startBalance");
const moment = require("moment");

const addBalance = async (req, res) => {
  const {
    bothSalary,
    passiveIncome,
    savings,
    cost,
    footage,
    percentagePerMounth,
  } = req.body;
  const monthSalary =
    (cost - savings) /
    ((bothSalary + passiveIncome) * (percentagePerMounth / 100));
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
  });
  res.json({ newBalance });
};

const getBalance = async (req, res) => {
  const { id } = req.params;
  const balance = await startBalance.findById(id);
  res.send(balance);
};

const patchBalance = async (req, res) => {
  const { id } = req.params;
  const balance = await startBalance.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );
  res.send(balance);
};

const getDailyLimit = async (req, res) => {
  const { id } = req.params;
  const currentBalance = await startBalance.findById(id);
  const days = moment().daysInMonth();
  const monthLimit =
    currentBalance.bothSalary * (currentBalance.percentagePerMounth / 100);
  const dailyLimit = currentBalance.previousDayLimit + monthLimit / days;
  res.json({ dailyLimit });
};

module.exports = { addBalance, getBalance, patchBalance, getDailyLimit };
