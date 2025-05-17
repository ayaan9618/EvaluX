const APIError = require('../errors/api-error');
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {

    if (err instanceof APIError) {
        return res.status(err.statusCode).json({ msg: err.message, code: err.code });
    }

    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
}

module.exports = errorHandlerMiddleware;
