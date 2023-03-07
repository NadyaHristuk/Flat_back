const { Schema, model } = require("mongoose");
const moment = require("moment");

const cashflowSchema = Schema({
  type: Boolean,
  category: String,
  coment: String,
  sum: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  month: {
        type: String,
       default: moment(new Date()).format("MMM"),},
  year: {
        type: String,
       default: moment(new Date()).format("YYYY"),},
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const Cashflow = model("cashflow", cashflowSchema);

module.exports = Cashflow;
