export class ProductDTO {

  // =====================================================
  // Create DTO
  // =====================================================

 static create(data) {
  const price = Number(data.price);
  const discountPrice = Number(
    data.discountPrice || 0
  );
  const makingCharges = Number(
    data.makingCharges || 0
  );
  const gst = Number(
    data.gst ?? 3
  );

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error(
      "Product price must be greater than 0."
    );
  }

  if (
    discountPrice < 0 ||
    (discountPrice > 0 &&
      discountPrice >= price)
  ) {
    throw new Error(
      "Discount price must be greater than 0 and less than the original price."
    );
  }

  if (
    !Number.isFinite(makingCharges) ||
    makingCharges < 0
  ) {
    throw new Error(
      "Making charges cannot be negative."
    );
  }

  if (
    !Number.isFinite(gst) ||
    gst < 0 ||
    gst > 100
  ) {
    throw new Error(
      "GST must be between 0 and 100."
    );
  }

  return {
    name: data.name?.trim(),

    description:
      data.description?.trim(),

    shortDescription:
      data.shortDescription?.trim() || "",

    category:
      data.category?.trim(),

    metal: "Silver",

    purity: "925 Silver",

    gender:
      data.gender || "Unisex",

    weight:
      Number(data.weight),

    price,

    discountPrice,

    makingCharges,

    gst,

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
        Number(
          data.inventory?.reservedStock || 0
        ),

      lowStockThreshold:
        Number(
          data.inventory
            ?.lowStockThreshold || 5
        ),
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