const personalPlan = require("../models/personalPlan");
const moment = require("moment");

const prePersonalPlan = async (req, res) => {
  const { salary, passiveIncome, savings, cost, footage, procent } = req.body;

  const monthSalary =
 (cost - savings) / ((salary + passiveIncome) * (procent  / 100));
  const year = Math.floor(monthSalary / 12);
  const month = Math.floor(monthSalary % 12);
  const days = moment().daysInMonth();
  const monthLimit = salary-(salary * (procent / 100));
  const dailyLimit = procent + monthLimit / days;

  res.json({
    salary, passiveIncome, savings, cost, footage, procent,
    year,
    month,
    monthLimit, dailyLimit,
  });
};

const addPersonalPlan = async (req, res) => {
  const { _id } = req.user;
  const { salary, passiveIncome, savings, cost, footage, procent } = req.body;

  const monthSalary =
 (cost - savings) / ((salary + passiveIncome) * (procent  / 100));
  const year = Math.floor(monthSalary / 12);
  const month = Math.floor(monthSalary % 12);
  const days = moment().daysInMonth();
  const monthLimit = salary-(salary * (procent / 100));
  const dailyLimit = procent + monthLimit / days;

  const newBalance = await startBalance.create({
    salary, passiveIncome, savings, cost, footage, procent,
    year,
    month,
    monthLimit, dailyLimit, owner:_id
  });

  res.json({ newBalance });
};

const getPersonalPlan = async (req, res) => {
  const { _id } = req.user;
  const personalPlan = await personalPlan.findOne({ owner: _id });
  const days = moment().daysInMonth();
  const monthLimit = personalPlan.salary-(personalPlan.salary * (personalPlan.procent / 100));
  const dailyLimit = personalPlan.procent + monthLimit / days;
  res.send({...personalPlan, monthLimit, dailyLimit});
};

const patchPersonalPlan = async (req, res) => {
  const { _id } = req.user;
  const personalPlan = await personalPlan.findOneAndUpdate(
    { owner: _id },
    { ...req.body },
    { new: true }
  );
  const monthLimit = personalPlan.salary-(personalPlan.salary * (personalPlan.procent / 100));
  const dailyLimit = personalPlan.procent + monthLimit / days;
  res.send({...personalPlan, monthLimit, dailyLimit});
};

const getDailyLimit = async (req, res) => {
  const { _id } = req.user;
  const currentBalance = await startBalance.findOne({ owner: _id });
  const days = moment().daysInMonth();
  const monthLimit = currentBalance.bothSalary-(currentBalance.bothSalary * (currentBalance.percentagePerMounth / 100));
  const dailyLimit = currentBalance.previousDayLimit + monthLimit / days;
  res.json({ dailyLimit });
};

module.exports = { prePersonalPlan, addPersonalPlan, getPersonalPlan, patchPersonalPlan, getDailyLimit };