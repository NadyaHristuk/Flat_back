const router = require("express").Router();
const {
  createTransaction,
  getTransaction,
  puchTransaction,
  transactionDelete,
  transactionByCategory,
  preTransaction,
  getCategory
} = require("../controllers/cashflow");
const { authenticate } = require("../middlewares");

router.get("/category", authenticate, getCategory);
router.get("/presaving", authenticate, preTransaction);
router.post("/", authenticate, createTransaction);
router.get("/", authenticate, getTransaction);
router.put("/:id", authenticate, puchTransaction);
router.delete("/:id", authenticate, transactionDelete);
router.get("/stat", authenticate, transactionByCategory);

module.exports = router;
