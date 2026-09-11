import { Router } from "express";

import AdminCustomerController from
  "../controllers/adminCustomer.controller.js";

import validate from "../middleware/validate.js";

import Joi from "joi";

const router = Router();

const idSchema = {
  params: Joi.object({
    id: Joi.string()
      .hex()
      .length(24)
      .required(),
  }),
};

const listSchema = {
  query: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(50)
      .default(20),

    search: Joi.string()
      .trim()
      .max(100)
      .allow("")
      .default(""),

    includeDeleted: Joi.boolean().default(true),
  }),
};

router.get(
  "/",
  validate(listSchema),
  AdminCustomerController.getAll
);

router.get(
  "/statistics",
  AdminCustomerController.statistics
);

router.get(
  "/:id",
  validate(idSchema),
  AdminCustomerController.getOne
);

router.put(
  "/:id",
  validate({
    params: idSchema.params,
    body: Joi.object({
      name: Joi.string().trim().min(2).max(100),
      email: Joi.string().email(),
      phone: Joi.string().trim().min(7).max(20),
      gender: Joi.string().valid(
        "Male",
        "Female",
        "Other"
      ),
      dob: Joi.date().allow(null),
      avatar: Joi.object({
        public_id: Joi.string().allow(""),
        url: Joi.string().uri().allow(""),
      }),
    }).min(1),
  }),
  AdminCustomerController.update
);

router.patch(
  "/:id/toggle-active",
  validate(idSchema),
  AdminCustomerController.toggleActive
);

router.patch(
  "/:id/restore",
  validate(idSchema),
  AdminCustomerController.restore
);

router.delete(
  "/:id",
  validate(idSchema),
  AdminCustomerController.remove
);

export default router;