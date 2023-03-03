const { Schema, model } = require("mongoose");
const moment = require("moment");

const transactionSchema = Schema({
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

const Transaction = model("transaction", transactionSchema);

module.exports = Transaction;
