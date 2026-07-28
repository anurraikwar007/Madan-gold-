import apiError from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Already our custom error
  if (err instanceof apiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      requestId: req.requestId,
    });
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: Object.values(err.errors).map(
        (e) => e.message
      ),
      requestId: req.requestId,
    });
  }

  // Mongo Duplicate Key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate record exists.",
      requestId: req.requestId,
    });
  }

  // JWT Error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
      requestId: req.requestId,
    });
  }

  // JWT Expired
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token Expired",
      requestId: req.requestId,
    });
  }

  // Unknown Error
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    requestId: req.requestId,
  });
};

export default errorHandler;