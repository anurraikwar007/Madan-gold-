import { Router } from "express";

import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import customerRoutes from "./customer.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import orderRoutes from "./order.routes.js";
import checkoutRoutes from "./checkout.routes.js";
import cartRoutes from "./cart.routes.js";
import couponRoutes from "./coupon.routes.js";
import paymentRoutes from "./payment.routes.js";
import reviewRoutes from "./review.routes.js";
import wishlistRoutes from "./wishlist.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import healthRoutes from "./health.routes.js";

const router = Router();

/*
===========================================
Health
===========================================
*/

router.use("/health", healthRoutes);

/*
===========================================
API Modules
===========================================
*/

router.use("/auth", authRoutes);

router.use("/admin", adminRoutes);

router.use("/customers", customerRoutes);

router.use("/products", productRoutes);

router.use("/categories", categoryRoutes);

router.use("/orders", orderRoutes);

router.use("/checkout", checkoutRoutes);

router.use("/cart", cartRoutes);

router.use("/coupons", couponRoutes);

router.use("/payments", paymentRoutes);

router.use("/reviews", reviewRoutes);

router.use("/wishlist", wishlistRoutes);

router.use("/dashboard", dashboardRoutes);

export default router;