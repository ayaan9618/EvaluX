require("dotenv").config();
const APIError = require("../errors/api-error");
const { StatusCodes } = require("http-status-codes");
// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
const User = require("../models/User");
const { USERTYPE, STATUS } = require("../db/enums");

const registerInitial = async (req, res) => {
    
    const { email, password, userType } = req.body;

    const user = await User.create({ email, password, userType, status: STATUS.UNVERIFIED });

    const token = user.createJWT(STATUS.UNVERIFIED);

    res.status(StatusCodes.CREATED).json({ msg: "User registered" ,user: { id: user._id }, token });

}

const registerComplete = async (req, res) => {

    const { bio, contactEmail, // reviewer and organization
            fullName, skills, linkedlnURL, // reviewer
            orgName, phone, websiteURL // organization
        } = req.body;

    const { userId, status, type } = req.user;

    const user = await User.findById(userId);

    if (!user) {
        throw new APIError(StatusCodes.UNAUTHORIZED, "Invalid User");
    }

    if (!contactEmail) {
        throw new APIError(StatusCodes.BAD_REQUEST, "Please provide contactEmail");
    }
    if (type === USERTYPE.REVIEWER) {
        if (!fullName) {
            throw new APIError(StatusCodes.BAD_REQUEST, "Please provide fullName");
        }
        if (!skills) {
            throw new APIError(StatusCodes.BAD_REQUEST, "Please provide skills");
        }
        if (!Array.isArray(skills) || !skills.length > 0) {
            throw new APIError(StatusCodes.BAD_REQUEST, "At least one skill is required");
        }

        await User.findByIdAndUpdate(userId,
            { fullName, contactEmail, skills, linkedlnURL, bio, status:STATUS.VERIFIED },
            { new: true, runValidators: true }
        );

    } else if (type === USERTYPE.ORG) {
        if (!orgName) {
            throw new APIError(StatusCodes.BAD_REQUEST, "Please provide orgName");
        }
        if (!phone) {
            throw new APIError(StatusCodes.BAD_REQUEST, "Please provide a phone number");
        }

        await User.findByIdAndUpdate(userId,
            { orgName, contactEmail, phone, websiteURL, bio, status:STATUS.VERIFIED },
            { new: true, runValidators: true }
        );
    }

    res.status(StatusCodes.OK).json({ msg: "User created successfully" });

}

const login = async (req, res) => {

    const { userType, email, password } = req.body;
    if (!email || !password) {
        throw new APIError(StatusCodes.BAD_REQUEST, "Please prove email and password");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new APIError(StatusCodes.UNAUTHORIZED, "Invalid Credentials");
    }
    
    if (userType !== user.userType) {
        throw new APIError(StatusCodes.UNAUTHORIZED, "Invalid Credentials.");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new APIError(StatusCodes.UNAUTHORIZED, "Invalid Credentials");
    }

    const token = user.createJWT(user.status);

    res.status(StatusCodes.OK).json({ msg: "User logged in", user: { id: user._id }, token });

}

module.exports = {
    registerInitial,
    registerComplete,
    login
};
