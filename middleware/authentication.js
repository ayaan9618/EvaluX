require("dotenv").config();
const APIError = require("../errors/api-error");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { STATUS } = require("../db/enums");

const auth = async (req, res, next) => {
    
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new APIError(StatusCodes.UNAUTHORIZED, "Authentication invalid.");
    }
    const token = authHeader.split(" ")[1];
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new APIError(StatusCodes.UNAUTHORIZED, "Authentication invalid");
    }

    const { sub, sat, typ } = payload;
    if (sat !== STATUS.VERIFIED) {
        throw new APIError(StatusCodes.FORBIDDEN, "User not verified");
    }
    req.user = { userId: sub, type: typ,  status: sat};
    next();
}

const preUserAuth = async (req, res, next) => {

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new APIError(StatusCodes.UNAUTHORIZED, "Authentication invalid.");
    }
    const token = authHeader.split(" ")[1];
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new APIError(StatusCodes.UNAUTHORIZED, "Authentication invalid");
    }

    const { sub, sat, typ } = payload;
    if (sat !== STATUS.UNVERIFIED) {
        throw new APIError(StatusCodes.FORBIDDEN, "No need to reverify");
    }
    req.user = { userId: sub, type: typ,  status: sat};
    next();
}

module.exports = { auth, preUserAuth };
