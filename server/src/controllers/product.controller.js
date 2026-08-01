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
} from "../services/product.service.js";

class ProductController {
  create = asyncHandler(async (req, res) => {

  const product = await createProduct(
    req.body,
    {
      adminId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      requestId: req.requestId,
    }
  );

  return res.status(201).json(
    apiResponse.success(
      "Product created successfully.",
      product
    )
  );

});

  getAll = asyncHandler(async (req, res) => {
    const products = await getAllProducts(req.query);

    return res.status(200).json(
      apiResponse.success(
        "Products fetched successfully.",
        products
      )
    );
  });

  getOne = asyncHandler(async (req, res) => {
    const product = await getProductById(req.params.id);

    return res.status(200).json(
      apiResponse.success(
        "Product fetched successfully.",
        product
      )
    );
  });

  update = asyncHandler(async (req, res) => {
   const product = await updateProduct(
    req.params.id,
    req.body,
    {
        adminId:req.user.id,
        ipAddress:req.ip,
        userAgent:req.get("user-agent"),
        requestId:req.requestId,
    }
);

    return res.status(200).json(
      apiResponse.success(
        "Product updated successfully.",
        product
      )
    );
  });

  remove = asyncHandler(async (req, res) => {

  await deleteProduct(
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
      "Product deleted successfully."
    )
  );

});

toggleStatus = asyncHandler(async (req, res) => {

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
}

export default new ProductController();