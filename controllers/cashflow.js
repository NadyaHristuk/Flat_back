const moment = require("moment");
const Transaction = require("../models/cashflow");
const User = require("../models/user");
const { BadRequest } = require('http-errors');
const personalPlan = require("../models/personalPlan");
const mongoose = require("mongoose");

const getCategory = async (req, res) => {
  arrOfCategory = [
    {
      name: "products",
      title: "Products"
  },
  {
    name: "clothing",
    title: "Clothing and footwear"
},
{
  name: "cafes",
  title: "Cafes and restaurants"
},
{
  name: "beauty",
  title: "Beauty and medicine"
},
{
  name: "health",
  title: "Health"
},
{
  name: "transport",
  title: "Transport"
},
{
  name: "house",
  title: "House"
},
{
  name: "other",
  title: "Other"
}
]

res.send(arrOfCategory);
}

const preTransaction = async (req, res) => {
  const { _id } = req.user;

  const data = await personalPlan.findOne({ owner: _id });

  if(!data){
    return res.status(400).send('You don`t have a personal plan!')
  }

  const days = moment().daysInMonth();
  const monthLimit = (data.salary + data.passiveIncome)-((data.salary + data.passiveIncome) * (data.procent / 100));
  const dailyLimit = data.procent + monthLimit / days;

  const totalByMounth = await Transaction.aggregate([
    {
      $match: { owner: _id },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: "$date",
          },
        },
        amount: {
          $sum: "$sum",
        },
      },
    },
    {
      $project: {
        _id: 0,
        amount: 1,
      },
    },
  ]);

  const totalByDay = await Transaction.aggregate([
    {
      $match: { owner: _id, $expr: {
        $eq: [
          new Date().toISOString().slice(0, 10),
          {
            $dateToString: {
              date: "$date",
              format: "%Y-%m-%d"
            }
          }
        ]
      }},
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
          },
        },
        amount: {
          $sum: "$sum",
        },
      },
    },
  ]);

  res.json({ totalByMounth: totalByMounth[0].amount, totalByDay: totalByDay[0].amount, monthLimit, dailyLimit });
};

async function createTransaction(req, res) {
  const { category, comment, sum, type } = req.body;
  const { _id, balance } = req.user;

 await Transaction.create({
    category,
    comment,
    type,
    sum,
    owner: _id,
  });

const newBalance = type === "expense" ? balance - sum : balance + sum
  await User.findByIdAndUpdate(_id, {
    balance: newBalance,
  });

  res.json({sum, type,  owner: _id, newBalance});
}

async function getTransaction(req, res) {
  const { _id } = req.user;

  const opt = { owner: mongoose.Types.ObjectId(_id),
  type: "expense" }

  let { year, month } = req.query;
  if ( month > 12 || month < 1 ){
    throw new BadRequest('Bad query request!');}

if (year && month){
  year = Number(year);
  month = Number(month);

  const startMonth = month - 1;
  const endMonth = startMonth === 11 ? 0 : month;
  const endYear = startMonth === 11 ? year + 1 : year;

  opt.date={
    $gte: new Date(year, startMonth),
    $lt: new Date(endYear, endMonth),
  }
}

if (!year && !month){
  opt.$expr = {
    $eq: [
      new Date().toISOString().slice(0, 10),
      {
        $dateToString: {
          date: "$date",
          format: "%Y-%m-%d"
        }
      }
    ]
  }
}

  const allTransaction = await Transaction.aggregate([
    {
      $match: opt
    },
  ]);

  res.json(allTransaction);
}

async function puchTransaction(req, res) {
  const { id } = req.params;
  const { _id, balance } = req.user;
    
  if(req.body.sum){
    const transactionPoint = await Transaction.findById(id);

    const newBalance = type === "expense" ? balance+transactionPoint.sum - req.body.sum : balance - transactionPoint.sum + req.body.sum
   await User.findByIdAndUpdate(_id, {
      balance: newBalance,
    });

    const transactionUpdate = await Transaction.findByIdAndUpdate(id, { ...req.body }, { new: true });

   return res.json({sum:transactionUpdate.sum, type:transactionUpdate.type, owner: _id, newBalance});
  } 

  const transactionUpdate = await Transaction.findByIdAndUpdate(id, { ...req.body }, { new: true }).select({ owner: 0, __v: 0 });

  res.json({sum:transactionUpdate.sum, type:transactionUpdate.type, owner: _id, newBalance: balance});
}

async function transactionDelete(req, res) {
  const { id } = req.params;
  const { _id, balance } = req.user;

  const transactionRemove = await Transaction.findByIdAndDelete(id).select({ owner: 0, __v: 0 });

  const newBalance = transactionRemove.type === "expense" ? balance + transactionRemove.sum : balance - transactionRemove.sum

  await User.findByIdAndUpdate(_id, {
    balance: newBalance,
  });

  res.json(transactionRemove);
}

async function transactionByCategory(req, res) {
  const { _id } = req.user;

  const opt = { owner: mongoose.Types.ObjectId(_id),
  type: "expense" }

  let { year, month } = req.query;
  if ( month > 12 || month < 1 ){
    throw new BadRequest('Bad query request!');}

if (year && month){
  year = Number(year);
  month = Number(month);

  const startMonth = month - 1;
  const endMonth = startMonth === 11 ? 0 : month;
  const endYear = startMonth === 11 ? year + 1 : year;

  opt.date={
    $gte: new Date(year, startMonth),
    $lt: new Date(endYear, endMonth),
  }
}

if (!year && !month){
  opt.$expr = {
    $eq: [
      new Date().toISOString().slice(0, 10),
      {
        $dateToString: {
          date: "$date",
          format: "%Y-%m-%d"
        }
      }
    ]
  }
}

  const result = await Transaction.aggregate([
    {
      $match: opt,
    },
    {
      $group: {
        _id: "$category",
        amount: {
          $sum: "$sum",
        },
      },
    },
    {
      $project: {
        _id: 0,

        stat: {
          category: "$_id",
          amount: "$amount",
        },
      },
    },
  ]);

  res.json(result.stat);
}

module.exports = {
  createTransaction,
  getTransaction,
  puchTransaction,
  transactionDelete,
  transactionByCategory,
  preTransaction,
  getCategory
};
