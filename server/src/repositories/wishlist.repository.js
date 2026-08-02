import Wishlist from "../models/wishlist.model.js";
import BaseRepository from "./base.repository.js";

class WishlistRepository extends BaseRepository {

    constructor() {
        super(Wishlist);
    }

    // ==========================================
    // Find Wishlist Item
    // ==========================================

    async findWishlist(customerId, productId) {

        return this.model.findOne({
            customer: customerId,
            product: productId,
        });

    }

    // ==========================================
    // Customer Wishlist
    // ==========================================

    async getCustomerWishlist(customerId) {

        return this.model
            .find({
                customer: customerId,
            })
            .populate("product")
            .sort({
                createdAt: -1,
            });

    }

    // ==========================================
    // Wishlist Count
    // ==========================================

    async countWishlist(customerId) {

        return this.model.countDocuments({
            customer: customerId,
        });

    }

    // ==========================================
    // Remove Item
    // ==========================================

    async removeWishlist(customerId, productId) {

        return this.model.findOneAndDelete({
            customer: customerId,
            product: productId,
        });

    }

}

export default new WishlistRepository();