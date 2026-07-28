import express from "express";

import {
  login as adminLogin,
  me,
} from "../controllers/adminAuth.controller.js";

import {
  register,
  login as customerLogin,
  profile,
} from "../controllers/customer.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validate from "../middleware/validate.js";

import {
  registerSchema,
  loginSchema,
  adminLoginSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

/*
==================================
Customer Routes
==================================
*/

// Register
router.post(
  "/register",
  validate(registerSchema),
  register
);

// Login
router.post(
  "/login",
  validate(loginSchema),
  customerLogin
);

// Customer Profile
router.get(
  "/profile",
  authMiddleware,
  profile
);

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
  roleMiddleware("Admin"),
  me
);

export default router;