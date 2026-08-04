import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  restoreProduct,
  toggleProductStatus,
  getCustomerProduct,
  getRelatedProducts,
  searchSuggestions,
} from "../services/product.service.js";

class ProductController {
  // Create Product
  create = asyncHandler(async (req, res) => {
    const product = await createProduct(req.body, {
      adminId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      requestId: req.requestId,
    });

    return res.status(201).json(
      apiResponse.success(
        "Product created successfully.",
        product
      )
    );
  });

  // Get All Products
  getAll = asyncHandler(async (req, res) => {
    const data = await getAllProducts(req.query);
         console.log(data);
    return res.status(200).json(
      apiResponse.success(
        "Products fetched successfully.",
        data
      )
    );
  });

  // Get Product By ID
  getOne = asyncHandler(async (req, res) => {
    const product = await getProductById(req.params.id);

    return res.status(200).json(
      apiResponse.success(
        "Product fetched successfully.",
        product
      )
    );
  });

  // Update Product
  update = asyncHandler(async (req, res) => {
    const product = await updateProduct(
      req.params.id,
      req.body,
      {
        adminId: req.user.id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        requestId: req.requestId,
      }
    );

    return res.status(200).json(
      apiResponse.success(
        "Product updated successfully.",
        product
      )
    );
  });

  // Delete Product
  remove = asyncHandler(async (req, res) => {
    await deleteProduct(req.params.id, {
      adminId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      requestId: req.requestId,
    });

    return res.status(200).json(
      apiResponse.success(
        "Product deleted successfully."
      )
    );
  });

  // Toggle Product Active Status
  toggleActive = asyncHandler(async (req, res) => {
    const product = await toggleProductStatus(
      req.params.id,
      {
        adminId: req.user.id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        requestId: req.requestId,
      }
    );

    return res.status(200).json(
      apiResponse.success(
        "Product status updated successfully.",
        product
      )
    );
  });

  // Restore Product
  restore = asyncHandler(async (req, res) => {
    const product = await restoreProduct(
      req.params.id,
      {
        adminId: req.user.id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        requestId: req.requestId,
      }
    );

    return res.status(200).json(
      apiResponse.success(
        "Product restored successfully.",
        product
      )
    );
  });

  // Customer Product
  customerProduct = asyncHandler(async (req, res) => {
    const product = await getCustomerProduct(req.params.id);

    return res.status(200).json(
      apiResponse.success(
        "Product fetched successfully.",
        product
      )
    );
  });

  // Related Products
  relatedProducts = asyncHandler(async (req, res) => {
    const products = await getRelatedProducts(req.params.id);

    return res.status(200).json(
      apiResponse.success(
        "Related products fetched successfully.",
        products
      )
    );
  });

  // Search Suggestions
  searchSuggestions = asyncHandler(async (req, res) => {
    const data = await searchSuggestions(req.query.q);

    return res.status(200).json(
      apiResponse.success(
        "Suggestions fetched successfully.",
        data
      )
    );
  });
}

export default new ProductController();