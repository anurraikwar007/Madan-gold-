import Checkout from "../models/checkout.model.js";
import BaseRepository from "./base.repository.js";

class CheckoutRepository extends BaseRepository {

  constructor() {
    super(Checkout);
  }

  // =====================================
  // Find Checkout By Customer
  // =====================================

  async findByCustomer(customerId) {

    return this.model
      .findOne({
        customer: customerId,
      })
      .populate("cart")
      .populate("items.product");

  }

  // =====================================
  // Create Checkout
  // =====================================

  async createCheckout(payload) {

    return this.create(payload);

  }

  // =====================================
  // Save Checkout
  // =====================================

  async saveCheckout(checkout) {

    return checkout.save();

  }

  // =====================================
  // Delete Checkout
  // =====================================

  async deleteCheckout(customerId) {

    return this.model.findOneAndDelete({

      customer: customerId,

    });

  }

  // =====================================
  // Mark Completed
  // =====================================

  async markCompleted(customerId) {

    return this.model.findOneAndUpdate(

      {
        customer: customerId,
      },

      {
        status: "COMPLETED",
      },

      {
        new: true,
      }

    );

  }

  // =====================================
  // Mark Expired
  // =====================================

  async markExpired(customerId) {

    return this.model.findOneAndUpdate(

      {
        customer: customerId,
      },

      {
        status: "EXPIRED",
      },

      {
        new: true,
      }

    );

  }

}

export default new CheckoutRepository();