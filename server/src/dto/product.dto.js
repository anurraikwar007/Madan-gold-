export class ProductDTO {

  // =====================================================
  // Create DTO
  // =====================================================

  static create(data) {

    return {

      name: data.name?.trim(),

      description: data.description?.trim(),

      shortDescription:
        data.shortDescription?.trim() || "",

      category: data.category?.trim(),

      metal: data.metal,

      purity: data.purity,

      gender: data.gender || "Unisex",

      weight: Number(data.weight),

      price: Number(data.price),

      discountPrice:
        Number(data.discountPrice || 0),

      makingCharges:
        Number(data.makingCharges || 0),

      gst:
        Number(data.gst || 3),

      featured:
        Boolean(data.featured),

      bestseller:
        Boolean(data.bestseller),

      isActive:
        data.isActive ?? true,

      seoTitle:
        data.seoTitle?.trim() || "",

      seoDescription:
        data.seoDescription?.trim() || "",

      seoKeywords:
        Array.isArray(data.seoKeywords)
          ? data.seoKeywords
          : [],

      inventory: {

        stock:
          Number(data.inventory?.stock || 0),

        reservedStock:
          Number(data.inventory?.reservedStock || 0),

        lowStockThreshold:
          Number(data.inventory?.lowStockThreshold || 5),

      },
      images:
        Array.isArray(data.images)
          ? data.images
          : [],

    };

  }

  // =====================================================
  // Update DTO
  // =====================================================

  static update(data) {

    const dto = {};

    Object.keys(data).forEach((key) => {

      if (
        data[key] !== undefined &&
        data[key] !== null
      ) {

        dto[key] = data[key];

      }

    });

    return dto;

  }

}