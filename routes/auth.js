const express = require("express");
// middleware
const { auth, preUserAuth } = require("../middleware/authentication");
//controller
const { registerInitial, registerComplete, login } = require("../controllers/auth");

const router = express.Router();

router.route("/register").post(registerInitial);
router.route("/register/complete").patch(preUserAuth, registerComplete);
router.route("/login").post(login);

module.exports = router;
