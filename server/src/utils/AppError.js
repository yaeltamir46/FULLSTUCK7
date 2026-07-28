class AppError extends Error {
    constructor(status, code, message, details = null) {
        super(message);

        this.status = status;
        this.code = code;
        this.details = details;

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;