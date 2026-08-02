import Order from "../models/order.model.js";
import BaseRepository from "./base.repository.js";


class OrderRepository extends BaseRepository {

  constructor() {
    super(Order);
  }

  async paginate(filter = {}, options = {}) {

    const {
      page = 1,
      limit = 20,
      populate = [],
      sort = {},
    } = options;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([

      this.model
        .find(filter)
        .populate(populate)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      this.model.countDocuments(filter),

    ]);

    return {

      items,

      pagination: {

        page,

        limit,

        total,

        totalPages: Math.ceil(total / limit),

      },

    };

  }
 
  async recent(limit = 10) {

    return this.model.find()

        .populate("customer")

        .sort({
            createdAt: -1,
        })

        .limit(limit);

}      

      async revenueSummary() {

    const result = await this.model.aggregate([

        {
            $match: {
                paymentStatus: "Paid",
                orderStatus: "Delivered",
            },
        },

        {
            $group: {

                _id: null,

                revenue: {
                    $sum: "$totalAmount",
                },

                subtotal: {
                    $sum: "$subtotal",
                },

                gst: {
                    $sum: "$gst",
                },

                discount: {
                    $sum: "$discount",
                },

                shipping: {
                    $sum: "$shippingCharge",
                },

            },
        },

    ]);

    return result[0] || {};

}

}

export default new OrderRepository();