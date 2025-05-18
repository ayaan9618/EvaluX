require("dotenv").config();
const APIError = require("../errors/api-error");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { USERTYPE, STATUS } = require("../db/enums");

const getCurrentUser = async (req, res) => {

    const { userId } = req.user;

    const user = await User.findById(userId).select("-password");

    res.status(StatusCodes.OK).json({ user });

}

const getUserById = async (req, res) => {

    const userId = req.params.user_id;
    const user = await User.findById(userId).select("-email -password");
    if (!user || user.status !== STATUS.VERIFIED) {
        throw new APIError(StatusCodes.NOT_FOUND, `User with id: ${userId} not found`);
    }

    res.status(StatusCodes.OK).json({ user });

}

module.exports = {
    getCurrentUser, getUserById
};
