const router = require("express").Router();
const balanceCtrl = require("../controllers/startBalance");
const { authenticate } = require("../middlewares");

router.post("/", authenticate, balanceCtrl.addBalance);
router.get("/daily-limit", authenticate, balanceCtrl.getDailyLimit);
router.get("/", authenticate, balanceCtrl.getBalance);
router.patch("/", authenticate, balanceCtrl.patchBalance);

module.exports = router;
