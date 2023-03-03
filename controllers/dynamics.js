const Transaction = require("../models/transaction");
const startBalance = require("../models/startBalance");

const byYear = async (req, res) => {};

const byMonth = async (req, res) => {
  const { _id } = req.user;
  const { month, year } = req.query;
  const balance = await startBalance.findOne({ owner: _id });
  const totalByMounth = await Transaction.aggregate([
    {
      $match: {
        owner: _id,
        year,
        month,
      },
    },
    {
      $group: {
        _id: null,
        totalSum: {
          $sum: "$sum",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalSum: 1,
      },
    },
  ]);

  res.json({
    income: balance.bothSalary,
    expenses: totalByMounth[0].totalSum,
    accumulated: balance,
    plan: balance,
    planPro: balance,
  });
};

const byFlat = async (req, res) => {};

const bySqm = async (req, res) => {};

module.exports = {
  byYear,
  byMonth,
  byFlat,
  bySqm,
};
