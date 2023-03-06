const { Schema, model } = require("mongoose");

const personslPlanSchema = Schema({
  salary: Number,
  passiveIncome: Number,
  savings: Number,
  cost: Number,
  footage: Number,
  procent: Number,
  year: Number,
  month: Number,
  dailyLimit: { type: Number, default: 0 },
  monthLimit: { type: Number, default: 0 },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

const startBalance = model("personslPlan", personslPlanSchema);

module.exports = PersonslPlan;
