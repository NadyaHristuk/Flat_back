const moment = require("moment");
const Transaction = require("../models/cashflow");
const User = require("../models/user");
const personalPlan = require("../models/personalPlan");

const preTransaction = async (req, res) => {
  const { _id } = req.user;

  const data = await personalPlan.findOne({ owner: _id });

  const days = moment().daysInMonth();
  const monthLimit = data.salary-(data.salary * (data.procent / 100));
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
      $match: { owner: _id },
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

  res.json({ totalByMounth, totalByDay, monthLimit, dailyLimit });
};

async function createTransaction(req, res) {
  const { category, comment, sum } = req.body;
  const { _id, balance } = req.user;

  const newTransaction = await Transaction.create({
    category,
    comment,
    sum,
    owner: _id,
  });

  await User.findByIdAndUpdate(_id, {
    balance: balance - sum,
  });

  res.json(newTransaction);
}

async function getTransaction(req, res) {
  const { year, month } = req.query;
  const { _id } = req.user;
  const options = { owner: _id, type: "expense" }

  if(year && month){options.date = new Date(year, month)}

  const allTransaction = await Transaction.aggregate([
    {
      $match: options,
    },
  ]);

  res.json(allTransaction);
}

async function puchTransaction(req, res) {
  const { id } = req.params;

  const transactionUpdate = await Transaction.findByIdAndUpdate(id, { ...req.body }, { new: true });

  res.json(transactionUpdate);
}

async function transactionDelete(req, res) {
  const { id } = req.params;
  const transactionRemove = await Transaction.findByIdAndDelete(id);
  res.json(transactionRemove);
}

async function transactionByCategory(req, res) {
  const { year, month } = req.params;
  const { _id } = req.user;

  const result = await Transaction.aggregate([
    {
      $match: {
        owner: _id,
      },
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
    {
      $group: {
        _id: null,
        total: {
          $sum: "$stat.amount",
        },
        stats: {
          $push: { aaa: "$stat", procent: Math.floor("$total" / "$stat.amount") },
        },
      },
    },

    {
      $sort: {
        amount: -1,
      },
    },
  ]);
  res.json(result);
}

module.exports = {
  createTransaction,
  getTransaction,
  puchTransaction,
  transactionDelete,
  transactionByCategory,
  preTransaction,
};
