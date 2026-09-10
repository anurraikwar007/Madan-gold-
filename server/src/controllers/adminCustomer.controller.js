import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  restoreCustomer,
  toggleCustomerStatus,
  getCustomerStatistics,
} from "../services/customer.service.js";

const getContext = (req) => ({
  adminId: req.user._id,
  ipAddress: req.ip,
  userAgent: req.get("user-agent") || "",
  requestId: req.requestId || "",
});

class AdminCustomerController {
  getAll = asyncHandler(async (req, res) => {
    const data = await getAllCustomers(req.query);

    return res.status(200).json(
      apiResponse.success(
        "Customers fetched successfully.",
        data
      )
    );
  });

  getOne = asyncHandler(async (req, res) => {
    const customer = await getCustomerById(
      req.params.id
    );

    return res.status(200).json(
      apiResponse.success(
        "Customer fetched successfully.",
        customer
      )
    );
  });

  update = asyncHandler(async (req, res) => {
    const customer = await updateCustomer(
      req.params.id,
      req.body,
      getContext(req)
    );

    return res.status(200).json(
      apiResponse.success(
        "Customer updated successfully.",
        customer
      )
    );
  });

  remove = asyncHandler(async (req, res) => {
    await deleteCustomer(
      req.params.id,
      getContext(req)
    );

    return res.status(200).json(
      apiResponse.success(
        "Customer deleted successfully."
      )
    );
  });

  restore = asyncHandler(async (req, res) => {
    const customer = await restoreCustomer(
      req.params.id,
      getContext(req)
    );

    return res.status(200).json(
      apiResponse.success(
        "Customer restored successfully.",
        customer
      )
    );
  });

  toggleActive = asyncHandler(async (req, res) => {
    const customer =
      await toggleCustomerStatus(
        req.params.id,
        getContext(req)
      );

    return res.status(200).json(
      apiResponse.success(
        "Customer status updated successfully.",
        customer
      )
    );
  });

  statistics = asyncHandler(async (req, res) => {
    const statistics =
      await getCustomerStatistics();

    return res.status(200).json(
      apiResponse.success(
        "Customer statistics fetched successfully.",
        statistics
      )
    );
  });
}

export default new AdminCustomerController();