const { Schema, model } = require("mongoose");

const startBalanceSchema = Schema({
  bothSalary: Number,
  passiveIncome: Number,
  savings: Number,
  cost: Number,
  footage: Number,
  percentagePerMounth: Number,
  year: Number,
  month: Number,
  previousDayLimit: { type: Number, default: 0 },
  monthLimit: { type: Number, default: 0 },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

const startBalance = model("startBalance", startBalanceSchema);

module.exports = startBalance;
