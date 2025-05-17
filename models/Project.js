const mongoose = require("mongoose");
const { USERTYPE, STATUS, TESTED_STATUS } = require("../db/enums");

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
        default: STATUS.UNVERIFIED,
        enum: {
            values: Object.values(STATUS),
            message: "{VALUE} is not a valid status"
        }
    },
    tested: {
        type: String,
        default: TESTED_STATUS.NULL,
        enum: {
            values: Object.values(TESTED_STATUS),
            message: "{VALUE} is not a valid tested status"
        }
    }
},
{
    timestamps: true
});

const Course = mongoose.model("Course", courseSchema);
const Project = mongoose.model("Project", projectSchema);

module.exports = { Course, Project };
