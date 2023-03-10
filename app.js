const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const personalPlanRouter = require("./routes/personalPlan");
const usersRouter = require("./routes/users");
const cashflowRouter = require("./routes/cashflow");
const dymamicsRouter = require("./routes/dymamicsRouter");

const swaggerDocument = require("./swagger.json");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/user", usersRouter);
app.use("/api/personal-plan", personalPlanRouter);
app.use("/api/cashflow", cashflowRouter);
app.use("/api/dynamics", dymamicsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.status) return res.status(err.status).json({ message: err.message });
  res.status(500).json({ message: err.message });
});

module.exports = app;
