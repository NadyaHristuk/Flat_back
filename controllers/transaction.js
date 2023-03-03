const moment = require("moment");
const Transaction = require("../models/transaction");
const { find } = require("../models/user");
const User = require("../models/user");

const preTransaction = async (req, res) => {
  const { category, coment, sum } = req.body;
  const { _id, balance } = req.user;

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
  res.json({ totalByMounth, totalByDay });
};

async function createTransaction(req, res) {
  const { category, coment, sum } = req.body;
  const { _id, balance } = req.user;
  const newTransaction = await Transaction.create({
    category,
    coment,
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

  const transactionByMonth = await Transaction.find({
    owner: _id,
    month,
    year,
  });
  res.json(transactionByMonth);
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
