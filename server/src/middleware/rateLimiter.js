import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 300,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },

  skip: (req) => {
    if (
      process.env.NODE_ENV === "development"
    ) {
      return false;
    }

    return false;
  },
});

export default rateLimiter;