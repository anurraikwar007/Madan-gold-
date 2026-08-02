import { Router } from "express";
import { singleUpload } from "../middleware/upload.middleware.js";

import {
  register,
  login,
  profile,
  updateCustomerProfile,
  uploadAvatar,
  changePassword,
  getCustomerAddresses,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
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
  updateCustomerProfile
);

   /**
 * @route   PATCH /api/v1/customers/avatar
 * @desc    Update customer avatar
 * @access  Private
 */
    router.patch(
    "/avatar",
    authMiddleware,
    singleUpload("avatar"),
    uploadAvatar
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
  
 /*
===========================================================
Customer Address Routes
===========================================================
*/

/**
 * @route   GET /api/v1/customers/addresses
 * @desc    Get customer addresses
 * @access  Private
 */
router.get(
  "/addresses",
  authMiddleware,
  getCustomerAddresses
);

/**
 * @route   POST /api/v1/customers/addresses
 * @desc    Add customer address
 * @access  Private
 */
router.post(
  "/addresses",
  authMiddleware,
  addCustomerAddress
);

/**
 * @route   PUT /api/v1/customers/addresses/:id
 * @desc    Update customer address
 * @access  Private
 */
router.put(
  "/addresses/:id",
  authMiddleware,
  updateCustomerAddress
);

/**
 * @route   DELETE /api/v1/customers/addresses/:id
 * @desc    Delete customer address
 * @access  Private
 */
router.delete(
  "/addresses/:id",
  authMiddleware,
  deleteCustomerAddress
);


export default router;