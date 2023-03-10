const express = require("express");
const ctrl = require("../controllers/users");
const { ctrlWrapper } = require("../helpers");
const { validateBody, authenticate } = require("../middlewares");
const { signupSchema, loginSchema } = require('../schemas/users');

const router = express.Router();

router.post("/register", validateBody(signupSchema), ctrlWrapper(ctrl.signup));

router.post("/login", validateBody(loginSchema), ctrlWrapper(ctrl.login));

router.get("/logout", authenticate, ctrlWrapper(ctrl.logout));

router.get("/info", authenticate, ctrlWrapper(ctrl.userInfo));

router.put("/addBalance", authenticate, ctrlWrapper(ctrl.addBalance));

module.exports = router;