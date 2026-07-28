import { Router } from "express";

import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import customerRoutes from "./customer.routes.js";
import productRoutes from "./product.routes.js";
//import categoryRoutes from "./category.routes.js";//
import orderRoutes from "./order.routes.js";
import cartRoutes from "./cart.routes.js";
import couponRoutes from "./coupon.routes.js";
import reviewRoutes from "./review.routes.js";

const router = Router();

/*
===========================================
Health Check
===========================================
*/

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,

    requestId: req.requestId,

    uptime: process.uptime(),

    timestamp:
      new Date().toISOString(),

    status: "Healthy",
  });
});

/*
===========================================
API Modules
===========================================
*/

router.use("/auth", authRoutes);

router.use("/admin", adminRoutes);

router.use("/customers", customerRoutes);

router.use("/products", productRoutes);

//router.use("/categories", categoryRoutes);//

router.use("/orders", orderRoutes);

router.use("/cart", cartRoutes);

router.use("/coupons", couponRoutes);

router.use("/reviews", reviewRoutes);

export default router;