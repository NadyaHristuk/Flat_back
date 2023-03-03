const router = require("express").Router();
const {
  createTransaction,
  getTransaction,
  puchTransaction,
  transactionDelete,
  transactionByCategory,
  preTransaction,
} = require("../controllers/transaction");
const { authenticate } = require("../middlewares");
router.get("/presaving", authenticate, preTransaction);
router.post("/", authenticate, createTransaction);
router.get("/", authenticate, getTransaction);
router.patch("/:id", authenticate, puchTransaction);
router.delete("/:id", authenticate, transactionDelete);
router.get("/stat", authenticate, transactionByCategory);

module.exports = router;
