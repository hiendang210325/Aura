const notFound = (req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    err.statusCode ||
    err.status ||
    (res.statusCode !== 200 ? res.statusCode : 500);

  const response = {
    message:
      statusCode >= 500 && process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
    statusCode,
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };
