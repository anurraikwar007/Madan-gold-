import { Router } from "express";

import {
  register,
  login,
  profile,
  //updateProfile,
  changePassword,
  //logout,
} from "../controllers/customer.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.js";
import rateLimiter from "../middleware/rateLimiter.middleware.js";

import {
  registerSchema,
  loginSchema,
 // updateProfileSchema,
  
} from "../validators/auth.validator.js";


const router = Router();


/*
===========================================================
Customer Authentication Routes
===========================================================
*/


/**
 * @route   POST /api/v1/customers/register
 * @desc    Register new customer
 * @access  Public
 */
router.post(
  "/register",
  rateLimiter.authLimiter,
  validate(registerSchema),
  register
);


/**
 * @route   POST /api/v1/customers/login
 * @desc    Customer login
 * @access  Public
 */
router.post(
  "/login",
  rateLimiter.authLimiter,
  validate(loginSchema),
  login
);


/**
 * @route   POST /api/v1/customers/logout
 * @desc    Logout customer
 * @access  Private
 */
/*router.post(
  "/logout",
  authMiddleware,
  logout
);*/



/*
===========================================================
Customer Profile Routes
===========================================================
*/


/**
 * @route   GET /api/v1/customers/profile
 * @desc    Get customer profile
 * @access  Private
 */
router.get(
  "/profile",
  authMiddleware,
  profile
);


/**
 * @route   PUT /api/v1/customers/profile
 * @desc    Update customer profile
 * @access  Private
 */
router.put(
  "/profile",
  authMiddleware,
 // validate(updateProfileSchema),
  //updateProfile
);


/**
 * @route   PATCH /api/v1/customers/change-password
 * @desc    Change customer password
 * @access  Private
 */
router.patch(
  "/change-password",
  authMiddleware,
 // validate(changePasswordSchema),
  changePassword
);



export default router;