require("dotenv").config();
const APIError = require("../errors/api-error");
const { StatusCodes } = require("http-status-codes");
const { Course, Project, SemgrepResult } = require("../models/Project");
const User = require("../models/User");
const { USERTYPE, STATUS, TESTED_STATUS, PROJECT_STATUS } = require("../db/enums");
const runProjectAnalyzer = require("../assesser");

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
    const { title, gitHubRepoURL, technologies, description } = req.body;
    
    const isValidGitHubUrl = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(gitHubRepoURL);
    if (!isValidGitHubUrl) {
        throw new APIError(StatusCodes.BAD_REQUEST, "Invalid GitHub repository URL.");
    }

    const project = await Project.create({
        course: courseId, title, gitHubRepoURL,
        technologies, description
    });

    runProjectAnalyzer(gitHubRepoURL, project._id);

    res.status(StatusCodes.CREATED).json({ msg: "project added", project });
}

const getProjectById = async (req, res) => {

    const projectId = req.params.id;

    const project = await Project.findOne({ _id: projectId });
    const assessment = await SemgrepResult.findOne({ projectId: projectId });
    if (!project) {
        throw new APIError(StatusCodes.NOT_FOUND, `project with id ${projectId} not found`);
    }

    res.status(StatusCodes.OK).json({ project, assessment });

}

const deleteProject = async (req, res) => {

    const projectId = req.params.id;

    const project = await Project.deleteOne({ _id: projectId, course: req.course._id });
    if (project.deletedCount === 0) {
        throw new APIError(StatusCodes.NOT_FOUND, `Project with id: ${projectId} not found`);
    }

    res.status(StatusCodes.OK).json({ msg: "Project deleted", project });
}

const assessProject = async (req, res) => {

    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new APIError(StatusCodes.NOT_FOUND, `Project with id: ${projectId} not found`);
    }
    if (project.tested !== TESTED_STATUS.NULL) {
        throw new APIError(StatusCodes.FORBIDDEN, "Project already assessed");
    }

    runProjectAnalyzer(project.gitHubRepoURL, project._id);

    res.status(StatusCodes.OK).json({ msg: "Project is being assessed" });

}

const reviewProject = async (req, res) => {

    const { userId } = req.user;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new APIError(StatusCodes.NOT_FOUND, `Project with id: ${projectId} not found`);
    }
    if (project.status !== PROJECT_STATUS.PENDING) {
        throw new APIError(StatusCodes.FORBIDDEN, "Project already reviewed");
    }

    const { status, feedback } = req.body;

    await Project.findByIdAndUpdate(projectId, 
        { status: status, feedback: feedback, reviewedBy: userId },
        { runValidators: true }
    )
}

module.exports = {
    getProjectInCourse, addProject, getProjectById, deleteProject, getAllProjects,
    assessProject, reviewProject
};
