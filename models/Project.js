const mongoose = require("mongoose");
const { USERTYPE, STATUS, TESTED_STATUS, PROJECT_STATUS } = require("../db/enums");

const courseSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: [true, "Please provide a name for the course"],
        maxlength: 128,

    },
    keywords: {
        type: [String],
        required: [true, "keywords are required"],
    },
    unique: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

const projectSchema = mongoose.Schema({

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    title: {
        type: String,
        required: [true, "Please provide a project title"]
    },
    gitHubRepoURL: {
        type: String,
        required: [true, "Please provide "]
    },
    technologies: {
        type: [String],
        required: [true, "technologies are required"],
    },
    status: {
        type: String,
        default: PROJECT_STATUS.PENDING,
        enum: {
            values: Object.values(PROJECT_STATUS),
            message: "{VALUE} is not a valid project status"
        }
    },
    tested: {
        type: String,
        default: TESTED_STATUS.NULL,
        enum: {
            values: Object.values(TESTED_STATUS),
            message: "{VALUE} is not a valid tested status"
        }
    },
    feedback: {
        type: String
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
},
{
    timestamps: true
});

const SemgrepResultSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  summary: Object,
  fullOutput: Object,
},
{
    timestamps: true
});

const Course = mongoose.model("Course", courseSchema);
const Project = mongoose.model("Project", projectSchema);
const SemgrepResult = mongoose.model("ProjectAssessment", SemgrepResultSchema);

module.exports = { Course, Project, SemgrepResult };
