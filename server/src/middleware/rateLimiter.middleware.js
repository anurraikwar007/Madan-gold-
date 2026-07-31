import rateLimit from "express-rate-limit";


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 10, // 10 requests per window

  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },

  standardHeaders: true,

  legacyHeaders: false,
});


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 200,

  message: {
    success: false,
    message: "Too many requests",
  },

  standardHeaders: true,

  legacyHeaders: false,
});


export default {
  authLimiter,
  apiLimiter,
};