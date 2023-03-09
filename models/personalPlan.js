const { Schema, model } = require("mongoose");

const personalPlanSchema = Schema({
  salary: Number,
  passiveIncome: Number,
  savings: Number,
  cost: Number,
  footage: Number,
  procent: Number,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

const PersonalPlan = model("personalPlan", personalPlanSchema);

module.exports = PersonalPlan;
