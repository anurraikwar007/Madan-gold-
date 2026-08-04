import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {

createOrder,

getCustomerOrders,

getOrderById,

getAdminOrders,

updateOrderStatus,

} from "../services/order.service.js";

import generateInvoice from "../utils/invoice.js";
import Order from "../models/order.model.js";

class OrderController {

  // =====================================================
  // Create Order
  // =====================================================
    create = asyncHandler(async (req, res) => {
      try {
        const order = await createOrder(
          req.user._id,
          req.body,
          {
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            requestId: req.requestId,
          }
        );

        return res.status(201).json(
          apiResponse.success(
            "Order placed successfully.",
            order
          )
        );
      } catch (err) {
        console.error(err);
        throw err;
      }
    });

  // =====================================================
  // Customer Orders
  // =====================================================

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

  // =====================================================
  // Get Single Order
  // =====================================================

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

  // =====================================================
  // Admin Orders
  // =====================================================

  getAll = asyncHandler(async(req,res)=>{

    const orders =
    await getAdminOrders(req.query);

    return res.status(200).json(

    apiResponse.success(

    "Orders fetched successfully.",

    orders

    )

    );

    });

  // =====================================================
  // Update Order Status
  // =====================================================

  updateStatus = asyncHandler(async (req, res) => {

    const order = await updateOrderStatus(

      req.params.id,

      req.body.orderStatus,

      {
        adminId: req.user._id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        requestId: req.requestId,
      }

    );

    return res.status(200).json(
      apiResponse.success(
        "Order status updated successfully.",
        order
      )
    );

  });

  // =====================================================
  // Download Invoice
  // =====================================================

  downloadInvoice = asyncHandler(async (req, res) => {

    const query = {
      _id: req.params.id,
    };

    // Customer sirf apna invoice download kar sakta hai

    const isAdmin =
    ["Admin","SuperAdmin"]
    .includes(req.user.role);

    if(!isAdmin){
    query.customer=req.user._id;
    }

    const order = await Order.findOne(query)
      .populate("customer")
      .populate("items.product");

    if (!order) {
      return res.status(404).json(
        apiResponse.error("Order not found.")
      );
    }

    if (!order.invoiceNumber) {

      order.invoiceNumber =
        `INV-${order.orderNumber}`;

      order.invoiceGenerated = true;

      order.invoiceGeneratedAt =
        new Date();

      await order.save();

    }

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${order.invoiceNumber}.pdf`
    );

    const pdf = generateInvoice(order);

    pdf.pipe(res);

  });

}

export default new OrderController();