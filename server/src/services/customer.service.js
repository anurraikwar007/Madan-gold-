import CustomerRepository from "../repositories/customer.repository.js";
import AuditService from "./audit.service.js";

import { CustomerDTO } from "../dto/customer.dto.js";
import { getObjectDiff } from "../utils/diff.util.js";

// ======================================================
// Create Customer
// ======================================================

export const createCustomer = async (
  payload,
  context
) => {

  const dto =
    CustomerDTO.create(payload);

  // =====================================
  // Email Validation
  // =====================================

  const existingEmail =
    await CustomerRepository.findOne({

      email: dto.email,

      isDeleted: false,

    });

  if (existingEmail) {

    throw new Error(
      "Email already registered."
    );

  }

  // =====================================
  // Phone Validation
  // =====================================

  const existingPhone =
    await CustomerRepository.findOne({

      phone: dto.phone,

      isDeleted: false,

    });

  if (existingPhone) {

    throw new Error(
      "Phone number already registered."
    );

  }

  // =====================================
  // Create Customer
  // =====================================

  const customer =
    await CustomerRepository.create(dto);

  // =====================================
  // Audit Log
  // =====================================

  await AuditService.log({

    entityType: "Customer",

    entityId: customer._id,

    action: "CREATE",

    performedBy:
      context.adminId,

    changes: [

      {

        field: "CREATE",

        oldValue: null,

        newValue: customer,

      },

    ],

    ipAddress:
      context.ipAddress,

    userAgent:
      context.userAgent,

    requestId:
      context.requestId,

  });

  return customer.toObject();

};

// ======================================================
// Get Customers
// ======================================================

export const getAllCustomers = async ({
  page = 1,
  limit = 20,
  search = "",
  includeDeleted = false,
}) => {
  page = Math.max(
    Number(page) || 1,
    1
  );

  limit = Math.min(
    Math.max(
      Number(limit) || 20,
      1
    ),
    50
  );

  const filter = {};

  if (!includeDeleted) {
    filter.isDeleted = false;
  }

  const normalizedSearch =
    String(search || "")
      .trim()
      .slice(0, 100);

  if (normalizedSearch) {
    const escaped =
      normalizedSearch.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    filter.$or = [
      {
        name: {
          $regex: escaped,
          $options: "i",
        },
      },
      {
        email: {
          $regex: escaped,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: escaped,
          $options: "i",
        },
      },
    ];
  }

  const skip =
    (page - 1) * limit;

  const [
    customers,
    totalCustomers,
  ] = await Promise.all([
    CustomerRepository.find(
      filter,
      {
        select:
          "-password -refreshTokens",
        skip,
        limit,
        sort: {
          createdAt: -1,
          _id: -1,
        },
      }
    ),

    CustomerRepository.count(
      filter
    ),
  ]);

  const totalPages =
    Math.ceil(
      totalCustomers / limit
    );

  return {
    customers,

    pagination: {
      total: totalCustomers,
      page,
      limit,
      totalPages,

      hasNextPage:
        page < totalPages,

      hasPrevPage:
        page > 1,
    },
  };
};
// ======================================================
// Get Customer By Id
// ======================================================

export const getCustomerById =
async (customerId) => {

  const customer =
    await CustomerRepository.findById(
      customerId
    );

  if (
    !customer ||
    customer.isDeleted
  ) {

    throw new Error(
      "Customer not found."
    );

  }

  return customer;

};

// ======================================================
// Update Customer
// ======================================================

