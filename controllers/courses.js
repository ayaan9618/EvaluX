require("dotenv").config();
const APIError = require("../errors/api-error");
const { StatusCodes } = require("http-status-codes");
const { Course } = require("../models/Project");
const { USERTYPE, STATUS } = require("../db/enums");

const getAllCourses = async (req, res) => {

    const { userId } = req.user;

    const courses = await Course.find({ author: userId });

    res.status(StatusCodes.OK).json({
        nbHits: courses.length,
        courses
    });
}

const addCourse = async (req, res) => {
    
    const { userId } = req.user;
    const { name, keywords, unique } = req.body;
    
    const course = await Course.create({ author: userId, name, keywords, unique });

    res.status(StatusCodes.CREATED).json({ msg: "course created", course });
}

const getCourseById = async (req, res) => {

    res.status(StatusCodes.OK).json({ course: req.course });

}

const deleteCourse = async (req, res) => {

    const course = await Course.deleteOne({ _id: req.course._id });

    res.status(StatusCodes.OK).json({ msg: "Course deleted", course });
}

module.exports = {
    getAllCourses,
    addCourse,
    getCourseById,
    deleteCourse
};
