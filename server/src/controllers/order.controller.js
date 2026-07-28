import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {
  createOrder,
  getCustomerOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../services/order.service.js";

class OrderController {
  create = asyncHandler(async (req, res) => {
    const order = await createOrder(
      req.user._id,
      req.body
    );

    return res.status(201).json(
      apiResponse.success(
        "Order placed successfully.",
        order
      )
    );
  });

  myOrders = asyncHandler(async (req, res) => {
    const orders = await getCustomerOrders(
      req.user._id
    );

    return res.status(200).json(
      apiResponse.success(
        "Orders fetched successfully.",
        orders
      )
    );
  });

  getOne = asyncHandler(async (req, res) => {
    const order = await getOrderById(
      req.user._id,
      req.params.id
    );

    return res.status(200).json(
      apiResponse.success(
        "Order fetched successfully.",
        order
      )
    );
  });

  getAll = asyncHandler(async (req, res) => {
    const orders = await getAllOrders();

    return res.status(200).json(
      apiResponse.success(
        "All orders fetched successfully.",
        orders
      )
    );
  });

  updateStatus = asyncHandler(async (req, res) => {
    const order = await updateOrderStatus(
      req.params.id,
      req.body.orderStatus
    );

    return res.status(200).json(
      apiResponse.success(
        "Order status updated successfully.",
        order
      )
    );
  });
}

export default new OrderController();