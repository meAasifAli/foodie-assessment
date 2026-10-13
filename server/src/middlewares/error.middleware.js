
export const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};

export const errorHandler = (error, req, res, next) => {
    console.error(error);

    res.status(error.status || 500).json({
        success: false,
        message:
            error.status && error.status < 500
                ? error.message
                : "Internal server error",
    });
};
