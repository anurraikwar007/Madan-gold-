import apiError from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
  console.error(err);
} else {
  console.error(
    JSON.stringify({
      requestId: req.requestId,
      name: err.name,
      message: err.message,
      statusCode: err.statusCode || 500,
    })
  );
}


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

  
  // ================================
 // Mongoose Cast Error
 // ================================

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path || "resource"} id.`,
      requestId: req.requestId,
    });
  }

  // ================================
  // Known Application Errors
  // ================================

  const errorStatusMap = {
    "Invalid email or password": 401,

    "Email already registered": 409,
    "Email already registered.": 409,

    "Email already registered. Please login.": 409,

    "Phone already registered": 409,
    "Phone already registered.": 409,
    "Phone number already registered": 409,

    "SKU already exists.": 409,
    "Category already exists.": 409,
    "Coupon code already exists.": 409,
    "Phone already exists.": 409,
    "Phone number already registered.": 409,

    "Address not found": 404,
    "Checkout not found.": 404,

    "Cart is empty.": 400,
    "Your cart is empty.": 400,

    "Quantity must be greater than zero.": 400,
    "Insufficient stock.": 400,

    "Reserved stock cannot exceed total stock.": 400,

    "Flat discount must be greater than 0.": 400,
    "Percentage discount must be between 1 and 100.": 400,
    "Percentage discount cannot exceed 100.": 400,

    "Valid Till must be greater than Valid From.": 400,
    "validTill must be greater than validFrom.": 400,

    "Coupon code is required.": 400,
    "Coupon is deleted.": 400,
    "Coupon is expired or not active yet.": 400,

    "Too many invalid OTP attempts. Please try again later.": 429,

    "Old password is incorrect.": 401,

    "Admin account is inactive.": 403,
    "Customer account is inactive.": 403,
    "Customer account is deleted.": 403,

    "Email configuration is missing: RESEND_API_KEY / RESEND_FROM_EMAIL": 500,

    "Customer not found.": 404,
    "Customer not found": 404,

    "Cart not found.": 404,
    "Cart not found": 404,

    "Product not found.": 404,
    "Product not found": 404,

    "Item not found.": 404,

    "Address not found": 404,

    "Category not found.": 404,

    "Coupon not found.": 404,

    "Review not found": 404,

    "Insufficient stock.": 400,

    "Quantity must be greater than zero.": 400,

    "Invalid coupon.": 400,

    "Coupon is inactive.": 400,

    "Coupon has expired.": 400,

    "Coupon is not active yet.": 400,

    "Coupon usage limit exceeded.": 400,

    "Invalid or expired password reset token.": 400,

    "Please verify your email before logging in.": 403,

    "Your account is inactive or deleted.": 403,

    "Email is already verified.": 400,

    "Verification OTP is not available.": 400,

    "Verification OTP has expired.": 400,

    "Invalid verification OTP.": 400,

    "Invalid email or OTP.": 400,
  };

  const mappedStatus =
    errorStatusMap[err.message];

  if (mappedStatus) {
    return res.status(mappedStatus).json({
      success: false,
      message: err.message,
      requestId: req.requestId,
    });
  }
  
  // Mongoose Version Error
if (err.name === "VersionError") {
  return res.status(409).json({
    success: false,
    message:
      "Resource was modified by another request. Please retry.",
    requestId: req.requestId,
  });
}

// Mongo Transaction / Write Conflict
if (
  err.hasErrorLabel?.(
    "TransientTransactionError"
  ) ||
  err.hasErrorLabel?.(
    "UnknownTransactionCommitResult"
  )
) {
  return res.status(409).json({
    success: false,
    message:
      "Temporary database conflict. Please retry.",
    requestId: req.requestId,
  });
}

  // Unknown Error
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    requestId: req.requestId,
    });
  };

  export default errorHandler;