const APIError = require('../errors/api-error');
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {

    if (err instanceof APIError) {
        return res.status(err.statusCode).json({ msg: err.message, code: err.code });
    }
    else if (err.name === "ValidationError") {
        messages = Object.values(err.errors).map((item) => item.message).join(", ");
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: messages });
    }
    else if (err.code && err.code === 11000) {
        const msg = `Duplicate value enterd for ${Object.keys(err.keyValue)} field, please choose another value`;
        return res.status(StatusCodes.CONFLICT).json({ msg });
    }
    else if (err.name === "CastError") {
        const msg = `No item found with id ${err.value}`;
        return res.status(StatusCodes.NOT_FOUND).json({ msg });
    }

    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
}

module.exports = errorHandlerMiddleware;
