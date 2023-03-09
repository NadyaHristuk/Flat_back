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

  const newBalance = await personalPlan.create({
    salary, passiveIncome, savings, cost, footage, procent,
    year,
    month,
   owner:_id
  });

  res.json({ newBalance });
};

const getPersonalPlan = async (req, res) => {
  const { _id } = req.user;

  const data = await personalPlan.findOne({ owner: _id }).lean();

  res.send(data);
};

const patchPersonalPlan = async (req, res) => {
  const { _id } = req.user;

  const data = await personalPlan.findOneAndUpdate(
    { owner: _id },
    { ...req.body },
    { new: true }
  ).lean();

  const monthSalary =
  (data.cost - data.savings) / ((data.salary + data.passiveIncome) * (data.procent  / 100));
   const year = Math.floor(monthSalary / 12);
   const month = Math.floor(monthSalary % 12);
  
  res.send({...data, year, month});
};

const getDailyLimit = async (req, res) => {
  const { _id } = req.user;
  const data = await personalPlan.findOne({ owner: _id });
  const days = moment().daysInMonth();
  const monthLimit = data.salary-(data.salary * (data.procent / 100));
  const dailyLimit = data.procent + monthLimit / days;
  res.json({ monthLimit, dailyLimit });
};

module.exports = { prePersonalPlan, addPersonalPlan, getPersonalPlan, patchPersonalPlan, getDailyLimit };
