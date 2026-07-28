import CategoryService from "../services/category.service.js";

class CategoryController {
  // =====================================================
  // Create Category
  // =====================================================

  async createCategory(req, res, next) {
    try {
      const category =
        await CategoryService.createCategory({
          ...req.body,

          image:
            req.file?.path ||
            req.body.image,
        });

      return res.status(201).json({
        success: true,
        message:
          "Category created successfully.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Update Category
  // =====================================================

  async updateCategory(req, res, next) {
    try {
      const category =
        await CategoryService.updateCategory(
          req.params.id,
          {
            ...req.body,

            image:
              req.file?.path ||
              req.body.image,
          }
        );

      return res.json({
        success: true,
        message:
          "Category updated successfully.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Delete Category
  // =====================================================

  async deleteCategory(req, res, next) {
    try {
      const result =
        await CategoryService.deleteCategory(
          req.params.id
        );

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Restore Category
  // =====================================================

  async restoreCategory(req, res, next) {
    try {
      const category =
        await CategoryService.restoreCategory(
          req.params.id
        );

      return res.json({
        success: true,
        message:
          "Category restored successfully.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
    // =====================================================
  // Get All Categories (Admin)
  // =====================================================

  async getCategories(req, res, next) {
    try {
      const result =
        await CategoryService.getCategories(
          req.query
        );

      return res.json({
        success: true,
        message:
          "Categories fetched successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Get Category By ID
  // =====================================================

  async getCategoryById(req, res, next) {
    try {
      const category =
        await CategoryService.getCategoryById(
          req.params.id
        );

      return res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Get Category By Slug
  // =====================================================

  async getCategoryBySlug(req, res, next) {
    try {
      const category =
        await CategoryService.getCategoryBySlug(
          req.params.slug
        );

      return res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Customer Category Listing
  // =====================================================

  async getActiveCategories(
    req,
    res,
    next
  ) {
    try {
      const categories =
        await CategoryService.getActiveCategories();

      return res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Toggle Active Status
  // =====================================================

  async toggleActive(req, res, next) {
    try {
      const category =
        await CategoryService.toggleActive(
          req.params.id
        );

      return res.json({
        success: true,
        message:
          "Category status updated successfully.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Toggle Featured Status
  // =====================================================

  async toggleFeatured(
    req,
    res,
    next
  ) {
    try {
      const category =
        await CategoryService.toggleFeatured(
          req.params.id
        );

      return res.json({
        success: true,
        message:
          "Category featured status updated successfully.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
    // =====================================================
  // Update Display Order
  // =====================================================

  async updateDisplayOrder(
    req,
    res,
    next
  ) {
    try {
      const category =
        await CategoryService.updateDisplayOrder(
          req.params.id,
          req.body.displayOrder
        );

      return res.json({
        success: true,
        message:
          "Category display order updated successfully.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Bulk Reorder Categories
  // =====================================================

  async reorderCategories(
    req,
    res,
    next
  ) {
    try {
      const result =
        await CategoryService.reorderCategories(
          req.body.categories
        );

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // Dashboard Statistics
  // =====================================================

  async getStatistics(
    req,
    res,
    next
  ) {
    try {
      const statistics =
        await CategoryService.getStatistics();

      return res.json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();