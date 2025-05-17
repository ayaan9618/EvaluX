const express = require("express");
// middleware
const { auth, verifyUserType } = require("../middleware/authentication");
const verifyCourse = require("../middleware/verify-course-owner");
//controller
const { getAllCourses, addCourse, getCourseById, deleteCourse } = require("../controllers/courses");

const { USERTYPE } = require("../db/enums");

const router = express.Router();

router.route("/")
    .post(auth, verifyUserType(USERTYPE.ORG), addCourse)
    .get(auth, verifyUserType(USERTYPE.ORG), getAllCourses);
router.route("/:id")
    .get(auth, verifyUserType(USERTYPE.ORG), verifyCourse, getCourseById)
    .delete(auth, verifyUserType(USERTYPE.ORG), verifyCourse, deleteCourse);

module.exports = router;
