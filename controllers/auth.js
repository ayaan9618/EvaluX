require("dotenv").config();
const APIError = require("../errors/api-error");
const { StatusCodes } = require("http-status-codes");
// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
const User = require("../models/User");
const { USERTYPE, STATUS } = require("../db/enums");

const registerInitial = async (req, res) => {
    
    const { email, password, userType } = req.body;

    let user
    try {
        user = await User.create({ email, password, userType, status: STATUS.UNVERIFIED });
    } catch (error) {
        // if (error.name === 'ValidationError') {
        //     const messages = Object.values(error.errors).map(e => e.message).join(', ');
        //     throw new APIError(StatusCodes.BAD_REQUEST, messages);
        // }
        // throw error;
        if (error.code === 11000) {

            throw new APIError(StatusCodes.BAD_REQUEST, `${error.keyValue.email} Email Already exists`);
        }
        // else if (error.name = "Validation") {
        else {
            const messages = Object.values(error.errors).map(e => e.message).join(', ');
            throw new APIError(StatusCodes.BAD_REQUEST, messages);
        }
    }

    const token = user.createJWT(STATUS.UNVERIFIED);

    res.status(StatusCodes.CREATED).json({ msg: "User registered" ,user: { id: user._id }, token });

}

const registerComplete = async (req, res) => {

    const { bio, contactEmail, // reviewer and organization
            fullName, skills, linkedlnURL, // reviewer
            orgName, phone, websiteURL // organization
        } = req.body;

    const { userId, status, type } = req.user;

    let user;
    try {
        user = await User.findById(userId);
    } catch (error) {
        const messages = Object.values(error.errors).map(e => e.message).join(', ');
        throw new APIError(StatusCodes.BAD_REQUEST, messages);
    }

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

        try {
            await User.findByIdAndUpdate(userId,
                { fullName, contactEmail, skills, linkedlnURL, bio },
                { new: true, runValidators: true }
            );
        } catch (error) {
            const messages = Object.values(error.errors).map(e => e.message).join(', ');
            throw new APIError(StatusCodes.BAD_REQUEST, messages);
        }

    } else if (type === USERTYPE.ORG) {
        if (!orgName) {
            throw new APIError(StatusCodes.BAD_REQUEST, "Please provide orgName");
        }
        if (!phone) {
            throw new APIError(StatusCodes.BAD_REQUEST, "Please provide a phone number");
        }

        try {
            await User.findByIdAndUpdate(userId,
                { orgName, contactEmail, phone, websiteURL, bio },
                { new: true, runValidators: true }
            );
        } catch (error) {
            const messages = Object.values(error.errors).map(e => e.message).join(', ');
            throw new APIError(StatusCodes.BAD_REQUEST, messages);
        }
    }

    res.status(StatusCodes.OK).json({ msg: "User created successfully" });

}

const login = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        throw new APIError(StatusCodes.BAD_REQUEST, "Please prove email and password");
    }

    let user;
    try {
        user = await User.findOne({ email });
    } catch (error) {
        const messages = Object.values(error.errors).map(e => e.message).join(', ');
        throw new APIError(StatusCodes.BAD_REQUEST, messages);
    }

    if (!user) {
        throw new APIError(StatusCodes.UNAUTHORIZED, "Invalid Credentials");
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
