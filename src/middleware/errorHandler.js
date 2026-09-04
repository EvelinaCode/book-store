const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  if (err.code === "P2002") {
    return res.status(409).json({
      error: "A book with this ISBN already exists",
    });
  }

  res.status(500).json({
    error: "Internal server error",
  });
};

export default errorHandler;
