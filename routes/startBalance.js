const router = require("express").Router();
const balanceCtrl = require("../controllers/startBalance");

router.post("/", balanceCtrl.addBalance);
router.get("/daily-limit/:id", balanceCtrl.getDailyLimit);
router.get("/:id", balanceCtrl.getBalance);
router.patch("/:id", balanceCtrl.patchBalance);

module.exports = router;
