const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const balanceRouter = require("./routes/startBalance");
const usersRouter = require("./routes/users");
const transactionRouter = require("./routes/transaction");
const dymamicsRouter = require("./routes/dymamicsRouter");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/currentBalance", balanceRouter);
app.use("/transaction", transactionRouter);
app.use("/dynamics", dymamicsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});
app.use((err, req, res, next) => {
  const { status = 500, message = "Smth wrong" } = err;
  res.status(status).json({ message });
});

module.exports = app;
