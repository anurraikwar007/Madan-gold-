export const orderQueryDTO = (query) => {

    return {

        page: Math.max(Number(query.page) || 1, 1),

        limit: Math.min(
            Number(query.limit) || 20,
            100
        ),

        search: query.search?.trim() || "",

        status:
                query.status ||
                query.orderStatus ||
                "",
        paymentStatus:
            query.paymentStatus || "",

        paymentMethod:
            query.paymentMethod || "",

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