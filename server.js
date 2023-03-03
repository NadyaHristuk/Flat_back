const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();
const { PORT, DB_HOST } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("DB_HOST is connected");
    });
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
