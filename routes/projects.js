const express = require("express");
// middleware
const { auth, verifyUserType } = require("../middleware/authentication");
const verifyCourse = require("../middleware/verify-course-owner");
//controller
const { getProjectInCourse, addProject, getProjectById,
    deleteProject, getAllProjects, assessProject,
    reviewProject
} = require("../controllers/projects");

const { USERTYPE } = require("../db/enums");

const router = express.Router();

router.route("/course/:course_id")
    .post(auth, verifyUserType(USERTYPE.ORG), verifyCourse, addProject)
    .get(auth, verifyUserType(USERTYPE.ORG), verifyCourse, getProjectInCourse);
router.route("/").get(auth, verifyUserType(USERTYPE.REVIEWER), getAllProjects);
router.route("/:id")
    .get(getProjectById);
router.route("/assess/:id")
    .post(auth, verifyUserType(USERTYPE.REVIEWER), assessProject);
router.route("/review/:id")
    .post(auth, verifyUserType(USERTYPE.REVIEWER), reviewProject);
router.route("/course/:course_id/:id")
    .delete(auth, verifyUserType(USERTYPE.ORG), verifyCourse, deleteProject);

module.exports = router;
