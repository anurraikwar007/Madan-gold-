import slugify from "slugify";

import apiError from "../utils/apiError.js";

import CategoryRepository from "../repositories/category.repository.js";

class CategoryService {
  // =====================================================
  // Create Category
  // =====================================================

  async createCategory(payload) {
    const {
      name,
      description,
      image,
      featured = false,
      displayOrder = 0,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = payload;

    const duplicate =
      await CategoryRepository.findDuplicate(name);

    if (duplicate) {
      throw new apiError(
        409,
        "Category already exists."
      );
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    return CategoryRepository.create({
      name,
      slug,
      description,
      image,
      featured,
      displayOrder,

      metaTitle,
      metaDescription,
      metaKeywords,
    });
  }

  // =====================================================
  // Update Category
  // =====================================================

  async updateCategory(
    categoryId,
    payload
  ) {
    const category =
      await CategoryRepository.findById(categoryId);

    if (!category) {
      throw new apiError(
        404,
        "Category not found."
      );
    }

    if (
      payload.name &&
      payload.name !== category.name
    ) {
      const duplicate =
        await CategoryRepository.findDuplicate(
          payload.name,
          categoryId
        );

      if (duplicate) {
        throw new apiError(
          409,
          "Category already exists."
        );
      }

      payload.slug = slugify(
        payload.name,
        {
          lower: true,
          strict: true,
          trim: true,
        }
      );
    }

    return CategoryRepository.updateById(
      categoryId,
      payload
    );
  }
    // =====================================================
  // Delete Category (Soft Delete)
  // =====================================================

  async deleteCategory(categoryId) {
    const category =
      await CategoryRepository.findById(categoryId);

    if (!category) {
      throw new apiError(
        404,
        "Category not found."
      );
    }

    await CategoryRepository.softDelete(
      categoryId
    );

    return {
      success: true,
      message: "Category deleted successfully.",
    };
  }

  // =====================================================
  // Restore Category
  // =====================================================

  async restoreCategory(categoryId) {
    const category =
      await CategoryRepository.findById(categoryId);

    if (!category) {
      throw new apiError(
        404,
        "Category not found."
      );
    }

    return CategoryRepository.restore(
      categoryId
    );
  }

  // =====================================================
  // Get Category By ID
  // =====================================================

  async getCategoryById(categoryId) {
    const category =
      await CategoryRepository.findById(categoryId);

    if (
      !category ||
      category.isDeleted
    ) {
      throw new apiError(
        404,
        "Category not found."
      );
    }

    return category;
  }

  // =====================================================
  // Get Category By Slug
  // =====================================================

  async getCategoryBySlug(slug) {
    const category =
      await CategoryRepository.findBySlug(slug);

    if (!category) {
      throw new apiError(
        404,
        "Category not found."
      );
    }

    return category;
  }

  // =====================================================
  // Toggle Active
  // =====================================================

  async toggleActive(categoryId) {
    const category =
      await CategoryRepository.toggleActive(
        categoryId
      );

    if (!category) {
      throw new apiError(
        404,
        "Category not found."
      );
    }

    return category;
  }

  // =====================================================
  // Toggle Featured
  // =====================================================

  async toggleFeatured(categoryId) {
    const category =
      await CategoryRepository.toggleFeatured(
        categoryId
      );

    if (!category) {
      throw new apiError(
        404,
        "Category not found."
      );
    }

    return category;
  }
    // =====================================================
  // Get All Categories (Admin)
  // =====================================================

  async getCategories(query = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      isActive,
      featured,
      sort = "-createdAt",
    } = query;

    const filter = {
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (typeof isActive !== "undefined") {
      filter.isActive =
        isActive === true ||
        isActive === "true";
    }

    if (typeof featured !== "undefined") {
      filter.featured =
        featured === true ||
        featured === "true";
    }

    return CategoryRepository.paginate({
      filter,
      page,
      limit,
      sort,
    });
  }

  // =====================================================
  // Active Categories (Customer)
  // =====================================================

  async getActiveCategories() {
    return CategoryRepository.getActiveCategories();
  }

  // =====================================================
  // Update Display Order
  // =====================================================

  async updateDisplayOrder(
    categoryId,
    displayOrder
  ) {
    const category =
      await CategoryRepository.findById(
        categoryId
      );

    if (!category) {
      throw new apiError(
        404,
        "Category not found."
      );
    }

    return CategoryRepository.updateById(
      categoryId,
      {
        displayOrder,
      }
    );
  }

  // =====================================================
  // Bulk Reorder Categories
  // =====================================================

  async reorderCategories(items = []) {
    await Promise.all(
      items.map((item) =>
        CategoryRepository.updateById(
          item.id,
          {
            displayOrder:
              item.displayOrder,
          }
        )
      )
    );

    return {
      success: true,
      message:
        "Category order updated successfully.",
    };
  }

  // =====================================================
  // Dashboard Statistics
  // =====================================================

  async getStatistics() {
    return CategoryRepository.getStatistics();
  }
}

export default new CategoryService();