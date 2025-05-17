class APIError extends Error {
    constructor(statusCode, message, code=null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

module.exports = APIError;
