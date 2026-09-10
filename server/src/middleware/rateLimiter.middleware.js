import rateLimit from "express-rate-limit";

const isTest = process.env.NODE_ENV === "test";

const createLimiter = (options) => {
  if (isTest) {
    return (req, res, next) => next();
  }

  return rateLimit(options);
};

const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later.",
  },
});

const refreshLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many refresh attempts, please try again later",
  },
});

const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 1000,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests",
  },
});

export default {
  authLimiter,
  refreshLimiter,
  apiLimiter,
};