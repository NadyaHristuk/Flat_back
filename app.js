const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const personslPlanRouter = require("./routes/personslPlan");
const usersRouter = require("./routes/users");
const cashflowRouter = require("./routes/cashflow");
const dymamicsRouter = require("./routes/dymamicsRouter");

const swaggerDocument = require("./swagger.json");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/user", usersRouter);
app.use("/api/personal-plan", personslPlanRouter);
app.use("/api/cashflow", cashflowRouter);
app.use("/api/dynamics", dymamicsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});
app.use((err, req, res, next) => {
  const { status = 500, message = "Smth wrong" } = err;
  res.status(status).json({ message });
});

module.exports = app;
