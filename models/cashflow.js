const { Schema, model } = require("mongoose");
const moment = require("moment");

const cashflowSchema = Schema({
  type: Boolean,
  category: String,
  comment: String,
  sum: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const Cashflow = model("cashflow", cashflowSchema);

module.exports = Cashflow;
