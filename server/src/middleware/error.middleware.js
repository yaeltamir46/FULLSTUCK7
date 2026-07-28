export function errorHandler(err, req, res, next) {

    console.error(err);

    const status = err.status || 500;
    const code = err.code || "INTERNAL_SERVER_ERROR";
    const message = err.message || "Unexpected server error";
    const details = err.details || null;

    res.status(status).json({
        error:{
            code,
            message,
            details
        }
    });

}