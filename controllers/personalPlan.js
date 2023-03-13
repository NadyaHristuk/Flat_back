const personalPlan = require("../models/personalPlan");
const { BadRequest, Conflict } = require('http-errors');
const moment = require("moment");
const { RequestError } = require('../helpers');

const prePersonalPlan = async (req, res) => {
  const { salary, passiveIncome, savings, cost, footage, procent } = req.body;

  const monthSalary =
 (cost - savings) / ((salary + passiveIncome) * (procent  / 100));
  const year = Math.floor(monthSalary / 12);
  const month = Math.floor(monthSalary % 12);

  res.json({
    salary, passiveIncome, savings, cost, footage, procent,
    year,
    month
  });
};

const addPersonalPlan = async (req, res) => {
  const { _id } = req.user;
 
  const data = await personalPlan.findOne({ owner: _id }, { owner: 0, __v: 0 }).lean();

  if(data){
    return res.status(400).send('You already have a personal plan!')
  }
 
  const { salary, passiveIncome, savings, cost, footage, procent } = req.body;

  const monthSalary =
 (cost - savings) / ((salary + passiveIncome) * (procent  / 100));
  const year = Math.floor(monthSalary / 12);
  const month = Math.floor(monthSalary % 12);

  const newBalance = await personalPlan.create({
    salary, passiveIncome, savings, cost, footage, procent,
   owner:_id
  });

  res.json({...newBalance._doc, year, month} );
};

const getPersonalPlan = async (req, res) => {
  const { _id } = req.user;

  const data = await personalPlan.findOne({ owner: _id }, { owner: 0, __v: 0 }).lean();

  if(!data){
    return res.status(400).send('You don`t have a personal plan!')
  }

  const monthSalary =
 (data.cost - data.savings) / ((data.salary + data.passiveIncome) * (data.procent  / 100));
  const year = Math.floor(monthSalary / 12);
  const month = Math.floor(monthSalary % 12);


  res.send({...data, year, month });
};

const patchPersonalPlan = async (req, res) => {
  const { _id } = req.user;

  const data = await personalPlan.findOneAndUpdate(
    { owner: _id },
    { ...req.body },
    { new: true }
  ).lean().select({ owner: 0, __v: 0 });
  if(!data){
    return res.status(400).send('You don`t have a personal plan!')
  }
  const monthSalary =
  (data.cost - data.savings) / ((data.salary + data.passiveIncome) * (data.procent  / 100));
   const year = Math.floor(monthSalary / 12);
   const month = Math.floor(monthSalary % 12);
  
  res.send({...data, year, month});
};

const getDailyLimit = async (req, res) => {
  const { _id } = req.user;
  const data = await personalPlan.findOne({ owner: _id });
  if(!data){
    return res.status(400).send('You don`t have a personal plan!')
  }
  const days = moment().daysInMonth();
  const monthLimit = (data.salary + data.passiveIncome)-((data.salary + data.passiveIncome) * (data.procent / 100));
  const dailyLimit = data.procent + monthLimit / days;
  res.json({ monthLimit, dailyLimit });
};

module.exports = { prePersonalPlan, addPersonalPlan, getPersonalPlan, patchPersonalPlan, getDailyLimit };
