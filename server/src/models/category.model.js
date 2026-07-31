import mongoose from "mongoose";
import slugify from "slugify";

const seoSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 70,
      default: "",
    },

    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
    },

    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    _id: false,
  }
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    image: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },

      alt: {
        type: String,
        default: "",
      },
    },

    icon: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
        parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    seo: {
      type: seoSchema,
      default: () => ({}),
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Admin",
          default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,

    versionKey: false,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  }
);

// ===============================================
// Indexes
// ===============================================



categorySchema.index({
  featured: 1,
  isActive: 1,
});

categorySchema.index({
  parentCategory: 1,
  displayOrder: 1,
});

categorySchema.index({
  isDeleted: 1,
  isActive: 1,
});
// ===============================================
// Pre Save
// ===============================================

categorySchema.pre("save", function (next) {
  if (
    this.isModified("name") ||
    !this.slug
  ) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  if (
    this.isDeleted &&
    !this.deletedAt
  ) {
    this.deletedAt = new Date();
  }

  if (!this.isDeleted) {
    this.deletedAt = null;
  }

  next();
});

// ===============================================
// Query Middleware
// Hide Soft Deleted Categories
// ===============================================

categorySchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeDeleted) {
    this.where({
      isDeleted: false,
    });
  }

  next();
});

// ===============================================
// Virtual
// ===============================================

categorySchema.virtual("imageUrl").get(function () {
  return this.image?.url || "";
});

// ===============================================
// Static Methods
// ===============================================

categorySchema.statics.findActive =
  function () {
    return this.find({
      isActive: true,
      isDeleted: false,
    }).sort({
      displayOrder: 1,
      name: 1,
    });
  };

categorySchema.statics.findFeatured =
  function () {
    return this.find({
      featured: true,
      isActive: true,
      isDeleted: false,
    }).sort({
      displayOrder: 1,
    });
  };

// ===============================================
// Model
// ===============================================

const Category = mongoose.model(
  "Category",
  categorySchema
);

export default Category;