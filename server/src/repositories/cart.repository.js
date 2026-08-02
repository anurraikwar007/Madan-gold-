import Cart from "../models/cart.model.js";
import BaseRepository from "./base.repository.js";

class CartRepository extends BaseRepository {

  constructor() {
    super(Cart);
  }

  // =====================================
  // Find Cart By Customer
  // =====================================

  async findByCustomer(customerId) {

    return this.model
      .findOne({
        customer: customerId,
      })
      .populate("items.product");

  }

  // =====================================
  // Create Empty Cart
  // =====================================

  async createCart(customerId) {

    return this.create({

      customer: customerId,

      items: [],

      totalItems: 0,

      totalAmount: 0,

    });

  }

  // =====================================
  // Save Cart
  // =====================================

  async saveCart(cart) {

    return cart.save();

  }

  // =====================================
  // Delete Cart
  // =====================================

  async deleteCart(customerId) {

    return this.model.findOneAndDelete({

      customer: customerId,

    });

  }

  // =====================================
  // Cart Exists
  // =====================================

  async exists(customerId) {

    return this.model.exists({

      customer: customerId,

    });

  }

}

export default new CartRepository();