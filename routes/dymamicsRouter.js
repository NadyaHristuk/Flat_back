const router = require("express").Router();
const { authenticate } = require("../middlewares");
const { byYear, byMonth, byFlat, bySqm } = require("../controllers/dynamics");

router.get("/by-year", authenticate, byYear);
router.get("/by-month", authenticate, byMonth);
router.get("/by-flat", authenticate, byFlat);
router.get("/by-sqm", authenticate, bySqm);

module.exports = router;
