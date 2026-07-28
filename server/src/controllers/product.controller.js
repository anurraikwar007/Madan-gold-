import asyncHandler from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";

class ProductController {
  create = asyncHandler(async (req, res) => {
    const product = await createProduct(req.body);

    return res.status(201).json(
      apiResponse.success(
        "Product created successfully.",
        product
      )
    );
  });

  getAll = asyncHandler(async (req, res) => {
    const products = await getAllProducts();

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
      req.body
    );

    return res.status(200).json(
      apiResponse.success(
        "Product updated successfully.",
        product
      )
    );
  });

  remove = asyncHandler(async (req, res) => {
    await deleteProduct(req.params.id);

    return res.status(200).json(
      apiResponse.success(
        "Product deleted successfully."
      )
    );
  });
}

export default new ProductController();