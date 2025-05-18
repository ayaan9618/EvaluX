const express = require("express");
// middleware
const { auth, verifyUserType } = require("../middleware/authentication");
//controller
const { getCurrentUser, getUserById } = require("../controllers/user");

const { USERTYPE } = require("../db/enums");

const router = express.Router();

router.route("/").get(auth, getCurrentUser);
router.route("/:user_id").get(getUserById);

module.exports = router;
