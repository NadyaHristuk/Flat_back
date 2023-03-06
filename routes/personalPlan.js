const router = require("express").Router();
const personalPlanCtrl = require("../controllers/personalPlan");
const { authenticate } = require("../middlewares");

router.post("/pre", authenticate, personalPlanCtrl.prePersonalPlan);
router.post("/", authenticate, personalPlanCtrl.addPersonalPlan);
router.get("/daily-limit", authenticate, personalPlanCtrl.getDailyLimit);
router.get("/", authenticate, personalPlanCtrl.getPersonalPlan);
router.patch("/", authenticate, personalPlanCtrl.patchPersonalPlan);

module.exports = router;
