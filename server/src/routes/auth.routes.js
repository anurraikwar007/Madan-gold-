import express from "express";

import {
  login as adminLogin,
  me,
} from "../controllers/adminAuth.controller.js";


import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validate from "../middleware/validate.js";

import {
  registerSchema,
  loginSchema,
  adminLoginSchema,
} from "../validators/auth.validator.js";

import AuthController from "../controllers/auth.controller.js";

const router = express.Router();


/*
==================================
Admin Routes
==================================
*/

// Admin Login
router.post(
  "/admin/login",
  validate(adminLoginSchema),
  adminLogin
);

// Admin Profile
router.get(
  "/admin/me",
  authMiddleware,
 roleMiddleware("Admin", "SuperAdmin"),
  me
);

router.post(
  "/refresh-token",
  AuthController.refreshAccessToken
);

export default router;