export const updateCustomer =
async (
  customerId,
  payload,
  context
) => {

  const dto =
    CustomerDTO.update(payload);

  const customer =
    await CustomerRepository.findById(
      customerId
    );

  if (
    !customer ||
    customer.isDeleted
  ) {

    throw new Error(
      "Customer not found."
    );

  }

  const oldCustomer =
    customer.toObject();

  // =====================================
  // Email Validation
  // =====================================

  if (dto.email) {

    const existingEmail =
      await CustomerRepository.findOne({

        _id: {
          $ne: customerId,
        },

        email: dto.email,

        isDeleted: false,

      });

    if (existingEmail) {

      throw new Error(
        "Email already registered."
      );

    }

  }

  // =====================================
  // Phone Validation
  // =====================================

  if (dto.phone) {

    const existingPhone =
      await CustomerRepository.findOne({

        _id: {
          $ne: customerId,
        },

        phone: dto.phone,

        isDeleted: false,

      });

    if (existingPhone) {

      throw new Error(
        "Phone number already registered."
      );

    }

  }

  Object.assign(
    customer,
    dto
  );

  await customer.save();

  const changes =
    getObjectDiff(
      oldCustomer,
      customer.toObject()
    );

  await AuditService.log({

    entityType: "Customer",

    entityId: customer._id,

    action: "UPDATE",

    performedBy:
      context.adminId,

    changes,

    ipAddress:
      context.ipAddress,

    userAgent:
      context.userAgent,

    requestId:
      context.requestId,

  });

  return customer.toObject();

};

// ======================================================
// Soft Delete Customer
// ======================================================

export const deleteCustomer =
async (
  customerId,
  context
) => {

  const customer =
    await CustomerRepository.findById(
      customerId
    );

  if (
    !customer ||
    customer.isDeleted
  ) {

    throw new Error(
      "Customer not found."
    );

  }

  customer.isDeleted = true;

  customer.isActive = false;

  await customer.save();

    // =====================================
  // Audit Log
  // =====================================

  await AuditService.log({

    entityType: "Customer",

    entityId: customer._id,

    action: "DELETE",

    performedBy:
      context.adminId,

    changes: [],

    ipAddress:
      context.ipAddress,

    userAgent:
      context.userAgent,

    requestId:
      context.requestId,

  });

  return true;

};

// ======================================================
// Restore Customer
// ======================================================

export const restoreCustomer =
async (
  customerId,
  context
) => {

  const customer =
    await CustomerRepository.findOne({

      _id: customerId,

      isDeleted: true,

    });

  if (!customer) {

    throw new Error(
      "Customer not found."
    );

  }

  customer.isDeleted = false;

  customer.isActive = true;

  await customer.save();

  await AuditService.log({

    entityType: "Customer",

    entityId: customer._id,

    action: "RESTORE",

    performedBy:
      context.adminId,

    changes: [],

    ipAddress:
      context.ipAddress,

    userAgent:
      context.userAgent,

    requestId:
      context.requestId,

  });

  return customer.toObject();

};

// ======================================================
// Toggle Customer Status
// ======================================================

export const toggleCustomerStatus =
async (
  customerId,
  context
) => {

  const customer =
    await CustomerRepository.findById(
      customerId
    );

  if (
    !customer ||
    customer.isDeleted
  ) {

    throw new Error(
      "Customer not found."
    );

  }

  const oldCustomer =
    customer.toObject();

  customer.isActive =
    !customer.isActive;

  await customer.save();

  const changes =
    getObjectDiff(
      oldCustomer,
      customer.toObject()
    );

  await AuditService.log({

    entityType: "Customer",

    entityId: customer._id,

    action: "STATUS_CHANGE",

    performedBy:
      context.adminId,

    changes,

    ipAddress:
      context.ipAddress,

    userAgent:
      context.userAgent,

    requestId:
      context.requestId,

  });

  return customer.toObject();

};

// ======================================================
// Customer Statistics
// ======================================================

export const getCustomerStatistics =
async () => {

  const [

    totalCustomers,

    activeCustomers,

    inactiveCustomers,

    deletedCustomers,

    verifiedCustomers,

  ] = await Promise.all([

    CustomerRepository.count({

      isDeleted: false,

    }),

    CustomerRepository.count({

      isDeleted: false,

      isActive: true,

    }),

    CustomerRepository.count({

      isDeleted: false,

      isActive: false,

    }),

    CustomerRepository.count({

      isDeleted: true,

    }),

    CustomerRepository.count({

      isDeleted: false,

      isVerified: true,

    }),

  ]);

  return {

    totalCustomers,

    activeCustomers,

    inactiveCustomers,

    deletedCustomers,

    verifiedCustomers,

  };

};