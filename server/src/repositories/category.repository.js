import BaseRepository from "./base.repository.js";
import Category from "../models/category.model.js";

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  // =====================================================
  // Find By Name
  // =====================================================

  async findByName(name) {
    return this.findOne({
      name: name.trim(),
      isDeleted: false,
    });
  }

  // =====================================================
  // Find By Slug
  // =====================================================

  async findBySlug(slug) {
    return this.findOne({
      slug,
      isDeleted: false,
      isActive: true,
    });
  }

  // =====================================================
  // Duplicate Check
  // =====================================================

  async findDuplicate(
    name,
    excludeId = null
  ) {
    const filter = {
      name,
      isDeleted: false,
    };

    if (excludeId) {
      filter._id = {
        $ne: excludeId,
      };
    }

    return this.findOne(filter);
  }

  // =====================================================
  // Active Categories
  // =====================================================

  async getActiveCategories() {
    return Category.find({
      isDeleted: false,
      isActive: true,
    })
      .sort({
        displayOrder: 1,
        name: 1,
      })
      .lean();
  }

  // =====================================================
  // Featured Categories
  // =====================================================

  async getFeaturedCategories() {
    return Category.find({
      featured: true,
      isDeleted: false,
      isActive: true,
    })
      .sort({
        displayOrder: 1,
      })
      .lean();
  }
    // =====================================================
   // Parent Categories
  // =====================================================

    async getParentCategories() {

        return Category.find({
            $or: [
                {
                    parentCategory: null
                },
                {
                    parentCategory: {
                        $exists: false
                    }
                }
            ],
            isActive: true,
            isDeleted: false
        })
            .sort({
                displayOrder: 1,
                name: 1
            })
            .lean();

    }

  // =====================================================
  // Paginated Listing
  // =====================================================

  async getListing({
    filter = {},
    page = 1,
    limit = 10,
    sort = {
      displayOrder: 1,
      name: 1,
    },
  }) {
    
    return this.paginate(
  filter,
  {
    page,
    limit,
    sort,
    lean: true,
  }
);
  }

 // =====================================================
 // Dashboard Statistics
 // =====================================================

 async getStatistics() {

    const result =
        await Category.aggregate([
            {
                $match: {
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: null,

                    totalCategories: {
                        $sum: 1
                    },

                    activeCategories: {
                        $sum: {
                            $cond: [
                                "$isActive",
                                1,
                                0
                            ]
                        }
                    },

                    featuredCategories: {
                        $sum: {
                            $cond: [
                                "$featured",
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

    return (
        result[0] || {
            totalCategories: 0,
            activeCategories: 0,
            featuredCategories: 0
        }
    );

 }

  // =====================================================
  // Soft Delete
  // =====================================================

  async softDelete(categoryId) {

  return Category.findByIdAndUpdate(

    categoryId,

    {
      isDeleted: true,
      deletedAt: new Date(),
    },

    {
      new: true,
    }

  );

}
    
     // =====================================================
    // Find Deleted By Id
   // =====================================================

    async findDeletedById(categoryId) {

      return Category.findOne({
        _id: categoryId,
        isDeleted: true,
        includeDeleted: true,

      });

    }
    

     // =====================================================
    // Restore Category
   // =====================================================

   async restore(categoryId) {

  const category =
    await this.findDeletedById(categoryId);

  if (!category) {
    return null;
  }

  category.isDeleted = false;
  category.deletedAt = null;

  await category.save();

  return category;

    }

  // =====================================================
  // Toggle Active Status
  // =====================================================

  async toggleActive(categoryId) {

    const category = await this.findById(
        categoryId,
        {
            lean: false
        }
    );

    if (!category) {
        return null;
    }

    category.isActive = !category.isActive;

    return category.save();
  }

 // =====================================================
// Toggle Featured Status
// =====================================================

async toggleFeatured(categoryId) {

    const category =
        await this.findById(
            categoryId,
            {
                lean: false
            }
        );

    if (!category) {
        return null;
    }

    category.featured =
        !category.featured;

    await category.save();

    return category;

}

  // =====================================================
  // Update Display Order
  // =====================================================

  async updateDisplayOrder(
  categoryId,
  displayOrder
) {

  return Category.findByIdAndUpdate(
    categoryId,
    {
      displayOrder,
    },
    {
      new: true,
    }
  );

   }

  // =====================================================
  // Bulk Display Order Update
  // =====================================================

  async updateDisplayOrders(categories) {
    const operations = categories.map(
      ({ id, displayOrder }) => ({
        updateOne: {
          filter: {
            _id: id,
          },
          update: {
            displayOrder,
          },
        },
      })
    );

    return Category.bulkWrite(operations);
  }
}

export default new CategoryRepository();