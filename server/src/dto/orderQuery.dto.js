export const orderQueryDTO = (query = {}) => {
  const page = Math.max(
    Number(query.page) || 1,
    1
  );

  const limit = Math.min(
    Math.max(
      Number(query.limit) || 20,
      1
    ),
    50
  );

  return {
    page,

    limit,

    search:
      String(query.search || "")
        .trim()
        .slice(0, 100),

    status:
      query.status ||
      query.orderStatus ||
      "",

    paymentStatus:
      query.paymentStatus || "",

    paymentMethod:
      query.paymentMethod || "",

    customerId:
      query.customerId || "",

    fromDate:
      query.fromDate || null,

    toDate:
      query.toDate || null,

    sortBy:
      query.sortBy || "createdAt",

    order:
      query.order === "asc"
        ? 1
        : -1,
  };
};