require("dotenv").config();
const APIError = require("../errors/api-error");
const { StatusCodes } = require("http-status-codes");
const { Course, Project } = require("../models/Project");
const User = require("../models/User");
const { USERTYPE, STATUS, TESTED_STATUS } = require("../db/enums");

const getProjectInCourse = async (req, res) => {

    const courseId = req.course._id;

    const projects = await Project.find({ course: courseId });

    res.status(StatusCodes.OK).json({
        nbHits: projects.length,
        projects
    });
}

// for reviewers
const getAllProjects = async (req, res) => {

    const { } = req.query;
    const { userId } = req.user;

    const user = await User.findById(userId);
    user.skills;

    // const projects = await Project.find({
    //     technologies: { $in: user.skills }
    // });

    const projects = await Project.aggregate([
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'courseData'
            }
        },
        { $unwind: '$courseData' },
        {
            $match: {
                $or: [
                    { technologies: { $in: user.skills } },
                    { 'courseData.keywords': { $in: user.skills } }
                ]
            }
        }
    ]);

    res.status(StatusCodes.OK).json({
        nbHits: projects.length,
        projects
    });

}

const addProject = async (req, res) => {

    // const { userId } = req.user;
    const { _id: courseId } = req.course;
    const { title, gitHubRepoURL, technologies } = req.body;

    const project = await Project.create({ course: courseId, title, gitHubRepoURL, technologies });

    res.status(StatusCodes.CREATED).json({ msg: "project added", project });
}

const getProjectById = async (req, res) => {

    // const { userId } = req.user;
    const projectId = req.params.id;

    const project = await Project.findOne({ _id: projectId });
    if (!project) {
        throw new APIError(StatusCodes.NOT_FOUND, `project with id ${projectId} not found`);
    }

    res.status(StatusCodes.OK).json({ project });

}

const deleteProject = async (req, res) => {

    const projectId = req.params.id;

    const project = await Project.deleteOne({ _id: projectId, course: req.course._id });
    if (project.deletedCount === 0) {
        throw new APIError(StatusCodes.NOT_FOUND, `Project with id: ${projectId} not found`);
    }

    res.status(StatusCodes.OK).json({ msg: "Project deleted", project });
}

module.exports = {
    getProjectInCourse, addProject, getProjectById, deleteProject, getAllProjects
};
