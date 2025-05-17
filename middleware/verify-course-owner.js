require("dotenv").config();
const APIError = require("../errors/api-error");
const { StatusCodes } = require("http-status-codes");
const { Course } = require("../models/Project");

const verifyCourse = async (req, res, next) => {

    const { userId } = req.user;
    const courseId = req.params.course_id;

    req.course = await Course.findOne({ _id: courseId, author: userId });

    if (!req.course) {
        throw new APIError(StatusCodes.NOT_FOUND, `No course with ID: ${courseId} found`);
    }

    next();
}

module.exports = verifyCourse;
