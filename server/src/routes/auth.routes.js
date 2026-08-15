import express from "express";

import {
  
  me,
} from "../controllers/adminAuth.controller.js";


import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import rateLimiter from "../middleware/rateLimiter.middleware.js";
import AuthController from "../controllers/auth.controller.js";

const router = express.Router();


/*
==================================
Admin Routes
==================================
*/

// Admin Profile
router.get(
  "/admin/me",
  authMiddleware,
 roleMiddleware("Admin", "SuperAdmin"),
  me
);

router.post(
  "/refresh-token",
  rateLimiter.refreshLimiter,
  AuthController.refreshAccessToken
);

export default router;